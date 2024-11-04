import { useState, useEffect } from 'react';
import { http, routes } from '@utils/constants';
import { useRouter } from 'next/router';
import { fetchDetailsEvent, fetchDetailsSeatType1ByEventId } from '@redux/actions/api';
import { useDispatch } from 'react-redux';

const SeatType1: ISeatType1Component<ISeatType1ComponentProps> = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    const [state, setState] = useState({
        eventDetails: undefined,
        seatDetails: undefined,
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        numSeatOfRowLeft: [],
        numSeatOfRowRight: [],
        numSeatOfRowMiddle: [],
        selectedSeat: [],
        orderedSeats: [],
        ticketPrice: 0,
    });

    const { eventDetails, seatDetails, rows, numSeatOfRowLeft, numSeatOfRowRight, numSeatOfRowMiddle, selectedSeat, orderedSeats, ticketPrice } = state;


    useEffect(() => {
        if (seatDetails?.quantity) {
            const [leftQuantity, middleQuantity, rightQuantity] = seatDetails.quantity;

            const leftColumns = 3;
            const rightColumns = 3;
            const middleColumns = 10;

            const leftRows = Math.floor(leftQuantity / leftColumns);
            const leftExtraSeats = leftQuantity % leftColumns;

            const rightRows = Math.floor(rightQuantity / rightColumns);
            const rightExtraSeats = rightQuantity % rightColumns;

            const middleRows = Math.floor(middleQuantity / middleColumns);
            const middleExtraSeats = middleQuantity % middleColumns;

            const leftSeats = Array.from({ length: leftRows }, () => leftColumns).concat(leftExtraSeats > 0 ? [leftExtraSeats] : []);
            const rightSeats = Array.from({ length: rightRows }, () => rightColumns).concat(rightExtraSeats > 0 ? [rightExtraSeats] : []);
            const middleSeats = Array.from({ length: middleRows }, () => middleColumns).concat(middleExtraSeats > 0 ? [middleExtraSeats] : []);

            setState((prevState) => ({
                ...prevState,
                numSeatOfRowLeft: leftSeats,
                numSeatOfRowRight: rightSeats,
                numSeatOfRowMiddle: middleSeats,
            }));
        }
    }, [seatDetails]);

    const toggleSeat = (row, seatNum, area) => {
        const seatId = `${area === 'left' ? 'L' : area === 'right' ? 'R' : 'M'}${row}${seatNum}`;
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
            })
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
            <h1 className="components__seattype2-title">Chọn vé</h1>
            <div className="components__seattype1-seat-map-container-seat-information">
                <div className="components__seattype1-status components__seattype1-status-available">Đang trống</div>
                <div className="components__seattype1-status components__seattype1-status-selected">Đang chọn</div>
                <div className="components__seattype1-status components__seattype1-status-unavailable">Không chọn được</div>
            </div>

            <div className="components__seattype1-seat-map">
                <div className="components__seattype1-left-seats">
                    {rows.map((row, index) => (
                        <div key={row} className="components__seattype1-seat-row">
                            {Array.from({ length: numSeatOfRowLeft[index] || 0 }).map((_, seatNum) => (
                                <div
                                    key={seatNum}
                                    className={`components__seattype1-seat components__seattype1-seat-left ${selectedSeat.includes(`L${row}${seatNum + 1}`) ? 'selected' : ''}`}
                                    onClick={() => toggleSeat(row, seatNum + 1, 'left')}
                                >
                                    {seatNum + 1}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="components__seattype1-stage">STAGE/SÂN KHẤU</div>

                <div className="components__seattype1-right-seats">
                    {rows.map((row, index) => (
                        <div key={row} className="components__seattype1-seat-row">
                            {Array.from({ length: numSeatOfRowRight[index] || 0 }).map((_, seatNum) => (
                                <div
                                    key={seatNum}
                                    className={`components__seattype1-seat components__seattype1-seat-right ${selectedSeat.includes(`R${row}${seatNum + 1}`) ? 'selected' : ''}`}
                                    onClick={() => toggleSeat(row, seatNum + 1, 'right')}
                                >
                                    {seatNum + 1}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="components__seattype1-middle-seats">
                    <div className="components__seattype1-left-middle-seats">
                        {rows.slice(0, Math.ceil(numSeatOfRowMiddle.length / 2)).map((row, index) => (
                            <div key={index} className="components__seattype1-seat-row">
                                {Array.from({ length: numSeatOfRowMiddle[index] || 0 }).map((_, seatNum) => (
                                    <div
                                        key={seatNum}
                                        className={`components__seattype1-seat components__seattype1-seat-middle ${selectedSeat.includes(`M${row}${seatNum + 1}`) ? 'selected' : ''
                                            }`}
                                        onClick={() => toggleSeat(row, seatNum + 1, 'middle')}
                                    >
                                        {seatNum + 1}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="components__seattype1-right-middle-seats">
                        {rows.slice(Math.ceil(numSeatOfRowMiddle.length / 2), numSeatOfRowMiddle.length).map((row, index) => (
                            <div key={index} className="components__seattype1-seat-row">
                                {Array.from({
                                    length: numSeatOfRowMiddle[Math.ceil(numSeatOfRowMiddle.length / 2) + index] || 0,
                                }).map((_, seatNum) => (
                                    <div
                                        key={seatNum}
                                        className={`components__seattype1-seat components__seattype1-seat-middle ${selectedSeat.includes(`M${row}${seatNum + 1}`) ? 'selected' : ''
                                            }`}
                                        onClick={() => toggleSeat(row, seatNum + 1, 'middle')}
                                    >
                                        {seatNum + 1}
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
                            {eventDetails?.day_start && new Intl.DateTimeFormat('en-GB', {
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
                                Left Area - &nbsp;<span className="components__seattype1-price-green">{seatDetails?.price?.[0]?.toLocaleString()} ₫
                                </span>
                            </li>
                            <li>
                                <div className="components__seattype1-price-detail components__seattype1-middle-seat"></div>
                                Middle Area - &nbsp;<span className="components__seattype1-price-green">{seatDetails?.price?.[1]?.toLocaleString()} ₫
                                </span>
                            </li>
                            <li>
                                <div className="components__seattype1-price-detail components__seattype1-right-seat"></div>
                                Right Area - &nbsp;<span className="components__seattype1-price-green">{seatDetails?.price?.[2]?.toLocaleString()} ₫
                                </span>
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
                                                { scroll: false }
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