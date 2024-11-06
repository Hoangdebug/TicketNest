import { IBasePageProps, IBasePage } from '@interfaces/pages/base';

interface ITicketBookingHistoryPageProps extends IBasePageProps {}

interface ITicketBookingHistoryPage<P = {}> extends IBasePage<P> {}

interface ITicketBookingHistoryState {
    historyBooking?: IOrderDataApi[];
}
