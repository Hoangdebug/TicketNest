import {
    ITicketBookingHistoryPage,
    ITicketBookingHistoryPageProps,
    ITicketBookingHistoryState,
} from '@interfaces/pages/ticketbookinghistory';
import { fetchListOrder } from '@redux/actions/api';
import { http } from '@utils/constants';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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

    return <div className="pages__ticket-booking-history bases__padding--top70">heelo</div>;
};

export default TicketBookingHistoryPage;
