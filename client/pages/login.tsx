import { LoginForm } from '@components/index';
import { enums, images, routes } from '@utils/constants';
import { ILoginPage, ILoginPageProps } from '@interfaces/pages/login';
import { authHelper } from '@utils/helpers';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ReduxStates } from '@redux/reducers';

const LoginPage: ILoginPage<ILoginPageProps> = () => {
    const router = useRouter();
    const token = authHelper.accessToken();
    const { profile } = useSelector((states: ReduxStates) => states);

    useEffect(() => {
        if (token) {
            switch (profile?.details?.type) {
                case enums.TYPES.ADMIN:
                    router.push(routes.CLIENT.ADMIN_PAGE.href, undefined, { scroll: false });
                    break;
                case enums.TYPES.ORGANIZER:
                    router.push(routes.CLIENT.ADMIN_PAGE.href, undefined, { scroll: false });
                    break;
                case enums.TYPES.USER:
                    router.push(routes.CLIENT.HOME_PAGE.href, undefined, { scroll: false });
                    break;
                default:
                    router.push(routes.CLIENT.ADMIN_PAGE.href, undefined, { scroll: false });
                    break;
            }
        }
    }, [token, profile, router]);

    return (
        <div className="pages__login d-flex">
            <div className="pages__login-leftSide">
                <img className="pages__login-leftSide-logo" style={{ height: '100vh' }} src={images.LOGIN_LOGO} alt="" />
            </div>
            <div className="col-md-6 col-sm-12 pages__login-rightSide d-flex flex-column justify-content-center">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
