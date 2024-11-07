import { RequestOrganizerForm } from '@components/index';
import { images } from '@utils/constants';
import { IRequestOrganizePage, IRequestOrganizePageProps } from '@interfaces/pages/requestorganize';

const RequestOrganizePage: IRequestOrganizePage<IRequestOrganizePageProps> = () => {
    return (
        <div className="pages__organizerRequest d-flex">
            <div className="pages__organizerRequest-leftSide">
                <img className="pages__organizerRequest-leftSide-logo" style={{ height: '100vh' }} src={images.LOGIN_LOGO} alt="" />
            </div>
            <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-center">
                <RequestOrganizerForm />
            </div>
        </div>
    );
};

export default RequestOrganizePage;
