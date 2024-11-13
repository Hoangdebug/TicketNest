import { useState, useEffect } from 'react';
import { http, routes } from '@utils/constants';
import { useRouter } from 'next/router';
import { fetchDetailsEvent, fetchDetailsSeatType1ByEventId } from '@redux/actions/api';
import { useDispatch } from 'react-redux';

const SeatType1: ISeatType1Component<ISeatType1ComponentProps> = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;
    
    const [state, setState] = useState<ISeatType1ComponentState>({
        eventDetails: undefined,
        seatDetails: undefined,
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', "K", "L", "M", "N"],
        numSeatOfRowLeft: [],
        numSeatOfRowRight: [],
        numSeatOfRowMiddleLeft: [],
        numSeatOfRowMiddleRight: [],
        selectedSeat: [],
        ticketPrice: 0,
    });

    const {
        eventDetails,
        seatDetails,
        rows,
        numSeatOfRowLeft,
        numSeatOfRowRight,
        numSeatOfRowMiddleLeft,
        numSeatOfRowMiddleRight,
        selectedSeat,
        ticketPrice,
    } = state;

    useEffect(() => {
        if (seatDetails?.quantity) {
            const [leftQuantity, middleQuantity, rightQuantity] = seatDetails.quantity;

            const leftColumns = 3;
            const rightColumns = 3;
            const middleColumns = 20;

            const leftRows = Math.floor(leftQuantity / leftColumns);
            const leftExtraSeats = leftQuantity % leftColumns;

            const rightRows = Math.floor(rightQuantity / rightColumns);
            const rightExtraSeats = rightQuantity % rightColumns;

            const middleRows = Math.floor(middleQuantity / middleColumns);
            const middleExtraSeats = middleQuantity % middleColumns;

            const leftSeats = Array.from({ length: leftRows }, () => leftColumns).concat(leftExtraSeats > 0 ? [leftExtraSeats] : []);
            const rightSeats = Array.from({ length: rightRows }, () => rightColumns).concat(rightExtraSeats > 0 ? [rightExtraSeats] : []);

            const middleSeats = Array.from({ length: middleRows }, () => middleColumns).concat(
                middleExtraSeats > 0 ? [middleExtraSeats] : []
            );

            const middleSeatsLeft = middleSeats.map(row => Math.min(row, 10));
            const middleSeatsRight = middleSeats.map(row => Math.min(row - 10, 10));

            setState((prevState) => ({
                ...prevState,
                numSeatOfRowLeft: leftSeats,
                numSeatOfRowRight: rightSeats,
                numSeatOfRowMiddleLeft: middleSeatsLeft,
                numSeatOfRowMiddleRight: middleSeatsRight,
            }));
        }
    }, [seatDetails]);



    const toggleSeat = (row, seatNum, area) => {
        const seatId = `${area === 'left' ? 'L-' : area === 'right' ? 'R-' : area === 'middle left' ? 'ML-' : 'MR-'}${row}${seatNum}`;
        if (seatDetails?.ordered_seat?.includes(seatId)) return;

        setState((prev) => {
            let newSelectedSeats = [...(prev.selectedSeat ?? [])];
            let newTicketPrice = prev.ticketPrice ?? 0;

            let seatPrice = 0;
            if (area === 'left') {
                seatPrice = seatDetails?.price?.[0];
            } else if (area === 'middle left' || area === 'middle right') {
                seatPrice = seatDetails?.price?.[1];
            } else if (area === 'right') {
                seatPrice = seatDetails?.price?.[2]; 
            }

            const isSeatSelected = newSelectedSeats.includes(seatId);

            if (isSeatSelected) {
                newSelectedSeats = newSelectedSeats.filter((seat) => seat !== seatId);
                newTicketPrice -= seatPrice;
            } else {
                newSelectedSeats.push(seatId);
                newTicketPrice += seatPrice;
            }

            return {
                ...prev,
                selectedSeat: newSelectedSeats,
                ticketPrice: newTicketPrice,
            };
        });
    };

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

    const handleDetialsSeatType1 = async () => {
        dispatch(
            await fetchDetailsSeatType1ByEventId(id?.toString() ?? '', (res: ISeattype2DetailsApiRes | IErrorAPIRes | null) => {
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
        handleDetialsSeatType1();
    }, [selectedSeat, ticketPrice]);

    return (
        <div className="components__seattype1-seat-map-container">
            <h1 className="components__seattype2-title">Select ticket</h1>
            <div className="components__seattype1-seat-map-container-seat-information">
                <div className="components__seattype1-status components__seattype1-status-available">Available</div>
                <div className="components__seattype1-status components__seattype1-status-selected">Selected</div>
                <div className="components__seattype1-status components__seattype1-status-unavailable">Not Available</div>
            </div>

            <div className="components__seattype1-seat-map">
                <div className="components__seattype1-left-seats">
                    {rows.map((row, index) => (
                        <div key={row} className="components__seattype1-seat-row">
                            {Array.from({ length: numSeatOfRowLeft[index] || 0 }).map((_, seatNum) => (
                                <div
                                    key={seatNum}
                                    className={`components__seattype1-seat components__seattype1-seat-left ${seatDetails?.ordered_seat?.includes(`L-${row}${seatNum + 1}`) ? 'components__seattype1-status-unavailable' : ''
                                        } ${selectedSeat.includes(`L-${row}${seatNum + 1}`) ? 'selected' : ''
                                        }`}
                                    onClick={() => toggleSeat(row, seatNum + 1, 'left')}
                                >
                                    {seatNum + 1}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="components__seattype1-stage">STAGE</div>

                <div className="components__seattype1-right-seats">
                    {rows.map((row, index) => (
                        <div key={row} className="components__seattype1-seat-row">
                            {Array.from({ length: numSeatOfRowRight[index] || 0 }).map((_, seatNum) => (
                                <div
                                    key={seatNum}
                                    className={`components__seattype1-seat components__seattype1-seat-right ${seatDetails?.ordered_seat?.includes(`R-${row}${seatNum + 1}`) ? 'components__seattype1-status-unavailable' : ''
                                        } ${selectedSeat.includes(`R-${row}${seatNum + 1}`) ? 'selected' : ''
                                        }`}
                                    onClick={() => toggleSeat(row, seatNum + 1, 'right')}
                                >
                                    {seatNum + 1}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="components__seattype1-middle-seats">
                    {/* Left Middle Seats */}
                    <div className="components__seattype1-left-middle-seats">
                        {rows.map((row, index) => (
                            <div key={index} className="components__seattype1-seat-row">
                                {Array.from({ length: numSeatOfRowMiddleLeft[index] || 0 }).map((_, seatNum) => (
                                    <div
                                        key={seatNum}
                                        className={`components__seattype1-seat components__seattype1-seat-middle ${selectedSeat.includes(`ML-${row}${seatNum + 1}`) ? 'selected' : ''} ${seatDetails?.ordered_seat?.includes(`ML-${row}${seatNum + 1}`) ? 'components__seattype1-status-unavailable' : ''}`}
                                        onClick={() => toggleSeat(row, seatNum + 1, 'middle left')}
                                    >
                                        {seatNum + 1}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Right Middle Seats */}
                    <div className="components__seattype1-right-middle-seats">
                        {rows.map((row, index) => (
                            <div key={index} className="components__seattype1-seat-row">
                                {Array.from({ length: numSeatOfRowMiddleRight[index] || 0 }).map((_, seatNum) => (
                                    <div
                                        key={seatNum}
                                        className={`components__seattype1-seat components__seattype1-seat-middle ${selectedSeat.includes(`MR-${row}${seatNum + 11}`) ? 'selected' : ''} ${seatDetails?.ordered_seat?.includes(`MR-${row}${seatNum + 11}`) ? 'components__seattype1-status-unavailable' : ''}`}
                                        onClick={() => toggleSeat(row, seatNum + 11, 'middle right')}
                                    >
                                        {seatNum + 11}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>



                <div className="components__seattype1-right-sidebar">
                    <h2 className="components__seattype1-right-sidebar-title">{eventDetails?.name}</h2>
                    <div className="components__seattype1-event-details">
                        <div className="components__seattype1-detail-item">
                            <span className="components__seattype1-icon">📅 Date of event:</span>&nbsp;
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
                        </div>
                        <div className="components__seattype1-detail-item">
                            <span className="components__seattype1-icon">📍 Location:</span>&nbsp;
                            <span className="components__seattype1-text">{eventDetails?.location}</span>
                        </div>
                        <h3>Pricing</h3>
                        <ul className="components__seattype1-event-info">
                            <li>
                                <div className="components__seattype1-price-detail components__seattype1-left-seat"></div>
                                {eventDetails?.ticket_type?.[0]?.toLocaleString()} - &nbsp;
                                <span className="components__seattype1-price-green">{seatDetails?.price?.[0]?.toLocaleString()} ₫</span>
                            </li>
                            <li>
                                <div className="components__seattype1-price-detail components__seattype1-middle-seat"></div>
                                {eventDetails?.ticket_type?.[1]?.toLocaleString()} - &nbsp;
                                <span className="components__seattype1-price-green">{seatDetails?.price?.[1]?.toLocaleString()} ₫</span>
                            </li>
                            <li>
                                <div className="components__seattype1-price-detail components__seattype1-right-seat"></div>
                                {eventDetails?.ticket_type?.[2]?.toLocaleString()} - &nbsp;
                                <span className="components__seattype1-price-green">{seatDetails?.price?.[2]?.toLocaleString()} ₫</span>
                            </li>
                        </ul>
                        <div className="components__seattype2-info-btn">
                            {selectedSeat.length === 0 ? (
                                <button className="components__seattype2-info-btn-continue-disabled">Please select ticket</button>
                            ) : (
                                <>
                                    <p>Selected Seat: {selectedSeat.join(', ')}</p>
                                    <button
                                        onClick={() =>
                                            router.push(
                                                {
                                                    pathname: routes.CLIENT.ORDER_PAGES.href,
                                                    query: { id: id, seatId: seatDetails?._id, seatDetails: JSON.stringify(selectedSeat), ticketPrice: ticketPrice },
                                                },
                                                undefined,
                                                { scroll: false },
                                            )
                                        }
                                        className="components__seattype2-info-btn-continue"
                                    >
                                        Continue - {ticketPrice.toLocaleString()} VND
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatType1;
