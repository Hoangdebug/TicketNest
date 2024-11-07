import { Box } from '@components/index';
import AdminListCustomerComponents from '@components/layouts/Customer';
import { IAdminCustomerPage, IAdminCustomerPageProps, IAdminCustomerPageState } from '@interfaces/pages/admincustomer';
import { fetchListAdminCustomer } from '@redux/actions/api';
import { http } from '@utils/constants';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const CustomerListPageAdmin: IAdminCustomerPage<IAdminCustomerPageProps> = () => {
    const dispatch = useDispatch();

    const [state, setState] = useState<IAdminCustomerPageState>({
        customers: [],
    });
    const { customers } = state;

    useEffect(() => {
        handleFetchListCus();
    }, []);

    const updateCustomers = (newCustomers: IEditUserProfileDataAPI[]) => {
        setState((prevState) => ({
            ...prevState,
            customers: newCustomers,
        }));
    };

    const handleFetchListCus = async () => {
        dispatch(
            await fetchListAdminCustomer((res: IAdminCustomerListAPIRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    const dataCus = (res as IAdminCustomerListAPIRes).result;
                    const blockedCustomers = dataCus?.filter((customer) => customer.isBlocked !== true);
                    setState((prevState) => ({
                        ...prevState,
                        customers: blockedCustomers,
                    }));
                }
            }),
        );
    };

    return (
        <div className="pages__listCustomer pt-3">
            {customers && customers.length > 0 ? (
                <Box className=" pages__listCustomer-rightSide justify-content-center col-md-12 p-3">
                    <h2 className="fw-bold mb-4 text-start">Customer List</h2>
                    <AdminListCustomerComponents customers={customers} updateCustomers={updateCustomers} />
                </Box>
            ) : (
                <div className="text-center fw-bolder pt-2 bases__text--red">Data not found</div>
            )}
        </div>
    );
};

export default CustomerListPageAdmin;
