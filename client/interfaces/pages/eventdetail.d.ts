import { IBasePageProps, IBasePage } from '@interfaces/pages/base';

interface IEventDetailPageProps extends IBasePageProps {}

interface IEventDetailPage<P = {}> extends IBasePage<P> {}

interface IEventDetailPageState {
    eventDetails?: IEventDataApi;
    event?: IEventDataApi[];
    comment?: string;
    replyId?: any;
}
