import RegisterForm from '@components/forms/Register';
import { IRegisterPage, IRegisterPageProps } from '@interfaces/pages/register';
import { ReduxStates } from '@redux/reducers';

import { enums, routes } from '@utils/constants';
import { authHelper } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const RegisterPage: IRegisterPage<IRegisterPageProps> = () => {
    const router = useRouter();
    const token = authHelper.accessToken();
    const { profile } = useSelector((states: ReduxStates) => states);

    useEffect(() => {
        if (token) {
            switch (profile?.type) {
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
        <div className="pages__register pt-5">
            <div className="pages__register-rightside d-flex flex-column justify-content-center">
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
