import path from 'path';
import fs from 'fs';

import * as cheerio from 'cheerio';

import {
    ARTICLE_PARTS_DIR,
    ASSET_DOMAIN,
    IMAGES_DIR,
    THROTTLE_DELAY_MS,
    IMAGES_MAP_FILE_PATH,
    MAX_RETRIES,
} from './src/constants.js';
import { mkdir, writeFile } from 'fs/promises';
import { fetchWithRetry, sleep } from './src/utils.js';
import { fileTypeFromBuffer } from 'file-type';

interface IImageMapEntry {
    originalFilename: string;
    newFilename: string;
    s3Url?: string;
}

interface IImageMap {
    images: IImageMapEntry[];
}

let globalImagesMap: IImageMap = { images: [] };

const saveImagesMap = () => {
    fs.writeFileSync(
        IMAGES_MAP_FILE_PATH,
        JSON.stringify(globalImagesMap, null, 2),
    );
};

const downloadImage = async (
    url: URL,
    fallbackUrl: URL | null = null,
    localFileName: string | null = null,
    outputDir: string = IMAGES_DIR,
) => {
    await mkdir(outputDir, { recursive: true });

    const urlPath = new URL(sanitizeURL(url)).pathname;
    console.log(`Downloading image from ${url} sanitized to ${urlPath}`);

    const existing = globalImagesMap.images.find(
        (img) => img.originalFilename === url.pathname,
    );

    if (existing) {
        console.log(`Already in map: ${url.pathname}`);
        return existing.newFilename;
    }

    let response;

    try {
        response = await fetchWithRetry(url, MAX_RETRIES, THROTTLE_DELAY_MS);
    } catch (error) {
        if (fallbackUrl) {
            console.log(
                `Error fetching image from ${url}, trying ${fallbackUrl}`,
            );
            response = await fetchWithRetry(
                sanitizeURL(fallbackUrl),
                MAX_RETRIES,
                THROTTLE_DELAY_MS,
            );
        } else {
            throw new Error(
                `Could not fetch image from ${url} or ${fallbackUrl}`,
            );
        }
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileType = (await fileTypeFromBuffer(buffer)) || null;
    const ext = fileType?.ext || '';

    const baseName = localFileName ? localFileName : crypto.randomUUID();
    const correctedFileName = `${baseName}.${ext}`;

    const writePath = path.join(outputDir, correctedFileName);

    await writeFile(writePath, buffer);

    globalImagesMap.images.push({
        originalFilename: url.pathname,
        newFilename: writePath,
    });

    saveImagesMap();

    return writePath;
};

const sanitizeURL = (url: URL) => {
    const urlWithoutQS = url.toString().split('?')[0];
    const urlStrippedSize = urlWithoutQS.replace(/\/[0-9]+x[0-9]+$/, '');

    const pathParts = urlStrippedSize.split('/');
    const filename = pathParts[pathParts.length - 1];
    const fileNameWithoutExtension = filename.split('.')[0];
    pathParts[pathParts.length - 1] = fileNameWithoutExtension + '.webp';

    return new URL(pathParts.join('/'));
};

const changeSrcToWebP = (src: string) => {
    return src;
    // const url = new URL(src, ASSET_DOMAIN);
    // url.pathname = url.pathname.replace(/\.[^/.]+$/, '') + '.webp';
    // return url.href;
};

const processHTMLImages = async (html: string) => {
    const $ = cheerio.load(html);

    const images = $('img').toArray();

    for (const element of images) {
        const originalSrc = $(element).attr('src') ?? '';
        const isRelative = !URL.canParse(originalSrc);
        const src = isRelative ? changeSrcToWebP(originalSrc) : originalSrc;

        if (src) {
            const srcURL = new URL(src, ASSET_DOMAIN);
            await downloadImage(srcURL, new URL(originalSrc, ASSET_DOMAIN));
        }
    }
};

const processFrontMatterImages = async (frontmatter: string) => {
    const frontmatterJson = JSON.parse(frontmatter);
    const currentURL = new URL(
        changeSrcToWebP(frontmatterJson.article_image),
        ASSET_DOMAIN,
    );
    const fallbackURL = new URL(frontmatterJson.article_image, ASSET_DOMAIN);

    await downloadImage(currentURL, fallbackURL);
};

const main = async () => {
    if (fs.existsSync(IMAGES_MAP_FILE_PATH)) {
        fs.unlinkSync(IMAGES_MAP_FILE_PATH);
    }

    fs.writeFileSync(IMAGES_MAP_FILE_PATH, '{"images": []}');

    for (const articleDir of fs.readdirSync(ARTICLE_PARTS_DIR)) {
        await sleep(THROTTLE_DELAY_MS);

        if (
            !fs.statSync(path.join(ARTICLE_PARTS_DIR, articleDir)).isDirectory()
        ) {
            console.log(`${articleDir} is Not a directory`);
        }

        const bodyHTMLFilePath = path.join(
            ARTICLE_PARTS_DIR,
            articleDir,
            'body.html',
        );
        const bodyFile = fs.readFileSync(bodyHTMLFilePath, 'utf-8');

        processHTMLImages(bodyFile);

        const frontmatterJsonFilePath = path.join(
            ARTICLE_PARTS_DIR,
            articleDir,
            'frontmatter.json',
        );
        const frontmatterFile = fs.readFileSync(
            frontmatterJsonFilePath,
            'utf-8',
        );

        processFrontMatterImages(frontmatterFile);
    }
};

main();
