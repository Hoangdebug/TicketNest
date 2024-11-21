interface IRatingDataApi {
    _id?: string;
    userId?: IEditUserProfileDataAPI;
    eventId?: IEventDataApi;
    rating?: number;
    createdAt?: string;
    isDeleted?: boolean;
}

interface IRatingDataAPIRes extends IBaseAPIRes {
    result?: IRatingDataApi;
}

interface IListRatingDataAPIRes extends IBaseAPIRes {
    result?: IRatingDataApi[];
}
