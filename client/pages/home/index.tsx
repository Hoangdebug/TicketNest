import { IHomePageProps, IHomePage, IHomePageState } from '@interfaces/pages/home';
import NavBar from '@components/layouts/NavBar';
import { enums, http, images, routes } from '@utils/constants';
import { EventList } from '@components/index';
import Tabs from '@components/commons/Tab';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReduxStates } from '@redux/reducers';
import { fetchListEvent } from '@redux/actions/api';

const HomePage: IHomePage<IHomePageProps> = () => {
    const { profile } = useSelector((states: ReduxStates) => states);
    const router = useRouter();
    const dispatch = useDispatch();
    const [state, setState] = useState<IHomePageState>({
        event: [],
    });

    const { event } = state;

    useEffect(() => {
        if (profile?.type === enums.TYPES.ADMIN || profile?.type === enums.TYPES.ORGANIZER) {
            router.push(routes.CLIENT.ERROR403_PAGE.href, undefined, { scroll: false });
        }
    }, [profile, router]);

    useEffect(() => {
        handleFetchListEvents();
    }, []);

    const handleFetchListEvents = async () => {
        dispatch(
            await fetchListEvent('', (res: IEventDataApiListRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    const data = (res as IEventDataApiListRes).result?.dataEvent;
                    const dataFilter = data?.filter((event) => event.status === enums.EventStatus.ACCEPTED);
                    setState((prevState) => ({
                        ...prevState,
                        event: dataFilter,
                    }));
                }
            }),
        );
    };

    const stepData = (type: 'step1' | 'step2' | 'step3' | 'step4') => {
        switch (type) {
            case 'step1':
                return (
                    <div className="pt-5">
                        Search and Select an Event easily in minutes.
                        <div className="row pt-5">
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Use the search tool</h3>
                                <p className="text-wrap">
                                    Utilize the search bar to enter keywords or the name of the event you wish to attend.
                                </p>
                            </div>
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Apply search filters</h3>
                                <p className="text-wrap">
                                    Use available filters (e.g., date, location, event type) to narrow down the list of events that match
                                    your preferences.
                                </p>
                            </div>
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Review event details</h3>
                                <p className="text-wrap">
                                    Click on each event to view specific information, select the event you want to attend and proceed with
                                    ticket purchase.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'step2':
                return (
                    <div className="pt-5">
                        Choose Tickets and Enter Personal Information easily in minutes.
                        <div className="row pt-5">
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Select tickets</h3>
                                <p className="text-wrap">Choose the type and quantity of tickets you wish to purchase.</p>
                            </div>
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Enter personal information</h3>
                                <p className="text-wrap">
                                    Provide details such as name, email address, and phone number to complete the transaction.
                                </p>
                            </div>
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Confirm your selection</h3>
                                <p className="text-wrap">
                                    Review your chosen tickets and personal information to ensure accuracy before completing the
                                    transaction.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'step3':
                return (
                    <div className="pt-5">
                        Confirm Information and Payment easily in minutes.
                        <div className="row pt-5">
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Review information</h3>
                                <p className="text-wrap">Double-check selected tickets and personal details for accuracy.</p>
                            </div>
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Select payment method</h3>
                                <p className="text-wrap">Choose your preferred payment method (credit card).</p>
                            </div>
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Enter payment details</h3>
                                <p className="text-wrap">Provide required payment information according to your chosen method.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'step4':
                return (
                    <div className="pt-5">
                        Complete Payment and Receive Tickets
                        <div className="row pt-5">
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Complete payment </h3>
                                <p className="text-wrap">Click "Pay" to finalize your ticket purchase.</p>
                            </div>
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Receive tickets</h3>
                                <p className="text-wrap">
                                    You will receive electronic tickets via email immediately upon successful payment.
                                </p>
                            </div>
                            <div className="col-md-4 px-2">
                                <h3 className="fw-bold">Check tickets</h3>
                                <p className="text-wrap">Verify the ticket details and keep them for use at the event.</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const titleTabs = (type: 'step1' | 'step2' | 'step3' | 'step4') => {
        switch (type) {
            case 'step1':
                return (
                    <div className="d-flex flex-column pages__home-title">
                        <h3>Step 1</h3>
                        <h4>
                            Search and Select <br /> an Event
                        </h4>
                    </div>
                );
            case 'step2':
                return (
                    <div className="d-flex flex-column pages__home-title">
                        <h3>Step 2</h3>
                        <h4>Select Tickets and Input Personal Details</h4>
                    </div>
                );
            case 'step3':
                return (
                    <div className="d-flex flex-column pages__home-title">
                        <h3>Step 3</h3>
                        <h4>Confirm Information and Payment</h4>
                    </div>
                );
            case 'step4':
                return (
                    <div className="d-flex flex-column pages__home-title">
                        <h3>Step 4</h3>
                        <h4>Complete Payment and Receive Tickets</h4>
                    </div>
                );
            default:
                return (
                    <div className="d-flex flex-column pages__home-title">
                        <h3>Step 1</h3>
                        <h4>Create Your Event</h4>
                    </div>
                );
        }
    };
    const dataSwiper = [
        {
            title: 'Sai Gon Opera House',
            // prams: 'One of the largest theaters in the city, renowned for its excellent sound and lighting',
            prams: 'In Ho Chi Minh City, Vietnam.',
            img: images.SG_HOUSE,
        },
        {
            title: 'My Dinh Stadium',
            prams: 'In Ha Noi Capital, Vietnam.',
            // prams: 'A venue for major sports events with a capacity of up to 50,000 attendees.',
            img: images.MY_DINH,
        },
        {
            title: 'Hanoi Opera House',
            prams: 'In Ha Noi Capital, Vietnam.',
            // prams: 'A modern venue with advanced sound, lighting, and stage systems, perfect for acoustic music.',
            img: images.HN_HOUSE,
        },
        {
            title: 'May Lang Thang Café',
            prams: 'In Da Lat City, Viet Nam.',
            // prams: 'A cozy cafe with an artistic atmosphere, perfect for acoustic music and intimate gatherings.',
            img: images.DA_LAT,
        },
        {
            title: 'Sun World Danang Wonders',
            prams: 'In Da Nang City, Viet Nam.',
            // prams: "Discover the world's hidden gems",
            img: images.DA_NANG,
        },
    ];
    return (
        <div className="pages__home">
            <div className="pb-5">
                <NavBar />
            </div>
            <div className="py-5">
                <EventList dataEvent={event} />
            </div>
            <div className="pages__home--host py-5 bases__background--white d-flex flex-column">
                <div className="p-5">
                    <h3 className="bases__font--40 fw-bolder">Venue for Exciting Events with TicketNest</h3>
                    <p className="m-0 bases__font--20 text-wrap">
                        We are proud to introduce to you classy locations with modern facilities, convenient locations and professional
                        services. Each location is carefully selected to ensure you and your audience have the best experiences. Let's
                        explore and choose the perfect location for your upcoming event!
                    </p>
                </div>
                <div className="p-5 pages__home--silder">
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{
                            delay: 5500,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            '@0.00': {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                            '@0.75': {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            '@1.00': {
                                slidesPerView: 3,
                                spaceBetween: 40,
                            },
                            '@1.50': {
                                slidesPerView: 4,
                                spaceBetween: 50,
                            },
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {dataSwiper?.map((data, index) => (
                            <SwiperSlide style={{ minHeight: '300px' }} key={index}>
                                <div className="col-md-12 pages__home--silder-item p-5">
                                    <img src={data?.img} alt={data?.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                    <h2 className="fw-bold fs-4">{data.title}</h2>
                                    <p className="m-0">{data?.prams}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <div className="py-5 pages__home--step">
                <div className="p-5 ">
                    <h2 className="fw-bolder">Booking Tickets and Making Direct Payment in 4 Easy Steps</h2>
                    <p className="m-0 bases__font--20 text-wrap">
                        Our platform offers you a simple and convenient event ticket booking experience online. With just a few easy steps,
                        you can effortlessly select and purchase tickets for your favorite events.
                    </p>
                </div>
                <div className="p-5">
                    <Tabs
                        type="material"
                        defaultActiveKey="step1"
                        tabs={[
                            {
                                title: titleTabs('step1'),
                                event: 'step1',
                                content: stepData('step1'),
                            },
                            {
                                title: titleTabs('step2'),
                                event: 'step2',
                                content: stepData('step2'),
                            },
                            {
                                title: titleTabs('step3'),
                                event: 'step3',
                                content: stepData('step3'),
                            },
                            {
                                title: titleTabs('step4'),
                                event: 'step4',
                                content: stepData('step4'),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
