import {
    MAX_RETRIES,
    THROTTLE_DELAY_MS,
    MAX_PAGES_TO_COMPILE,
} from './constants.js';
import * as cheerio from 'cheerio';
import { getArticleDataFromCheerio } from './getArticleDataFromCheerio.js';
import { processArticle } from './processArticle.js';
import { fetchPageToCheerio, logToFileAndPrint, sleep } from './utils.js';

const getNextUrl = ($: cheerio.CheerioAPI, currentPageURL: URL) => {
    const olderLink = $('.wvu-pagination__older a').attr('href');

    const olderURL: URL | null =
        !olderLink || olderLink === '#'
            ? null
            : new URL(olderLink, currentPageURL);

    return olderURL;
};

export const compilePages = async (rootPageURL: URL) => {
    let currentPageURL: URL | null = rootPageURL;
    let numCompiledPages = 0;
    let tryCount = 0;

    while (currentPageURL) {
        const $ = await fetchPageToCheerio(currentPageURL);

        if (!$) {
            tryCount++;

            if (tryCount > MAX_RETRIES) {
                logToFileAndPrint(
                    `Could not fetch page ${currentPageURL} after ${MAX_RETRIES} attempts`,
                );
                break;
            }

            await sleep(THROTTLE_DELAY_MS);

            continue;
        }

        tryCount = 0;

        const articleDataArray = await getArticleDataFromCheerio($);

        if (!articleDataArray || articleDataArray.length === 0) {
            return;
        }

        console.log(
            `Got ${articleDataArray.length} article summaries from ${currentPageURL}`,
        );

        for (const articleData of articleDataArray) {
            await processArticle(articleData);
            await sleep(THROTTLE_DELAY_MS);
        }

        numCompiledPages++;

        const nextURL = getNextUrl($, currentPageURL);

        const compileLimitEnabled = MAX_PAGES_TO_COMPILE >= 0;
        const compileLimitExceeded =
            compileLimitEnabled && numCompiledPages >= MAX_PAGES_TO_COMPILE;

        currentPageURL = nextURL && !compileLimitExceeded ? nextURL : null;

        await sleep(THROTTLE_DELAY_MS);
    }
};
