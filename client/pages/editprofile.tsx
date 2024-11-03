import { EditUserProFileForm } from '@components/index';
import { IEditUserProfilePage, IEditUserProfilePageProps } from '@interfaces/pages/edituserprofile';
import { useSelector } from 'react-redux';
import { ReduxStates } from '@redux/reducers';

const EditUserProfilePage: IEditUserProfilePage<IEditUserProfilePageProps> = () => {
    const { profile } = useSelector((states: ReduxStates) => states);

    return (
        <div className="pages__edit-profile d-flex bases__padding--top120">
            {Object.keys(profile).length > 0 && (
                <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-center">
                    <EditUserProFileForm currentUser={profile} />
                </div>
            )}
        </div>
    );
};

export default EditUserProfilePage;
