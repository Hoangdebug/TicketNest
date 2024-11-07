interface ISeatAnotherComponentProps extends IBaseCompProps {}

interface ISeatAnotherComponent<P = {}> extends IBaseComp<P> {}

interface ISeatAnotherComponentState {
    eventDetails?: IEventDataApi;
    event?: IEventDataApi[];
    seatDetails?: ISeatAnotherDataAPI;
    rows?: string[];
    numSeatOfRowLeft?: number[];
    numSeatOfRowRight?: number[];
    vipRows?: string[];
    selectedSeat?: string | null;
    orderedSeats?: string[];
    ticketPrice?: number;
}
