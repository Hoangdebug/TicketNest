interface ISeatType3ComponentProps extends IBaseCompProps {}

interface ISeatType3Component<P = {}> extends IBaseComp<P> {}

interface ISeatType3ComponentState {
    eventDetails?: IEventDataApi;
    event?: IEventDataApi[];
    seatDetails?: ISeatType3DataAPI;
    rows?: string[];
    numSeatOfRowLeft?: number[];
    numSeatOfRowRight?: number[];
    vipRows?: string[];
    selectedSeat?: string | null;
    orderedSeats?: string[];
    ticketPrice?: number;
}
