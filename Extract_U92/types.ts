export interface IAuthor {
    author: string;
    article_role: string;
}

export interface IPhoto {
    image: string | null;
    alt_text: string | null;
    caption: string | null;
}
export interface IArticleBlock {
    _bookshop_name: string;
    photos: IPhoto[];
    is_dynamic: boolean;
}

export interface IFrontMatterJSon {
    _schema: 'article';
    title: string;
    subheading: string;
    draft: boolean;
    article_image: string;
    article_image_alt_text: string;
    publishDate: string;
    expiryDate: string;
    alternate_url: string;
    authors: IAuthor[];
    teaser: string;
    tags: string[];
    article_topper: {
        _bookshop_name: string;
        show_byline: boolean;
    };
    article_blocks: IArticleBlock[];
    show_author_bios: boolean;
    properties: {
        exclude_from_search_engines: boolean;
        include_in_search_results: boolean;
        meta_description: string;
        social_image: string;
    };
    uuid: string;
    type: 'articles';
    metadata: {
        type: 'Article';
    };
    authorString: string;
}

export interface IArticleData {
    title: string;
    link: string;
    thumbnail: {
        url: string;
        altText: string;
    };
    date: string;
    author: string;
    summary: string;
}
