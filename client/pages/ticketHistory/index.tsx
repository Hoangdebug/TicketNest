import { Box, Img } from '@components/index';
import {
    ITicketBookingHistoryPage,
    ITicketBookingHistoryPageProps,
    ITicketBookingHistoryState,
} from '@interfaces/pages/ticketbookinghistory';
import { fetchListOrder } from '@redux/actions/api';
import { http, images } from '@utils/constants';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

const TicketBookingHistoryPage: ITicketBookingHistoryPage<ITicketBookingHistoryPageProps> = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState<ITicketBookingHistoryState>({
        historyBooking: [],
    });

    const { historyBooking } = state;

    useEffect(() => {
        handleFetchListOrder();
    }, []);

    const handleFetchListOrder = async () => {
        dispatch(
            await fetchListOrder((res: IOrderDataApiRes | IErrorAPIRes | null) => {
                const data = (res as IOrderDataApiRes).result;
                if (res?.code === http.SUCCESS_CODE) {
                    setState((prevState) => ({
                        ...prevState,
                        historyBooking: data,
                    }));
                }
            }),
        );
    };

    return (
        <div className="pages__ticket-booking-history bases__padding--top70 p-4">
            <h2 className="bases__font20 fw-bolder pt-5">Ticket Booking History</h2>
            <Box>
                {historyBooking?.map((item, index) => (
                    <div className="pages__ticket-booking-history-card p-3" key={index}>
                        <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                            <Img src={images.ICON_USER} />
                            <p className="m-0 fs-4">{item.customer?.username}</p>
                        </span>
                        <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                            <Img src={images.ICON_TICKET_EVENT} />
                            <p className="m-0 fs-4 fw-bolder">{item.event?.name}</p>
                        </span>
                        <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                            <Img src={images.ICON_CHAIR} />
                            <p className="m-0 fs-4 fw-bolder">{item?.seat_code}</p>
                        </span>
                        <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                            <Img src={images.ICON_MONEY} />
                            <p className="m-0 fs-4">{item?.event?.price}</p>
                        </span>
                        <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                            <Img src={images.ICON_LOCATION} />
                            <p className="m-0 fs-4">{item?.event?.location}</p>
                        </span>
                        <p className="m-0 text-end bases__text--gray">
                            Event time: {moment(item.event?.day_event).format('YYYY/MM/DD HH:ss')}
                        </p>
                    </div>
                ))}
            </Box>
        </div>
    );
};

export default TicketBookingHistoryPage;
