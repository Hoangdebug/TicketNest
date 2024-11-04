interface ISeatType3DataAPI {
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

interface ISeattype3DetailsApiRes extends IBaseAPIRes {
    result?: ISeatType3DataAPI;
}

interface ISeattype3DataApiRes extends IBaseAPIRes {
    code: number;
    result?: {
        metadata?: {
            pages?: number;
            pageSize?: number;
            currentPage?: number;
            totalItems?: number;
        };
        Seattype3?: ISeatType3DataAPI;
    };
}