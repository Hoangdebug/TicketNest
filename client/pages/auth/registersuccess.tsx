import RegisterSuccessForm from '@components/forms/RegisterSuccess';
import { IRegisterSuccessPage, IRegisterSuccessPageProps } from '@interfaces/pages/registersuccess';
import { images } from '@utils/constants';

const RegisterSuccessPage: IRegisterSuccessPage<IRegisterSuccessPageProps> = () => {
    return (
        <div className="pages__registersuccess d-flex">
            <div className=" pages__registersuccess-rightside">
                <img
                    className="pages__registersuccess-rightside-logo"
                    style={{ height: '100%', backgroundSize: 'contain' }}
                    src={images.LOGIN_LOGO}
                    alt="Logo"
                />
            </div>
            <div className="col-md-6 col-sm-12 pages__registersuccess-leftside d-flex flex-column justify-content-center">
                <img style={{ height: '91px', width: 'auto' }} src={images.SUCCESS_LOGO} alt="Logo" />
                <RegisterSuccessForm />
            </div>
        </div>
    );
};

export default RegisterSuccessPage;
