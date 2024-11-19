import Button from '@components/commons/Button';
import Img from '@components/commons/Img';
import Input from '@components/commons/Input';
import { setModal } from '@redux/actions';
import { fetchUpdateComment } from '@redux/actions/api';
import { http, images } from '@utils/constants';
import { validateHelper } from '@utils/helpers';
import React, { createRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const CommentForm: ICommentFormComponent<ICommentFormComponentProps> = (props) => {
    const { dataComment, idComment } = props;
    const commentValidatorRef = createRef<IValidatorComponentHandle>();
    const dispatch = useDispatch();
    const [state, setState] = useState<ICommentFormComponentState>({
        isValidate: true,
    });
    const { updateComments } = state;

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            updateComments: dataComment,
        }));
    }, []);

    const handleOnChange = (field: string, value: string) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleFetchUpdateComment = async (idComment: string) => {
        let validate = state.isValidate;

        const validator = [{ ref: commentValidatorRef, value: updateComments, message: 'Enter your comment' }];

        validator.forEach(({ ref, value, message }) => {
            ref.current?.onValidateMessage('');
            if (validateHelper.isEmpty(String(value ?? ''))) {
                ref.current?.onValidateMessage(message);
                validate = false;
            }
        });

        if (validate) {
            dispatch(
                await fetchUpdateComment(idComment, { comment: updateComments }, (res: ICommentDataAPIRes | IErrorAPIRes | null) => {
                    if (res?.code === http.SUCCESS_CODE) {
                        setState((prevState) => ({
                            ...prevState,
                            updateComments: '',
                        }));
                    } else {
                        setModal({
                            isShow: true,
                            content: (
                                <>
                                    <div className="text-center bases__margin--bottom31">
                                        <Img src={images.ICON_TIMES} className="bases__width--90 bases__height--75" />
                                    </div>
                                    <div className="bases__text--bold bases__font--14 text-center">Error while you add new comment!!!</div>
                                </>
                            ),
                        });
                    }
                }),
            );
        }
    };

    return (
        <div className="d-flex flex-column gap-2">
            <Input
                type="text"
                value={updateComments}
                onChange={(value: string) => handleOnChange('updateComments', value)}
                placeholder="Enter your reply..."
            />
            <Button buttonText="Update" background="green" onClick={() => handleFetchUpdateComment(idComment ?? '')} />
        </div>
    );
};

export default CommentForm;
