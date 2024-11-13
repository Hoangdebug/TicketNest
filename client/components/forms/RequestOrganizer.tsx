import { createRef, useEffect, useState } from 'react';
import Validator from '@components/commons/Validator';
import { validateHelper } from '@utils/helpers';
import { http, routes } from '@utils/constants';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequestOrganizer } from '@redux/actions/api';
import Button from '@components/commons/Button';
import Input from '@components/commons/Input';
import { ReduxStates } from '@redux/reducers';

const RequestOrganizerForm: IRequestOrganizerComponent<IRequestOrganizerComponentProps> = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { profile } = useSelector((states: ReduxStates) => states);

    const [state, setState] = useState<IRequestOrganizerComponentState>({
        organizer: {
            name: '',
            description: '',
            contact_email: '',
            contact_phone: '',
        },
    });

    const { organizer } = state;

    const organizationNameValidatorRef = createRef<IValidatorComponentHandle>();
    const descriptionValidatorRef = createRef<IValidatorComponentHandle>();
    const contactEmailValidatorRef = createRef<IValidatorComponentHandle>();
    const contactPhoneValidatorRef = createRef<IValidatorComponentHandle>();

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            organizer: {
                name: profile?.username,
                description: '',
                contact_email: profile?.email,
                contact_phone: profile?.phone,
            },
        }));
    }, []);

    const handleOnChange = (field: string, value: string | null) => {
        setState((prevState) => ({
            ...prevState,
            organizer: {
                ...prevState.organizer,
                [field]: value,
            },
        }));
    };

    const submitForm = async () => {
        let isValidate = true;

        const validatorText = [
            { ref: organizationNameValidatorRef, value: organizer?.name, message: 'Organization Name Is Not Empty!' },
            { ref: descriptionValidatorRef, value: organizer?.description, message: 'Description Is Not Empty!' },
            { ref: contactEmailValidatorRef, value: organizer?.contact_email, message: 'Contact Email Is Not Empty!' },
            { ref: contactPhoneValidatorRef, value: organizer?.contact_phone, message: 'Contact Phone Is Not Empty!' },
        ];

        validatorText.forEach(({ ref, value, message }) => {
            ref.current?.onValidateMessage('');
            if (validateHelper.isEmpty(value as string)) {
                ref.current?.onValidateMessage(message);
                isValidate = false;
            } else if (validateHelper.isCharacters(value as string)) {
                ref.current?.onValidateMessage(`Your ${message} Cannot Be Less Than 2 Characters`);
                isValidate = false;
            }
        });

        if (!validateHelper.isEmail(organizer?.contact_email ?? '')) {
            contactEmailValidatorRef.current?.onValidateMessage('Enter a valid email address');
            isValidate = false;
        }

        if (isValidate) {
            dispatch(
                await fetchRequestOrganizer(organizer ?? {}, (res: IAdminRequestCustomerAcceptApiRes | IErrorAPIRes | null) => {
                    if (res?.code === http.SUCCESS_CODE) {
                        router.push(routes.CLIENT.HOME_PAGE.href);
                    } else if (res?.code === 500) {
                        alert(res?.mes);
                    }
                }),
            );
        }
    };

    return (
        <div className="components___requestorganizer">
            <div className="components___requestorganizer-form p-3">
                <h2 className="fw-bold mb-4 text-center">Request to be an Organizer</h2>
                <div className="row">
                    <div className="col-md-6 gap-4 d-flex flex-column">
                        <div className="form-group">
                            <label htmlFor="organizationName" className="pb-2">
                                Organization Name
                                <span className="text-danger">*</span>
                            </label>
                            <Validator ref={organizationNameValidatorRef}>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="organizationName"
                                    value={organizer?.name}
                                    onChange={(value: string) => handleOnChange('name', value)}
                                    name="organizationName"
                                    placeholder="Enter Your Organization Name"
                                    isBlockSpecial={true}
                                />
                            </Validator>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description" className="pb-2">
                                Description
                                <span className="text-danger">*</span>
                            </label>
                            <Validator ref={descriptionValidatorRef}>
                                <Input
                                    type="textarea"
                                    className="form-control"
                                    id="description"
                                    value={organizer?.description}
                                    onChange={(value: string) => handleOnChange('description', value)}
                                    name="description"
                                    placeholder="Enter Description of Your Organization"
                                />
                            </Validator>
                        </div>
                    </div>
                    <div className="col-md-6 gap-4 d-flex flex-column">
                        <div className="form-group">
                            <label htmlFor="contactEmail" className="pb-2">
                                Contact Email
                                <span className="text-danger">*</span>
                            </label>
                            <Validator ref={contactEmailValidatorRef}>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="contactEmail"
                                    value={organizer?.contact_email}
                                    onChange={(value: string) => handleOnChange('contact_email', value)}
                                    name="contactEmail"
                                    placeholder="Enter Contact Email"
                                />
                            </Validator>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactPhone" className="pb-2">
                                Contact Phone
                                <span className="text-danger">*</span>
                            </label>
                            <Validator ref={contactPhoneValidatorRef}>
                                <Input
                                    type="signed-number"
                                    className="form-control"
                                    id="contactPhone"
                                    maxLength={10}
                                    value={organizer?.contact_phone}
                                    onChange={(value: string) => handleOnChange('contact_phone', value)}
                                    name="contactPhone"
                                    placeholder="Enter Contact Phone"
                                    isBlockSpecial={true}
                                />
                            </Validator>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end pt-4">
                    <Button onClick={submitForm} buttonText="Submit" className="components___requestorganizer-form-firstButton" />
                </div>
            </div>
        </div>
    );
};

export default RequestOrganizerForm;
