import * as cheerio from 'cheerio';
import { IArticleData } from '../types.js';

export const getArticleDataFromCheerio = async ($: cheerio.CheerioAPI) => {
    if (!$) {
        return;
    }

    const articleData: IArticleData[] = $('.wvu-article')
        .map((_, el): IArticleData => {
            const title = $(el).find('.wvu-article__title').text().trim();
            const link = $(el)
                .find('.wvu-article__body-and-link a.button--wvu-blue-fill')
                .attr('href')
                ?.trim();
            const thumbnailUrl = $(el)
                .find('.wvu-articles__thumbnail img')
                .attr('src')
                ?.trim();
            const thumbnailAltText = $(el)
                .find('.wvu-articles__thumbnail img')
                .attr('alt')
                ?.trim();
            const date = $(el)
                .find('.wvu-article__meta .wvu-article__date')
                .attr('datetime')
                ?.trim();
            const author = $(el).find('.wvu-article__author').text()?.trim();
            const summary = $(el).find('.wvu-article__body').text()?.trim();

            if (
                !title ||
                !link ||
                !thumbnailUrl ||
                !thumbnailAltText ||
                !date ||
                !author ||
                !summary
            ) {
                console.error(
                    'Missing data for \n',
                    title || '[error with title]',
                );
            }

            return {
                title: title || '[error with title]',
                link: link || '[error with link]',
                thumbnail: {
                    url: thumbnailUrl || '[error with thumbnail url]',
                    altText:
                        thumbnailAltText || '[error with thumbnail alt text]',
                },
                date: date || '[error with date]',
                author: author || '[error with author]',
                summary: summary || '[error with summary]',
            };
        })
        .get();

    return articleData;
};
