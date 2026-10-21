import path from 'path';
import fs from 'fs';
import { IArticleData, IFrontMatterJSon } from '../types.js';
import {
    fetchPageToCheerio,
    logToFileAndPrint,
    normalizeTitle,
} from './utils.js';
import { TMP_DIR } from './constants.js';

const localStoreArticle = (
    frontMatterAsJSON: IFrontMatterJSon,
    articleHTML: string,
) => {
    const outputDir = path.resolve(`${TMP_DIR}/articleParts/`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const dirName = normalizeTitle(frontMatterAsJSON.title);

    if (!dirName) {
        logToFileAndPrint(
            `\nError with file name:${JSON.stringify(frontMatterAsJSON)}\n\n`,
        );
        return;
    }

    const articleDir = path.resolve(outputDir, dirName);

    fs.mkdirSync(articleDir, { recursive: true });

    const bodyHTMLFilePath = path.resolve(articleDir, `body.html`);
    const frontmatterJsonFilePath = path.resolve(
        articleDir,
        `frontmatter.json`,
    );

    fs.writeFileSync(bodyHTMLFilePath, articleHTML);
    fs.writeFileSync(
        frontmatterJsonFilePath,
        JSON.stringify(frontMatterAsJSON),
    );
};

export const processArticle = async (articleData: IArticleData) => {
    if (!articleData) {
        return;
    }

    console.log(`Processing ${articleData.title || '***MISSING TITLE***'}`);

    if (!articleData.link) {
        logToFileAndPrint(
            `\nMissing link for article data:\n${JSON.stringify(
                articleData,
            )}\n\n`,
        );

        return;
    }

    const { link: articleLinkUrl } = articleData;

    if (!articleLinkUrl) {
        return;
    }
    const $ = await fetchPageToCheerio(new URL(articleLinkUrl));

    if (!$) {
        return;
    }

    const frontMatterAsJSON: IFrontMatterJSon = {
        _schema: 'article',
        title: articleData?.title?.trim() ?? '[error with title]',
        subheading: '',
        draft: false,
        article_image:
            articleData?.thumbnail?.url ?? '[error with thumbnail url]',
        article_image_alt_text:
            articleData?.thumbnail?.altText ??
            '[error with thumbnail alt text]',
        publishDate: articleData?.date ?? '[error with date]',
        expiryDate: '',
        alternate_url: '',
        authors: [
            {
                author: articleData?.author ?? '[error with author]',
                article_role: 'Author',
            },
        ],
        teaser: articleData?.summary,
        tags: [],
        article_topper: {
            _bookshop_name: 'design-system/topper/article',
            show_byline: true,
        },
        article_blocks: [
            {
                _bookshop_name: 'design-system/article-blocks/teaser',
                photos: [
                    {
                        image:
                            articleData?.thumbnail?.url ??
                            '[error with thumbnail url]',
                        alt_text:
                            articleData?.thumbnail?.altText ??
                            '[error with thumbnail alt text]',
                        caption: '',
                    },
                ],
                is_dynamic: false,
            },
        ],
        show_author_bios: false,
        properties: {
            exclude_from_search_engines: false,
            include_in_search_results: true,
            meta_description: '',
            social_image: '',
        },
        uuid: crypto.randomUUID(),
        type: 'articles',
        metadata: {
            type: 'Article',
        },
        authorString: articleData?.author ?? '',
    };

    const articleText =
        $('.wvu-article__body').html()?.trim() ||
        '<!-- [error with article text] -->';

    localStoreArticle(frontMatterAsJSON, articleText);
};
