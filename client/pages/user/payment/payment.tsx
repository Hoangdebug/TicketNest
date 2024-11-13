import { IEventDetailPageState } from '@interfaces/pages/eventdetail';
import { http, routes } from '@utils/constants';
import { authHelper } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchDetailsEvent, fetchUpdateOrderSeat } from '@redux/actions/api';
import moment from 'moment';
import axios from 'axios';

const Payment = () => {
    const router = useRouter();
    const { id, seatId, seatDetails, ticketPrice, username, email, phone } = router.query;
    const token = authHelper.accessToken();
    const dispatch = useDispatch();

    const [state, setState] = useState<IEventDetailPageState>({
        eventDetails: undefined,
        event: [],
    });

    const [countdown, setCountdown] = useState(90);
    const [isDisabled, setIsDisabled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const { eventDetails, event } = state;
    const formattedDayEvent = moment(eventDetails?.day_event).format('MMM DD, YYYY HH:mm:ss');

    const handleDetailsEvent = async () => {
        dispatch(
            await fetchDetailsEvent(id?.toString() ?? '', (res: IEventDataApiRes | IErrorAPIRes | null) => {
                if (res && res.code === http.SUCCESS_CODE) {
                    const event = (res as IEventDataApiRes).result?.dataEvent;
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
        handleDetailsEvent();
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsDisabled(true);
            setShowPopup(true);
        }
    }, [countdown]);

    let parsedSeatDetails = [];

    if (seatDetails) {
        try {
            parsedSeatDetails = Array.isArray(seatDetails) ? seatDetails : JSON.parse(seatDetails);
        } catch (error) {
            console.error('Error parsing seat details:', error);
        }
    }

    const formattedSeatDetails = parsedSeatDetails.join(', ');
    const seatCount = parsedSeatDetails.length;

    const handleClose = () => {
        setShowPopup(false);
        // Redirect to rebook tickets
        router.push(
            { pathname: routes.CLIENT.ORDER_PAGES.href, query: { id, seatCount, formattedSeatDetails, seatDetails, ticketPrice } },
            undefined,
            { scroll: false },
        );
    };

    const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return undefined;
    };

    const handlePayment = async () => {
        if (seatId && seatDetails.length > 0) {
            try {
                const res = await dispatch(fetchUpdateOrderSeat(seatId, seatDetails));
                if (res && res.success) {
                    try {
                        const token = getCookie('token');

                        if (!token) {
                            console.error('Token not found in cookies');
                            return;
                        }

                        const selectedPaymentMethod = (document.querySelector('input[name="payment"]:checked') as HTMLInputElement).value;

                        const response = await axios.post(
                            `http://localhost:5000/api/order/${id}`,
                            {
                                seatcode: formattedSeatDetails,
                                totalmoney: ticketPrice,
                                paymentCode: selectedPaymentMethod,
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        );

                        const data = response.data;
                        if (data.status === true) {
                            const paymentUrl = data.paymentUrl;
                            window.location.href = paymentUrl;
                        } else {
                            console.error('Failed to create order', data.message);
                        }
                    } catch (error) {
                        console.error('Error during payment', error);
                    }
                } else {
                    console.error("Failed to update order seat:", res?.message || "Unknown error");
                }
            } catch (error) {
                console.error("Error updating order seat:", error);
            }
        }
    };

    return (
        <div className="components__payment">
            <div className="components__payment-header">
                <h1>{eventDetails?.name}</h1>
                <p>{eventDetails?.event_type}</p>
                <p>{eventDetails?.location}</p>
                <p>{formattedDayEvent}</p>
            </div>
            <div className="components__payment-timer">
                <span>Complete your booking within</span>
                <div className="components__payment-timer--countdown">
                    <span>{String(Math.floor(countdown / 60)).padStart(2, '0')}</span>
                    <span>:</span>
                    <span>{String(countdown % 60).padStart(2, '0')}</span>
                </div>
            </div>
            <div className="components__payment-paymentSection">
                <div className="components__payment-paymentSection-left">
                    <div className="components__payment-paymentSection-ticketInfo">
                        <h2>Ticket receiving info</h2>
                        <p>Name: {username}</p>
                        <p>Phone Number: {phone}</p>
                        <p>Email: {email}</p>
                    </div>
                    <div className="components__payment-paymentSection-paymentMethods">
                        <h2>Payment method</h2>
                        <div className="components__payment-paymentSection-method">
                            <input type="radio" id="paypal" name="payment" value="paypal" />
                            <label>PayPal</label>
                        </div>
                    </div>
                </div>
                <div className="components__payment-paymentSection-right">
                    <div className="components__payment-paymentSection-orderInfo">
                        <h2>Ticket information</h2>
                        <p>Seat: {formattedSeatDetails}</p>
                        <p>Number: {seatCount}</p>
                        <p>{ticketPrice}</p>
                    </div>
                    <div className="components__payment-paymentSection-total">
                        <h2>Order information</h2>
                        <p>Subtotal: {ticketPrice}</p>
                        <p>Total: {ticketPrice}</p>
                    </div>
                    <button className="components__payment-paymentSection-payButton" disabled={isDisabled} onClick={handlePayment}>
                        Payment
                    </button>
                </div>
            </div>

            {showPopup && (
                <div className="popup-modal">
                    <div className="popup-modal-content">
                        <span className="popup-modal-close" onClick={handleClose}>
                            &times;
                        </span>
                        <h2>Ticket hold time has expired!</h2>
                        <p>The ticket holding period has expired. Please rebook a new ticket.</p>
                        <button onClick={handleClose}>Book new ticket</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
