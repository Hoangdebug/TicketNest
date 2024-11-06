import { IPostForgotPasswordPage, IPostForgotPasswordPageProps } from '@interfaces/pages/postforgotpassword';

import { images } from '@utils/constants';

const PostForgotPasswordPage: IPostForgotPasswordPage<IPostForgotPasswordPageProps> = () => {
    return (
        <div className="pages__postForgotPassword d-flex ">
            <div className="pages__postForgotPassword-leftSide ">
                <img
                    className="pages__postForgotPassword-leftSide-logo"
                    style={{ height: '100vh' }}
                    src={images.BG_FORGOT_PASSWORD}
                    alt=""
                />
            </div>
            <div className="col-md-6 col-sm-12 pages__postForgotPassword-rightSide ">
                <img
                    className="pages__postForgotPassword-rightSide-logo"
                    style={{ height: '100vh' }}
                    src={images.POSTFORGOTPW_LOGO}
                    alt=""
                />
            </div>
        </div>
    );
};

export default PostForgotPasswordPage;
