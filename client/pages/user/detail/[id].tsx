import { IEventDetailPageState, IEventDetailPage, IEventDetailPageProps } from '@interfaces/pages/eventdetail';
import { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoLocationOutline } from 'react-icons/io5';
import { IoMdShare } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { MdOutlinePeople } from 'react-icons/md';
import { SlCalender } from 'react-icons/sl';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCreateComment,
    fetchDeleteComment,
    fetchDetailsEvent,
    fetchListComment,
    fetchListEvent,
    fetchListReplyComment,
    fetchReplyComment,
    fetchUpdateComment,
} from '@redux/actions/api';
import { enums, http, images, routes } from '@utils/constants';
import Countdown from '@components/commons/Countdown';
import moment from 'moment';
import { Button, Img, Input } from '@components/index';
import Validator from '@components/commons/Validator';
import { validateHelper } from '@utils/helpers';
import { setModal } from '@redux/actions';
import { ReduxStates } from '@redux/reducers';

const EventDetailPage: IEventDetailPage<IEventDetailPageProps> = () => {
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();
    const { profile } = useSelector((states: ReduxStates) => states);
    const [state, setState] = useState<IEventDetailPageState>({
        eventDetails: undefined,
        event: [],
        replyId: null,
        listComments: [],
        isValidate: true,
        listReplyComments: [],
    });
    const { eventDetails, event, comment, replyId, listComments, listReplyComments, replyCommemt } = state;

    const [quantity, setQuantity] = useState(0);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };
    const commentValidatorRef = createRef<IValidatorComponentHandle>();
    const replyCommentValidatorRef = createRef<IValidatorComponentHandle>();

    const totalMoney = quantity * (eventDetails?.price as any);
    const slicedEvents = event?.slice(0, 4);
    const formattedDayStart = moment(eventDetails?.day_start).format('MMM DD, YYYY HH:mm:ss');
    const formattedDayEnd = moment(eventDetails?.day_end).format('MMM DD, YYYY HH:mm:ss');
    const formattedDayEvent = moment(eventDetails?.day_event).format('MMM DD, YYYY HH:mm:ss');
    const dayStart = moment(formattedDayEvent).format('DD');
    const monthStart = moment(formattedDayEvent).format('MMM');

    useEffect(() => {
        handleDetialsEvent();
        handleFetchListEvents();
        handleFetchListComment();
    }, []);

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
        }));
    }, []);

    useEffect(() => {
        if (replyId) {
            handleFetchListReplyComments(replyId);
        }
    }, [replyId]);

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
            handleFetchListReplyComments(id);
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

    const handleFetchListComment = async () => {
        dispatch(
            await fetchListComment(id?.toString() ?? '', (res: ICommentListDataAPIRes | IErrorAPIRes | null) => {
                if (res?.code === http.SUCCESS_CODE) {
                    const data = (res as ICommentListDataAPIRes).result;
                    const dataCommentFilter = data?.filter((comment) => comment.parentComment === null);
                    setState((prevState) => ({
                        ...prevState,
                        listComments: dataCommentFilter,
                    }));
                }
            }),
        );
    };

    const handleDeleteComment = async (idComment: string) => {
        dispatch(
            await fetchDeleteComment(idComment, (res: ICommentDataAPIRes | IErrorAPIRes | null) => {
                if (res && res.code === http.SUCCESS_CODE) {
                    console.log(res);
                    handleFetchListComment();
                    handleFetchListReplyComments(idComment);
                    dispatch(
                        setModal({
                            isShow: false,
                        }),
                    );
                }
            }),
        );
    };

    const handleFetchUpdateComment = async (idComment: string) => {
        let validate = state.isValidate;

        const validator = [{ ref: commentValidatorRef, value: comment, message: 'Enter your comment' }];

        validator.forEach(({ ref, value, message }) => {
            ref.current?.onValidateMessage('');
            if (validateHelper.isEmpty(String(value ?? ''))) {
                ref.current?.onValidateMessage(message);
                validate = false;
            }
        });

        if (validate) {
            dispatch(
                await fetchUpdateComment(id?.toString() ?? idComment, { comment }, (res: ICommentDataAPIRes | IErrorAPIRes | null) => {
                    if (res?.code === http.SUCCESS_CODE) {
                        setState((prevState) => ({
                            ...prevState,
                            comment: '',
                        }));
                        handleFetchListComment();
                    } else {
                        setModal({
                            isShow: true,
                            content: (
                                <>
                                    <div className="text-center bases__margin--bottom31">
                                        <Img src={images.ICON_TIMES} className="bases__width--90 bases__height--75" />
                                    </div>
                                    <div className="bases__text--bold bases__font--14 text-center">Error while you add new comment!!!</div>
                                </>
                            ),
                        });
                    }
                }),
            );
        }
    };

    const hanldeEditcomment = (id: string) => {
        dispatch(
            setModal({
                isShow: true,
                content: (
                    <>
                        <div className="bases__text--bold bases__font--14 text-center">Do you want to edit this comment !!</div>
                    </>
                ),
                button: (
                    <div className="d-flex gap-1 flex-row">
                        <Button startIcon={images.ICON_DELETE} background="red" onClick={() => hanldeDeleteComments(id)} />
                        <Button buttonText="Update" background="green" onClick={() => handleFetchUpdateComment(id)} />
                    </div>
                ),
            }),
        );
    };

    const hanldeDeleteComments = (id: string) => {
        dispatch(
            setModal({
                isShow: true,
                content: (
                    <>
                        <div className="text-center bases__margin--bottom31">
                            <Img src={images.ICON_TIMES} className="bases__width--90 bases__height--75" />
                        </div>
                        <div className="bases__text--bold bases__font--14 text-center">Do you want to delete this comment !!</div>
                    </>
                ),
                button: (
                    <>
                        <Button buttonText="OK" background="red" onClick={() => handleDeleteComment(id)} />
                    </>
                ),
            }),
        );
    };

    const handleFetchListReplyComments = async (idComment: string) => {
        dispatch(
            await fetchListReplyComment(id?.toString() ?? '', idComment, (res: ICommentListDataAPIRes | IErrorAPIRes | null) => {
                if (res?.code === http.SUCCESS_CODE) {
                    const data = (res as ICommentListDataAPIRes).result;
                    setState((prevState) => ({
                        ...prevState,
                        listReplyComments: data,
                    }));
                }
            }),
        );
    };

    const handleFetchAddComment = async () => {
        let validate = state.isValidate;

        const validator = [{ ref: commentValidatorRef, value: comment, message: 'Enter your comment' }];

        validator.forEach(({ ref, value, message }) => {
            ref.current?.onValidateMessage('');
            if (validateHelper.isEmpty(String(value ?? ''))) {
                ref.current?.onValidateMessage(message);
                validate = false;
            }
        });

        if (validate) {
            dispatch(
                await fetchCreateComment(id?.toString() ?? '', { comment }, (res: ICommentDataAPIRes | IErrorAPIRes | null) => {
                    if (res?.code === http.SUCCESS_CODE) {
                        setState((prevState) => ({
                            ...prevState,
                            comment: '',
                        }));
                        handleFetchListComment();
                    } else {
                        setModal({
                            isShow: true,
                            content: (
                                <>
                                    <div className="text-center bases__margin--bottom31">
                                        <Img src={images.ICON_TIMES} className="bases__width--90 bases__height--75" />
                                    </div>
                                    <div className="bases__text--bold bases__font--14 text-center">Error while you add new comment!!!</div>
                                </>
                            ),
                        });
                    }
                }),
            );
        }
    };

    const handleFetchReplyComment = async (idComment: string) => {
        let validate = state.isValidate;

        const validator = [{ ref: replyCommentValidatorRef, value: replyCommemt, message: 'Enter your comment' }];

        validator.forEach(({ ref, value, message }) => {
            ref.current?.onValidateMessage('');
            if (validateHelper.isEmpty(String(value ?? ''))) {
                ref.current?.onValidateMessage(message);
                validate = false;
            }
        });

        if (validate) {
            dispatch(
                await fetchReplyComment(
                    id?.toString() ?? '',
                    idComment ?? '',
                    { replyCommemt },
                    (res: ICommentDataAPIRes | IErrorAPIRes | null) => {
                        if (res?.code === http.SUCCESS_CODE) {
                            setState((prevState) => ({
                                ...prevState,
                                replyCommemt: '',
                            }));
                            handleFetchListReplyComments(idComment);
                        } else {
                            setModal({
                                isShow: true,
                                content: (
                                    <>
                                        <div className="text-center bases__margin--bottom31">
                                            <Img src={images.ICON_TIMES} className="bases__width--90 bases__height--75" />
                                        </div>
                                        <div className="bases__text--bold bases__font--14 text-center">
                                            Error while you add new comment!!!
                                        </div>
                                    </>
                                ),
                            });
                        }
                    },
                ),
            );
        }
    };

    return (
        <div className="pages__eventdetail container">
            <div className="pages__eventdetail_headers">
                <div className="pages__eventdetail_headers-container">
                    <div className="pages__eventdetail_headers-content">
                        <div className="pages__eventdetail_headers-details">
                            <h1>{eventDetails?.name}</h1>
                            <p className="pages__eventdetail_headers-time">📅{eventDetails?.day_event &&
                                new Intl.DateTimeFormat('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                    timeZone: 'UTC',
                                }).format(new Date(eventDetails.day_event))}</p>
                            <p className="pages__eventdetail_headers-location">📍{eventDetails?.location}</p>
                            <div className="pages__eventdetail_headers-line-separator"></div>
                            <div className="pages__eventdetail_headers-ticket-price">
                                <span>From: {Math.min(...(eventDetails?.price ?? []))} đ</span>
                                <button
                                    className="pages__eventdetail_headers-book-now"
                                    onClick={() => {
                                        if (eventDetails?.location === 'Location A') {
                                            router.push(
                                                { pathname: routes.CLIENT.EVENT_DETAILS_PAGES_ORDER_TYPE1.href, query: { id: id } },
                                                undefined,
                                                { scroll: false },
                                            );
                                        } else if (eventDetails?.location === 'Location B') {
                                            router.push(
                                                { pathname: routes.CLIENT.EVENT_DETAILS_PAGES_ORDER_TYPE2.href, query: { id: id } },
                                                undefined,
                                                { scroll: false },
                                            );
                                        } else if (eventDetails?.location === 'Location C') {
                                            router.push(
                                                { pathname: routes.CLIENT.EVENT_DETAILS_PAGES_ORDER_TYPE3.href, query: { id: id } },
                                                undefined,
                                                { scroll: false },
                                            );
                                        } else if (eventDetails?.location === 'ANOTHER') {
                                            router.push(
                                                { pathname: routes.CLIENT.EVENT_DETAILS_PAGES_ORDER_ANOTHER.href, query: { id: id } },
                                                undefined,
                                                { scroll: false },
                                            );
                                        }

                                    }}
                                >
                                    Book now
                                </button>
                            </div>
                        </div>

                        <div className="pages__eventdetail_headers-image">
                            <Img src={eventDetails?.images as string} />                        </div>
                    </div>
                </div>
            </div>
            <div className="pages__eventdetail_body">
                <div className="pages__eventdetail_body_sideleft col-md-8">
                    <div className="pages__eventdetail_body_sideleft_description">
                        <h2>About This Event</h2>
                        <p>{eventDetails?.description}</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div>
                    <h2>Comment</h2>
                    <Validator ref={commentValidatorRef}>
                        <Input
                            className=""
                            type="textarea"
                            value={comment ?? ''}
                            onChange={(value: string) => handleOnChange('comment', value)}
                        />
                    </Validator>
                </div>
                <div className="d-flex justify-content-end w-100">
                    <Button onClick={() => handleFetchAddComment()} buttonText="Send" background="#FF7E00" />
                </div>
            </div>
            <hr />

            <div className="p-3 d-flex gap-3 w-100 flex-column">
                {listComments?.map((item, index) => (
                    <div key={index}>
                        <div className="pages__eventdetail_comment p-3">
                            {item.isDeleted ? (
                                <div>{item.comment}</div>
                            ) : (
                                <div className="pages__eventdetail_comment_infor">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="pages__eventdetail_comment_infor_user">
                                            <Img src={(item?.userId?.images as '') || images.ICON_USER} />
                                            <h4>{item?.userId?.username}</h4>
                                        </div>
                                        <div className="pages__eventdetail_comment_time bases__width26 text-end">
                                            {moment(item?.createdAt ?? '').format('DD/MM/YYYY HH:mm')}
                                        </div>
                                    </div>
                                    <div className="pages__eventdetail_comment_infor_content">
                                        <p>{item?.comment}</p>
                                    </div>
                                </div>
                            )}
                            <div className="pages__eventdetail_comment_time d-flex justify-content-end flex-row gap-1">
                                <Button buttonText="Reply" startIcon="" onClick={() => handleReplyClick(item?._id ?? '')} />
                                {item?.userId?._id === profile?._id && (
                                    <Button buttonText="Edit" startIcon="" onClick={() => hanldeEditcomment(item?._id ?? '')} />
                                )}
                            </div>

                            {replyId === item._id && (
                                <div className="reply-form pt-4">
                                    <Validator ref={replyCommentValidatorRef}>
                                        <Input
                                            type="textarea"
                                            value={replyCommemt ?? ''}
                                            onChange={(value: string) => handleOnChange('replyCommemt', value)}
                                            placeholder="Enter your reply..."
                                        />
                                    </Validator>
                                    <div className="d-flex justify-content-end pt-3">
                                        <Button buttonText="Send" onClick={() => handleFetchReplyComment(item._id ?? '')} />
                                    </div>
                                </div>
                            )}

                            {replyId === item._id && (
                                <div className="reply-list pt-3 pl-3">
                                    {listReplyComments?.map((reply, replyIndex) => (
                                        <div key={replyIndex} className="reply-comment p-2 border-top bases__margin--left90">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="pages__eventdetail_comment_infor_user">
                                                    <Img src={(reply?.userId?.images as '') || images.ICON_USER} />
                                                    <h5>{reply?.userId?.username}</h5>
                                                </div>
                                                <div className="reply-comment-time bases__width26 text-end">
                                                    {moment(reply?.createdAt ?? '').format('DD/MM/YYYY HH:mm')}
                                                </div>
                                            </div>
                                            <div className="reply-comment-content">
                                                <p>{reply?.comment}</p>
                                            </div>

                                            <div className="d-flex justify-content-end">
                                                {reply?.userId?._id === profile?._id && (
                                                    <Button
                                                        buttonText="Edit"
                                                        startIcon=""
                                                        onClick={() => hanldeEditcomment(reply?._id ?? '')}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
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
                                <p className="pages__eventdetail_relate_list_card_infor_date">{formattedDayEvent}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default EventDetailPage;
