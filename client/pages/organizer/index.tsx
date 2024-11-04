import { Box, Table } from '@components/index';
import { IEventListPage, IEventListPageProps, IEventListPageState } from '@interfaces/pages/eventpage';
import { fetchListEventOrganizer } from '@redux/actions/api';
import { http, images, routes } from '@utils/constants';
import { useRouter } from 'next/router';
import React, { createRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

const EventPageOrganizer: IEventListPage<IEventListPageProps> = () => {
    const router = useRouter();

    const [state, setState] = useState<IEventListPageState>({
        events: [],
    });

    const { events, totalItems } = state;

    const dispatch = useDispatch();
    const tableRef = createRef<ITableComponentHandle>();

    useEffect(() => {
        handleFetchListEvents();
    }, []);

    const handleFetchListEvents = async () => {
        dispatch(
            await fetchListEventOrganizer((res: IEventByOrganizerDataApiRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    const data = (res as IEventByOrganizerDataApiRes).result;
                    setState((prevState) => ({
                        ...prevState,
                        events: data,
                        totalItems: data?.length,
                    }));
                }
            }),
        );
    };

    const renderData = events?.map((item) => {
        const editBtn = {
            export: {
                srcIcon: images.ICON_DETAIL,
                onClick: () =>
                    router.push({ pathname: routes.CLIENT.UPDATE_EVENT_PAGE.href, query: { id: item._id } }, undefined, { scroll: false }),
            },
        };

        return {
            ...item,
            day_end: moment(item.day_end).format("YYYY-MM-DD"),
            day_start: moment(item.day_start).format("YYYY-MM-DD"),
            ...editBtn,
        };
    });

    const tableEventRender: ITableComponentProps = {
        heads: [
            {
                title: 'Edit Events',
                isSort: false,
            },
            {
                title: 'Event Name',
                isSort: true,
            },
            {
                title: 'Ticket Price',
                isSort: true,
            },
            {
                title: 'Ticket Quantity',
                isSort: true,
            },
            {
                title: 'Location',
                isSort: true,
            },
            {
                title: 'Event Type',
                isSort: true,
            },
            {
                title: 'Description',
                isSort: true,
            },
            {
                title: 'Days End',
                isSort: true,
            },
            {
                title: 'Days Start',
                isSort: true,
            },
        ],
        body: {
            columns: [
                {
                    field: 'export',
                    isButton: true,
                },
                {
                    field: 'name',
                    className: 'text-center',
                },
                {
                    field: 'price',
                    className: 'text-center',
                },
                {
                    field: 'ticket_number',
                    className: 'text-center',
                },
                {
                    field: 'location',
                    className: 'text-center',
                },
                {
                    field: 'event_type',
                    className: 'text-center',
                },
                {
                    field: 'description',
                    className: 'text-center',
                },
                {
                    field: 'day_end',
                    className: 'text-center',
                },
                {
                    field: 'day_start',
                    className: 'text-center',
                },
            ],
            rows: renderData,
        },
    };
    return (
        <div className="pages__organizer pt-5 row">
            <div className="pages__organizer-table">
                {events && events?.length > 0 ? (
                    <Box className="p-3">
                        <h2 className="text-start">Event Manager</h2>
                        <Table ref={tableRef} heads={tableEventRender.heads} body={tableEventRender.body} total={totalItems} />
                    </Box>
                ) : (
                    <div className="text-center pt-2 bases__font--16 fw-bolder bases__text--red">No events</div>
                )}
            </div>
        </div>
    );
};

export default EventPageOrganizer;
