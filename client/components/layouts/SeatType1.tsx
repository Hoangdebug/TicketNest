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
            <div className="components__seattype1-seat-map-container-seat-information">
                <div className="components__seattype1-status components__seattype1-status-available">Đang trống</div>
                <div className="components__seattype1-status components__seattype1-status-selected">Đang chọn</div>
                <div className="components__seattype1-status components__seattype1-status-unavailable">Không chọn được</div>
            </div>

            <div className="components__seattype1-seat-map">
                <div className="components__seattype1-left-seats">
                    {rows.slice(0, numSeatOfRowLeft.length).map((row, index) => (
                        <div key={row} className="components__seattype1-seat-row">
                            {Array.from({ length: numSeatOfRowLeft[index] }).map((_, seatNum) => (
                                <div
                                    key={seatNum}
                                    className="components__seattype1-seat components__seattype1-seat-left"
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
                    {rows.slice(0, numSeatOfRowRight.length).map((row, index) => (
                        <div key={row} className="components__seattype1-seat-row">
                            {Array.from({ length: numSeatOfRowRight[index] }).map((_, seatNum) => (
                                <div
                                    key={seatNum}
                                    className="components__seattype1-seat components__seattype1-seat-right"
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
                                        className="components__seattype1-seat components__seattype1-seat-middle"
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
                                {Array.from({ length: numSeatOfRowMiddle[Math.ceil(numSeatOfRowMiddle.length / 2) + index] || 0 }).map(
                                    (_, seatNum) => (
                                        <div
                                            key={seatNum}
                                            className="components__seattype1-seat components__seattype1-seat-middle"
                                            onClick={() => toggleSeat(row, seatNum + 1, 'middle')}
                                        >
                                            {seatNum + 1}
                                        </div>
                                    )
                                )}
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
                        <div className="components__seattype1--color-details">
                            <div className="components__seattype1-color-box components__seattype1-seat-left"></div> THƯỜNG
                            <div className="components__seattype1-color-box components__seattype1-seat-right"></div> VIP
                            <div className="components__seattype1-color-box components__seattype1-seat-middle"></div> PREMIUM
                        </div>
                        <button className="components__seattype1-select-seat-btn">Vui lòng chọn vé</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatType1;