const HOME: IRouteConstant = {
    href: '/home',
};

const LOGIN: IRouteConstant = {
    href: '/auth/login',
};

const REGISTER: IRouteConstant = {
    href: '/auth/register',
};

const FORGOT_PASSWORD: IRouteConstant = {
    href: '/forgotpassword/forgot_password',
};

const POST_FORGOT_PASSWORD: IRouteConstant = {
    href: '/forgotpassword/post_forgot_password',
};

const CHANGE_PASSWORD: IRouteConstant = {
    href: '/forgotpassword/change_password',
};

const CHANGE_PASSWORD_SUCCESS: IRouteConstant = {
    href: '/forgotpassword/change_password_success',
};

const OTP_VERIFY: IRouteConstant = {
    href: '/auth/otpverify',
};

const REGISTERSUCCESS: IRouteConstant = {
    href: '/auth/registersuccess',
};

const EVENT_DETAILS_PAGES: IRouteConstant = {
    href: 'user/detail/[id]',
};

const EVENT_DETAILS_PAGES_ORDER_TYPE1: IRouteConstant = {
    href: '/user/seat/seattype1',
};

const EVENT_DETAILS_PAGES_ORDER_TYPE2: IRouteConstant = {
    href: '/user/seat/seattype2',
};

const EVENT_DETAILS_PAGES_ORDER_TYPE3: IRouteConstant = {
    href: '/user/seat/seattype3',
};

const EVENT_DETAILS_PAGES_ORDER_ANOTHER: IRouteConstant = {
    href: '/seatanother',
};

const ERROR404: IRouteConstant = {
    href: '/404',
};

const ERROR500: IRouteConstant = {
    href: '/500',
};

const ERROR403: IRouteConstant = {
    href: '/403',
};

const ADD_EVENT: IRouteConstant = {
    href: '/organizer/event/addevent',
};
const UPDATE_EVENT: IRouteConstant = {
    href: '/organizer/event/edit/[id]',
};

const ORGANIZER_LIST_EVENT_PAGE: IRouteConstant = {
    href: '/organizer',
};

const ADMIN_DASHBOARD: IRouteConstant = {
    href: '/admin',
};

const ADMIN_LIST_CUSTOMER: IRouteConstant = {
    href: '/admin/customer',
};

const ADMIN_LIST_CUSTOMER_BAN: IRouteConstant = {
    href: '/admin/customer/customerBan',
};

const ADMIN_LIST_CUSTOMER_REQUEST: IRouteConstant = {
    href: '/admin/customer/customerRequest',
};

const ADMIN_MANAGER_EVENT: IRouteConstant = {
    href: '/admin/event',
};

const ADMIN_CREATE_ACCOUNT: IRouteConstant = {
    href: '/admin/customer/createAccount',
};

const ABOUT_US: IRouteConstant = {
    href: '/home/about',
};

const EDITPROFILE: IRouteConstant = {
    href: '/user/profile/editprofile',
};

const REQUESTORGANIZE: IRouteConstant = {
    href: '/user/requestOrganizer/requestorganize',
};
const CONTACT: IRouteConstant = {
    href: '/home/contact',
};

const ORDER_PAGE: IRouteConstant = {
    href: '/order',
};

const PAYMENT_PAGE: IRouteConstant = {
    href: '/user/payment/payment',
};
const PAYMENT_RETURN_PAGE: IRouteConstant = {
    href: '/user/payment/payment-return',
};
const PAYMENT_SUCCESS_PAGE: IRouteConstant = {
    href: '/user/payment/payment-success',
};

const TICKET_BOOKING_HISTORY_PAGE: IRouteConstant = {
    href: '/ticketHistory',
};

const LIST_FAVOURITE_EVENT_PAGE: IRouteConstant = {
    href: '/favouritepage',
};

const ORDER_ADMIN_MANAGER_PAGE: IRouteConstant = {
    href: '/admin/customer/orderList',
};

const PAYMENT_FAIL_PAGE: IRouteConstant = {
    href: 'home/',
};
export const CLIENT = {
    LOGIN_PAGE: LOGIN,
    REGISTER_PAGE: REGISTER,
    OTP_VERIFY_PAGE: OTP_VERIFY,
    REGISTERSUCCESS_PAGE: REGISTERSUCCESS,
    ERROR404_PAGE: ERROR404,
    ERROR500_PAGE: ERROR500,
    ERROR403_PAGE: ERROR403,
    FORGOT_PASSWORD_PAGE: FORGOT_PASSWORD,
    POST_FORGOT_PASSWORD_PAGE: POST_FORGOT_PASSWORD,
    CHANGE_PASSWORD_PAGE: CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS_PAGE: CHANGE_PASSWORD_SUCCESS,
    ADD_EVENT_PAGE: ADD_EVENT,
    HOME_PAGE: HOME,
    ADMIN_PAGE: ADMIN_DASHBOARD,
    EDIT_PROFILE_PAGE: EDITPROFILE,
    REQUEST_ORGNIZE_PAGE: REQUESTORGANIZE,
    EVENT_DETAILS: EVENT_DETAILS_PAGES,
    ORGANIZER_LIST_EVENT: ORGANIZER_LIST_EVENT_PAGE,
    UPDATE_EVENT_PAGE: UPDATE_EVENT,
    ABOUT_PAGE: ABOUT_US,
    CONTACT_PAGE: CONTACT,
    ADMIN_LIST_CUSTOMER_PAGE: ADMIN_LIST_CUSTOMER,
    ADMIN_LIST_CUSTOMER_BAN_PAGE: ADMIN_LIST_CUSTOMER_BAN,
    ADMIN_LIST_CUSTOMER_REQUEST_PAGE: ADMIN_LIST_CUSTOMER_REQUEST,
    ADMIN_MANAGER_EVENT_PAGE: ADMIN_MANAGER_EVENT,
    ADMIN_CREATE_ACCOUNT_PAGE: ADMIN_CREATE_ACCOUNT,
    EVENT_DETAILS_PAGES_ORDER_TYPE1: EVENT_DETAILS_PAGES_ORDER_TYPE1,
    EVENT_DETAILS_PAGES_ORDER_TYPE2: EVENT_DETAILS_PAGES_ORDER_TYPE2,
    EVENT_DETAILS_PAGES_ORDER_TYPE3: EVENT_DETAILS_PAGES_ORDER_TYPE3,
    EVENT_DETAILS_PAGES_ORDER_ANOTHER: EVENT_DETAILS_PAGES_ORDER_ANOTHER,
    ORDER_PAGES: ORDER_PAGE,
    PAYMENT_PAGE: PAYMENT_PAGE,
    PAYMENT_RETURN_PAGE: PAYMENT_RETURN_PAGE,
    PAYMENT_SUCCESS_PAGE: PAYMENT_SUCCESS_PAGE,
    TICKET_BOOKING_HISTORY: TICKET_BOOKING_HISTORY_PAGE,
    LIST_FAVOURITE_EVENT_PAGE: LIST_FAVOURITE_EVENT_PAGE,
    ORDER_ADMIN_MANAGER: ORDER_ADMIN_MANAGER_PAGE,
    PAYMENT_FAIL_PAGE: PAYMENT_FAIL_PAGE,
};

