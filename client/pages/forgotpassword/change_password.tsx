import ChangePasswordForm from '@components/forms/ChangePassword';
import { IChangePasswordPage, IChangePasswordPageProps } from '@interfaces/pages/changepassword';
import { images } from '@utils/constants';

const ChangePasswordPage: IChangePasswordPage<IChangePasswordPageProps> = () => {
    return (
        <div className="pages__changepw d-flex ">
            <div className="pages__changepw-leftSide ">
                <img className="pages__changepw-leftSide-logo bases__width100" style={{ height: '100vh' }} src={images.BG_FORGOT_PASSWORD} alt="" />
            </div>
            <div className="col-md-6 col-sm-12 pages__changepw-rightSide d-flex flex-column justify-content-center">
                <ChangePasswordForm />
            </div>
        </div>
    );
};

export default ChangePasswordPage;
