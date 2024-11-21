import { routes } from '@utils/constants';
import { axios } from '@utils/plugins';
import { AxiosRequestConfig } from 'axios';
import { authHelper } from '.';

const checkAccessTokenAndParams = (data: IAccessTokenAndParams) => {
    const { token, params } = data;

    if (!params && token) {
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    if (params && token) {
        return {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    if (params && !token) {
        return {
            params,
        };
    }

    if (!params && !token) {
        return;
    }
};

export const login = async (data: ILoginDataAPI) => {
    try {
        return await axios.post<ILoginAPIRes>(`${routes.API.LOGIN.href}`, data);
    } catch (err) {
        throw err;
    }
};

export const register = async (data: IRegisterDataApi) => {
    try {
        return await axios.post<IRegisterDataApiRes>(`${routes.API.REGISTER.href}`, data);
    } catch (err) {
        throw err;
    }
};

export const verify_register = async (email: string, data: IOtpVerifyDataApi) => {
    try {
        return await axios.post<IOtpVerifyDataApiRes>(`${routes.API.OTP_REGISTER.href}/${email}`, data);
    } catch (err) {
        throw err;
    }
};

export const getCurrentUser = async () => {
    try {
        return await axios.get<ICurrentUserAPIRes>(`${routes.API.CURRENT_USER.href}`);
    } catch (err) {
        throw err;
    }
};

export const editUserProfile = async (data: IEditUserProfileDataAPI) => {
    try {
        return await axios.put<IEditUserProfileAPIRes>(`${routes.API.CURRENT_USER.href}`, data);
    } catch (err) {
        throw err;
    }
};

export const forgotPassword = async (data: IEditUserProfileDataAPI) => {
    try {
        return await axios.post<IEditUserProfileAPIRes>(`${routes.API.FORGOTPASSWORD.href}`, data);
    } catch (err) {
        throw err;
    }
};

export const verify_forgot = async (email: string, data: IOtpVerifyDataApi) => {
    try {
        return await axios.post<IOtpVerifyDataApiRes>(`${routes.API.OTP_FORGOTPASS.href}/${email}`, data);
    } catch (err) {
        throw err;
    }
};

export const uploadImg = async (formData: FormData, config: AxiosRequestConfig) => {
    try {
        const accessTokenConfig = checkAccessTokenAndParams({ token: authHelper.accessToken() });
        const finalConfig: AxiosRequestConfig = {
            ...accessTokenConfig,
            ...config,
            headers: {
                ...accessTokenConfig?.headers,
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
        };
        return await axios.put<IEditUserProfileAPIRes>(`${routes.API.UPLOAD_IMG.href}`, formData, finalConfig);
    } catch (err) {
        throw err;
    }
};

export const uploadImgEvent = async (id: string, formData: FormData, config: AxiosRequestConfig) => {
    try {
        const accessTokenConfig = checkAccessTokenAndParams({ token: authHelper.accessToken() });
        const finalConfig: AxiosRequestConfig = {
            ...accessTokenConfig,
            ...config,
            headers: {
                ...accessTokenConfig?.headers,
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
        };
        return await axios.put<IEventUpdateByAdmin>(`${routes.API.EVENT_UPLOAD_IMG.href}/${id}`, formData, finalConfig);
    } catch (err) {
        throw err;
    }
};

export const addEvent = async (data: IEventDataApi) => {
    try {
        return await axios.post<IEventDataApiRes>(`${routes.API.EVENT.href}`, data);
    } catch (err) {
        throw err;
    }
};

export const updateOrderSeat = async (seatId: string, data: { new_ordered_seat: string[] }) => {
    try {
        return await axios.put<ISeattype2DataApiRes>(`${routes.API.SEAT.href}/update-order/${seatId}`, data);
    } catch (err) {
        throw err;
    }
};

export const addSeat = async (data: ISeatType2DataAPI) => {
    try {
        return await axios.post<ISeattype2DataApiRes>(`${routes.API.SEAT.href}`, data);
    } catch (err) {
        throw err;
    }
};
export const updateEvent = async (id: string, data: IEventDataApi) => {
    try {
        return await axios.put<IEventDataApiRes>(`${routes.API.EVENT.href}/${id}`, data);
    } catch (err) {
        throw err;
    }
};

export const listEvent = async (query: string) => {
    try {
        return await axios.get<IEventDataApiListRes>(`${routes.API.EVENT.href}/${query}`);
    } catch (err) {
        throw err;
    }
};

export const listEventOrganizer = async () => {
    try {
        return await axios.get<IEventByOrganizerDataApiRes>(`${routes.API.ORGANIZER_LIST_EVENT.href}`);
    } catch (err) {
        throw err;
    }
};

export const searchEvents = async (keyword: string) => {
    try {
        return await axios.get(`${routes.API.EVENT_SEARCH.href}=${keyword}`);
    } catch (err) {
        throw err;
    }
};

export const detailsEvent = async (id: string) => {
    try {
        return await axios.get<IEventDetailsApiRes>(`${routes.API.EVENT.href}/${id}`);
    } catch (err) {
        throw err;
    }
};

export const detailsSeat = async (id: string) => {
    try {
        return await axios.get<ISeattype2DetailsApiRes>(`${routes.API.SEAT.href}/${id}`);
    } catch (err) {
        throw err;
    }
};

export const detailsSeatAnotherByEventId = async (eventId: string) => {
    try {
        return await axios.get<ISeatanotherDetailsApiRes>(`${routes.API.SEAT.href}/event/${eventId}`);
    } catch (err) {
        throw err;
    }
};

export const detailsSeatType3ByEventId = async (eventId: string) => {
    try {
        return await axios.get<ISeattype3DetailsApiRes>(`${routes.API.SEAT.href}/event/${eventId}`);
    } catch (err) {
        throw err;
    }
};

export const detailsSeatType2ByEventId = async (eventId: string) => {
    try {
        return await axios.get<ISeattype2DetailsApiRes>(`${routes.API.SEAT.href}/event/${eventId}`);
    } catch (err) {
        throw err;
    }
};

export const detailsSeatType1ByEventId = async (eventId: string) => {
    try {
        return await axios.get<ISeattype1DetailsApiRes>(`${routes.API.SEAT.href}/event/${eventId}`);
    } catch (err) {
        throw err;
    }
};

export const requestOrganizer = async (data: IRequestOrganizeDataAPI) => {
    try {
        return await axios.post<IRequestOrganizeAPIRes>(`${routes.API.REQUEST_ORGANIZER.href}`, data);
    } catch (err) {
        throw err;
    }
};

export const adminListCustomer = async () => {
    try {
        return await axios.get<IAdminCustomerListAPIRes>(`${routes.API.ADMIN_LIST_CUSTOMER.href}`);
    } catch (err) {
        throw err;
    }
};

export const updateOrganizerByAdmin = async (_id: string, data: IEditUserProfileDataAPI) => {
    try {
        return await axios.put<IAdminUpdateOrganizerAPIRes>(`${routes.API.ADMIN_UPDATE_ORGANIZER.href}/${_id}`, data);
    } catch (err) {
        throw err;
    }
};

export const adminBanCustomer = async (id: string) => {
    try {
        return await axios.put<IAdminCustomerBanAPIRes>(`${routes.API.ADMIN_BAN_CUSTOMER.href}/${id}`);
    } catch (err) {
        throw err;
    }
};

export const createAccountByAdmin = async (data: IRegisterDataApi) => {
    try {
        return await axios.post<IRegisterDataApiRes>(`${routes.API.ADMIN_CREATE_ACCOUNT_BY_ADMIN.href}`, data);
    } catch (err) {
        throw err;
    }
};

export const updateEventsStatusByAdmin = async (id: string, data: IEventDataApi) => {
    try {
        return await axios.put<IEventUpdateByAdmin>(`${routes.API.ADMIN_UPDATE_STATUS_EVENT.href}/${id}`, data);
    } catch (err) {
        throw err;
    }
};

export const createCommemt = async (eid: string, data: ICommentDataAPI) => {
    try {
        return await axios.post<ICommentDataAPIRes>(`${routes.API.COMMENT.href}/${eid}`, data);
    } catch (err) {
        throw err;
    }
};

export const listCommemt = async (eid: string) => {
    try {
        return await axios.get<ICommentDataAPIRes>(`${routes.API.COMMENT.href}/${eid}`);
    } catch (err) {
        throw err;
    }
};

export const replyCommemt = async (eid: string, idComment: string, data: ICommentDataAPI) => {
    try {
        return await axios.post<ICommentDataAPIRes>(`${routes.API.COMMENT.href}/reply/${eid}/${idComment}`, data);
    } catch (err) {
        throw err;
    }
};

export const deleteComment = async (idComment: string) => {
    try {
        return await axios.delete<ICommentDataAPIRes>(`${routes.API.COMMENT.href}/${idComment}`);
    } catch (err) {
        throw err;
    }
};

export const editComment = async (idComment: string, data: ICommentDataAPI) => {
    try {
        return await axios.put<ICommentDataAPIRes>(`${routes.API.COMMENT.href}/${idComment}`, data);
    } catch (err) {
        throw err;
    }
};

export const listReplyCommemt = async (eid: string, idComment: string) => {
    try {
        return await axios.get<ICommentListDataAPIRes>(`${routes.API.COMMENT.href}/reply/${eid}/${idComment}`);
    } catch (err) {
        throw err;
    }
};

export const orderList = async () => {
    try {
        return await axios.get<IOrderDataApiRes>(`${routes.API.ORDER.href}`);
    } catch (err) {
        throw err;
    }
};

export const createOrder = async (eid: string, data: IOrderDataApi) => {
    try {
        return await axios.post<ICreateorderDataApiRes>(`${routes.API.ORDER.href}/${eid}`, data);
    } catch (err) {
        throw err;
    }
};

export const createRating = async (eventId: string, data: IRatingDataApi) => {
    try {
        return await axios.post<IRatingDataAPIRes>(`${routes.API.RATING.href}/${eventId}`, data);
    } catch (err) {
        throw err;
    }
};

export const listRating = async (eventId: string) => {
    try {
        return await axios.get<IListRatingDataAPIRes>(`${routes.API.RATING.href}/${eventId}`);
    } catch (err) {
        throw err;
    }
};
