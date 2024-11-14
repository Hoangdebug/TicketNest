import { IBasePageProps, IBasePage } from '@interfaces/pages/base';

interface IEventDetailPageProps extends IBasePageProps {}

interface IEventDetailPage<P = {}> extends IBasePage<P> {}

interface IEventDetailPageState {
    isValidate?: boolean;
    eventDetails?: IEventDataApi;
    event?: IEventDataApi[];
    replyId?: any;
    comment?: string;
    listComments?: ICommentDataAPI[];
    listReplyComments?: ICommentDataAPI[];
    replyCommemt?: string;
    customer?: IEditUserProfileDataAPI;
    updateComments?: string;
}
