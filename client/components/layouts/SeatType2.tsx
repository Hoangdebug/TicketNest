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
        numSeatOfRowLeft: [], // Ghế bên trái
        numSeatOfRowRight: [], // Ghế bên phải
        selectedSeat: [],
        orderedSeats: ['A2', 'C2', 'C2'],
        ticketPrice: 0,
    });

    const { eventDetails, seatDetails, rows, numSeatOfRowLeft, numSeatOfRowRight, selectedSeat = [], orderedSeats, ticketPrice } = state;

    // Cập nhật số ghế bên trái và phải dựa vào seatDetails
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
            })
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
            <div className="components__seattype2-layout">
                <div className="components__seattype2-screen">STAGE/SÂN KHẤU</div>
                <div className="components__seattype2-container">
                    {/* Ghế bên trái */}
                    <div className="components__seattype2-left">
                        {state.rowsLeft?.map((row, rowIndex) => (
                            <div key={row} className="components__seattype2-row">
                                <span className="components__seattype2-row-label">{row}</span>
                                <div className="components__seattype2-row-seats">
                                    {numSeatOfRowLeft?.[rowIndex] &&
                                        Array.from({ length: numSeatOfRowLeft[rowIndex] }).map((_, seatNum) => {
                                            const seatId = `L${row}${seatNum + 1}`;
                                            const isSelected = selectedSeat?.includes(seatId);
                                            const isOrdered = orderedSeats?.includes(seatId);
                                            const seatClass = `components__seattype2-seat ${isSelected
                                                ? 'selected'
                                                : isOrdered
                                                    ? 'ordered'
                                                    : 'available'
                                                }`;
                                            return (
                                                <div key={seatNum} className={seatClass} onClick={() => toggleSeat(row, seatNum + 1, 'left')}>
                                                    {isSelected && <div className="components__seattype2-seat-text">{seatId}</div>}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ghế bên phải */}
                    <div className="components__seattype2-right">
                        {state.rowsRight?.map((row, rowIndex) => (
                            <div key={row} className="components__seattype2-row">
                                <span className="components__seattype2-row-label">{row}</span>
                                <div className="components__seattype2-row-seats">
                                    {numSeatOfRowRight?.[rowIndex] &&
                                        Array.from({ length: numSeatOfRowRight[rowIndex] }).map((_, seatNum) => {
                                            const seatId = `R${row}${seatNum + 1}`;
                                            const isSelected = selectedSeat?.includes(seatId);
                                            const isOrdered = orderedSeats?.includes(seatId);
                                            const seatClass = `components__seattype2-seat ${isSelected
                                                ? 'selected'
                                                : isOrdered
                                                    ? 'ordered'
                                                    : 'available'
                                                }`;
                                            return (
                                                <div key={seatNum} className={seatClass} onClick={() => toggleSeat(row, seatNum + 1, 'right')}>
                                                    {isSelected && <div className="components__seattype2-seat-text">{seatId}</div>}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cột thông tin bên phải */}
            <div className="components__seattype2-info">
                <h2>{eventDetails?.name}</h2>
                <p><strong>Date of event:</strong> {eventDetails?.day_start}</p>
                <p><strong>Location:</strong> {eventDetails?.location}</p>
                <p><strong>Ticket Price:</strong></p>
                <ul>
                    <li>Left Area: {seatDetails?.price?.[0]?.toLocaleString()} đ</li>
                    <li>Right Area: {seatDetails?.price?.[1]?.toLocaleString()} đ</li>
                </ul>

                {/* Button */}
                <div className="components__seattype2-info-btn">
                    {selectedSeat.length === 0 ? (
                        <button className="components__seattype2-info-btn-continue">Please Selected Seat</button>
                    ) : (
                        <>
                            <p>Selected Seat : {selectedSeat.join(', ')}</p>
                            <button onClick={() =>
                                router.push(
                                    {
                                        pathname: routes.CLIENT.ORDER_PAGES.href,
                                        query: { id: id, seatDetails: JSON.stringify(selectedSeat), ticketPrice: ticketPrice },
                                    },
                                    undefined,
                                    { scroll: false },
                                )
                            } className="components__seattype2-info-btn-continue" >Continue - {ticketPrice.toLocaleString()} VND</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatType2;