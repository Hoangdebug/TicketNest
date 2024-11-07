interface ISeatAnotherDataAPI {
    _id?: string;
    username?: {
        _id?: string;
        name?: string;
    };
    ticket_type?: string[];
    location?: string;
    price?: number[];
    quantity?: number[];
}

interface ISeatanotherDetailsApiRes extends IBaseAPIRes {
    result?: ISeatAnotherDataAPI;
}

interface ISeatanotherDataApiRes extends IBaseAPIRes {
    code: number;
    result?: {
        metadata?: {
            pages?: number;
            pageSize?: number;
            currentPage?: number;
            totalItems?: number;
        };
        Seatanother?: ISeatAnotherDataAPI;
    };
}
