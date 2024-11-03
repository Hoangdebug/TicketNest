import ForgotPasswordForm from '@components/forms/ForgotPassword';
import { IForgotPasswordPage, IForgotPasswordPageProps } from '@interfaces/pages/forgotpassword';

import { images } from '@utils/constants';

const ForgotPasswordPage: IForgotPasswordPage<IForgotPasswordPageProps> = () => {
    return (
        <div className="pages__forgotpw d-flex ">
            <div className="pages__forgotpw-leftSide ">
                <img className="pages__forgotpw-leftSide-logo bases__width100" style={{ height: '100vh' }} src={images.BG_FORGOT_PASSWORD} alt="" />
            </div>
            <div className="col-md-6 col-sm-12 pages__forgotpw-rightSide d-flex flex-column justify-content-center">
                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
