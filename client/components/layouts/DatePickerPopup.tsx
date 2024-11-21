import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

const DatePickerPopup: React.FC<{
    onClose: () => void;
    onApply: (dates: { start: string; end: string }) => void;
}> = ({ onClose, onApply }) => {
    const today = moment().startOf('day');
    const [selectedStartDate, setSelectedStartDate] = useState(today);
    const [selectedEndDate, setSelectedEndDate] = useState(today.clone().add(7, 'days')); 
    const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'tomorrow' | 'weekend' | 'month'>('all');

    const handleFilter = (filter: 'all' | 'today' | 'tomorrow' | 'weekend' | 'month') => {
        setActiveFilter(filter);

        switch (filter) {
            case 'all':
                setSelectedStartDate(today);
                setSelectedEndDate(today.clone().add(7, 'days'));
                break;
            case 'today':
                setSelectedStartDate(today);
                setSelectedEndDate(today);
                break;
            case 'tomorrow':
                const tomorrow = today.clone().add(1, 'day');
                setSelectedStartDate(tomorrow);
                setSelectedEndDate(tomorrow);
                break;
            case 'weekend':
                const startOfWeekend = today.clone().isoWeekday(6);
                const endOfWeekend = startOfWeekend.clone().add(1, 'day');
                setSelectedStartDate(today);
                setSelectedEndDate(endOfWeekend);
                break;
            case 'month':
                const endOfMonth = today.clone().endOf('month');
                setSelectedStartDate(today);
                setSelectedEndDate(endOfMonth);
                break;
            default:
                break;
        }
    };

    const handleApply = () => {
        onApply({
            start: selectedStartDate.format('YYYY-MM-DD'),
            end: selectedEndDate.format('YYYY-MM-DD'),
        });
    };

    const handleReset = () => {
        setActiveFilter('all');
        setSelectedStartDate(today);
        setSelectedEndDate(today.clone().add(7, 'days'));
    };

    const handleManualDateChange = (type: 'start' | 'end', value: string) => {
        const newDate = moment(value, 'YYYY-MM-DD');

        if (type === 'start') {
            setSelectedStartDate(newDate);
            if (newDate.isAfter(selectedEndDate)) {
                setSelectedEndDate(newDate);
            }
        } else {
            setSelectedEndDate(newDate);
        }
    };

    return (
        <div className="components__event-popup">
            <div className="components__event-popup-header d-flex justify-content-between align-items-center">
                <h4>All dates</h4>
                <CloseIcon onClick={onClose} style={{ cursor: 'pointer' }} />
            </div>
            <div className="components__event-popup-filters d-flex justify-content-between gap-2 my-3">
                <button
                    className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilter('all')}
                >
                    All dates
                </button>
                <button
                    className={`filter-button ${activeFilter === 'today' ? 'active' : ''}`}
                    onClick={() => handleFilter('today')}
                >
                    Today
                </button>
                <button
                    className={`filter-button ${activeFilter === 'tomorrow' ? 'active' : ''}`}
                    onClick={() => handleFilter('tomorrow')}
                >
                    Tomorrow
                </button>
                <button
                    className={`filter-button ${activeFilter === 'weekend' ? 'active' : ''}`}
                    onClick={() => handleFilter('weekend')}
                >
                    This weekend
                </button>
                <button
                    className={`filter-button ${activeFilter === 'month' ? 'active' : ''}`}
                    onClick={() => handleFilter('month')}
                >
                    This month
                </button>
            </div>
            <div className="components__event-popup-body">
                <div>
                    <label htmlFor="start-date" className="pb-2">
                        Start Date<span className="text-danger">*</span>
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        className="form-control"
                        value={selectedStartDate.format('YYYY-MM-DD')}
                        onChange={(e) => handleManualDateChange('start', e.target.value)}
                        min={today.format('YYYY-MM-DD')}
                    />
                </div>
                <div className="mt-3">
                    <label htmlFor="end-date" className="pb-2">
                        End Date<span className="text-danger">*</span>
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        className="form-control"
                        value={selectedEndDate.format('YYYY-MM-DD')}
                        onChange={(e) => handleManualDateChange('end', e.target.value)}
                        min={selectedStartDate.format('YYYY-MM-DD')}
                    />
                </div>
            </div>
            <div className="components__event-popup-footer d-flex justify-content-between mt-3">
                <button className="btn-reset" onClick={handleReset}>
                    Reset
                </button>
                <button className="btn-apply" onClick={handleApply}>
                    Apply
                </button>
            </div>
        </div>
    );
};

export default DatePickerPopup;
