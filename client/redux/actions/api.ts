import { Dispatch } from 'redux';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { authHelper, apiHelper } from '@utils/helpers';
import { SET_LOADER, SET_MEMBER_PROFILE } from '@redux/actions/type';

const setLoader = (data: boolean = false) => {
    return {
        type: SET_LOADER,
        data,
    };
};

const setAccount = (data: IEditUserProfileDataAPI | null) => {
    return {
        type: SET_MEMBER_PROFILE,
        data,
    };
};

export const fetchLogin = async (
    data: ILoginDataAPI,
    callBack?: (result: ILoginAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.login(data);
            authHelper.setAccessToken(res.data.accessToken ?? '');
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchRegister = async (
    data: IRegisterDataApi,
    callBack?: (result: IRegisterDataApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.register(data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const verifyOtp = async (
    email: string,
    data: IOtpVerifyDataApi,
    callBack?: (result: IOtpVerifyDataApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.verify_register(email, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchForgotPassword = async (
    data: IEditUserProfileDataAPI,
    callBack?: (result: IEditUserProfileAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.forgotPassword(data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchUploadImages = async (
    data: IEditUserProfileDataAPI,
    callBack?: (result: IEditUserProfileAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            let formData: FormData;
            if (data.images instanceof FormData) {
                formData = data.images;
            } else {
                formData = new FormData();
                formData.append('images', data.images || '');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authHelper.accessToken()}`,
                    'Content-Type': 'multipart/form-data',
                },
            };
            const res = await apiHelper.uploadImg(formData, config);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchUploadImagesEvent = async (
    id: string,
    data: IEventDataApi,
    callBack?: (result: IEventUpdateByAdmin | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const formData = new FormData();
            if (data.images instanceof File) {
                formData.append('images', data.images); // Ensure the field name matches what the backend expects
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authHelper.accessToken()}`,
                    'Content-Type': 'multipart/form-data',
                },
            };
            const res = await apiHelper.uploadImgEvent(id, formData, config);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const verifyOtpForgot = async (
    email: string,
    data: IOtpVerifyDataApi,
    callBack?: (result: IOtpVerifyDataApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.verify_forgot(email, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchGetCurrentAccount = async (callBack?: (result: ICurrentUserAPIRes | IErrorAPIRes | null) => void) => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await apiHelper.getCurrentUser();

            dispatch(setAccount(res?.data?.result ?? null));
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }
    };
};

export const fetchLogout = () => {
    authHelper.logOut();
    return {
        type: SET_MEMBER_PROFILE,
        data: { profile: null },
    };
};

export const fetchEditUserProfile = async (
    data: IEditUserProfileDataAPI,
    callBack?: (result: IEditUserProfileAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.editUserProfile(data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchRequestOrganizer = async (
    data: IRequestOrganizeDataAPI,
    callBack?: (result: IRequestOrganizeAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.requestOrganizer(data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchAddEvent = (data: IEventDataApi = { ticket_type: [] }, isLoad: boolean = true): any => {
    return async (dispatch: Dispatch): Promise<IEventDataApiRes | IErrorAPIRes | null> => {
        if (isLoad) {
            dispatch(setLoader(true));
        }
        const validatedData = {
            ...data,
            ticket_type: data.ticket_type ?? [],
        };

        try {
            const res: AxiosResponse<IEventDataApiRes> = await apiHelper.addEvent(validatedData);
            return res.data;
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                return res.data;
            }
            return { code: 500, mes: err.message };
        } finally {
            if (isLoad) {
                dispatch(setLoader(false));
            }
        }
    };
};

export const fetchAddSeat = (data: ISeatType2DataAPI = { ticket_type: [] }, isLoad: boolean = true): any => {
    return async (dispatch: Dispatch): Promise<ISeattype2DataApiRes | IErrorAPIRes | null> => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        const validatedData = {
            ...data,
            ticket_type: data.ticket_type ?? [],
        };

        try {
            const res: AxiosResponse<ISeattype2DataApiRes> = await apiHelper.addSeat(validatedData);
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const res = err.response;
                if (res && res.data) {
                    return res.data;
                }
            }
            return { code: 500, mes: err instanceof Error ? err.message : 'An unknown error occurred' };
        } finally {
            if (isLoad) {
                dispatch(setLoader(false));
            }
        }
    };
};

export const fetchUpdateOrderSeat = (seatId: string, newOrderedSeat: string[], isLoad: boolean = true): any => {
    return async (dispatch: Dispatch): Promise<ISeattype2DataApiRes | IErrorAPIRes | null> => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        const data = {
            new_ordered_seat: newOrderedSeat,
        };

        try {
            const res: AxiosResponse<ISeattype2DataApiRes> = await apiHelper.updateOrderSeat(seatId, data);
            return res.data;
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                return res.data;
            }
            return { code: 500, mes: err.message };
        } finally {
            if (isLoad) {
                dispatch(setLoader(false));
            }
        }
    };
};

export const fetchUpdateEvent = async (
    id: string,
    data: IEventDataApi,
    callBack?: (result: IEventDataApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.updateEvent(id, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchListEvent = async (
    query: string,
    callBack?: (result: IEventDataApiListRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.listEvent(query);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchListEventOrganizer = async (
    callBack?: (result: IEventByOrganizerDataApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.listEventOrganizer();
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchDetailsEvent = async (
    id: string,
    callBack?: (result: IEventDetailsApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.detailsEvent(id);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchDetailsSeat = async (
    id: string,
    callBack?: (result: ISeattype2DetailsApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.detailsSeat(id);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchDetailsSeatAnotherByEventId = async (
    eventId: string,
    callBack?: (result: ISeatanotherDetailsApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.detailsSeatAnotherByEventId(eventId);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchDetailsSeatType3ByEventId = async (
    eventId: string,
    callBack?: (result: ISeattype3DetailsApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.detailsSeatType3ByEventId(eventId);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchDetailsSeatType2ByEventId = async (
    eventId: string,
    callBack?: (result: ISeattype2DetailsApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.detailsSeatType2ByEventId(eventId);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const searchEvents = async (
    keyword: string,
    callBack?: (result: IEventListComponentProps | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        console.log(`Searching for events with keyword: ${keyword}`); // Debug log
        const response = await apiHelper.searchEvents(keyword); // Kiểm tra API Helper
        console.log(response); // Log response từ API
        if (callBack) {
            callBack(response?.data);
        }
    };
};

export const fetchDetailsSeatType1ByEventId = async (
    eventId: string,
    callBack?: (result: ISeattype1DetailsApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.detailsSeatType1ByEventId(eventId);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchListAdminCustomer = async (
    callBack?: (result: IAdminCustomerListAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.adminListCustomer();
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchUpdateOrganizerByAdmin = async (
    _id: string,
    data: IEditUserProfileDataAPI,
    callBack?: (result: IAdminUpdateOrganizerAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.updateOrganizerByAdmin(_id, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchBanCustomerByAdmin = async (
    id: string,
    callBack?: (result: IAdminCustomerBanAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.adminBanCustomer(id);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchCreateAccountByAdmin = async (
    data: IRegisterDataApi,
    callBack?: (result: IRegisterDataApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.createAccountByAdmin(data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchUpdateStatusEventByAdmin = async (
    id: string,
    data: IEventDataApi,
    callBack?: (result: IEventUpdateByAdmin | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.updateEventsStatusByAdmin(id, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchCreateComment = async (
    id: string,
    data: ICommentDataAPI,
    callBack?: (result: ICommentDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.createCommemt(id, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};
export const fetchUpdateComment = async (
    idComment: string,
    data: ICommentDataAPI,
    callBack?: (result: ICommentDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.editComment(idComment, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchDeleteComment = async (
    idComment: string,
    callBack?: (result: ICommentDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.deleteComment(idComment);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchListComment = async (
    id: string,
    callBack?: (result: ICommentListDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.listCommemt(id);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchReplyComment = async (
    eid: string,
    commentId: string,
    data: ICommentDataAPI,
    callBack?: (result: ICommentDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.replyCommemt(eid, commentId, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchListReplyComment = async (
    eid: string,
    commentId: string,
    callBack?: (result: ICommentListDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.listReplyCommemt(eid, commentId);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchListOrder = async (callBack?: (result: IOrderDataApiRes | IErrorAPIRes | null) => void, isLoad: boolean = true) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.orderList();
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchUserFavourites = async (
    userId: string,
    callBack?: (result: IFavouriteDataApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.getFavourites(userId);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchCreateOrder = async (
    eid: string,
    data: IOrderDataApi,
    callBack?: (result: ICreateorderDataApiRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.createOrder(eid, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchCreateRating = async (
    eventId: string,
    data: IRatingDataApi,
    callBack?: (result: IRatingDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.createRating(eventId, data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchListRating = async (
    eventId: string,
    callBack?: (result: IRatingDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.listRating(eventId);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};

export const fetchAddFavourite = async (
    data: addFavourite,
    callBack?: (result: IRatingDataAPIRes | IErrorAPIRes | null) => void,
    isLoad: boolean = true,
) => {
    return async (dispatch: Dispatch) => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res = await apiHelper.addFavourite(data);
            if (callBack) {
                callBack(res?.data);
            }
        } catch (err) {
            if (!(err instanceof Error)) {
                const res = err as AxiosResponse<IErrorAPIRes, AxiosError>;
                if (callBack) {
                    callBack(res?.data);
                }
            }
        }

        if (isLoad) {
            dispatch(setLoader(false));
        }
    };
};
