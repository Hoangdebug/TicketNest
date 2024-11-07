import PaymenReturnForm from '@components/forms/PaymentReturnForm';
import { images } from '@utils/constants';

const PaymentReturn = () => {
    return (
        <div className="pages__firsterror">
            <div className="pages__firsterror-content">
                <img
                    style={{
                        width: 420,
                        height: 420,
                    }}
                    className="pages__firsterror-logo"
                    src={images.CHANGEPWSUCCESS_LOGO}
                    alt="Logo"
                />
                <PaymenReturnForm />
            </div>
        </div>
    );
};

export default PaymentReturn;
