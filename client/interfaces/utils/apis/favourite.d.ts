interface addFavourite {
    user?: string,
    event?: string
}

interface addFavouriteRes extends IBaseAPIRes {
    result?: addFavourite;
}

interface addFavouriteApiRes extends IBaseAPIRes {
    code: number;
    result?: {
        metadata?: {
            pages?: number;
            pageSize?: number;
            currentPage?: number;
            totalItems?: number;
        };
    };
}
