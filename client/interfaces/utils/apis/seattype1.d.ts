interface ISeatType1DataAPI {
    _id?: string;
    username?: {
        _id?: string;
        name?: string;
    };
    ticket_type?: string[];
    location?: string;
    price?: number[];
    quantity?: number[];
    ordered_seat?: string[];
}

interface ISeattype1DetailsApiRes extends IBaseAPIRes {
    result?: ISeatType1DataAPI;
}

interface ISeattype1DataApiRes extends IBaseAPIRes {
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
