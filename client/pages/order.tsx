import { ISeatType1Page, ISeatType1PageProps } from '@interfaces/pages/seattype1';
import { IEventDetailPageState } from '@interfaces/pages/eventdetail';
import { http, routes } from '@utils/constants';
import { authHelper } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchDetailsEvent } from '@redux/actions/api';
import moment from 'moment';

const OrderPage: ISeatType1Page<ISeatType1PageProps> = () => {
    const router = useRouter();
    const { id, seatDetails, ticketPrice } = router.query;
    const token = authHelper.accessToken();
    const dispatch = useDispatch();

    const [state, setState] = useState<IEventDetailPageState>({
        eventDetails: undefined,
        event: [],
    });

    const { eventDetails, event } = state;
    const formattedDayEnd = moment(eventDetails?.day_end).format('MMM DD, YYYY HH:mm:ss');

    const [yourName, setYourName] = useState('');
    const [yourEmail, setYourEmail] = useState('');
    const [yourPhone, setYourPhone] = useState('');

    const handleDetialsEvent = async () => {
        dispatch(
            await fetchDetailsEvent(id?.toString() ?? '', (res: IEventDataApiRes | IErrorAPIRes | null) => {
                if (res && res.code === http.SUCCESS_CODE) {
                    const event = (res as IEventDataApiRes).result;
                    setState((prevState) => ({
                        ...prevState,
                        eventDetails: event,
                    }));
                }
            }),
        );
    };

    useEffect(() => {
        if (!token) {
            router.push(routes.CLIENT.LOGIN_PAGE.href, undefined, { scroll: false });
        }
        handleDetialsEvent();
    }, []);

    let parsedSeatDetails: string[] = [];

    if (seatDetails) {
        try {
            parsedSeatDetails = Array.isArray(seatDetails) ? seatDetails : JSON.parse(seatDetails as string);
        } catch (error) {
            console.error('Error parsing seat details:', error);
        }
    }

    const formattedSeatDetails = parsedSeatDetails.join(', ');
    const seatCount = parsedSeatDetails.length;

    return (
        <>
            <div className="components__seattype1">
                <div className="components__order-form-and-ticket-info">
                    <div className="components__order-form-container">
                        <h2 className="components__order-form-title">Question Table</h2>
                        <form>
                            <label className="components__order-form-label">Your Name?</label>
                            <input
                                className="components__order-form-input"
                                value={yourName}
                                onChange={(e) => setYourName(e.target.value)}
                            />

                            <label className="components__order-form-label">Your email?</label>
                            <input
                                className="components__order-form-input"
                                value={yourEmail}
                                onChange={(e) => setYourEmail(e.target.value)}
                            />

                            <label className="components__order-form-label" htmlFor="phone">
                                Your Phone
                            </label>
                            <input
                                className="components__order-form-input"
                                value={yourPhone}
                                onChange={(e) => setYourPhone(e.target.value)}
                            />
                        </form>
                    </div>
                    <div className="components__order-ticket-info">
                        <h2 className="components__order-ticket-title">Ticket information</h2>
                        <div className="components__order-ticket-item">
                            <label className="components__order-ticket-label">Ticket type</label>
                            <span className="components__order-ticket-value">{eventDetails?.event_type}</span>
                        </div>
                        <div className="components__order-ticket-item">
                            <label className="components__order-ticket-label">Number</label>
                            <span className="components__order-ticket-value">{seatCount}</span>
                        </div>
                        <div className="components__order-ticket-item">
                            <label className="components__order-ticket-label">Seat</label>
                            <span className="components__order-ticket-value">{formattedSeatDetails}</span>
                        </div>
                        <div className="components__order-ticket-item">
                            <label className="components__order-ticket-label">The money of {seatCount} seat</label>
                            <span className="components__order-ticket-value">{ticketPrice} đ</span>
                        </div>
                        <button
                            className="components__order-form-button"
                            onClick={() =>
                                router.push(
                                    {
                                        pathname: routes.CLIENT.PAYMENT_PAGE.href,
                                        query: {
                                            id,
                                            seatCount,
                                            seatDetails,
                                            ticketPrice,
                                            yourName,
                                            yourEmail,
                                            yourPhone,
                                        },
                                    },
                                    undefined,
                                    { scroll: false },
                                )
                            }
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;
