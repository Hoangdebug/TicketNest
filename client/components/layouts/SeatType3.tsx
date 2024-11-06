import { useState, useEffect } from 'react';
import { http, routes } from '@utils/constants';
import { useRouter } from 'next/router';
import { fetchDetailsEvent, fetchDetailsSeatType3ByEventId } from '@redux/actions/api';
import { useDispatch } from 'react-redux';

const SeatType3: ISeatType3Component<ISeatType3ComponentProps> = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    const [state, setState] = useState<ISeatType3ComponentState>({
        eventDetails: undefined,
        event: [],
        seatDetails: undefined,
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        numSeatOfRowLeft: [],
        numSeatOfRowRight: [],
        selectedSeat: [],
        orderedSeats: [],
        ticketPrice: 0,
    });

    const { eventDetails, seatDetails, rows, numSeatOfRowLeft, numSeatOfRowRight, selectedSeat = [], orderedSeats, ticketPrice } = state;

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

    const handleDetialsSeatType3 = async () => {
        dispatch(
            await fetchDetailsSeatType3ByEventId(id?.toString() ?? '', (res: ISeattype3DetailsApiRes | IErrorAPIRes | null) => {
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

    const toggleSeat = (row: string, seatNum: number, area: 'left' | 'right') => {
        const seatId = `${area === 'left' ? 'L' : 'R'}${row}${seatNum}`;
        if (orderedSeats?.includes(seatId)) return;

        setState((prev) => {
            let newSelectedSeats = [...(prev.selectedSeat ?? [])];
            let newTicketPrice = prev.ticketPrice ?? 0;

            const seatPrice = area === 'left' ? seatDetails?.price?.[0] : seatDetails?.price?.[1];

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
        handleDetialsSeatType3();
    }, [selectedSeat, ticketPrice]);

    return (
        <div className="components__seattype3-body">
            <div className="components__seattype3-body-container">
                <h1 className="components__seattype2-title">Select ticket</h1>
                <div className="components__seattype3-seat-information">
                    <div className="components__seattype3-indicator">
                        <span className="components__seattype3-circle components__seattype3-circle-available"></span>
                        <span>Available</span>
                    </div>
                    <div className="components__seattype3-indicator">
                        <span className="components__seattype3-circle components__seattype3-circle-selected"></span>
                        <span>Selected</span>
                    </div>
                    <div className="components__seattype3-indicator">
                        <span className="components__seattype3-circle components__seattype3-circle-unavailable"></span>
                        <span>Not Available</span>
                    </div>
                </div>

                <div className="components__seattype3-stage-wrapper">
                    <div className="components__seattype3-stage">STAGE</div>
                </div>

                <div className="components__seattype3-layout-wrapper">
                    <div className="components__seattype3-seat-layout">
                        <div className="components__seattype3-sections">
                            <div className="components__seattype3-left-section">
                                {state.rowsLeft?.map((row, rowIndex) => (
                                    <div key={row} className="components__seattype3-row">
                                        <span className="components__seattype3-row-label">{row}</span>
                                        <div className="components__seattype3-seats">
                                            {numSeatOfRowLeft?.[rowIndex] &&
                                                Array.from({ length: numSeatOfRowLeft[rowIndex] }).map((_, index) => {
                                                    const seatNum = index * 2 + 1;
                                                    const seatId = `L${row}${seatNum}`;
                                                    const isSelected = selectedSeat.includes(seatId);
                                                    return (
                                                        <span
                                                            key={`${row}-${seatNum}`}
                                                            className={`components__seattype3-seat ${
                                                                isSelected
                                                                    ? 'components__seattype3-seat-selected'
                                                                    : 'components__seattype3-seat-available'
                                                            }`}
                                                            onClick={() => toggleSeat(row, seatNum, 'left')}
                                                        >
                                                            {seatNum}
                                                        </span>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="components__seattype3-divider"></div>

                            <div className="components__seattype3-right-section">
                                {state.rowsLeft?.map((row, rowIndex) => (
                                    <div key={row} className="components__seattype3-row">
                                        <span className="components__seattype3-row-label">{row}</span>
                                        <div className="components__seattype3-seats">
                                            {numSeatOfRowLeft?.[rowIndex] &&
                                                Array.from({ length: numSeatOfRowLeft[rowIndex] }).map((_, index) => {
                                                    const seatNum = index * 2 + 1;
                                                    const seatId = `R${row}${seatNum}`;
                                                    const isSelected = selectedSeat.includes(seatId);
                                                    return (
                                                        <span
                                                            key={`${row}-${seatNum}`}
                                                            className={`components__seattype3-seat ${
                                                                isSelected
                                                                    ? 'components__seattype3-seat-selected'
                                                                    : 'components__seattype3-seat-available'
                                                            }`}
                                                            onClick={() => toggleSeat(row, seatNum, 'right')}
                                                        >
                                                            {seatNum}
                                                        </span>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="components__seattype3-event-information">
                        <h4>🗓 {eventDetails?.name}</h4>
                        <div className="components__seattype3-event-date">
                            <span>📍</span> {eventDetails?.location}
                        </div>
                        <div className="components__seattype3-event-location">
                            <span>📅</span>Date of event:{' '}
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
                        <div className="components__seattype3-pricing">
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
                            </ul>
                        </div>
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
                                                    query: { id: id, seatDetails: JSON.stringify(selectedSeat), ticketPrice: ticketPrice },
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

export default SeatType3;
