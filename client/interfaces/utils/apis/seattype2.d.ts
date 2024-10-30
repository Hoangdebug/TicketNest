interface ISeatType2DataAPI {
    _id?: string;
    username?: {
        _id?: string;
        name?: string;
    };
    status?: 'all' | enums.SeatStatus.ACCEPTED | enums.SeatStatus.CANCELLED | enums.SeatStatus.PENDING | undefined;
    location?: string;
    price?: number[];
    quantity?: number[];
}

interface ISeattype2DetailsApiRes extends IBaseAPIRes {
    result?: ISeatType2DataAPI;
}

interface ISeattype2DataApiRes extends IBaseAPIRes {
    code: number;
    result?: {
        metadata?: {
            pages?: number;
            pageSize?: number;
            currentPage?: number;
            totalItems?: number;
        };
        Seattype2?: ISeatType2DataAPI;
    };
}