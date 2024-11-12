export const enum ROLE {
    ADMIN = 'ROLE_ADMIN',
    USER = 'ROLE_USER',
    ORGANIZER = 'ROLE_ORGANIZER',
}

export const enum TYPES {
    USER = 'User',
    ADMIN = 'Admin',
    ORGANIZER = 'Organizer',
}

export enum EVENTTYPE {
    MUSIC = 'Music',
    DRAMATIC = 'Dramatic',
    WORKSHOP = 'Workshop',
}

export enum EVENTLOCATION {
    LOCATIONA = 'Location A',
    LOCATIONB = 'Location B',
    LOCATIONC = 'Location C',
    ANOTHER = 'ANOTHER',
}

export const EVENTLOCATION_IMAGE_URL: { [key in EVENTLOCATION]: string } = {
    [EVENTLOCATION.LOCATIONA]: 'https://storage.googleapis.com/dev-ixink-public-resource/1730723055519/SeatType1_00001_.png',
    [EVENTLOCATION.LOCATIONB]: 'https://storage.googleapis.com/dev-ixink-public-resource/1730723202297/SeatType2_00001_.png',
    [EVENTLOCATION.LOCATIONC]: 'https://storage.googleapis.com/dev-ixink-public-resource/1730723367158/SeatType3_00001_.png',
    [EVENTLOCATION.ANOTHER]: 'https://example.com/path-to-another-location-image.jpg',
};

export const EVENTLOCATION_AREAS: { [key in EVENTLOCATION]: number } = {
    [EVENTLOCATION.LOCATIONA]: 3,
    [EVENTLOCATION.LOCATIONB]: 2,
    [EVENTLOCATION.LOCATIONC]: 2,
    [EVENTLOCATION.ANOTHER]: 0,
};

export const TICKET_QUANTITY_LIMITS: { [key in EVENTLOCATION]: number[] } = {
    [EVENTLOCATION.LOCATIONA]: [30, 150, 30],
    [EVENTLOCATION.LOCATIONB]: [60, 60],
    [EVENTLOCATION.LOCATIONC]: [130, 130],
    [EVENTLOCATION.ANOTHER]: [],
};

export enum EVENTTICKET {
    BASE = '50',
    MEDIUM = '60',
    LARGE = '70',
}

export enum STATUS_ORGANIZER_REQUEST {
    PROCESSING = 'Processing',
    ACCEPT = 'Accepted',
    REJECTED = 'Rejected',
}

export enum EventStatus {
    CANCELLED = 'Cancel',
    PENDING = 'Pending',
    ACCEPTED = 'Accept',
}

export enum SeatStatus {
    CANCELLED = 'Cancel',
    PENDING = 'Pending',
    ACCEPTED = 'Accept',
}
