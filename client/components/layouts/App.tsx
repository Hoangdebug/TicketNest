import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Loader from '@components/layouts/Loader';
import Modal from '@components/layouts/Modal';
import Header from '@components/layouts/Header';
import Footer from '@components/layouts/Footer';

import { useDispatch } from 'react-redux';
import { setLocale, setModal } from '@redux/actions';
import { http, routes } from '@utils/constants';

const App: IAppComponent<IAppComponentProps> = (props) => {
    const { children, statusCode } = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const [state, setState] = useState<IAppComponentState>({
        reloadKey: 0,
        historyPathname: router.pathname,
    });
    const { reloadKey } = state;
    const { locale, pathname } = router;

    const noAuthPath = [
        // bắt phân quyền admin
        routes.CLIENT.CHANGEPASSWORDSUCCESS_PAGE.href,
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
        routes.CLIENT.LOGIN_PAGE.href,
        routes.CLIENT.REGISTER_PAGE.href,
        routes.CLIENT.FORGOTPASSWORD_PAGE.href,
        routes.CLIENT.POSTFORGOTPASSWORD_PAGE.href,
        routes.CLIENT.CHANGEPASSWORD_PAGE.href,
        routes.CLIENT.CHANGEPASSWORDSUCCESS_PAGE.href,
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
            {children}
            <Footer isShow={isShowComponent && !noHeaderFooterPath.includes(router.pathname)} />
        </div>
    );
};

export default App;
