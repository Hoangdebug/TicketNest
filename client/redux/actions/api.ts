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

export const fetchAddEvent = (data: IEventDataApi, isLoad: boolean = true): any => {
    return async (dispatch: Dispatch): Promise<IEventDataApiRes | IErrorAPIRes | null> => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res: AxiosResponse<IEventDataApiRes> = await apiHelper.addEvent(data);
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

export const fetchAddSeat = (data: ISeatType2DataAPI, isLoad: boolean = true): any => {
    return async (dispatch: Dispatch): Promise<ISeattype2DataApiRes | IErrorAPIRes | null> => {
        if (isLoad) {
            dispatch(setLoader(true));
        }

        try {
            const res: AxiosResponse<ISeattype2DataApiRes> = await apiHelper.addSeat(data);
            return res.data;
        } catch (err) {
            // Kiểm tra nếu lỗi là AxiosError
            if (axios.isAxiosError(err)) {
                const res = err.response;
                if (res && res.data) {
                    return res.data; // Trả về data từ response nếu tồn tại
                }
            }

            // Xử lý các lỗi khác (nếu không phải lỗi Axios)
            return { code: 500, mes: err instanceof Error ? err.message : 'An unknown error occurred' };
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
