import path from 'path';
import fs from 'fs';
import * as cheerio from 'cheerio';
import { IFrontMatterJSon } from '../types.js';
import YAML from 'yaml';
import { createHash } from 'crypto';
import TurndownService from 'turndown';
import { TMP_DIR } from './constants.js';

export const sleep = async (delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
};

const urlToFileName = (url: string, extension = '.html') => {
    return `${createHash('sha256').update(url).digest('hex')}${extension}`;
};

export const logToFileAndPrint = (message: string) => {
    const logFilePath = path.resolve('./last_run.log');

    fs.appendFile(logFilePath, message, (err) => {
        if (err) {
            console.error(err);
        }
    });

    console.log(message ?? '[Error with log message]');
};

const storeFetchedHTML = async (url: URL, html: string) => {
    const urlToFileNameMapPath = path.resolve(
        TMP_DIR,
        `url_to_file_name_map.txt`,
    );

    if (!fs.existsSync(TMP_DIR)) {
        fs.mkdirSync(TMP_DIR, { recursive: true });
    }

    if (!fs.existsSync(urlToFileNameMapPath)) {
        fs.writeFileSync(urlToFileNameMapPath, '');
    }

    const fileName = urlToFileName(url.toString());

    fs.appendFile(urlToFileNameMapPath, `${fileName} => ${url}\n`, (err) => {
        if (err) {
            console.error(err);
        }
    });

    const rawPageDir = path.resolve(TMP_DIR, 'raw_pages/');
    if (!fs.existsSync(rawPageDir)) {
        fs.mkdirSync(rawPageDir, { recursive: true });
    }

    const filePath = path.resolve(rawPageDir, `${fileName}.html`);

    if (!fileName) {
        console.error('Error with file name');
        return;
    }

    if (!html) {
        console.error('Error with html');
        return;
    }

    try {
        fs.promises.writeFile(filePath, html, { flag: 'wx' });
    } catch (err: any) {
        if (err.code === 'EEXIST') {
            logToFileAndPrint(`\n[File already exists]: ${fileName}=>${url}\n`);
        } else {
            logToFileAndPrint(
                `\n\n[Failed to write file]: ${filePath}\n[Error]: ${err}\n\n`,
            );
        }
    }
};

const formatFilename = (filename: string) => {
    return filename
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLocaleLowerCase();
};

export const writeMd = (
    frontMatterAsJSON: IFrontMatterJSon,
    bodyHTML: string,
    outputDir: string,
    fileName: string,
    overwrite: boolean = false,
) => {
    const frontMatterAsYAML = formatJSONAsFrontmatter(frontMatterAsJSON);
    const bodyMarkdown = htmlToMarkdown(bodyHTML);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = `${outputDir}${formatFilename(fileName)}.md`;

    if (!overwrite && fs.existsSync(filePath)) {
        logToFileAndPrint(
            `[File already exists and overwrite not enabled]: ${filePath}`,
        );
        return;
    }

    fs.writeFileSync(filePath, frontMatterAsYAML + bodyMarkdown);
};

export const fetchPageToCheerio = async (url: URL) => {
    if (!url) {
        console.error('No url provided');
        return;
    }

    const res = await fetch(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        },
    });

    const status = res.status;

    if (status !== 200) {
        console.log(`Error: ${status}`);
        return;
    }

    const html = await res.text();

    storeFetchedHTML(url, html);

    const $ = cheerio.load(html);

    return $;
};

const formatJSONAsFrontmatter = (sourceData: IFrontMatterJSon) => {
    const leaderLine = '---\n';
    const closerLine = '\n---\n';

    const finalFileContent =
        leaderLine + YAML.stringify(sourceData) + closerLine;

    return finalFileContent;
};

const htmlToMarkdown = (html: string) => {
    const turndownService = new TurndownService();
    return turndownService.turndown(html);
};

export const fetchWithRetry = async (
    url: URL,
    retries: number,
    delayMS: number,
) => {
    let tryCount = 0;
    while (tryCount < retries) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return response;
            }
        } catch (error) {
            console.error(error);
        }

        await sleep(delayMS);
        tryCount++;
    }
    throw new Error(`Failed to fetch ${url} after ${retries} retries`);
};

export const normalizeTitle = (title: string) => {
    return title.replace(/[^a-zA-Z0-9]+/g, '-').toLocaleLowerCase();
};
