import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Loader from '@components/layouts/Loader';
import Modal from '@components/layouts/Modal';
import Header from '@components/layouts/Header';
import Footer from '@components/layouts/Footer';

import { useDispatch, useSelector } from 'react-redux';
import { setLocale, setModal } from '@redux/actions';
import { enums, http, routes } from '@utils/constants';
import { ReduxStates } from '@redux/reducers';
import AdminSidebarComponents from './admin/SideBarAdmin';
import HeaderAdminComponents from './admin/HeaderAdmin';

const App: IAppComponent<IAppComponentProps> = (props) => {
    const { children, statusCode } = props;
    const { profile } = useSelector((states: ReduxStates) => states);
    const router = useRouter();
    const isAdminPage = router.pathname.startsWith('/admin');
    const isOrganizerPage = router.pathname.startsWith('/organizer');
    const isAdmin = profile?.role === enums.ROLE.ADMIN || enums.ROLE.ORGANIZER;

    const dispatch = useDispatch();
    const [state, setState] = useState<IAppComponentState>({
        reloadKey: 0,
        historyPathname: router.pathname,
        isCollapsed: false,
    });
    const { reloadKey } = state;
    const { locale, pathname } = router;

    const noAuthPath = [
        // bắt phân quyền admin
        routes.CLIENT.CHANGE_PASSWORD_SUCCESS_PAGE.href,
    ];
    const isNotFoundPage = statusCode === http.NOT_FOUND_CODE;

    const isShowComponent = !noAuthPath.includes(pathname) && !isNotFoundPage;

    useEffect(() => {
        window.addEventListener('popstate', onBackButtonEvent);

        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    }, []);
    const noHeaderFooterPath = [
        routes.CLIENT.CHANGE_PASSWORD_PAGE.href,
        routes.CLIENT.CHANGE_PASSWORD_SUCCESS_PAGE.href,
        routes.CLIENT.FORGOT_PASSWORD_PAGE.href,
        routes.CLIENT.REGISTERSUCCESS_PAGE.href,
        routes.CLIENT.ERROR403_PAGE.href,
        routes.CLIENT.ERROR404_PAGE.href,
        routes.CLIENT.ERROR500_PAGE.href,
        routes.CLIENT.LOGIN_PAGE.href,
        routes.CLIENT.REGISTER_PAGE.href,
        routes.CLIENT.FORGOT_PASSWORD_PAGE.href,
        routes.CLIENT.POST_FORGOT_PASSWORD_PAGE.href,
        routes.CLIENT.CHANGE_PASSWORD_PAGE.href,
        routes.CLIENT.ADD_EVENT_PAGE.href,
        routes.CLIENT.ORGANIZER_LIST_EVENT.href,
        routes.CLIENT.CHANGE_PASSWORD_SUCCESS_PAGE.href,
        routes.CLIENT.ADMIN_PAGE.href,
        routes.CLIENT.UPDATE_EVENT_PAGE.href,
        routes.CLIENT.ADMIN_LIST_CUSTOMER_PAGE.href,
        routes.CLIENT.ADMIN_LIST_CUSTOMER_BAN_PAGE.href,
        routes.CLIENT.ADMIN_LIST_CUSTOMER_REQUEST_PAGE.href,
        routes.CLIENT.ADMIN_MANAGER_EVENT_PAGE.href,
        routes.CLIENT.ADMIN_CREATE_ACCOUNT_PAGE.href,
        routes.CLIENT.OTP_VERIFY_PAGE.href,
    ];
    useEffect(() => {
        handleScrollToTop();
        setState((prevState) => ({
            ...prevState,
            historyPathname: pathname,
        }));
    }, [pathname]);

    useEffect(() => {
        dispatch(setLocale(locale));
    }, [locale]);

    const onBackButtonEvent = () => {
        dispatch(setModal({ isShow: false }));
        handleScrollToTop();
    };

    const handleScrollToTop = () => {
        document.documentElement.style.scrollBehavior = 'auto';
        setTimeout(() => window.scrollTo(0, 0), 5);
    };

    return (
        <div key={reloadKey} className="components__app">
            <Loader />
            <Modal />
            <Header isShow={isShowComponent && !noHeaderFooterPath.includes(router.pathname)} />
            {isOrganizerPage || (isAdminPage && isAdmin) ? (
                <>
                    <div className="row position-relative" style={{ minHeight: '100vh' }}>
                        <div className="col-xl-2 p-0">
                            <AdminSidebarComponents />
                            <div className="components__app--headerAdmin p-0">
                                <HeaderAdminComponents />
                            </div>
                        </div>
                        <div className={`col-xl-9 bases__width83 p-0 bases__padding--top70 position-relative`}>
                            <div
                                className={`components__app--children bases__background--gray-opacity p-4`}
                                style={{ minHeight: '100vh', borderRadius: '10px' }}
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                children
            )}
            <Footer isShow={isShowComponent && !noHeaderFooterPath.includes(router.pathname)} />
        </div>
    );
};

export default App;
