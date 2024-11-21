import React, { useEffect, useState } from 'react';
import Button from '@components/commons/Button';
import { useRouter } from 'next/router';
import TodayIcon from '@mui/icons-material/Today';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { http, routes } from '@utils/constants';
import moment from 'moment';
import Img from '@components/commons/Img';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import DatePickerPopup from './DatePickerPopup';
import FilterPopup from './FilterPopup';
import { searchEvents } from '@redux/actions/api';
import { useDispatch, useSelector } from 'react-redux';

const EventList: IEventListComponent<IEventListComponentProps> = (props) => {
    const { dataEvent } = props;
    const router = useRouter();

    const [state, setState] = useState<IEventListComponentState>({
        type: 'All',
        isActive: false,
    });
    const { type } = state;

    const [filterCriteria, setFilterCriteria] = useState<{ //
        priceRange: [number, number];
        ticketType: string;
        location: string;
        dateRange: { start: string; end: string } | null;
    }>({
        priceRange: [0, 1000000],
        ticketType: 'all',
        location: 'all',
        dateRange: null,
    });

    const [filteredEvents, setFilteredEvents] = useState<IEventDataApi[] | []>([]);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

    useEffect(() => {
        const { type } = router.query;
        if (type === 'All' || type === 'Music' || type === 'Dramatic' || type === 'Workshop') {
            setState((prevState) => ({ ...prevState, type }));
        } else {
            setState((prevState) => ({ ...prevState, type: 'All' }));
        }
    }, [router.query]);

    const formattedDayStart = moment(dataEvent?.[0]?.day_start).format('MMM DD, YYYY');
    const formattedDayEnd = moment(dataEvent?.[0]?.day_end).format('MMM DD, YYYY');
    const formattedDayEvent = moment(dataEvent?.[0]?.day_event).format('MMM DD, YYYY');
    
    const listTypeSearch = [
        { title: 'All', query: 'All' },
        { title: 'Music', query: 'Music' },
        { title: 'Dramatic', query: 'Dramatic' },
        { title: 'Workshop', query: 'Workshop' },
    ];

    useEffect(() => {
        const newFilteredEvents = dataEvent?.filter((event) => {
            const matchesType = type === 'All' || event?.event_type === type;

            const matchesPrice =
                filterCriteria.priceRange[0] <= Math.min(...(event?.price || [])) &&
                filterCriteria.priceRange[1] >= Math.max(...(event?.price || []));

            const matchesTicketType = filterCriteria.ticketType === 'all' || event?.ticket_type?.includes(filterCriteria.ticketType);

            const matchesLocation = filterCriteria.location === 'all' || event?.location === filterCriteria.location;

            const matchesDateRange =
                !filterCriteria.dateRange ||
                (moment(event?.day_event).isSameOrAfter(filterCriteria.dateRange.start) &&
                    moment(event?.day_event).isSameOrBefore(filterCriteria.dateRange.end));

            return matchesType && matchesPrice && matchesTicketType && matchesLocation && matchesDateRange;
        });

        setFilteredEvents(newFilteredEvents || []);
    }, [type, filterCriteria, dataEvent]);

    const toggleDatePicker = () => setIsDatePickerOpen(!isDatePickerOpen);
    const toggleFilterPopup = () => setIsFilterPopupOpen(!isFilterPopupOpen);

    const [searchKeyword, setSearchKeyword] = useState('');
    const dispatch = useDispatch();
    const handleSearch = async () => {
        console.log(`Searching for events with keyword: ${searchKeyword}`);
        dispatch(
            await searchEvents(searchKeyword, (res) => {
                if (res && res.code === 200) {
                    console.log('Search results received:', res.result);
                    setFilteredEvents(res.result);
                } else {
                    console.log('No results found or error occurred');
                    setFilteredEvents([]);
                }
            }),
        );
    };
    useEffect(() => {
        if (!searchKeyword) {
            setFilteredEvents(dataEvent); // Hiển thị dữ liệu ban đầu nếu không có từ khóa
        }
    }, [searchKeyword, dataEvent]);

    return (
        <div className="components__event p-4">
            {/*Search textbox*/}
            <div className="components__event--search d-flex mb-4">
                <input
                    type="text"
                    placeholder="Search events by name or location..."
                    className="form-control me-2"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Button buttonText="Search" className="btn-primary" onClick={handleSearch} />
            </div>
            <div className="components__event--filter d-flex gap-3 py-4">
                <Button
                    buttonText="All dates"
                    icon={<CalendarTodayIcon />}
                    className="components__event--btnFilter"
                    onClick={toggleDatePicker}
                />
                <Button
                    buttonText="Filter"
                    icon={<FilterListIcon />}
                    className="components__event--btnFilter"
                    onClick={toggleFilterPopup}
                />
            </div>

            {isDatePickerOpen && (
                <DatePickerPopup
                    onClose={() => setIsDatePickerOpen(false)}
                    onApply={(selectedDates) => {
                        console.log('Selected Dates:', selectedDates);
                        setFilterCriteria((prev) => ({
                            ...prev,
                            dateRange: selectedDates,
                        }));
                        setIsDatePickerOpen(false);
                    }}
                />
            )}

            {isFilterPopupOpen && (
                <FilterPopup
                    onClose={() => setIsFilterPopupOpen(false)}
                    onApply={(filters) => {
                        console.log('Applied Filters:', filters);
                        setFilterCriteria(filters);
                        setIsFilterPopupOpen(false);
                    }}
                />
            )}

            <div className="components__event--items row">
                {filteredEvents && filteredEvents.length > 0 ? (
                    filteredEvents.map((item, index) => (
                        <div
                            className="col-md-3 mb-4 bases__p--cursor"
                            key={index}
                            onClick={() =>
                                router.push({ pathname: routes.CLIENT.EVENT_DETAILS.href, query: { id: item._id } }, undefined, {
                                    scroll: false,
                                })
                            }>
                            <div className="components__event--items-card">
                                <div className="w-100" style={{ position: 'relative' }}>
                                    <Img src={item?.images as string} className="components__event--items-card-img img-fluid w-100" />
                                </div>
                                <div className="p-3 ">
                                    <div className="d-flex align-items-center flex-row gap-2">
                                        <h3 className="fw-bold pb-2 bases__font--20 ">{item?.name}</h3>
                                        <p className="m-0">Max: {Math.max(...item?.price)} đ</p>
                                        <p className="m-0">Min: {Math.min(...item?.price)} đ</p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="d-flex flex-row w-100 gap-2">
                                            <TodayIcon />
                                            <p className="m-0">{formattedDayStart}</p>
                                        </span>
                                        <span className="d-flex flex-row w-100 gap-2" style={{ justifyContent: 'flex-end' }}>
                                            <WatchLaterIcon />
                                            <p className="m-0">{formattedDayEnd}</p>
                                        </span>
                                        <span className="d-flex flex-row w-100 gap-2" style={{ justifyContent: 'flex-end' }}>
                                            <WatchLaterIcon />
                                            <p className="m-0">{formattedDayEvent}</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center bases__font--16 fw-bolder">No events today</div>
                )}
            </div>
        </div>
    );
};

export default EventList;
