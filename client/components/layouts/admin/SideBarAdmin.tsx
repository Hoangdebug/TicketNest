import { enums, images, routes } from '@utils/constants';
import Toggle from '../Toggle';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStates } from '@redux/reducers';
import Img from '@components/commons/Img';
import { useRouter } from 'next/router';
import { fetchLogout } from '@redux/actions/api';
import Button from '@components/commons/Button';
import React from 'react';

const AdminSidebarComponents: IAdminSideBarComponents<IAdminSideBarComponentsProps> = () => {
    const dispatch = useDispatch();
    const { sidebar, profile } = useSelector((states: ReduxStates) => states);
    const router = useRouter();
    const { pathname } = router;
    const userType = profile?.type;

    const sidebarAdminItem = [
        {
            title: 'Dashboard',
            href: routes.CLIENT.ADMIN_PAGE.href,
            icon: images.ICON_DASBOARD,
            options: [],
        },
        ...(userType === enums.TYPES.ADMIN
            ? [
                  {
                      title: 'Event',
                      href: routes.CLIENT.ADMIN_MANAGER_EVENT_PAGE.href,
                      icon: images.ICON_EVENT,
                      options: [],
                  },
                  {
                      title: 'User',
                      icon: images.ICON_USER,
                      options: [
                          {
                              title: 'Customer List',
                              href: routes.CLIENT.ADMIN_LIST_CUSTOMER_PAGE.href,
                          },
                          {
                              title: 'Request Organizer',
                              href: routes.CLIENT.ADMIN_LIST_CUSTOMER_REQUEST_PAGE.href,
                          },
                          {
                              title: 'Banned User',
                              href: routes.CLIENT.ADMIN_LIST_CUSTOMER_BAN_PAGE.href,
                          },
                          {
                              title: 'Order List',
                              href: routes.CLIENT.ORDER_ADMIN_MANAGER.href,
                          },
                      ],
                  },
              ]
            : []),
        ...(userType === enums.TYPES.ORGANIZER
            ? [
                  {
                      title: 'Event Manager',
                      icon: images.ICON_DASBOARD,
                      options: [
                          {
                              title: 'Events',
                              href: routes.CLIENT.ORGANIZER_LIST_EVENT.href,
                          },
                          {
                              title: 'Add Event',
                              href: routes.CLIENT.ADD_EVENT_PAGE.href,
                          },
                      ],
                  },
              ]
            : []),
    ];

    const handleGoToHome = () => {
        if (pathname !== routes.CLIENT.ADMIN_PAGE.href) {
            router.push(routes.CLIENT.ADMIN_PAGE.href, undefined, { scroll: false });
        }
    };

    const handleLogout = () => {
        dispatch(fetchLogout());
        router.push(routes.CLIENT.LOGIN_PAGE.href, undefined, { scroll: false });
    };

    return (
        <>
            <nav className={`components__sidebar ${sidebar.isSidebarShow ? 'active' : ''}`}>
                <div className="">
                    <div className="components__sidebar-heading d-flex justify-content-center">
                        <a className="bases__p--cursor" onClick={handleGoToHome}>
                            <Img
                                className="bases__margin--top12 components__sidebar-logo bases__width60 bases__margin--left40"
                                src={images.ICON_LOGO_ADMIN}
                            />
                        </a>
                    </div>
                    {Object.keys(profile).length ? <Toggle viewMode="admin" data={sidebarAdminItem} /> : <></>}
                </div>
                <hr />
                <div className="d-flex justify-content-center flex-row w-100">
                    <Button background="black" buttonText="Log Out" onClick={handleLogout} />
                </div>
            </nav>
        </>
    );
};

export default AdminSidebarComponents;
