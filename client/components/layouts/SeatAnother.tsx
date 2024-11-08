import { useState, useEffect } from 'react';
import { http, routes } from '@utils/constants';
import { useRouter } from 'next/router';
import { fetchDetailsEvent, fetchDetailsSeatAnotherByEventId } from '@redux/actions/api';
import { useDispatch } from 'react-redux';

const SeatAnother: ISeatAnotherComponent<ISeatAnotherComponentProps> = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    const [state, setState] = useState<ISeatAnotherComponentState>({
        eventDetails: undefined,
        event: [],
        seatDetails: undefined,
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        numSeatOfRowLeft: [],
        numSeatOfRowRight: [],
        selectedSeat: [],
        orderedSeats: [],
        ticketPrice: 0,
        quantities: [],
        totalAmount: 0,
    });

    const {
        eventDetails,
        seatDetails,
        rows,
        numSeatOfRowLeft,
        numSeatOfRowRight,
        selectedSeat = [],
        orderedSeats,
        ticketPrice,
        quantities,
        totalAmount,
    } = state;

    useEffect(() => {
        if (seatDetails?.quantity && seatDetails?.price) {
            const [leftQuantity, rightQuantity] = seatDetails.quantity;

            const leftColumns = 13;
            const rightColumns = 13;

            const leftRows = Math.floor(leftQuantity / leftColumns);
            const leftExtraSeats = leftQuantity % leftColumns;

            const rightRows = Math.floor(rightQuantity / rightColumns);
            const rightExtraSeats = rightQuantity % rightColumns;

            const leftSeats = Array.from({ length: leftRows }, () => leftColumns).concat(leftExtraSeats > 0 ? [leftExtraSeats] : []);
            const rightSeats = Array.from({ length: rightRows }, () => rightColumns).concat(rightExtraSeats > 0 ? [rightExtraSeats] : []);

            const filteredRowsLeft = rows?.slice(0, leftSeats.length);
            const filteredRowsRight = rows?.slice(0, rightSeats.length);

            setState((prevState) => ({
                ...prevState,
                numSeatOfRowLeft: leftSeats,
                numSeatOfRowRight: rightSeats,
                rowsLeft: filteredRowsLeft,
                rowsRight: filteredRowsRight,
            }));
        }
    }, [seatDetails]);

    const handleDetialsEvent = async () => {
        dispatch(
            await fetchDetailsEvent(id?.toString() ?? '', (res: IEventDetailsApiRes | IErrorAPIRes | null) => {
                if (res && res.code === http.SUCCESS_CODE) {
                    const event = (res as IEventDetailsApiRes).result;
                    setState((prevState) => ({
                        ...prevState,
                        eventDetails: event,
                    }));
                }
            }),
        );
    };

    const handleDetialsSeatAnother = async () => {
        dispatch(
            await fetchDetailsSeatAnotherByEventId(id?.toString() ?? '', (res: ISeatanotherDetailsApiRes | IErrorAPIRes | null) => {
                if (res && 'success' in res && res.success && 'result' in res && Array.isArray(res.result) && res.result.length > 0) {
                    const seat = res.result[0];
                    console.log('Fetched Seat:', seat);
                    setState((prevState) => ({
                        ...prevState,
                        seatDetails: seat,
                    }));
                }
            }),
        );
    };

    const handleQuantityChange = (index: number, change: number) => {
        const updatedQuantities = [...quantities];
        updatedQuantities[index] = Math.max(0, (updatedQuantities[index] || 0) + change);

        const newTotalAmount = updatedQuantities.reduce((total, qty, idx) => {
            const price = eventDetails?.price?.[idx] || 0;
            return total + qty * price;
        }, 0);

        setState((prevState) => ({
            ...prevState,
            quantities: updatedQuantities,
            totalAmount: newTotalAmount,
        }));
    };

    useEffect(() => {
        const savedSeats = localStorage.getItem('selectedSeats');
        const savedPrice = localStorage.getItem('ticketPrice');
        if (savedSeats && savedPrice) {
            setState((prev) => ({
                ...prev,
                selectedSeat: JSON.parse(savedSeats),
                ticketPrice: +savedPrice,
            }));
        }
    }, []);

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            selectedSeat: [],
            ticketPrice: 0,
        }));
        localStorage.removeItem('selectedSeats');
        localStorage.removeItem('ticketPrice');
    }, []);

    useEffect(() => {
        if (selectedSeat.length > 0) {
            localStorage.setItem('selectedSeats', JSON.stringify(selectedSeat));
            localStorage.setItem('ticketPrice', ticketPrice.toString());
        } else {
            localStorage.removeItem('selectedSeats');
            localStorage.removeItem('ticketPrice');
        }
        handleDetialsEvent();
        handleDetialsSeatAnother();
    }, [selectedSeat, ticketPrice]);

    return (
        <div className="components__seatanother">
            <div className="components__seatanother-main-container">
                <div className="components__seatanother-left-section">
                    <h1>Select Ticket</h1>
                    <div className="components__seatanother-ticket-type">
                        {eventDetails?.ticket_type?.map((_, index) => (
                            <div key={index} className="components__seatanother-ticket">
                                <div className="components__seatanother-ticket-info">
                                    <h2>{eventDetails?.ticket_type?.[index]?.toLocaleString()}</h2>
                                    <p>{eventDetails?.price?.[index]?.toLocaleString()} đ</p>
                                </div>
                                <div className="components__seatanother-quantity-control">
                                    <button onClick={() => handleQuantityChange(index, -1)} disabled={(quantities[index] || 0) <= 0}>
                                        -
                                    </button>
                                    <input type="text" value={quantities[index] || 0} readOnly />
                                    <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="components__seatanother-right-section">
                    <h2>{eventDetails?.name}</h2>
                    <p>
                        <strong>Time:</strong>{' '}
                        {eventDetails?.day_start &&
                            new Intl.DateTimeFormat('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                                timeZone: 'UTC',
                            }).format(new Date(eventDetails.day_start))}
                    </p>

                    <p>
                        <strong>Location:</strong> {eventDetails?.location}
                    </p>
                    <div className="components__seatanother-pricing-summary">
                        <h2>Pricing</h2>
                        {eventDetails?.ticket_type?.map((_, index) => (
                            <p key={index}>
                                {eventDetails?.ticket_type?.[index]?.toLocaleString()}: {eventDetails?.price?.[index]?.toLocaleString()} đ
                            </p>
                        ))}
                    </div>
                    <div className="components__seatanother-total">
                        <h3>Total: {totalAmount.toLocaleString()} đ</h3>
                    </div>
                    <div className="components__seattype2-info-btn">
                        {totalAmount == 0 ? (
                            <button className="components__seattype2-info-btn-continue-disabled">Please select ticket</button>
                        ) : (
                            <>
                                <button
                                    onClick={() =>
                                        router.push(
                                            {
                                                pathname: routes.CLIENT.ORDER_PAGES.href,
                                                query: { id: id, seatDetails: JSON.stringify(quantities), ticketPrice: totalAmount },
                                            },
                                            undefined,
                                            { scroll: false },
                                        )
                                    }
                                    className="components__seattype2-info-btn-continue"
                                >
                                    Continue - {totalAmount.toLocaleString()} VND
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatAnother;
