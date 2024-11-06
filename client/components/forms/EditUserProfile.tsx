import { createRef, useState } from 'react';
import Validator from '@components/commons/Validator';
import { validateHelper } from '@utils/helpers';
import { useDispatch } from 'react-redux';
import { fetchEditUserProfile, setModal } from '@redux/actions';
import Input from '@components/commons/Input';
import { http, images } from '@utils/constants';
import { fetchUploadImages } from '@redux/actions/api';
import Img from '@components/commons/Img';

const EditUserProFileForm: IEditUserProfileComponent<IEditUserProfileComponentProps> = (props) => {
    const { currentUser } = props;
    const dispatch = useDispatch();

    const [state, setState] = useState<IEditUserProfileComponentState>(() => {
        let previewUrl = '';
        if (currentUser?.images) {
            if (typeof currentUser.images === 'string') {
                previewUrl = currentUser.images;
            } else if (currentUser.images instanceof FormData) {
                // Nếu là FormData, chúng ta không thể trực tiếp sử dụng nó làm previewUrl
                // Có thể bạn muốn để trống hoặc sử dụng một giá trị mặc định
                previewUrl = '';
            }
        }

        return {
            curentProfile: {
                ...(currentUser ?? {}),
            },
            previewUrl,
        };
    });

    const { curentProfile, previewUrl } = state;

    const firstNameValidatorRef = createRef<IValidatorComponentHandle>();
    const dobValidatorRef = createRef<IValidatorComponentHandle>();
    const genderValidatorRef = createRef<IValidatorComponentHandle>();
    const phoneValidatorRef = createRef<IValidatorComponentHandle>();
    const addressValidatorRef = createRef<IValidatorComponentHandle>();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (file) {
            setState((prev) => ({
                ...prev,
                previewUrl: URL.createObjectURL(file),
            }));
            await handleUploadImages(file);
        }
    };

    const handleDeleteAvatar = () => {
        setState((prev) => ({
            ...prev,
            previewUrl: undefined,
            curentProfile: prev.curentProfile
                ? {
                      ...prev.curentProfile,
                      images: undefined,
                  }
                : undefined,
        }));
    };

    const handleOnChange = (field: string, value: string | null) => {
        setState((prev) => ({
            ...prev,
            curentProfile: {
                ...prev.curentProfile,
                [field]: value,
            },
        }));
    };

    const handleUploadImages = async (file: File) => {
        const formData = new FormData();
        formData.append('images', file);

        dispatch(
            await fetchUploadImages({ images: formData }, (res) => {
                if (res?.code === http.SUCCESS_CODE) {
                    const upload = (res as IEditUserProfileAPIRes).data?.userData?.images;
                    setState((prev) => ({
                        ...prev,
                        curentProfile: {
                            ...prev.curentProfile,
                            images: upload,
                        },
                    }));
                    dispatch(
                        setModal({
                            isShow: true,
                            content: (
                                <>
                                    <div className="text-center bases__margin--bottom31">
                                        <Img src={images.ICON_SUCCESS} className="bases__width--90 bases__height--75" />
                                    </div>
                                    <div className="bases__text--bold bases__font--14 text-center">Upload avatar successfully!</div>
                                </>
                            ),
                        }),
                    );
                } else {
                    dispatch(
                        setModal({
                            isShow: true,
                            content: (
                                <>
                                    <div className="text-center bases__margin--bottom31">
                                        <Img src={images.ICON_TIMES} className="bases__width--90 bases__height--75" />
                                    </div>
                                    <div className="bases__text--bold bases__font--14 text-center">Error while you upload image!!!</div>
                                </>
                            ),
                        }),
                    );
                }
            }),
        );
    };

    const submitForm = async () => {
        let isValidate = true;

        const validatorText = [
            { ref: firstNameValidatorRef, value: curentProfile?.username, message: 'Your First Name Is Not Empty!' },
            { ref: dobValidatorRef, value: curentProfile?.dob, message: 'Your Date of Birth Is Not Empty!' },
            { ref: genderValidatorRef, value: curentProfile?.gender, message: 'Your Gender Is Not Empty!' },
            { ref: phoneValidatorRef, value: curentProfile?.phone, message: 'Your Phone Is Not Empty!' },
            { ref: addressValidatorRef, value: curentProfile?.address, message: 'Your Address Is Not Empty!' },
        ];

        validatorText.forEach(({ ref, value, message }) => {
            ref.current?.onValidateMessage('');
            if (validateHelper.isEmpty(value ?? '')) {
                ref.current?.onValidateMessage(message);
                isValidate = false;
            } else if (validateHelper.isCharacters(value ?? '')) {
                ref.current?.onValidateMessage(`Your ${message} Cannot Be Less Than 2 Characters`);
                isValidate = false;
            }
        });

        if (isValidate) {
            dispatch(
                await fetchEditUserProfile(curentProfile ?? {}, (result: IEditUserProfileAPIRes | IErrorAPIRes | null) => {
                    if (result?.code === http.SUCCESS_CODE) {
                        dispatch(
                            setModal({
                                isShow: true,
                                content: (
                                    <>
                                        <div className="text-center bases__margin--bottom31">
                                            <Img src={images.ICON_SUCCESS} className="bases__width--90 bases__height--75" />
                                        </div>
                                        <div className="bases__text--bold bases__font--14 text-center">
                                            Upload your information successfully!
                                        </div>
                                    </>
                                ),
                            }),
                        );
                    }
                }),
            );
        }
    };

    return (
        <div className="components___edituserprofile">
            <div className="components___edituserprofile-form bases__width1500px p-3">
                <h2 className="fw-bold mb-4 text-center">Edit Profile</h2>
                <div className="row gap-5">
                    <div className="form-group d-flex justify-content-center align-items-center col-md-4">
                        {!(previewUrl || curentProfile?.images) && (
                            <label htmlFor="avatar" className="components___edituserprofile--imgUpload">
                                <img src={images.ICON_FILE_UPLOAD} alt="" />
                            </label>
                        )}
                        <div className="d-flex align-items-center">
                            <input type="file" className="form-control d-none" id="avatar" name="avatar" onChange={handleAvatarChange} />
                            {(previewUrl || curentProfile?.images) && (
                                <div className="ms-3 position-relative">
                                    <img
                                        src={typeof previewUrl === 'string' ? previewUrl : ''}
                                        alt="Avatar"
                                        className="img-thumbnail"
                                        style={{ width: '450px', height: '450px', objectFit: 'cover' }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                        onClick={handleDeleteAvatar}
                                    >
                                        X
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="gap-4 d-flex flex-column">
                            <div className="form-group">
                                <label htmlFor="firstname" className="pb-2">
                                    User Name
                                    <span className="text-danger">*</span>
                                </label>
                                <Validator ref={firstNameValidatorRef}>
                                    <Input
                                        type="text"
                                        id="firstname"
                                        value={curentProfile?.username}
                                        onChange={(value: string) => handleOnChange('username', value)}
                                        name="firstname"
                                        placeholder="Enter Your First Name"
                                        isBlockSpecial={true}
                                    />
                                </Validator>
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender" className="pb-2">
                                    Gender
                                    <span className="text-danger">*</span>
                                </label>
                                <Validator ref={genderValidatorRef}>
                                    <select
                                        value={curentProfile?.gender}
                                        onChange={(e) => handleOnChange('gender', e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </Validator>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone_number" className="pb-2">
                                    Phone Number
                                    <span className="text-danger">*</span>
                                </label>
                                <Validator ref={phoneValidatorRef}>
                                    <Input
                                        type="signed-number"
                                        className="form-control"
                                        maxLength={10}
                                        id="phone_number"
                                        name="phone_number"
                                        value={curentProfile?.phone}
                                        onChange={(value: string) => handleOnChange('phone', value)}
                                        placeholder="Enter Your Phone Number"
                                    />
                                </Validator>
                            </div>
                        </div>
                        <div className="col-md-6 gap-4 d-flex flex-column">
                            <div className="form-group">
                                <label htmlFor="dob" className="pb-2">
                                    Date Of Birth
                                    <span className="text-danger">*</span>
                                </label>
                                <Validator ref={dobValidatorRef}>
                                    <input
                                        value={curentProfile?.dob}
                                        onChange={(e) => handleOnChange('dob', e.target.value)}
                                        type="date"
                                        className="form-control"
                                        name="dob"
                                    />
                                </Validator>
                            </div>
                            <div className="form-group">
                                <label htmlFor="address" className="pb-2">
                                    Address
                                    <span className="text-danger">*</span>
                                </label>
                                <Validator ref={addressValidatorRef}>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        maxLength={100}
                                        id="address"
                                        value={curentProfile?.address}
                                        onChange={(value: string) => handleOnChange('address', value)}
                                        name="address"
                                        placeholder="Enter Your Address"
                                        isBlockSpecial={true}
                                    />
                                </Validator>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end pt-4">
                    <button type="button" onClick={submitForm} className="components___edituserprofile-form-firstButton">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserProFileForm;
