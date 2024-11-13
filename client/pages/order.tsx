import { ISeatType1Page, ISeatType1PageProps } from '@interfaces/pages/seattype1';
import { IEventDetailPageState } from '@interfaces/pages/eventdetail';
import { http, routes } from '@utils/constants';
import { authHelper, validateHelper } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { createRef, useEffect, useState } from 'react';
import { fetchDetailsEvent } from '@redux/actions/api';
import Validator from '@components/commons/Validator';
import moment from 'moment';
import { ReduxStates } from '@redux/reducers';
import { Input } from '@components/index';

const OrderPage: ISeatType1Page<ISeatType1PageProps> = () => {
    const router = useRouter();
    const { id, seatDetails, ticketPrice } = router.query;
    const token = authHelper.accessToken();
    const dispatch = useDispatch();
    const { profile } = useSelector((states: ReduxStates) => states);

    const [state, setState] = useState<IEventDetailPageState>({
        eventDetails: undefined,
    });

    const { eventDetails, customer } = state;
    const formattedDayEnd = moment(eventDetails?.day_end).format('MMM DD, YYYY HH:mm:ss');

    const yourNameValidatorRef = createRef<IValidatorComponentHandle>();
    const yourEmailValidatorRef = createRef<IValidatorComponentHandle>();
    const yourPhoneValidatorRef = createRef<IValidatorComponentHandle>();

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            customer: {
                username: profile?.username ?? '',
                email: profile?.email ?? '',
                phone: profile?.phone ?? '',
            },
        }));
    }, []);

    useEffect(() => {
        if (!token) {
            router.push(routes.CLIENT.LOGIN_PAGE.href, undefined, { scroll: false });
        }
        handleDetialsEvent();
    }, []);

    const handleOnChange = (field: string, value: string | boolean | null) => {
        setState((prevState) => ({
            customer: {
                ...prevState.customer,
                [field]: value,
            },
        }));
    };

    const handleDetialsEvent = async () => {
        dispatch(
            await fetchDetailsEvent(id?.toString() ?? '', (res: IEventDetailsApiRes | IErrorAPIRes | null) => {
                if (res && res.code === http.SUCCESS_CODE) {
                    const dataDetail = (res as IEventDetailsApiRes).result;
                    setState((prevState) => ({
                        ...prevState,
                        eventDetails: dataDetail,
                    }));
                }
            }),
        );
    };

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
            { ref: yourNameValidatorRef, value: customer?.username, message: 'Name Is Not Empty!' },
            { ref: yourEmailValidatorRef, value: customer?.email, message: 'Email Is Not Empty!' },
            { ref: yourPhoneValidatorRef, value: customer?.phone, message: 'Phone Is Not Empty!' },
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
                        seatDetails,
                        ticketPrice,
                        username: customer?.username ?? '',
                        email: customer?.email ?? '',
                        phone: customer?.phone ?? '',
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
                                <Input
                                    className="components__order-form-input"
                                    value={customer?.username ?? ''}
                                    onChange={(value: string) => handleOnChange('username', value)}
                                />
                            </Validator>
                            <label className="components__order-form-label">Your email</label>
                            <Validator ref={yourEmailValidatorRef}>
                                <Input
                                    className="components__order-form-input"
                                    value={customer?.email ?? ''}
                                    onChange={(value: string) => handleOnChange('email', value)}
                                />
                            </Validator>
                            <label className="components__order-form-label" htmlFor="phone">
                                Your Phone
                            </label>
                            <Validator ref={yourPhoneValidatorRef}>
                                <Input
                                    className="components__order-form-input"
                                    value={customer?.phone ?? ''}
                                    onChange={(value: string) => handleOnChange('phone', value)}
                                    isBlockSpecial={true}
                                    type="signed-number"
                                    maxLength={10}
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
