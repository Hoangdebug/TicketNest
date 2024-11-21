interface IAdminListCustomerComponents<P = {}> extends IBaseComp<P> {}

interface IAdminListCustomerComponentsProps extends IBaseCompProps {
    customers?: IEditUserProfileDataAPI[];
    updateCustomers?: (newCustomers: IEditUserProfileDataAPI[]) => void;
}

interface IAdminListCustomerComponentsState {
    ids?: string[];
    search?: string;
    sortBy?: any;
    sortOrder?: any;
}
