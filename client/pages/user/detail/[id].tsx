import { IEventDetailPageState, IEventDetailPage, IEventDetailPageProps } from '@interfaces/pages/eventdetail';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoLocationOutline } from 'react-icons/io5';
import { IoMdShare } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { MdOutlinePeople } from 'react-icons/md';
import { SlCalender } from 'react-icons/sl';
import { useDispatch } from 'react-redux';
import { fetchDetailsEvent, fetchListEvent } from '@redux/actions/api';
import { enums, http, images, routes } from '@utils/constants';
import Countdown from '@components/commons/Countdown';
import moment from 'moment';
import { Button, Img, Input } from '@components/index';

const dataDumyCommentEvent = [
    {
        _id: 'kdfhadsfadsf383udssf7raf',
        avatar: images.DA_LAT,
        userName: 'Heheh',
        create_at: '29-04-2024',
        content_comment: 'Mình hỗ trợ sinh viên trả góp như thế nào v ạ',
    },
    {
        _id: 'fadf7238idfasdf92fds9fiadfu8',
        avatar: images.DA_LAT,
        userName: 'Heheh',
        create_at: '29-04-2024',
        content_comment: 'Mình hỗ trợ sinh viên trả góp như thế nào v ạ',
    },
    {
        _id: 'fadf3242384ifjsdfyifds7f342',
        avatar: images.DA_LAT,
        userName: 'Heheh',
        create_at: '29-04-2024',
        content_comment: 'Mình hỗ trợ sinh viên trả góp như thế nào v ạ',
    },
    {
        _id: 'adfslkf29934u32oisdfaydfuiasf83',
        avatar: images.DA_LAT,
        userName: 'Heheh',
        create_at: '29-04-2024',
        content_comment: 'Mình hỗ trợ sinh viên trả góp như thế nào v ạ',
    },
];
const EventDetailPage: IEventDetailPage<IEventDetailPageProps> = () => {
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();
    const [state, setState] = useState<IEventDetailPageState>({
        eventDetails: undefined,
        event: [],
    });
    const { eventDetails, event, comment, replyId } = state;

    const [quantity, setQuantity] = useState(0);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };
    const totalMoney = quantity * (eventDetails?.price ?? 0);
    const slicedEvents = event?.slice(0, 4);
    const formattedDayStart = moment(eventDetails?.day_start).format('MMM DD, YYYY HH:mm:ss');
    const formattedDayEnd = moment(eventDetails?.day_end).format('MMM DD, YYYY HH:mm:ss');
    const dayStart = moment(formattedDayEnd).format('DD');
    const monthStart = moment(formattedDayEnd).format('MMM');

    useEffect(() => {
        handleDetialsEvent();
        handleFetchListEvents();
        handleFetchListComment();
    }, []);

    const handleOnChange = (feild: string, value: string | null) => {
        setState((prev) => ({
            ...prev,
            [feild]: value,
        }));
    };

    const handleReplyClick = (id: string) => {
        if (replyId === id) {
            setState((prevState) => ({
                ...prevState,
                replyId: null,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                replyId: id,
            }));
        }
    };

    const handleDetialsEvent = async () => {
        dispatch(
            await fetchDetailsEvent(id?.toString() ?? '', (res: IEventDetailsApiRes | IErrorAPIRes | null) => {
                if (res && res.code === http.SUCCESS_CODE) {
                    const event = (res as IEventDetailsApiRes).result;
                    setState((prevState) => ({
                        ...prevState,
                        eventDetails: event,
                    }));
                }
            }),
        );
    };

    const handleFetchListEvents = async () => {
        dispatch(
            await fetchListEvent('', (res: IEventDataApiListRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    const data = (res as IEventDataApiListRes).result?.dataEvent;
                    const dataFilter = data?.filter((event) => event.status === enums.EventStatus.ACCEPTED && event._id !== id);
                    setState((prevState) => ({
                        ...prevState,
                        event: dataFilter,
                    }));
                }
            }),
        );
    };

    const handleFetchListComment = () => { };

    const handleFetchAddComment = () => {
        console.log(comment);
    };

    return (
        <div className="pages__eventdetail container">
            <div className="pages__eventdetail_headers">
                <div className="pages__eventdetail_headers_sideleft col-md-2">
                    <h4>{monthStart}</h4>
                    <h4>{dayStart}</h4>
                </div>
                <div className="pages__eventdetail_headers_sideright col-md-10">
                    <h2>{eventDetails?.name}</h2>
                    <div className="pages__eventdetail_headers_sideright_param">
                        <IoLocationOutline />
                        <p>
                            {eventDetails?.location}
                            <span className="pages__eventdetail_headers_sideright_param_separator">•</span>
                            {formattedDayStart}
                            <span className="pages__eventdetail_headers_sideright_param_separator">•</span>
                            {formattedDayEnd}
                        </p>
                    </div>
                </div>
            </div>
            <div className="pages__eventdetail_body">
                <div className="pages__eventdetail_body_sideleft col-md-8">
                    <button
                        className="pages__eventdetail_body_sideright_book"
                        onClick={() => {
                            if (eventDetails?.location === 'Location A') {
                                router.push(
                                    { pathname: routes.CLIENT.EVENT_DETAILS_PAGES_ORDER_TYPE1.href, query: { id: id} },
                                    undefined,
                                    { scroll: false },
                                );
                            } else if (eventDetails?.location === 'Location B') {
                                router.push(
                                    { pathname: routes.CLIENT.EVENT_DETAILS_PAGES_ORDER_TYPE2.href, query: { id: id } },
                                    undefined,
                                    { scroll: false },
                                );
                            } else if (eventDetails?.location === 'Location C' || eventDetails?.location === 'ANOTHER') {
                                router.push(
                                    { pathname: routes.CLIENT.EVENT_DETAILS_PAGES_ORDER_TYPE3.href, query: { id: id } },
                                    undefined,
                                    { scroll: false },
                                );
                            }
                        }}
                    >
                        Book now
                    </button>
                    <div className="pages__eventdetail_body_sideleft_image">
                        <Img src={eventDetails?.images as string} />
                    </div>
                    <div className="pages__eventdetail_body_sideleft_actions">
                        <button className="save-button">
                            <CiHeart /> Save
                        </button>
                        <button className="share-button">
                            <IoMdShare />
                            Share
                        </button>
                    </div>
                    <div className="pages__eventdetail_body_sideleft_description">
                        <h2>About This Event</h2>
                        <p>{eventDetails?.description}</p>
                        <p>{eventDetails?.description}</p>
                        <ul>
                            <li>Name: {eventDetails?.name}</li>
                            <li>Location: {eventDetails?.location}</li>
                            <li>Price: {eventDetails?.price}</li>
                            <li>Quantity: {eventDetails?.quantity}</li>
                            <li>Start Date: {eventDetails?.day_start}</li>
                            <li>End Date: {eventDetails?.day_end}</li>
                            {/* Thêm các thuộc tính khác bạn muốn in ra */}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div>
                    <h2>Leave a Comment</h2>
                    <Input className="" type="textarea" value={comment} onChange={(value: string) => handleOnChange('comment', value)} />
                </div>
                <div className="d-flex justify-content-end w-100">
                    <Button onClick={() => handleFetchAddComment()} buttonText="Send" background="#FF7E00" />
                </div>
            </div>
            <hr />

            <div className="p-3 d-flex gap-3 w-100 flex-column">
                {dataDumyCommentEvent.map((item, index) => (
                    <div key={index}>
                        <div className="pages__eventdetail_comment p-3">
                            <div className="pages__eventdetail_comment_infor">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="pages__eventdetail_comment_infor_user">
                                        <Img src={item?.avatar ?? ''} />
                                        <h4>{item?.userName}</h4>
                                    </div>
                                    <div className="pages__eventdetail_comment_time">
                                        {moment(item?.create_at ?? '').format('DD/MM/YYYY HH:mm')}
                                    </div>
                                </div>
                                <div className="pages__eventdetail_comment_infor_content">
                                    <p>{item?.content_comment}</p>
                                </div>
                            </div>
                            <div className="pages__eventdetail_comment_time d-flex justify-content-end">
                                <Button buttonText="Reply" startIcon="" onClick={() => handleReplyClick(item._id)} />
                            </div>

                            {replyId === item._id && (
                                <div className="reply-form pt-4">
                                    <Input type="textarea" placeholder="Enter your reply..." />
                                    <div className="d-flex justify-content-end pt-3">
                                        <Button
                                            buttonText="Submit"
                                            onClick={() => {
                                                /* Handle submit logic here */
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pages__eventdetail_relate">
                <h2>UpComing Events</h2>
                <div className="pages__eventdetail_relate_list">
                    {slicedEvents?.map((events) => (
                        <div
                            onClick={() =>
                                router.push({ pathname: routes.CLIENT.EVENT_DETAILS.href, query: { id: events._id } }, undefined, {
                                    scroll: false,
                                })
                            }
                            key={events?._id}
                            className="pages__eventdetail_relate_list_card"
                        >
                            <Img src={events?.images as string} />
                            <h3>{events?.name}</h3>
                            <div className="pages__eventdetail_relate_list_card_infor">
                                <p className="pages__eventdetail_relate_list_card_infor_price">{events?.price} $</p>
                                <p className="pages__eventdetail_relate_list_card_infor_date">{formattedDayEnd}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default EventDetailPage;
