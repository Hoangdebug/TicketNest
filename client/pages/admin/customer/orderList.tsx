import { Box, Input, Table } from '@components/index';
import { ICustomerListOrderPage, ICustomerListOrderPageProps, ICustomerListOrderState } from '@interfaces/pages/adminorder';
import { fetchListOrder } from '@redux/actions/api';
import { http } from '@utils/constants';
import React, { createRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

const CustomerListOrderPageAdmin: ICustomerListOrderPage<ICustomerListOrderPageProps> = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState<ICustomerListOrderState>({
        listOrder: [],
        search: '',
        sortBy: '',
        sortOrder: 'asc',
    });

    const { listOrder, search, sortBy, sortOrder } = state;
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

    const handleOnchange = (field: string, value: string) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSort = (column: string) => {
        setState((prevState) => ({
            ...prevState,
            sortBy: column,
            sortOrder: prevState.sortBy === column && prevState.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredAndSortedOrders = listOrder
        ?.filter((order) => {
            const searchLower = search?.toLowerCase();
            return (
                order.customer?.username?.toLowerCase().includes(searchLower as string) ||
                order.event?.name?.toLowerCase().includes(searchLower as string) ||
                order.event?.location?.toLowerCase().includes(searchLower as string)
            );
        })
        .sort((a, b) => {
            if (!sortBy) return 0;
            const valueA = sortBy === 'day_start' ? a.event?.day_start : a.event?.day_end;
            const valueB = sortBy === 'day_start' ? b.event?.day_start : b.event?.day_end;

            const dateA = moment(valueA);
            const dateB = moment(valueB);

            if (sortOrder === 'asc') {
                return dateA.isAfter(dateB) ? 1 : dateA.isBefore(dateB) ? -1 : 0;
            } else {
                return dateA.isBefore(dateB) ? 1 : dateA.isAfter(dateB) ? -1 : 0;
            }
        });

    const renderData = filteredAndSortedOrders?.map((item) => {
        return {
            ...item,
            username: item?.customer?.username,
            nameEvent: item?.event?.name,
            location: item?.event?.location,
            dayStart: moment(item.event?.day_start).format('YYYY-MM-DD HH:mm'),
            dayEnd: moment(item.event?.day_end).format('YYYY-MM-DD HH:mm'),
        };
    });

    const tableOrderRender: ITableComponentProps = {
        heads: [
            {
                title: 'Users Name',
                isSort: false,
                className: 'text-center',
            },
            {
                title: 'Days Of Birth',
                className: 'text-center',
            },
            {
                title: 'Seat',
                className: 'text-center',
            },
            {
                title: 'Event',
                className: 'text-center',
            },
            {
                title: 'Location',
                className: 'text-center',
            },
            {
                title: 'Day start ',
                isSort: true,
                onClick: () => handleSort('dayStart'),
                className: 'text-center',
            },
            {
                title: 'Day End ',
                isSort: true,
                onClick: () => handleSort('dayEnd'),
                className: 'text-center',
            },
        ],
        body: {
            columns: [
                {
                    field: 'username',
                    className: 'text-center',
                },
                {
                    field: 'total_money',
                    className: 'text-center',
                },
                {
                    field: 'seat_code',
                    className: 'text-center',
                },
                {
                    field: 'nameEvent',
                    className: 'text-center',
                },
                {
                    field: 'location',
                    className: 'text-center',
                },
                {
                    field: 'dayStart',
                    className: 'text-center',
                },
                {
                    field: 'dayEnd',
                    className: 'text-center',
                },
            ],
            rows: renderData,
        },
    };
    return (
        <div className="row pt-3">
            <h3 className="pb-3">Orders</h3>
            {listOrder && listOrder.length > 0 ? (
                <Box className="col-md-12 p-3">
                    <div className="d-flex flex-row justify-content-between">
                        <h2 className="fw-bold mb-4 text-start ">Customer Request Organizer</h2>
                        <div className="w-25">
                            <Input
                                type="text"
                                placeholder="Enter your key...."
                                value={search}
                                onChange={(value: string) => handleOnchange('search', value)}
                            />
                        </div>
                    </div>
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
