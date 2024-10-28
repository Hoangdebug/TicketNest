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
    [EVENTLOCATION.LOCATIONA]: 'https://phongvu.vn/cong-nghe/wp-content/uploads/2024/07/Cong-cu-AI-nen-dung-1024x640.jpg',
    [EVENTLOCATION.LOCATIONB]: 'https://example.com/path-to-locationB-image.jpg',
    [EVENTLOCATION.LOCATIONC]: 'https://example.com/path-to-locationC-image.jpg',
    [EVENTLOCATION.ANOTHER]: 'https://example.com/path-to-another-location-image.jpg',
};

export const EVENTLOCATION_AREAS: { [key in EVENTLOCATION]: number } = {
    [EVENTLOCATION.LOCATIONA]: 3,
    [EVENTLOCATION.LOCATIONB]: 2,
    [EVENTLOCATION.LOCATIONC]: 2,
    [EVENTLOCATION.ANOTHER]: 0,
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
    CANCELLED = 'Cancelled',
    PENDING = 'Pending',
    ACCEPTED = 'Successed',
}
