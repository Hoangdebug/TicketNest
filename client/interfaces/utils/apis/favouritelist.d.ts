interface IFavouriteDataApi {
    _id?: string;
    name?: string;
    description?: string;
    day_start?: string;
    day_end?: string;
    day_event?: string;
    ticket_number?: number[];
    price?: number[];
    location?: string;
    ticket_type?: string[];
    quantity?: number[];
    event_type?: string;
    status?: string;
    is_active?: boolean;
    created_by?: string;
    createdAt?: string;
    updatedAt?: string;
    images?: string;
}

interface IFavouriteDataApiRes extends IBaseAPIRes {
    result?: IFavouriteDataApi[];
}
