import { Box, Table } from '@components/index';
import { ICustomerListOrderPage, ICustomerListOrderPageProps, ICustomerListOrderState } from '@interfaces/pages/adminorder';
import { fetchListOrder } from '@redux/actions/api';
import { http, images } from '@utils/constants';
import React, { createRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const CustomerListOrderPageAdmin: ICustomerListOrderPage<ICustomerListOrderPageProps> = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState<ICustomerListOrderState>({
        listOrder: [],
    });
    const { listOrder } = state;
    const tableRef = createRef<ITableComponentHandle>();

    useEffect(() => {
        handleFetchListOrder();
    }, []);

    const handleFetchListOrder = async () => {
        dispatch(
            await fetchListOrder((res: IOrderDataApiRes | IErrorAPIRes | null) => {
                if (res?.code === http.SUCCESS_CODE) {
                    const data = (res as IOrderDataApiRes).result;
                    setState((prevState) => ({
                        ...prevState,
                        listOrder: data,
                    }));
                }
            }),
        );
    };

    const renderData = listOrder?.map((item) => {
        const editBtn = {
            export: {
                srcIcon: images.ICON_DETAIL,
            },
        };

        return {
            ...item,

            ...editBtn,
        };
    });

    const tableOrderRender: ITableComponentProps = {
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
        <div className="row pt-3">
            {listOrder && listOrder.length > 0 ? (
                <Box className="col-md-12 p-3">
                    <h2 className="fw-bold mb-4 text-start ">Customer Request Organizer</h2>
                    <Table ref={tableRef} heads={tableOrderRender.heads} body={tableOrderRender.body} total={listOrder?.length} />
                </Box>
            ) : (
                <div className="col-md-9 pt-5">
                    <div className="text-center pt-3 bases__font--16 fw-bold bases__text--red"> No Request Organizer By Customer </div>
                </div>
            )}
        </div>
    );
};

export default CustomerListOrderPageAdmin;
