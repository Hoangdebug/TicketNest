import { Box, Button, Img, Select, Table } from '@components/index';
import { ICustomerRequestPage, ICustomerRequestPageProps, ICustomerRequestPageState } from '@interfaces/pages/customerreuqest';
import { setModal } from '@redux/actions';
import { fetchListAdminCustomer, fetchUpdateOrganizerByAdmin } from '@redux/actions/api';
import { enums, http, images } from '@utils/constants';
import React, { createRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const CustomerRequestPage: ICustomerRequestPage<ICustomerRequestPageProps> = () => {
    const dispatch = useDispatch();
    const tableRef = createRef<ITableComponentHandle>();
    const tableRefRequest = createRef<ITableComponentHandle>();

    const [state, setState] = useState<ICustomerRequestPageState>({
        customers: [],
        total: 0,
        organizerDetials: undefined,
        organizerRequest: enums.STATUS_ORGANIZER_REQUEST.ACCEPT,
    });

    const { customers, organizerRequest } = state;

    useEffect(() => {
        handleFetchListCus();
    }, []);

    const handleOnChange = (field: string, value: string | number | boolean) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleFetchListCus = async () => {
        dispatch(
            await fetchListAdminCustomer((res: IAdminCustomerListAPIRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    const dataCus = (res as IAdminCustomerListAPIRes).result;
                    const blockedCustomers = dataCus?.filter(
                        (customer) =>
                            customer.type === enums.TYPES.USER &&
                            customer.isBlocked !== true &&
                            customer?.organizerRequest === enums.STATUS_ORGANIZER_REQUEST.PROCESSING,
                    );
                    setState((prevState) => ({
                        ...prevState,
                        customers: blockedCustomers,
                        total: blockedCustomers?.length,
                    }));
                }
            }),
        );
    };

    const handleUpdateOrganizerByAdmin = async (idsToUpdate: string[]) => {
        dispatch(
            await fetchUpdateOrganizerByAdmin(
                idsToUpdate?.join(','),
                { organizerRequest },
                (res: IAdminUpdateOrganizerAPIRes | IErrorAPIRes | null) => {
                    if (res && res?.code === http.SUCCESS_CODE) {
                        handleFetchListCus();
                    }
                },
            ),
        );
    };

    const renderRoleOptions = () => {
        const roleOptions = [
            {
                value: enums.STATUS_ORGANIZER_REQUEST.PROCESSING,
                label: enums.STATUS_ORGANIZER_REQUEST.PROCESSING,
            },
            {
                value: enums.STATUS_ORGANIZER_REQUEST.ACCEPT,
                label: enums.STATUS_ORGANIZER_REQUEST.ACCEPT,
            },
            {
                value: enums.STATUS_ORGANIZER_REQUEST.REJECTED,
                label: enums.STATUS_ORGANIZER_REQUEST.REJECTED,
            },
        ];

        return roleOptions;
    };

    const handleConfirmUpdateRole = async (id: string) => {
        dispatch(
            setModal({
                isShow: true,
                content: (
                    <>
                        {/* <div className="text-center bases__margin--bottom31">
                            <Table ref={tableRefRequest} heads={tableRequest.heads} body={tableRequest.body} />
                        </div> */}
                        <Select
                            className="p-2"
                            value={organizerRequest}
                            onChange={(value: string) => handleOnChange('organizerRequest', value)}
                            options={renderRoleOptions()}
                        />
                        <div className="bases__text--bold bases__font--14 text-center">Do you want to update this account</div>
                    </>
                ),
                button: (
                    <Button
                        className="bases__margin--right32"
                        fontSize="14"
                        textColor="white"
                        buttonText="OK"
                        background="blue"
                        onClick={() => {
                            handleUpdateOrganizerByAdmin([id]);
                            dispatch(
                                setModal({
                                    isShow: false,
                                }),
                            );
                        }}
                    />
                ),
            }),
        );
    };

    const renderData = customers?.map((item) => {
        const editBtn = {
            export: {
                srcIcon: images.ICON_DETAIL,
                onClick: () => handleConfirmUpdateRole(item?._id ?? ''),
            },
        };

        let userType;
        switch (item.type) {
            case 'Admin':
                userType = 'ADMIN';
                break;
            case 'Organizer':
                userType = 'ORGANIZER';
                break;
            case 'User':
                userType = 'USER';
                break;
            default:
                userType = item.type;
        }

        return {
            ...item,
            type: userType,
            ...editBtn,
        };
    });

    const tableRequest: ITableComponentProps = {
        heads: [
            {
                title: 'Name Organizer',
                className: 'text-center',
            },
            {
                title: 'Mail Organizer',
                className: 'text-center',
            },
            {
                title: 'Descriptions Organizer',
                className: 'text-center',
            },
            {
                title: 'Phone Organizer',
                className: 'text-center',
            },
        ],
        body: {
            columns: [
                {
                    field: 'name',
                    className: 'text-center',
                },
                {
                    field: 'contact_email',
                    className: 'text-center',
                },
                {
                    field: 'description',
                    className: 'text-center',
                },
                {
                    field: 'contact_phone',
                    className: 'text-center',
                },
            ],
        },
    };

    const tableEventRender: ITableComponentProps = {
        heads: [
            {
                title: 'Update Role',
                isSort: false,
                className: 'text-center',
            },
            {
                title: 'Users Name',
                isSort: false,
                className: 'text-center',
            },
            {
                title: 'Days Of Birth',
                isSort: true,
                className: 'text-center',
            },
            {
                title: 'Gender',
                isSort: true,
                className: 'text-center',
            },
            {
                title: 'Phone',
                isSort: true,
                className: 'text-center',
            },
            {
                title: 'Address',
                isSort: true,
                className: 'text-center',
            },
            {
                title: 'Permission ',
                isSort: true,
                className: 'text-center',
            },
        ],
        body: {
            columns: [
                {
                    field: 'export',
                    isButton: true,
                    className: 'd-flex justify-content-center',
                },
                {
                    field: 'username',
                    className: 'text-center',
                },
                {
                    field: 'dob',
                    className: 'text-center',
                },
                {
                    field: 'gender',
                    className: 'text-center',
                },
                {
                    field: 'phone',
                    className: 'text-center',
                },
                {
                    field: 'address',
                    className: 'text-center',
                },
                {
                    field: 'type',
                    className: 'text-center',
                },
            ],
            rows: renderData,
        },
    };
    return (
        <div className="pages__custommerRequest row pt-3">
            {customers && customers.length > 0 ? (
                <Box className="col-md-12 p-3">
                    <h2 className="fw-bold mb-4 text-start ">Customer Request Organizer</h2>
                    <Table ref={tableRef} heads={tableEventRender.heads} body={tableEventRender.body} total={customers?.length} />
                </Box>
            ) : (
                <div className="col-md-9 pt-5">
                    <div className="text-center pt-3 bases__font--16 fw-bold bases__text--red"> No Request Organizer By Customer </div>
                </div>
            )}
        </div>
    );
};

export default CustomerRequestPage;
