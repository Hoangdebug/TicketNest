import { useState, useEffect } from 'react';
import { http, routes } from '@utils/constants';
import { useRouter } from 'next/router';
import { fetchDetailsEvent, fetchDetailsSeatType2ByEventId } from '@redux/actions/api';
import { useDispatch } from 'react-redux';

const SeatType2: ISeatType2Component<ISeatType2ComponentProps> = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    const [state, setState] = useState<ISeatType2ComponentState>({
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

            const leftColumns = 6;
            const rightColumns = 6;

            const leftRows = Math.floor(leftQuantity / leftColumns);
            const leftExtraSeats = leftQuantity % leftColumns;

            const rightRows = Math.floor(rightQuantity / rightColumns);
            const rightExtraSeats = rightQuantity % rightColumns;

            const leftSeats = Array.from({ length: leftRows }, () => leftColumns).concat(leftExtraSeats > 0 ? [leftExtraSeats] : []);
            const rightSeats = Array.from({ length: rightRows }, () => rightColumns).concat(rightExtraSeats > 0 ? [rightExtraSeats] : []);

            const filteredRowsLeft = rows.slice(0, leftSeats.length);
            const filteredRowsRight = rows.slice(0, rightSeats.length);

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

    const handleDetialsSeatType2 = async () => {
        dispatch(
            await fetchDetailsSeatType2ByEventId(id?.toString() ?? '', (res: ISeattype2DetailsApiRes | IErrorAPIRes | null) => {
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
        const seatId = `${area === 'left' ? 'L' : 'R'}${row}${seatNum}`; // Thêm tiền tố L cho bên trái và R cho bên phải
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
        handleDetialsSeatType2();
    }, [selectedSeat, ticketPrice]);

    return (
        <div className="components__seattype2">
            <h1 className="components__seattype2-title">Select ticket</h1>
            <div className="components__seattype2-details">
                <span className="components__seattype2-legend">
                    <span className="components__seattype2-legend-circle components__seattype2-available"></span> Available
                </span>
                <span className="components__seattype2-legend">
                    <span className="components__seattype2-legend-circle components__seattype2-selected"></span> Selected
                </span>
                <span className="components__seattype2-legend">
                    <span className="components__seattype2-legend-circle components__seattype2-unavailable"></span> Not Available
                </span>
            </div>

            <div className="components__seattype2-content-container">
                <div className="components__seattype2-column">
                    <div className="components__seattype2-screen">Screen</div>
                    <div className="components__seattype2-seat-map">
                        {/* Left section */}
                        <div className="components__seattype2-section components__seattype2-section-left">
                            {state.rowsLeft?.map((row, rowIndex) => (
                                <div key={row} className="components__seattype2-row">
                                    {numSeatOfRowLeft?.[rowIndex] &&
                                        Array.from({ length: numSeatOfRowLeft[rowIndex] }).map((_, seatNum) => {
                                            const seatId = `L${row}${seatNum + 1}`;
                                            const isSelected = selectedSeat?.includes(seatId);
                                            const isOrdered = orderedSeats?.includes(seatId);
                                            const seatClass = `components__seattype2-seat ${
                                                isSelected
                                                    ? 'components__seattype2-selected'
                                                    : isOrdered
                                                    ? 'components__seattype2-unavailable'
                                                    : 'available'
                                            }`;
                                            return (
                                                <div
                                                    key={seatNum}
                                                    className={seatClass}
                                                    onClick={() => toggleSeat(row, seatNum + 1, 'left')}
                                                />
                                            );
                                        })}
                                </div>
                            ))}
                        </div>

                        {/* Right section */}
                        <div className="components__seattype2-section components__seattype2-section-right">
                            {state.rowsRight?.map((row, rowIndex) => (
                                <div key={row} className="components__seattype2-row">
                                    {numSeatOfRowRight?.[rowIndex] &&
                                        Array.from({ length: numSeatOfRowRight[rowIndex] }).map((_, seatNum) => {
                                            const seatId = `R${row}${seatNum + 1}`;
                                            const isSelected = selectedSeat?.includes(seatId);
                                            const isOrdered = orderedSeats?.includes(seatId);
                                            const seatClass = `components__seattype2-seat ${
                                                isSelected
                                                    ? 'components__seattype2-selected'
                                                    : isOrdered
                                                    ? 'components__seattype2-unavailable'
                                                    : 'available'
                                            }`;
                                            return (
                                                <div
                                                    key={seatNum}
                                                    className={seatClass}
                                                    onClick={() => toggleSeat(row, seatNum + 1, 'right')}
                                                />
                                            );
                                        })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Event Info Section */}
                <div className="components__seattype2-event-info">
                    <h2>🗓 {eventDetails?.name}</h2>
                    <p>
                        <span className="components__seattype2-icon-calendar">&#128197;</span>
                        <strong>Date of event:</strong>&nbsp;
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
                        <span className="components__seattype2-icon-location">&#128205;</span>
                        <strong>Location:</strong>&nbsp;
                        {eventDetails?.location}
                    </p>
                    <h3>Pricing</h3>
                    <ul>
                        <li>
                            <span className="components__seattype2-price-detail components__seattype2-vip"></span>
                            {eventDetails?.ticket_type?.[0]?.toLocaleString()}:{' '}
                            <span className="components__seattype2-price-green">{seatDetails?.price?.[0]?.toLocaleString()} ₫</span>
                        </li>
                        <li>
                            <span className="components__seattype2-price-detail components__seattype2-regular"></span>
                            {eventDetails?.ticket_type?.[1]?.toLocaleString()}:{' '}
                            <span className="components__seattype2-price-green">{seatDetails?.price?.[1]?.toLocaleString()} ₫</span>
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
    );
};

export default SeatType2;
