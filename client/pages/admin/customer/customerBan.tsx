import { Box, Button, Img, Table } from '@components/index';
import { IAdminCustomerBanPage, IAdminCustomerBanPageProps, IAdminCustomerBanPageState } from '@interfaces/pages/customerbanlist';
import { setModal } from '@redux/actions';
import { fetchBanCustomerByAdmin, fetchListAdminCustomer } from '@redux/actions/api';
import { http, images } from '@utils/constants';
import React, { createRef, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

const CustomerBanList: IAdminCustomerBanPage<IAdminCustomerBanPageProps> = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState<IAdminCustomerBanPageState>({
        customers: [],
        total: 0,
    });

    const { customers } = state;
    const tableRef = createRef<ITableComponentHandle>();
    useEffect(() => {
        handleFetchListCus();
    }, []);

    const handleFetchListCus = async () => {
        dispatch(
            await fetchListAdminCustomer((res: IAdminCustomerListAPIRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    const dataCus = (res as IAdminCustomerListAPIRes).result;
                    const blockedCustomers = dataCus?.filter((customer) => customer.isBlocked === true);
                    setState((prevState) => ({
                        ...prevState,
                        customers: blockedCustomers,
                        total: blockedCustomers?.length,
                    }));
                }
            }),
        );
    };

    const handleFetchDeleteUser = async (idsToDelete: string[]) => {
        dispatch(
            await fetchBanCustomerByAdmin(idsToDelete.join(','), (res: IAdminCustomerBanAPIRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    handleFetchListCus();
                } else {
                    dispatch(
                        setModal({
                            isShow: true,
                            content: (
                                <>
                                    <div className="text-center bases__margin--bottom31">
                                        <Img src={images.ICON_CLOSE} className="bases__width--90 bases__height--75" />
                                    </div>
                                    <div className="bases__text--bold bases__font--14 text-center">
                                        Error While Ban Customer. Please Try Again!!!
                                    </div>
                                </>
                            ),
                        }),
                    );
                }
            }),
        );
    };

    const handleConfirmDelete = (id: string) => {
        dispatch(
            setModal({
                isShow: true,
                content: (
                    <>
                        <div className="text-center bases__margin--bottom31">
                            <Img src={images.ICON_TIMES} className="bases__width--90 bases__height--75" />
                        </div>
                        <div className="bases__text--bold bases__font--14 text-center">Do you want to Un Ban this user</div>
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
                            handleFetchDeleteUser([id]);
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
                srcIcon: images.ICON_DELETE,
                onClick: () => handleConfirmDelete(item?._id ?? ''),
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

    const tableEventRender: ITableComponentProps = {
        heads: [
            {
                title: 'Un Ban',
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
        <div className="row pt-3">
            <div className="pages__organizer-table col-md-12">
                {customers && customers.length > 0 ? (
                    <Box className="p-3">
                        <h2 className="fw-bold mb-4 text-start">Customer List Ban</h2>
                        <Table ref={tableRef} heads={tableEventRender.heads} body={tableEventRender.body} total={customers?.length} />
                    </Box>
                ) : (
                    <div className="text-center fw-bolder pt-2 bases__text--red">No Customer Ban</div>
                )}
            </div>
        </div>
    );
};

export default CustomerBanList;
