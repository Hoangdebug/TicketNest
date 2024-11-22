import { fetchGetCurrentAccount, fetchLogout } from '@redux/actions/api';
import { images, routes } from '@utils/constants';
import { authHelper, stringHelper } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DehazeIcon from '@mui/icons-material/Dehaze';
import CloseIcon from '@mui/icons-material/Close';
import { ReduxStates } from '@redux/reducers';
import Link from 'next/link';

const Header: IHeaderComponent<IHeaderComponentProps> = (props) => {
    const { isShow } = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const { profile } = useSelector((states: ReduxStates) => states);

    const [state, setState] = useState<IHeaderComponentState>({
        isOpen: false,
        isActive: routes.CLIENT.HOME_PAGE.href,
    });

    const { isOpen } = state;

    const getLoginTitle = () => {
        if (authHelper.isAuth()) {
            return stringHelper.limitText(profile?.username ?? '', 3) || 'User';
        } else {
            return 'Login';
        }
    };

    useEffect(() => {
        if (authHelper.isAuth()) {
            const memberProfile = async () => {
                dispatch(await fetchGetCurrentAccount());
            };
            memberProfile();
        }
    }, [dispatch, authHelper.isAuth()]);

    const handleOpen = () => {
        setState((prevState) => ({
            ...prevState,
            isOpen: !isOpen,
        }));
    };

    const handleLogout = () => {
        dispatch(fetchLogout());
        router.push(routes.CLIENT.LOGIN_PAGE.href, undefined, { scroll: false });
    };
    const data = [
        {
            title: 'Home',
            href: routes.CLIENT.HOME_PAGE.href,
            class: 'position-relative hover-link',
        },
        {
            title: 'About',
            href: routes.CLIENT.ABOUT_PAGE.href,
            class: 'position-relative hover-link',
        },
        {
            title: 'Contact',
            href: routes.CLIENT.CONTACT_PAGE.href,
            class: 'position-relative hover-link',
        },
    ];

    if (isShow) {
        return (
            <div className="components__header container-fluid d-flex justify-content-around pt-3 align-items-center">
                <div className="">
                    <img src={images.LOGO_HOME} />
                </div>
                <div className="components__header-item">
                    <ul className={`d-flex ${isOpen ? 'active' : ''}`} style={{ gap: '40px' }} onClick={handleOpen}>
                        {data?.map((link, index) => (
                            <li className="text-white bases__font--18 bases__header-link bases__width30" key={index}>
                                <a className={`${link.class} ${router.pathname === link.href ? 'active' : ''}`} href={link.href ?? '#'}>
                                    {link.title}
                                </a>
                            </li>
                        ))}
                        <li className="text-white bases__font--18 bases__header-link bases__width30">
                            <div className="dropdown">
                                <a
                                    onClick={() => (authHelper.isAuth() ? handleLogout : null)}
                                    className={`${'position-relative hover-link '} ${
                                        router.pathname === (authHelper.isAuth() ? null : routes.CLIENT.LOGIN_PAGE.href) ? 'active' : ''
                                    }`}
                                    href={(authHelper.isAuth() ? null : routes.CLIENT.LOGIN_PAGE.href) ?? '#'}
                                >
                                    {getLoginTitle()}
                                </a>
                                {authHelper.isAuth() && (
                                    <div className="dropdown-content">
                                        <Link href={routes.CLIENT.EDIT_PROFILE_PAGE.href}>Edit Profile</Link>
                                        <Link href={routes.CLIENT.REQUEST_ORGNIZE_PAGE.href}>Request organizer</Link>
                                        <Link href={routes.CLIENT.TICKET_BOOKING_HISTORY.href}>Ticket Booking History</Link>
                                        <Link href={routes.CLIENT.LIST_FAVOURITE_EVENT_PAGE.href}>List Event Favourite</Link>
                                        <a onClick={handleLogout} style={{ fontSize: '15px', cursor: 'pointer' }}>
                                            Log out
                                        </a>
                                    </div>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="mobile" className="components__header-mobile mb-2" onClick={handleOpen}>
                    {isOpen ? <CloseIcon sx={{ cursor: 'pointer' }} /> : <DehazeIcon sx={{ cursor: 'pointer' }} />}
                </div>
            </div>
        );
    }
    return <></>;
};

Header.defaultProps = {
    isShow: true,
};
export default Header;
