import { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Validator from '@components/commons/Validator';
import { validateHelper } from '@utils/helpers';

import Input from '@components/commons/Input';
import DateTimePicker from '@components/commons/DateTimePicker';
import { useDispatch } from 'react-redux';
import { fetchAddEvent, fetchUpdateEvent, fetchAddSeat } from '@redux/actions/api';
import { enums, http, images, routes } from '@utils/constants';
import Select from '@components/commons/Select';
import Button from '@components/commons/Button';
import Img from '@components/commons/Img';
import { setModal } from '@redux/actions';
import axios from 'axios';

//theanh318 add thanh cong
const AddEventForm: IAddEventComponent<IAddEventComponentProps> = (props) => {
    const { event } = props;

    const dispatch = useDispatch();
    const router = useRouter();
    const { query } = router;
    const { id } = query;

    const [state, setState] = useState<IAddEventComponentState>(() => {
        let previewUrl = '';
        if (event?.images) {
            if (typeof event.images === 'string') {
                previewUrl = event.images;
            } else if (event.images instanceof FormData) {
                previewUrl = '';
            }
        }

        return {
            isValidateStartDateTime: true,
            isValidateEndDateTime: true,
            eventAdd: {
                ...(event ?? {}),
            },
            previewUrl,
        };
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { eventAdd, isValidateStartDateTime, isValidateEndDateTime, previewUrl } = state;
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const titleValidatorRef = createRef<IValidatorComponentHandle>();
    const descriptionValidatorRef = createRef<IValidatorComponentHandle>();
    const startDateValidatorRef = createRef<IValidatorComponentHandle>();
    const endDateValidatorRef = createRef<IValidatorComponentHandle>();
    const locationValidatorRef = createRef<IValidatorComponentHandle>();
    const ticketTypeValidatorRef = createRef<IValidatorComponentHandle>();
    const ticketPriceValidatorRef = createRef<IValidatorComponentHandle>();
    const ticketQuantityValidatorRef = createRef<IValidatorComponentHandle>();
    const startDateTimeValidatorRef = createRef<IValidatorComponentHandle>();
    const endDateTimeValidatorRef = createRef<IValidatorComponentHandle>();

    const handleOnChange = (field: string, value: string | number | boolean) => {
        setState((prevState) => ({
            ...prevState,
            eventAdd: {
                ...prevState.eventAdd,
                [field]: value,
            },
        }));
    };

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            eventAdd: {
                ...prevState.eventAdd,
                name: event?.name ?? '',
                description: event?.description ?? '',
                day_start: event?.day_start ?? '',
                day_end: event?.day_end ?? '',
                event_type: event?.event_type ?? enums.EVENTTYPE.MUSIC,
                location: event?.location ?? enums.EVENTLOCATION.LOCATIONA,
                price: event?.price ?? [0],
                quantity: event?.quantity ?? [0],
                ticket_number: event?.ticket_number ?? enums.EVENTTICKET.BASE,
            },
            previewUrl: typeof event?.images === 'string' ? event.images : prevState.previewUrl,
        }));
    }, [event]);

    const handleLocationChange = (value: string) => {
        let newPrices = eventAdd?.price || [];
        let newQuantities = eventAdd?.quantity || [];

        switch (value) {
            case enums.EVENTLOCATION.LOCATIONA:
                newPrices = newPrices.slice(0, 3);
                newQuantities = newQuantities.slice(0, 3);
                while (newPrices.length < 3) newPrices.push(0);
                while (newQuantities.length < 3) newQuantities.push(0);
                break;
            case enums.EVENTLOCATION.LOCATIONB:
            case enums.EVENTLOCATION.LOCATIONC:
                newPrices = newPrices.slice(0, 2);
                newQuantities = newQuantities.slice(0, 2);
                while (newPrices.length < 2) newPrices.push(0);
                while (newQuantities.length < 2) newQuantities.push(0);
                break;
            default:
                break;
        }

        setState((prevState) => ({
            ...prevState,
            eventAdd: {
                ...prevState.eventAdd,
                location: value,
                price: newPrices,
                quantity: newQuantities,
            },
        }));
    };

    const handleAddTicketPrice = () => {
        const maxPrices = eventAdd?.location === enums.EVENTLOCATION.LOCATIONA ? 3 : 2;
        if ((eventAdd?.price?.length ?? 0) < maxPrices) {
            setState((prevState) => ({
                ...prevState,
                eventAdd: {
                    ...(prevState.eventAdd ?? {}),
                    price: [...(prevState.eventAdd?.price ?? []), 0],
                },
            }));
        }
    };

    const handleRemoveTicketPrice = (index: number) => {
        const minPrices = eventAdd?.location === enums.EVENTLOCATION.LOCATIONA ? 3 : 2;
        if ((eventAdd?.price?.length ?? 0) > minPrices) {
            setState((prevState) => ({
                ...prevState,
                eventAdd: {
                    ...(prevState.eventAdd ?? {}),
                    price: (prevState.eventAdd?.price ?? []).filter((_, i) => i !== index),
                },
            }));
        }
    };

    const handleOnChangePrice = (index: number, value: string | number) => {
        setState((prevState) => ({
            ...prevState,
            eventAdd: {
                ...(prevState.eventAdd ?? {}),
                price: prevState.eventAdd?.price?.map((p, i) => (i === index ? Number(value) : p)) || [],
            },
        }));
    };

    const handleAddTicketQuantity = () => {
        const maxQuantities = eventAdd?.location === enums.EVENTLOCATION.LOCATIONA ? 3 : 2;
        if ((eventAdd?.quantity?.length ?? 0) < maxQuantities) {
            setState((prevState) => ({
                ...prevState,
                eventAdd: {
                    ...(prevState.eventAdd ?? {}),
                    quantity: [...(prevState.eventAdd?.quantity ?? []), 0],
                },
            }));
        }
    };

    const handleOnChangeQuantity = (index: number, value: string | number) => {
        const location = eventAdd?.location as enums.EVENTLOCATION;
        const maxQuantities = enums.TICKET_QUANTITY_LIMITS[location] || [];

        const newValue = Number(value);
        const maxQuantity = maxQuantities[index] ?? Infinity;

        let errorMessage = '';
        if (newValue > maxQuantity) {
            errorMessage = `Giới hạn chỉ là ${maxQuantity}`;
        }

        setErrorMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[index] = errorMessage;
            return newMessages;
        });

        if (!errorMessage) {
            setState((prevState) => ({
                ...prevState,
                eventAdd: {
                    ...(prevState.eventAdd ?? {}),
                    quantity: prevState.eventAdd?.quantity?.map((q, i) => (i === index ? newValue : q)) || [],
                },
            }));
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setState((prev) => ({
                ...prev,
                previewUrl: URL.createObjectURL(file),
            }));
        }
    };

    const handleDeleteAvatar = () => {
        setSelectedFile(null);
        setState((prev) => ({
            ...prev,
            previewUrl: undefined,
        }));
    };

    const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return undefined;
    };

    const handleUploadImages = async (eventId: string, file: File) => {
        const formData = new FormData();
        formData.append('images', file);

        try {
            const token = getCookie('token');

            if (!token) {
                console.error('Token not found in cookies');
                return;
            }

            const res = await axios.put(`http://localhost:5000/api/event/upload-image/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data?.code === http.SUCCESS_CODE) {
                const upload = res.data.data?.userData?.images;
                setState((prev) => ({
                    ...prev,
                    eventAdd: {
                        ...prev.eventAdd,
                        images: upload,
                    },
                }));

                // Show success modal
                dispatch(
                    setModal({
                        isShow: true,
                        content: (
                            <>
                                <div className="text-center bases__margin--bottom31">
                                    <Img src={images.ICON_SUCCESS} className="bases__width--90 bases__height--75" />
                                </div>
                                <div className="bases__text--bold bases__font--14 text-center">Create New Event Successfully</div>
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
        } catch (error) {
            console.error('Error during image upload', error);
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
    };
    useEffect(() => {
        const handleBeforeUnload = () => {
            setState({
                eventAdd: undefined,
            });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const hanldeCancelBack = () => {
        router.back();
    };

    const handleSetValidateDateTime = (value: boolean, field: 'start' | 'end' = 'start') => {
        if (field === 'start') {
            setState((prevState) => ({
                ...prevState,
                isValidateStartDateTime: value,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                isValidateEndDateTime: value,
            }));
        }
    };

    const renderEventTypeOptions = () => {
        const eventTypeOptions = [
            {
                value: enums.EVENTTYPE.MUSIC,
                label: enums.EVENTTYPE.MUSIC,
            },
            {
                value: enums.EVENTTYPE.DRAMATIC,
                label: enums.EVENTTYPE.DRAMATIC,
            },
            {
                value: enums.EVENTTYPE.WORKSHOP,
                label: enums.EVENTTYPE.WORKSHOP,
            },
        ];

        return eventTypeOptions;
    };

    const renderEventLocationOptions = () => {
        const eventLocationOptions = [
            {
                value: enums.EVENTLOCATION.LOCATIONA,
                label: enums.EVENTLOCATION.LOCATIONA,
            },
            {
                value: enums.EVENTLOCATION.LOCATIONB,
                label: enums.EVENTLOCATION.LOCATIONB,
            },
            {
                value: enums.EVENTLOCATION.LOCATIONC,
                label: enums.EVENTLOCATION.LOCATIONC,
            },
            {
                value: enums.EVENTLOCATION.ANOTHER,
                label: enums.EVENTLOCATION.ANOTHER,
            },
        ];

        return eventLocationOptions;
    };

    const handleValidateStartDateTime = () => {
        handleSetValidateDateTime(true);
        if (eventAdd?.day_start && !validateHelper.isDate(eventAdd?.day_start)) {
            handleSetValidateDateTime(false);
        }
    };

    const handleValidateEndDateTime = () => {
        handleSetValidateDateTime(true, 'end');
        endDateTimeValidatorRef?.current?.onValidateMessage('');

        if (eventAdd?.day_end && !validateHelper.isDate(eventAdd?.day_end)) {
            handleSetValidateDateTime(false, 'end');
        }
    };

    const handleSubmitUpdateEvent = async () => {
        dispatch(
            await fetchUpdateEvent(id?.toString() ?? '', eventAdd ?? {}, (res: IEventDataApiRes | IErrorAPIRes | null) => {
                if (res?.code === http.SUCCESS_CODE) {
                    router.push(routes.CLIENT.ORGANIZER_LIST_EVENT.href, undefined, { scroll: false });
                } else if (res?.code === http.ERROR_EXCEPTION_CODE) {
                    alert(res?.mes);
                }
            }),
        );
    };

    const handleSubmitAddEvent = async (): Promise<string | null> => {
        console.log('Event data being sent:', eventAdd); // Kiểm tra dữ liệu event trước khi gửi

        const res: IEventDataApiRes | IErrorAPIRes | null = await dispatch(fetchAddEvent(eventAdd ?? {}));

        if (res?.code === http.SUCCESS_CODE) {
            const eventId = res.result?._id ?? null;

            if (eventId) {
                const seatAdd: ISeatType2DataAPI = {
                    location: eventAdd?.location,
                    price: eventAdd?.price, // Gửi lên mảng price
                    quantity: eventAdd?.quantity, // Gửi lên mảng quantity
                    status: enums.SeatStatus.PENDING,
                };

                // Kiểm tra dữ liệu seat trước khi gửi
                console.log('Seat data being sent:', seatAdd);

                const seatRes = await dispatch(fetchAddSeat(seatAdd));

                if (seatRes?.code === http.SUCCESS_CODE) {
                    router.push(routes.CLIENT.ORGANIZER_LIST_EVENT.href, undefined, { scroll: false });
                } else {
                    // Thêm thông báo khi tạo ghế thất bại
                    alert('Error while creating seat: ' + seatRes?.mes);
                }
            }
            return eventId;
        } else if (res?.code === http.ERROR_EXCEPTION_CODE) {
            alert(res?.mes);
            return null;
        } else {
            return null;
        }
    };

    const handleSubmit = async () => {
        let isValidate = true;

        const validator = [
            { ref: titleValidatorRef, value: eventAdd?.name, message: 'Title Is Not Empty!' },
            { ref: descriptionValidatorRef, value: eventAdd?.description, message: 'Description Is Not Empty!' },
            { ref: startDateValidatorRef, value: eventAdd?.day_start, message: 'Start Date Is Not Empty!' },
            { ref: endDateValidatorRef, value: eventAdd?.day_end, message: 'End Date Is Not Empty!' },
            { ref: locationValidatorRef, value: eventAdd?.location, message: 'Location Is Not Empty!' },
            { ref: ticketTypeValidatorRef, value: eventAdd?.event_type, message: 'TicketType Is Not Empty!' },
            { ref: ticketPriceValidatorRef, value: eventAdd?.price, message: 'Ticket Price Is Not Empty!' },
            { ref: ticketQuantityValidatorRef, value: eventAdd?.ticket_number, message: 'Ticket Quantity Is Not Empty!' },
        ];

        validator.forEach(({ ref, value, message }) => {
            ref.current?.onValidateMessage('');
            if (validateHelper.isEmpty(String(value ?? ''))) {
                ref.current?.onValidateMessage(message);
                isValidate = false;
            } else if (validateHelper.isCharacters(String(value ?? ''))) {
                ref.current?.onValidateMessage(`Your ${message} Cannot Be Less Than 2 Characters`);
                isValidate = false;
            }
        });

        if (isValidate) {
            if (id) {
                await handleSubmitUpdateEvent();
                if (id && selectedFile) {
                    await handleUploadImages(id?.toString() ?? '', selectedFile);
                }
            } else {
                const eventId = await handleSubmitAddEvent();
                if (eventId && selectedFile) {
                    await handleUploadImages(eventId, selectedFile);
                }
            }
        }
    };
    return (
        <div className="components__addevent">
            <div className="components__addevent-form p-3">
                <div className="row">
                    <div className="col-md-6 gap-4 d-flex flex-column">
                        <div className="form-group">
                            <label htmlFor="title" className="pb-2">
                                Title <span className="text-danger">*</span>
                            </label>
                            <Validator ref={titleValidatorRef}>
                                <Input
                                    type="text"
                                    value={eventAdd?.name}
                                    onChange={(value: string) => handleOnChange('name', value)}
                                    id="eventname"
                                    name="eventname"
                                    placeholder="Enter Title"
                                />
                            </Validator>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ticketType" className="pb-2">
                                Ticket Type<span className="text-danger">*</span>
                            </label>
                            <Validator ref={ticketTypeValidatorRef}>
                                <Select
                                    value={eventAdd?.event_type}
                                    onChange={(value: string) => handleOnChange('event_type', value)}
                                    options={renderEventTypeOptions()}
                                />
                            </Validator>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description" className="pb-2">
                                Description <span className="text-danger">*</span>
                            </label>
                            <Validator ref={descriptionValidatorRef}>
                                <Input
                                    type="textarea"
                                    value={eventAdd?.description}
                                    onChange={(value: string) => handleOnChange('description', value)}
                                    id="eventdescription"
                                    name="eventdescription"
                                    placeholder="Enter Event Description"
                                />
                            </Validator>
                        </div>
                        <div
                            className={`w-100 d-flex flex-wrap components__addevent_picker ${
                                !isValidateStartDateTime || !isValidateEndDateTime ? 'components__addevent_picker_invalid' : ''
                            }`}
                        >
                            <Validator className="bases__width-percent--40 components__addevent_picker_to" ref={startDateTimeValidatorRef}>
                                <DateTimePicker
                                    value={eventAdd?.day_start}
                                    onBlur={() => handleValidateStartDateTime()}
                                    onChange={(value: string) => handleOnChange('day_start', value)}
                                    maxDate={null}
                                    maxTime={null}
                                    classNameDate="components__addevent_picker-date"
                                    classNameTime="components__addevent_picker-time"
                                />
                            </Validator>

                            <span className="bases__padding--horizontal10 d-flex align-items-center bases__font--14 components__addevent_picker-center-text">
                                ~
                            </span>

                            <Validator className="bases__width-percent--40 components__addevent_picker_from">
                                <DateTimePicker
                                    value={eventAdd?.day_end}
                                    onBlur={() => handleValidateEndDateTime()}
                                    onChange={(value: string) => handleOnChange('day_end', value)}
                                    maxDate={null}
                                    maxTime={null}
                                    classNameDate="components__addevent_picker-date"
                                    classNameTime="components__addevent_picker-time"
                                />
                            </Validator>
                        </div>
                        <div className="form-group">
                            <label htmlFor="avatar" className="pb-2">
                                Avatar <span className="text-danger">*</span>
                            </label>
                            <div className="form-group d-flex justify-content-center align-items-center col-md-12">
                                {!previewUrl && (
                                    <label
                                        htmlFor="avatar"
                                        style={{ cursor: 'pointer', padding: '70px', border: '1px solid #ffbdbd', borderRadius: '10px' }}
                                    >
                                        <img src={images.ICON_FILE_UPLOAD} alt="" />
                                    </label>
                                )}
                                <div className="d-flex align-items-center">
                                    <input
                                        type="file"
                                        className="form-control d-none"
                                        id="avatar"
                                        name="avatar"
                                        onChange={handleAvatarChange}
                                    />
                                    {previewUrl && (
                                        <div className="ms-3 position-relative">
                                            <img
                                                src={previewUrl}
                                                alt="Avatar"
                                                className="img-thumbnail"
                                                style={{ width: '1050px', height: 'auto', objectFit: 'cover' }}
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
                        </div>
                    </div>
                    <div className="col-md-6 gap-4 d-flex flex-column">
                        <div className="form-group">
                            <label htmlFor="location" className="pb-2">
                                Location<span className="text-danger">*</span>
                            </label>
                            <Validator ref={locationValidatorRef}>
                                <Select
                                    value={eventAdd?.location}
                                    onChange={(value: string) => handleLocationChange(value)}
                                    options={renderEventLocationOptions()}
                                />
                            </Validator>
                            {eventAdd?.location && (
                                <div className="mt-3">
                                    <img
                                        src={enums.EVENTLOCATION_IMAGE_URL[eventAdd.location as enums.EVENTLOCATION]}
                                        alt="Location preview"
                                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="ticketPrice" className="pb-2">
                                Ticket Prices<span className="text-danger">*</span>
                            </label>
                            <Validator ref={ticketPriceValidatorRef}>
                                {(eventAdd?.price ?? []).map((price, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <Input
                                            value={price}
                                            type="signed-number"
                                            onChange={(value: string) => handleOnChangePrice(index, value)}
                                            id={`ticketprice${index}`}
                                            name={`ticketprice${index}`}
                                            placeholder={`Enter Ticket Price ${index + 1}`}
                                            isBlockSpecial={true}
                                            maxLength={10}
                                        />
                                        {(eventAdd?.price?.length ?? 0) >
                                            (eventAdd?.location === enums.EVENTLOCATION.LOCATIONA ? 3 : 2) && (
                                            <Button
                                                buttonText="Remove"
                                                onClick={() => handleRemoveTicketPrice(index)}
                                                background="red"
                                                fontSize="14"
                                                className="ms-2"
                                            />
                                        )}
                                    </div>
                                ))}
                                {(eventAdd?.price?.length ?? 0) < (eventAdd?.location === enums.EVENTLOCATION.LOCATIONA ? 3 : 2) && (
                                    <Button
                                        buttonText="Add Price"
                                        onClick={handleAddTicketPrice}
                                        background="blue"
                                        fontSize="14"
                                        className="mt-2"
                                    />
                                )}
                            </Validator>
                        </div>

                        <div className="form-group">
                            <label htmlFor="ticketQuantity" className="pb-2">
                                Ticket Quantities<span className="text-danger">*</span>
                            </label>
                            <Validator ref={ticketQuantityValidatorRef}>
                                {eventAdd?.quantity?.map((quantity, index) => (
                                    <div key={index} className="d-flex flex-column mb-2">
                                        <div className="d-flex align-items-center">
                                            <Input
                                                value={quantity}
                                                type="signed-number"
                                                onChange={(value: string) => handleOnChangeQuantity(index, value)}
                                                id={`ticketquantity${index}`}
                                                name={`ticketquantity${index}`}
                                                placeholder={`Enter Ticket Quantity ${index + 1}`}
                                                isBlockSpecial={true}
                                                maxLength={10}
                                            />
                                            <span className="ms-2">
                                                Max:{' '}
                                                {enums.TICKET_QUANTITY_LIMITS[eventAdd?.location as enums.EVENTLOCATION]?.[index] ?? 'N/A'}
                                            </span>
                                        </div>
                                        {errorMessages[index] && (
                                            <span style={{ color: 'red', fontSize: '20px' }}>{errorMessages[index]}</span>
                                        )}
                                    </div>
                                ))}
                                {(eventAdd?.quantity?.length ?? 0) < (eventAdd?.location === enums.EVENTLOCATION.LOCATIONA ? 3 : 2) && (
                                    <Button
                                        buttonText="Add Quantity"
                                        onClick={handleAddTicketQuantity}
                                        background="blue"
                                        fontSize="14"
                                        className="mt-2"
                                    />
                                )}
                            </Validator>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row-reverse gap-2">
                    <Button buttonText="Submit" onClick={handleSubmit} background="green" fontSize="14" />
                    <Button buttonText="Cancel" onClick={hanldeCancelBack} fontSize="14" />
                </div>
            </div>
        </div>
    );
};

export default AddEventForm;
