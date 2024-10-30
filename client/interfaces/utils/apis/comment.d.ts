interface ICommentDataAPI {
    _id?: string;
    userId?: IEditUserProfileDataAPI;
    eventId?: IEventDataApi;
    parentComment?: string;
    comment?: string;
    createdAt?: string;
}

interface ICommentDataAPIRes extends IBaseAPIRes {
    code?: number;
    message?: string;
    result?: ICommentDataAPI;
}

interface ICommentListDataAPIRes extends IBaseAPIRes {
    code?: number;
    message?: string;
    result?: ICommentDataAPI[];
}
