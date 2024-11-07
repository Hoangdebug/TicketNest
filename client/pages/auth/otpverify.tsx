import OtpVerifyForm from '@components/forms/OtpVerify';
import { IOtpVerifyPage, IOtpVerifyPageProps } from '@interfaces/pages/otpverify';
import { images } from '@utils/constants';

const OtpVerifyPages: IOtpVerifyPage<IOtpVerifyPageProps> = () => {
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
                <OtpVerifyForm />
            </div>
        </div>
    );
};

export default OtpVerifyPages;