const LOGIN_API: IRouteConstant = {
    href: '/user/login',
};

const REGISTER_API: IRouteConstant = {
    href: '/user/register',
};

const CURRENT_USER_API: IRouteConstant = {
    href: '/user/current',
};

const REQUEST_ORGANIZER_API: IRouteConstant = {
    href: '/user/be-organizer',
};

const FORGOTPASSWORD_API: IRouteConstant = {
    href: '/user/forgotpassword',
};

const UPLOAD_IMG_API: IRouteConstant = {
    href: '/user/upload-image',
};

const CHANGEPASSWORD_API: IRouteConstant = {
    href: '/user/changepassword',
};

const EVENT_API: IRouteConstant = {
    href: 'event/',
};

const EVENT_SEARCH: IRouteConstant = {
    href: 'event/search?keyword',
};

const SEAT_API: IRouteConstant = {
    href: 'seat/',
};

const EVENT_UPLOAD_IMG_API: IRouteConstant = {
    href: 'event/upload-image',
};

const EVENT_LIST_ORGANIZER_API: IRouteConstant = {
    href: 'event/get-event',
};

const ADMIN_LIST_CUSTOMER_API: IRouteConstant = {
    href: '/user',
};

const ADMIN_BAN_CUSTOMER_API: IRouteConstant = {
    href: '/user/ban',
};

const ADMIN_LIST_CUSTOMER_REQUEST_API: IRouteConstant = {
    href: '/',
};

const ADMIN_UPDATE_ORGANIZER_API: IRouteConstant = {
    href: '/user/role',
};

const ADMIN_CREATE_ACCOUNT_BY_ADMIN_API: IRouteConstant = {
    href: '/user/create-account-by-admin',
};

const ADMIN_UPDATE_STATUS_EVENT_API: IRouteConstant = {
    href: '/event/update-status',
};

const OTP_VERIFY_REGISTER_API: IRouteConstant = {
    href: '/user/verify-register',
};

const OTP_VERIFY_FORGOTPASS_API: IRouteConstant = {
    href: '/user/verify-forgot-pass',
};

const COMMENT_API: IRouteConstant = {
    href: 'comment',
};

const ORDER_API: IRouteConstant = {
    href: 'order',
};

const RATING_API: IRouteConstant = {
    href: '/rating',
};

const ADDFAVOURITE_API: IRouteConstant = {
    href: '/favourites',
};
export const API = {
    LOGIN: LOGIN_API,
    REGISTER: REGISTER_API,
    OTP_REGISTER: OTP_VERIFY_REGISTER_API,
    CURRENT_USER: CURRENT_USER_API,
    FORGOTPASSWORD: FORGOTPASSWORD_API,
    OTP_FORGOTPASS: OTP_VERIFY_FORGOTPASS_API,
    CHANGEPASSWORD: CHANGEPASSWORD_API,
    REQUEST_ORGANIZER: REQUEST_ORGANIZER_API,
    UPLOAD_IMG: UPLOAD_IMG_API,
    COMMENT: COMMENT_API,
    // organizer
    EVENT: EVENT_API,
    EVENT_SEARCH: EVENT_SEARCH,
    SEAT: SEAT_API,
    ORGANIZER_LIST_EVENT: EVENT_LIST_ORGANIZER_API,
    EVENT_UPLOAD_IMG: EVENT_UPLOAD_IMG_API,

    // admin
    ADMIN_LIST_CUSTOMER: ADMIN_LIST_CUSTOMER_API,
    ADMIN_BAN_CUSTOMER: ADMIN_BAN_CUSTOMER_API,
    ADMIN_LIST_CUSTOMER_REQUEST: ADMIN_LIST_CUSTOMER_REQUEST_API,
    ADMIN_UPDATE_ORGANIZER: ADMIN_UPDATE_ORGANIZER_API,
    ADMIN_CREATE_ACCOUNT_BY_ADMIN: ADMIN_CREATE_ACCOUNT_BY_ADMIN_API,
    ADMIN_UPDATE_STATUS_EVENT: ADMIN_UPDATE_STATUS_EVENT_API,

    // order
    ORDER: ORDER_API,

    // rating
    RATING: RATING_API,

    // favourite
    FAVOURITE: ADDFAVOURITE_API,
};
