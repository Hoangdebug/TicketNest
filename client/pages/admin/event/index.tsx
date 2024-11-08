import { Box, Button, Img, Input, Select } from '@components/index';
import Pagination from '@components/layouts/Pagination';
import { IEventManagerAcceptPage, IEventManagerAcceptPageProps, IEventManagerAcceptPageState } from '@interfaces/pages/eventaccept';
import { setModal } from '@redux/actions';
import { fetchListEvent, fetchUpdateStatusEventByAdmin } from '@redux/actions/api';
import { ReduxStates } from '@redux/reducers';
import { enums, http, images, routes } from '@utils/constants';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const EventManagerAcceptPage: IEventManagerAcceptPage<IEventManagerAcceptPageProps> = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { profile } = useSelector((states: ReduxStates) => states);
    const pageQuery = parseInt(router.query.page as string) || 1;

    const [state, setState] = useState<IEventManagerAcceptPageState>({
        event: [],
        status: 'all',
        search: '',
        statusEventFilter: enums.EventStatus.PENDING,
        statusEvent: 'all',
        currentPage: pageQuery,
        totalPage: 0,
        totalItems: undefined,
    });

    const { event, status, search, statusEvent, currentPage, totalPage, allEvents, statusEventFilter } = state;

    useEffect(() => {
        if (currentPage !== pageQuery) {
            router.push(
                {
                    pathname: router.pathname,
                    query: { ...router.query, page: currentPage },
                },
                undefined,
                { scroll: false },
            );
        }
    }, [currentPage]);

    useEffect(() => {
        if (pageQuery !== currentPage) {
            setState((prevState) => ({
                ...prevState,
                currentPage: pageQuery,
            }));
        }
    }, [router.query.page]);

    useEffect(() => {
        handleFetchListEvents();
    }, [currentPage]);

    useEffect(() => {
        const filteredEvents = allEvents?.filter((eventItem) => (status === 'all' ? true : eventItem.status === status));
        setState((prevState) => ({
            ...prevState,
            event: filteredEvents,
        }));
    }, [status, allEvents]);

    const allItemFillter = [
        {
            title: 'All Events',
            icon: images.ICON_FILLTER_ALL_EVENT,
            value: 'all',
            class: '',
        },
        {
            title: 'New',
            icon: images.ICON_FILLTER_NEW_EVENT,
            value: 'new',
            class: '',
        },
        {
            title: 'On-Going',
            icon: images.ICON_FILLTER_ON_GOING_EVENT,
            value: 'on-going',
            class: '',
        },
        {
            title: 'Resolved',
            icon: images.ICON_FILLTER_RESOLVED_EVENT,
            value: 'resolved',
            class: '',
        },
    ];

    const renderStatusOptions = () => {
        const statusOptions = [
            {
                value: 'all',
                label: 'All Events',
            },
            {
                value: enums.EventStatus.PENDING,
                label: 'Events Processing',
                classOption: 'pages__events--status status-new',
            },
            {
                value: enums.EventStatus.CANCELLED,
                label: 'Events Cancel',
                classOption: 'pages__events--status status-ongoing',
            },
            {
                value: enums.EventStatus.ACCEPTED,
                label: 'Events On-Going',
                classOption: 'pages__events--status status-resolved',
            },
        ];

        return statusOptions;
    };

    const handleOnChange = (field: string, value: string | number | boolean) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleChangePage = (page: number) => {
        setState((prevState) => ({
            ...prevState,
            currentPage: page,
        }));
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, page: page.toString() },
            },
            undefined,
            { scroll: false },
        );
    };

    const processProductQuery = () => {
        const query = new URLSearchParams({
            page: currentPage?.toString() ?? '1',
            pageSize: '5',
        });

        if (status !== 'all') {
            query.append('status', status ?? '');
        }
        return query;
    };

    const handleFetchListEvents = async () => {
        const query = processProductQuery();
        dispatch(
            await fetchListEvent(`?${query.toString()}`, (res: IEventDataApiListRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    const data = (res as IEventDataApiListRes).result;
                    const totalPages = (res as IEventDataApiListRes).totalPage;
                    setState((prevState) => ({
                        ...prevState,
                        allEvents: data?.dataEvent,
                        totalPage: totalPages,
                        currentPage: data?.metadata?.currentPage,
                        totalItems: data?.metadata?.totalItems,
                    }));
                }
            }),
        );
    };

    const handleUpdateStatusEventByAdmin = async (idsToUpdate: string[]) => {
        console.log(statusEventFilter);
        if (!statusEventFilter || statusEventFilter === 'all') {
            console.error('Invalid status selected for update.');
            return;
        }
        dispatch(
            await fetchUpdateStatusEventByAdmin(
                idsToUpdate.join(','),
                { status: statusEventFilter },
                (res: IEventUpdateByAdmin | IErrorAPIRes | null) => {
                    if (res?.code === http.SUCCESS_CODE) {
                        handleFetchListEvents();
                    } else {
                        dispatch(
                            setModal({
                                isShow: true,
                                content: (
                                    <>
                                        <div className="text-center bases__margin--bottom31">
                                            <Img src={images.ICON_CLOSE} className="bases__width--90 bases__height--75" />
                                        </div>
                                        <div className="bases__text--bold bases__font--14 text-center">Error While Update Status Event</div>
                                    </>
                                ),
                            }),
                        );
                    }
                },
            ),
        );
    };

    const renderEventTypeOptions = () => {
        const eventTypeOptions = [
            {
                value: enums.EventStatus.PENDING,
                label: enums.EventStatus.PENDING,
            },
            {
                value: enums.EventStatus.CANCELLED,
                label: enums.EventStatus.CANCELLED,
            },
            {
                value: enums.EventStatus.ACCEPTED,
                label: enums.EventStatus.ACCEPTED,
            },
        ];

        return eventTypeOptions;
    };

    const handleConfirmUpdate = async (id: string) => {
        dispatch(
            setModal({
                isShow: true,
                content: (
                    <>
                        <div className="bases__text--bold bases__font--14 text-center">Do You Want To Accept This Event?</div>
                        <div className="pt-3">
                            <Select
                                className="p-2"
                                value={statusEventFilter}
                                onChange={(value: string) => handleOnChange('statusEventFilter', value)}
                                options={renderEventTypeOptions()}
                            />
                        </div>
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
                            handleUpdateStatusEventByAdmin([id]);
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

    const handleChangeText = (value: string) => {
        if (value === enums.EventStatus.ACCEPTED) {
            return (
                <div className="d-flex flex-row align-items-center">
                    <div className="p-3" style={{ width: 5, height: 5, borderRadius: 50, background: 'green', marginRight: 10 }}></div>
                </div>
            );
        } else if (value === enums.EventStatus.PENDING) {
            return (
                <div className="d-flex flex-row d-flex flex-row align-items-center">
                    <div className="p-3" style={{ width: 5, height: 5, borderRadius: 50, background: 'blue', marginRight: 10 }}></div>
                </div>
            );
        } else if (value === enums.EventStatus.CANCELLED) {
            return (
                <div className="d-flex flex-row d-flex flex-row align-items-center">
                    <div className="p-3" style={{ width: 5, height: 5, borderRadius: 50, background: 'orange', marginRight: 10 }}></div>
                </div>
            );
        }
    };

    return (
        <div className="pages__events row">
            <div className="col-md-11">
                <h3 className="pb-3">Events</h3>
                <Box className="p-3 bases__width110">
                    <div className="pages__events--header d-flex flex-row justify-content-between pb-5">
                        <div className="position-relative">
                            <Input
                                type="text"
                                placeholder="Search by event name"
                                value={search}
                                onChange={(value: string) => handleOnChange('search', value)}
                            />
                            <Img className="pages__events--btnSearch" src={images.ICON_SEACH} onClick={() => {}} />
                        </div>
                        <div className="d-flex flex-row gap-4">
                            <Select
                                options={renderStatusOptions()}
                                value={status}
                                onChange={(value: string) => handleOnChange('status', value)}
                            />

                            {profile && profile?.type === enums.TYPES.ORGANIZER && (
                                <Button
                                    className="pages__events--btnAdd w-100 bases__background--color-royal-purple"
                                    buttonText="New Ticket"
                                    startIcon={images.ICON_ADD_NEW_EVENT}
                                    iconColor="bases__filter--white"
                                    onClick={() => {
                                        router.push(routes.CLIENT.ADD_EVENT_PAGE.href, undefined, { scroll: false });
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="pages__events--header-filter d-flex gap-4">
                        {allItemFillter.map((item, index) => (
                            <div key={index} className="pages__events--header-filter-item">
                                <Button
                                    buttonText={item.title}
                                    startIcon={item.icon}
                                    background={statusEvent === item.value ? 'color-royal-purple' : 'white'}
                                    textColor={statusEvent === item.value ? 'white' : 'black'}
                                    iconColor={statusEvent === item.value ? 'white' : ''}
                                    className={item.class}
                                    onClick={() => {
                                        handleOnChange('statusEvent', item.value);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    {event?.map((item, index) => (
                        <div className='className="d-flex flex-column p-3 pages__events--box mt-3 gap-4'>
                            <div key={index}>
                                <div className="d-flex flex-row justify-content-between align-items-center">
                                    <div className="pages__events--header-title d-flex flex-row">
                                        <div>{handleChangeText(item?.status ?? '')}</div>
                                        <h4>{item?.event_type}</h4>
                                    </div>
                                    <div>
                                        <p className="m-0">{moment(item?.createdAt ?? '--').format('DD/MM/YYYY HH:mm')}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <h5>{item?.name}</h5>
                                    <p className="m-0">{item?.description}</p>
                                </div>
                                <hr />
                                <div className="d-flex flex-row justify-content-between align-items-center">
                                    <div className="d-flex flex-row gap-2 align-items-center">
                                        <div>
                                            <Img src={item?.created_by?.name} />
                                        </div>
                                        <div>
                                            <p className="m-0">{item?.created_by?.name}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            background="white"
                                            buttonText="Approval"
                                            onClick={() => handleConfirmUpdate(item?._id ?? '')}
                                            textColor="blue"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {totalPage && totalPage > 0 && (
                        <Pagination current={pageQuery} totalPage={totalPage ?? 0} onPageChange={handleChangePage} />
                    )}
                </Box>
            </div>
        </div>
    );
};

export default EventManagerAcceptPage;
