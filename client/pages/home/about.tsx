import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { IAboutPageProps, IAboutPage } from '@interfaces/pages/about';
import { authHelper } from '@utils/helpers';
import { images, routes } from '@utils/constants';
import Tabs from '@components/commons/Tab';

const AboutPage: IAboutPage<IAboutPageProps> = () => {
    const router = useRouter();

    useEffect(() => {
        if (authHelper.accessToken()) {
            const currentPath = router.pathname;
            if (currentPath === routes.CLIENT.LOGIN_PAGE.href || currentPath === routes.CLIENT.REGISTER_PAGE.href) {
                router.push(routes.CLIENT.HOME_PAGE.href);
            }
        } else {
            router.push(routes.CLIENT.LOGIN_PAGE.href);
        }
    }, [router]);

    const stepData = (type: 'step1' | 'step2' | 'step3' | 'step4' | 'step5') => {
        switch (type) {
            case 'step1':
                return (
                    <div className="pt-4">
                        <div className="row ">
                            <div className=" p-2">
                                <h4 className="fw-bold">Flexible Design</h4>
                                <p className="text-wrap">
                                    Our event page is designed to be responsive and user-friendly, allowing customers to book tickets from
                                    any device.
                                </p>
                            </div>
                            <div className=" p-2">
                                <h4 className="fw-bold">Support for Various Event Types</h4>
                                <p className="text-wrap">
                                    Our platform supports a variety of events, from performances to sports and entertainment events,
                                    catering to all your needs.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Program Schedule</h4>
                                <p className="text-wrap">
                                    Provides information about the event schedule, including activities, speakers, performers, and other
                                    planned content.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Visual Content</h4>
                                <p className="text-wrap">
                                    The page can feature multimedia like images, videos, or promotional graphics related to the event,
                                    highlighting its atmosphere and overall appeal to attract potential attendees.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'step2':
                return (
                    <div className="pt-4">
                        <div className="row ">
                            <div className="p-2">
                                <h4 className="fw-bold">Single Ticket</h4>
                                <p className="text-wrap">
                                    Offer standard tickets at a fixed price to all event participants. You have complete control over
                                    setting limits on ticket availability.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Multiple Ticket Types</h4>
                                <p className="text-wrap">
                                    Utilize a versatile pricing system for various ticket categories, including discounts and VIP options
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Seat Selection</h4>
                                <p className="text-wrap">Allow attendees to choose their seats for a personalized event experience.</p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Enhanced Features</h4>
                                <p className="text-wrap">Optimize ticketing with detailed information and tailored promotions.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'step3':
                return (
                    <div className="pt-4">
                        <div className="row ">
                            <div className="p-2">
                                <h4 className="fw-bold">Receive Alerts</h4>
                                <p className="text-wrap">
                                    Get notified about event updates, ticket availability, and special offers via email notifications.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Manage Bookings</h4>
                                <p className="text-wrap">Access their booking history, view upcoming events, and make changes.</p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Access Support</h4>
                                <p className="text-wrap">
                                    Reach out to customer support for assistance with ticketing inquiries or issues.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Secure Payment Methods</h4>
                                <p className="text-wrap">
                                    TicketNest uses payment gateways with comprehensive data protection policies to ensure the security of
                                    your earnings. Additionally, we offer flexible payment methods for a smooth payment experience.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'step4':
                return (
                    <div className="pt-4">
                        <div className="row">
                            <div className="p-2">
                                <h4 className="fw-bold">User Tracking</h4>
                                <p className="text-wrap">
                                    View detailed information about customers and event attendees, including registration details and ticket
                                    purchase history.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Revenue Analytics</h4>
                                <p className="text-wrap">
                                    Track and analyze revenue generated from ticket sales, including total sales, revenue per event, and net
                                    income after deducting expenses.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Organizer Statistics</h4>
                                <p className="text-wrap">Statistics related to the number of organizers involved in events</p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Statistics on Organizers</h4>
                                <p className="text-wrap">
                                    Both administrators and organizers can access data regarding the number of organizers involved in
                                    events, their participation frequency, and the types of events they manage.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'step5':
                return (
                    <div className="pt-4">
                        <div className="row ">
                            <div className="p-2">
                                <h4 className="fw-bold">Scanner App</h4>
                                <p className="text-wrap">
                                    Use the scanning app to check in guests with valid tickets and cross-reference them with your guest
                                    list.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Event Creation and Customization</h4>
                                <p className="text-wrap">
                                    Easily create and customize events with options for ticket types, pricing, and seating arrangements.
                                </p>
                            </div>
                            <div className=" p-2">
                                <h4 className="fw-bold ">Promotional Tools</h4>
                                <p className="text-wrap">
                                    Utilize built-in tools for marketing campaigns, including discount codes, promotional offers, and email
                                    campaigns.
                                </p>
                            </div>
                            <div className="p-2">
                                <h4 className="fw-bold">Integration and Compatibility</h4>
                                <p className="text-wrap">
                                    Seamlessly integrate with other platforms and services, such as payment gateways and social media
                                    channels, for enhanced functionality.
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const titleTabs = (type: 'step1' | 'step2' | 'step3' | 'step4' | 'step5') => {
        switch (type) {
            case 'step1':
                return (
                    <div className="d-flex flex-column pages__about-title">
                        <h3>Step 1</h3>
                        <h4>Event Page</h4>
                    </div>
                );
            case 'step2':
                return (
                    <div className="d-flex flex-column pages__about-title">
                        <h3>Step 2</h3>
                        <h4>Ticket</h4>
                    </div>
                );
            case 'step3':
                return (
                    <div className="d-flex flex-column pages__about-title">
                        <h3>Step 3</h3>
                        <h4>Audiences</h4>
                    </div>
                );
            case 'step4':
                return (
                    <div className="d-flex flex-column pages__about-title">
                        <h3>Step 4</h3>
                        <h4>Statistical</h4>
                    </div>
                );
            case 'step5':
                return (
                    <div className="d-flex flex-column pages__about-title">
                        <h3>Step 5</h3>
                        <h4>Management</h4>
                    </div>
                );
            default:
                return (
                    <div className="d-flex flex-column pages__about-title">
                        <h3>Step 1</h3>
                        <h4>Create Your Event</h4>
                    </div>
                );
        }
    };
    const dataSwiper = [
        {
            prams: 'We partner with industry leaders and community organizations across Viet Nam to empower event organizers for effortless success. While organizing events can be challenging, we ensure that selling tickets online is seamless and straightforward.',
            img: images.ABOUT1,
        },
        {
            prams: 'We offer a simple, convenient, and secure ticket buying experience. Ticket Nest connects you to exciting events with advanced technology and dedicated service, making it easy to find and purchase tickets for your favorite cultural, entertainment, and sports events.',

            img: images.ABOUT2,
        },
        {
            prams: 'We work closely with event organizers to provide you with the latest and most accurate event information. Through our strong partnerships, we offer official tickets, exclusive deals, and early access to popular events, ensuring you can access the best events confidently and conveniently.',

            img: images.ABOUT3,
        },
    ];
    return (
        <div className="pages__about">
            <div className="pages__about-background">
                <img src={images.BG_ABOUT} style={{ width: '100%', height: '100%' }} />
            </div>

            <div className="pages__about-content">
                <h1 className="pages__about-content-aim">
                    Our goal is to provide a powerful and affordable event ticketing platform that can handle any type of ticket for events
                    of any size and complexity, without any obstacles.
                </h1>

                <p className="pages__about-content-essay py-2">
                    TicketNest's online event ticketing software is built on the idea that anyone, anywhere in Vietnam who wants to organize
                    and sell tickets for their event should have the tools to easily do so. We promote this idea every day through the
                    dedication of a team of students at FPT University in Da Nang.
                </p>

                <p className="pages__about-content-essay">
                    The focus of our efforts is on event ticket sellers, who always strive to ensure that music lovers and enthusiasts in
                    other fields can easily and conveniently book tickets online. At the same time, we support event organizers in promoting
                    and selling tickets more effectively, helping them focus on creating memorable experiences for the audience.
                </p>
            </div>

            <div className="pages__about-intro">
                <h1>We enrich community experiences through events​ </h1>

                <div className=" pages__about-intro-silder">
                    <div className="row">
                        {dataSwiper?.map((data, index) => (
                            <div className="col-md-3 pages__about-intro-silder-item p-2" key={index}>
                                <img className="img-fluid" src={data?.img} />
                                <p className="m-0">{data?.prams}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className=" pages__about-step">
                <div className="pages__about-step-content ">
                    <h2 className="fw-bolder">The Comprehensive Event Ticketing Platform with many Useful Features</h2>
                    <p className="m-0 bases__font--16.5 ">
                        TicketNest allows you to create and sell tickets for your events, manage all related data such as ticket revenue,
                        attendee information, reporting, and many other features. This is the perfect platform to help you efficiently
                        manage your events.
                    </p>
                </div>
                <div className="pages__about-step-tab">
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
                            {
                                title: titleTabs('step5'),
                                event: 'step5',
                                content: stepData('step5'),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
