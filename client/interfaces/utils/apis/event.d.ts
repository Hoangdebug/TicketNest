interface IEventDataApi {
    _id?: string;
    name?: string;
    description?: string;
    images?: string | FormData | undefined;
    day_start?: string;
    day_end?: string;
    event_type?: string;
    location?: string;
    ticket_type?: string[];
    price?: number[];
    quantity?: number[];
    ticket_number?: string;
    createdAt?: string;
    created_by?: {
        _id?: string;
        name?: string;
        description?: string;
        contact_email?: string;
        contact_phone?: string;
        sponsor_by?: string;
    };
    status?: 'all' | enums.EventStatus.ACCEPTED | enums.EventStatus.CANCELLED | enums.EventStatus.PENDING | undefined;
}

interface IEventDataApiRes extends IBaseAPIRes {
    code: number;
    result?: {
        metadata?: {
            pages?: number;
            pageSize?: number;
            currentPage?: number;
            totalItems?: number;
        };
        dataEvent?: IEventDataApi;
    };
}

interface IEventDetailsApiRes extends IBaseAPIRes {
    result?: IEventDataApi;
}

interface IEventUpdateByAdmin extends IBaseAPIRes {
    code: number;
    result?: IEventDataApi;
}

interface IEventByOrganizerDataApiRes extends IBaseAPIRes {
    code: number;
    result?: IEventDataApi[];
}

interface IEventDataApiListRes extends IBaseAPIRes {
    code: number;
    result?: {
        metadata?: {
            pages?: number;
            pageSize?: number;
            currentPage?: number;
            totalItems?: number;
        };
        dataEvent?: IEventDataApi[];
    };
    totalPage?: number;
}
