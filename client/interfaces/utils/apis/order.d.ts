interface IOrderDataApi {
    _id?: string;
    payment?: string;
    total_money?: string;
    seat_code?: string[];
    description?: string;
    customer?: IEditUserProfileDataAPI;
    event?: IEventDataApi;
}

interface IOrderDataApiRes extends IBaseAPIRes {
    result?: IOrderDataApi[];
}
