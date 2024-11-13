interface IOrderDataApi {
    _id?: string;
    payment?: string;
    total_money?: string;
    seat_code?: string[];
    description?: string;
    customer?: IEditUserProfileDataAPI;
    event?: IEventDataApi;
    paymentUrl?: string;
}

interface IOrderDataApiRes extends IBaseAPIRes {
    result?: IOrderDataApi[];
}

interface ICreateorderDataApiRes extends IBaseAPIRes {
    result?: IOrderDataApi;
}
