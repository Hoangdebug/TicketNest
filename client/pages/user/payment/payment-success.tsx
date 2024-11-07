import SuccessPagesForm from '@components/forms/SuccessPage';
import { IFirstErrorPage, IFirstErrorPageProps } from '@interfaces/pages/firsterror';
import { images } from '@utils/constants';

const SuccessPages: IFirstErrorPage<IFirstErrorPageProps> = () => {
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
                <SuccessPagesForm />
            </div>
        </div>
    );
};

export default SuccessPages;
