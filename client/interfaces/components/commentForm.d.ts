interface ICommentFormComponent<P = {}> extends IBaseComp<P> {}

interface ICommentFormComponentProps extends IBaseCompProps {
    idComment?: string;
    dataComment?: string;
}

interface ICommentFormComponentState {
    updateComments?: string;
    isValidate?: boolean;
}
