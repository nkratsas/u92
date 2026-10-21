import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import * as cheerio from 'cheerio';

import {
    TMP_DIR,
    ARTICLE_PARTS_DIR,
    HUGO_OUTPUT_DIR,
    PEOPLE_JSON_PATH,
} from './src/constants.js';
import { writeMd } from './src/utils.js';
import { IAuthor, IFrontMatterJSon } from './types.js';

interface S3MapEntry {
    originalFilename: string;
    newFilename: string;
    s3Url: string;
}

const S3_MAP_PATH = path.join(TMP_DIR, 's3_map.json');

const processStage3 = async () => {
    if (!fs.existsSync(S3_MAP_PATH)) {
        throw new Error(
            `s3_map.json not found at ${S3_MAP_PATH}. Run Stage 2 first.`,
        );
    }

    const s3MapRaw = fs.readFileSync(S3_MAP_PATH, 'utf-8');
    const s3MapData = JSON.parse(s3MapRaw);
    const imageMappings: S3MapEntry[] = s3MapData.images || [];

    const urlReplacements = new Map<string, string>();
    for (const item of imageMappings) {
        if (item.originalFilename)
            urlReplacements.set(item.originalFilename, item.s3Url);
        if (item.newFilename) urlReplacements.set(item.newFilename, item.s3Url);
        if (item.newFilename)
            urlReplacements.set(path.basename(item.newFilename), item.s3Url);
    }

    if (!fs.existsSync(HUGO_OUTPUT_DIR)) {
        fs.mkdirSync(HUGO_OUTPUT_DIR, { recursive: true });
    }

    const replaceUrl = (targetUrl: string): string => {
        const withoutQuery = targetUrl.split('?')[0];
        if (!withoutQuery) return withoutQuery;

        if (urlReplacements.has(withoutQuery)) {
            return urlReplacements.get(withoutQuery)!;
        }

        const targetBasename = path.basename(withoutQuery);
        if (urlReplacements.has(targetBasename)) {
            return urlReplacements.get(targetBasename)!;
        }

        return withoutQuery;
    };

    const updateFrontmatterUrls = (obj: any): any => {
        if (typeof obj === 'string') {
            return replaceUrl(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(updateFrontmatterUrls);
        }
        if (obj !== null && typeof obj === 'object') {
            const updated: Record<string, any> = {};
            for (const [key, value] of Object.entries(obj)) {
                updated[key] = updateFrontmatterUrls(value);
            }
            return updated;
        }
        return obj;
    };

    const updateFrontmatterAuthors = (
        obj: IFrontMatterJSon,
    ): IFrontMatterJSon => {
        const peopleMap = JSON.parse(
            fs.readFileSync(PEOPLE_JSON_PATH, 'utf-8'),
        );

        if (Array.isArray(obj.authors)) {
            obj.authors = obj.authors.map((author: IAuthor) => {
                const authorUUID = peopleMap[author.author.toLowerCase()];
                console.log(author);
                console.log(peopleMap);

                if (authorUUID) {
                    author.author = authorUUID;
                } else {
                    author.author = '00000000-0000-0000-0000-000000000000';
                }

                return author;
            });
        }

        return obj;
    };

    const articleFolders = fs.readdirSync(ARTICLE_PARTS_DIR);
    console.log(
        `Starting Stage 3: Building Hugo Markdown files for ${articleFolders.length} articles...`,
    );

    for (const articleFolder of articleFolders) {
        const articlePath = path.join(ARTICLE_PARTS_DIR, articleFolder);

        if (!fs.statSync(articlePath).isDirectory()) continue;

        const frontmatterPath = path.join(articlePath, 'frontmatter.json');
        const bodyPath = path.join(articlePath, 'body.html');

        if (!fs.existsSync(frontmatterPath) || !fs.existsSync(bodyPath)) {
            console.warn(
                `[SKIP] Missing frontmatter.json or body.html in ${articlePath}`,
            );
            continue;
        }

        const rawFrontmatter = JSON.parse(
            fs.readFileSync(frontmatterPath, 'utf-8'),
        );
        const updatedFrontmatter = updateFrontmatterAuthors(
            updateFrontmatterUrls(rawFrontmatter),
        );

        const rawBodyHtml = fs.readFileSync(bodyPath, 'utf-8');
        const $ = cheerio.load(rawBodyHtml, null, false);

        $('img').each((_, el) => {
            const src = $(el).attr('src');
            if (src) {
                $(el).attr('src', replaceUrl(src));
            }

            const srcset = $(el).attr('srcset');
            if (srcset) {
                const newSrcset = srcset
                    .split(',')
                    .map((part) => {
                        const [url, size] = part.trim().split(/\s+/);
                        const replaced = replaceUrl(url);
                        return size ? `${replaced} ${size}` : replaced;
                    })
                    .join(', ');
                $(el).attr('srcset', newSrcset);
            }
        });

        if (!updatedFrontmatter.article_blocks) {
            updatedFrontmatter.article_blocks = [
                {
                    _bookshop_name: 'design-system/column/photo-block',
                    photos: [
                        {
                            image: updatedFrontmatter.article_image,
                            alt_text: updatedFrontmatter.article_image_alt_text,
                            caption: null,
                        },
                    ],
                    is_dynamic: false,
                },
            ];
        }

        writeMd(updatedFrontmatter, $.html(), HUGO_OUTPUT_DIR, articleFolder);
    }

    console.log(`\nStage 3 Complete! Posts written to ${HUGO_OUTPUT_DIR}`);
};

processStage3().catch((err) => console.error('Stage 3 Failed:', err));
