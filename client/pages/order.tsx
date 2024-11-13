import { ISeatType1Page, ISeatType1PageProps } from '@interfaces/pages/seattype1';
import { IEventDetailPageState } from '@interfaces/pages/eventdetail';
import { http, routes } from '@utils/constants';
import { authHelper } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { createRef, useEffect, useState } from 'react';
import { fetchDetailsEvent } from '@redux/actions/api';
import { validateHelper } from '@utils/helpers';
import Validator from '@components/commons/Validator';
import moment from 'moment';

const OrderPage: ISeatType1Page<ISeatType1PageProps> = () => {
    const router = useRouter();
    const { id, seatId, seatDetails, ticketPrice } = router.query;
    const token = authHelper.accessToken();
    const dispatch = useDispatch();

    const [state, setState] = useState<IEventDetailPageState>({
        eventDetails: undefined,
        event: [],
    });

    const { eventDetails, customer } = state;
    const formattedDayEnd = moment(eventDetails?.day_end).format('MMM DD, YYYY HH:mm:ss');
    
    const [yourName, setYourName] = useState('');
    const [yourEmail, setYourEmail] = useState('');
    const [yourPhone, setYourPhone] = useState('');

    const yourNameValidatorRef = createRef<IValidatorComponentHandle>();
    const yourEmailValidatorRef = createRef<IValidatorComponentHandle>();
    const yourPhoneValidatorRef = createRef<IValidatorComponentHandle>();

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

    const handleSubmit = async () => {
        let isValidate = true;

        const validator = [
            { ref: yourNameValidatorRef, value: yourName, message: 'Name Is Not Empty!' },
            { ref: yourEmailValidatorRef, value: yourEmail, message: 'Email Is Not Empty!' },
            { ref: yourPhoneValidatorRef, value: yourPhone, message: 'Phone Is Not Empty!' },
        ];

        validator.forEach(({ ref, value, message }) => {
            ref.current?.onValidateMessage('');
            if (validateHelper.isEmpty(String(value ?? ''))) {
                ref.current?.onValidateMessage(message);
                isValidate = false;
            } else if (validateHelper.isCharacters(String(value ?? ''))) {
                ref.current?.onValidateMessage(`Your ${message} Cannot Be Less Than 2 Characters`);
                isValidate = false;
            }
        });

        if (isValidate) {
            router.push(
                {
                    pathname: routes.CLIENT.PAYMENT_PAGE.href,
                    query: {
                        id,
                        seatCount,
                        seatId,
                        seatDetails,
                        ticketPrice,
                        yourName,
                        yourEmail,
                        yourPhone,
                    },
                },
                undefined,
                { scroll: false },
            );
        }
    };

    return (
        <>
            <div className="components__seattype1">
                <div className="components__order-form-and-ticket-info">
                    <div className="components__order-form-container">
                        <h2 className="components__order-form-title">Customer Information</h2>
                        <form>
                            <label className="components__order-form-label">Your Name</label>
                            <Validator ref={yourNameValidatorRef}>
                                <input
                                    type="textarea"
                                    className="components__order-form-input"
                                    value={yourName}
                                    onChange={(e) => setYourName(e.target.value)}
                                />
                            </Validator>
                            <label className="components__order-form-label">Your email</label>
                            <Validator ref={yourEmailValidatorRef}>
                                <input
                                    className="components__order-form-input"
                                    value={yourEmail}
                                    onChange={(e) => setYourEmail(e.target.value)}
                                />
                            </Validator>
                            <label className="components__order-form-label" htmlFor="phone">
                                Your Phone
                            </label>
                            <Validator ref={yourPhoneValidatorRef}>
                                <input
                                    className="components__order-form-input"
                                    value={yourPhone}
                                    onChange={(e) => setYourPhone(e.target.value)}
                                />
                            </Validator>
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
                        <button className="components__order-form-button" onClick={handleSubmit}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;
