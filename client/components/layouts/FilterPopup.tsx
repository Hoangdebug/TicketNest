import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const FilterPopup: React.FC<{
    onClose: () => void;
    onApply: (filters: { priceRange: [number, number]; ticketType: string; location: string }) => void;
}> = ({ onClose, onApply }) => {
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [ticketType, setTicketType] = useState<string>('all');
    const [location, setLocation] = useState<string>('all');

    const handleApply = () => {
        onApply({
            priceRange,
            ticketType,
            location,
        });
    };

    const handleReset = () => {
        setPriceRange([0, 1000000]);
        setTicketType('all');
        setLocation('all');
    };

    return (
        <div className="components__event-filter">
            <div className="components__event-filter-header d-flex justify-content-between align-items-center">
                <h4>Filters</h4>
                <CloseIcon onClick={onClose} style={{ cursor: 'pointer' }} />
            </div>
            <div className="components__event-filter-body">
                <div className="filter-section">
                    <label htmlFor="price-range" className="pb-2">
                        Price Range (₫)
                    </label>
                    <div className="d-flex align-items-center gap-2">
                        <input
                            type="number"
                            className="form-control"
                            value={priceRange[0]}
                            min={0}
                            onChange={(e) =>
                                setPriceRange([Math.min(+e.target.value, priceRange[1]), priceRange[1]])
                            }
                        />
                        <span>–</span>
                        <input
                            type="number"
                            className="form-control"
                            value={priceRange[1]}
                            max={1000000}
                            onChange={(e) =>
                                setPriceRange([priceRange[0], Math.max(priceRange[0], +e.target.value)])
                            }
                        />
                    </div>
                </div>

                <div className="filter-section mt-3">
                    <label htmlFor="ticket-type" className="pb-2">
                        Ticket Type
                    </label>
                    <select
                        className="form-control"
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="Music">Music</option>
                        <option value="Dramatic">Dramatic</option>
                        <option value="Workshop">Work Shop</option>
                    </select>
                </div>

                <div className="filter-section mt-3">
                    <label htmlFor="location" className="pb-2">
                        Location
                    </label>
                    <select
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value="all">All Locations</option>
                        <option value="Location A">location A</option>
                        <option value="Location B">location B</option>
                        <option value="Location C">location C</option>
                        <option value="ANOTHER">ANOTHER</option>
                    </select>
                </div>
            </div>
            <div className="components__event-filter-footer d-flex justify-content-between mt-3">
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

export default FilterPopup;