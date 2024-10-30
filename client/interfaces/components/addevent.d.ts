interface IAddEventComponent<P = {}> extends IBaseComp<P> {}

interface IAddEventComponentProps extends IBaseCompProps {
    event?: IEventDataApi;
    seat?: ISeatType2DataAPI;
}

interface IAddEventComponentState {
    isValidateStartDateTime?: boolean;
    isValidateEndDateTime?: boolean;
    eventAdd?: IEventDataApi;
    seatAdd?: ISeatType2DataAPI;
    previewUrl?: string;
    ids?: string[];
}
