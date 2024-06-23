import { createRef, useState } from 'react';
import Validator from '@components/commons/Validator';
import { validateHelper } from '@utils/helpers';
import { enums, routes } from '@utils/constants';
import router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditUserProfile } from '@redux/actions';
import { ReduxStates } from '@redux/reducers';

const EditUserProFileForm: IEditUserProfileComponent<IEditUserProfileComponentProps> = () => {
    const navigate = useRouter();
    const dispatch = useDispatch();
    const { profile } = useSelector((states: ReduxStates) => states); 
    // lấy data trong thằng profile này truyền vào các ô input để update 
    console.log("data__: ",profile);
    
    const [state, setState] = useState<IEditUserProfileComponentState>({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        phone : '',
        address: '',
        images: '',
    });
    
    const { firstName, lastName, dob, gender, phone, address, images } = state;

    const firstNameValidatorRef = createRef<IValidatorComponentHandle>();
    const lastNameValidatorRef = createRef<IValidatorComponentHandle>();
    const dobValidatorRef = createRef<IValidatorComponentHandle>();
    const genderValidatorRef = createRef<IValidatorComponentHandle>();
    const phoneValidatorRef = createRef<IValidatorComponentHandle>();
    const addressValidatorRef = createRef<IValidatorComponentHandle>();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setState((prev) => ({
                ...prev,
                avatar: URL.createObjectURL(file),
            }));
        }
    };

    const handleDeleteAvatar = () => {
        setState((prev) => ({
            ...prev,
            avatar: '',
        }));
    };

    const handleOnChange = (feild: string, value: string | null) => {
        setState((prev) => ({
            ...prev,
            [feild]: value,
        }));
    };    

    const submitForm = async () => {
        let isValidate = true;

        const validatorText = [
            { ref: firstNameValidatorRef, value: firstName, message: 'Your First Name Is Not Empty!' },
            { ref: lastNameValidatorRef, value: lastName, message: 'Your Last Name Is Not Empty!' },
            { ref: dobValidatorRef, value: dob, message: 'Your Date of Birth Is Not Empty!' },
            { ref: genderValidatorRef, value: gender, message: 'Your Gender Is Not Empty!' },
            { ref: phoneValidatorRef, value: phone, message: 'Your Phone Is Not Empty!' },
            { ref: addressValidatorRef, value: address, message: 'Your Address Is Not Empty!' },
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

        // call api
        if (isValidate) {
            dispatch(
                await fetchEditUserProfile({ firstName, lastName, dob, gender, phone, address }, (res) => {
                    const isAdmin = res?.data?.userData?.role;
                    console.log(isAdmin);
                    if (res?.code == 200) {
                        if (isAdmin.includes(enums?.ROLE?.ADMIN)) {
                            router.push(routes.CLIENT.ADMIN_PAGE.href);
                        } else {
                            router.push(routes.CLIENT.HOME_PAGE.href);
                        }
                    } else if (res?.code == 500) {
                        alert(res?.mes);
                    }
                }),
            );
        }
    };

    return (
        <div className="components___edituserprofile">
            <div className="components___edituserprofile-form p-3">
                <h2 className="fw-bold mb-4 text-center">Edit Profile</h2>
                <div className="row">
                    <div className="col-md-6 gap-4 d-flex flex-column">
                        <div className="form-group">
                            <label htmlFor="firstname" className="pb-2">
                                First Name
                                <span className="text-danger">*</span>
                            </label>
                            <Validator ref={firstNameValidatorRef}>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstname"
                                    value={firstName}
                                    onChange={(e) => handleOnChange('firstName', e.target.value)}
                                    name="firstname"
                                    placeholder="Enter Your First Name"
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
                                    value={gender}
                                    onChange={(e) => handleOnChange('gender', e.target.value)}
                                    className="form-control"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </Validator>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone_number" className="pb-2">
                                Phone Number
                                <span className="text-danger">*</span>
                            </label>
                            <Validator ref={phoneValidatorRef}>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone_number"
                                    name="phone_number"
                                    value={phone}
                                    onChange={(e) => handleOnChange('phone', e.target.value)}
                                    placeholder="Enter Your Phone Number"
                                />
                            </Validator>
                        </div>
                    </div>
                    <div className="col-md-6 gap-4 d-flex flex-column">
                        <div className="form-group">
                            <label htmlFor="lastname" className="pb-2">
                                Last Name
                                <span className="text-danger">*</span>
                            </label>
                            <Validator ref={lastNameValidatorRef}>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastname"
                                    value={lastName}
                                    onChange={(e) => handleOnChange('lastName', e.target.value)}
                                    name="lastname"
                                    placeholder="Enter Your Last Name"
                                />
                            </Validator>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob" className="pb-2">
                                Date Of Birth
                                <span className="text-danger">*</span>
                            </label>
                            <Validator ref={dobValidatorRef}>
                                <input
                                    value={dob}
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
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    value={address}
                                    onChange={(e) => handleOnChange('address', e.target.value)}
                                    name="address"
                                    placeholder="Enter Your Address"
                                />
                            </Validator>
                        </div>
                        <div className="form-group">
                            <label htmlFor="avatar" className="pb-2">
                                Avatar
                            </label>
                            <div className="d-flex align-items-center">
                                <input
                                    type="file"
                                    className="form-control"
                                    id="avatar"
                                    name="avatar"
                                    onChange={handleAvatarChange}
                                />
                                {images && (
                                    <div className="ms-3">
                                        <img src={images} alt="Avatar" className="img-thumbnail" style={{ width: '100px', height: '100px' }} />
                                        <button type="button" className="btn btn-danger mt-2" onClick={handleDeleteAvatar}>
                                            Delete
                                        </button>
                                    </div>
                                )}
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


