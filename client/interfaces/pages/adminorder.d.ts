import { IBasePageProps, IBasePage } from '@interfaces/pages/base';

interface ICustomerListOrderPage<P = {}> extends IBasePage<P> {}

interface ICustomerListOrderPageProps extends IBasePageProps {}

interface ICustomerListOrderState {
    listOrder?: IOrderDataApi[];
    search?: string;
    sortBy?: any;
    sortOrder?: any;
}
