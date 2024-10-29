interface ISeatType2ComponentProps extends IBaseCompProps {}

interface ISeatType2Component<P = {}> extends IBaseComp<P> {}

interface ISeatType2ComponentState {
    eventDetails?: IEventDataApi;
    event?: IEventDataApi[];
    seatDetails?: ISeatType2DataAPI;
    rows?: string[];
    numSeatOfRowLeft?: number[];
    numSeatOfRowRight?: number[];
    vipRows?: string[];
    selectedSeat?: string | null;
    orderedSeats?: string[];
    ticketPrice?: number;
}
