import { routes } from '@utils/constants';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SecondErrorForm: ISecondErrorComponent<ISecondErrorComponentProps> = () => {
    const navigate = useRouter();
    const handleNextPage = () => {
        navigate.push(routes.CLIENT.HOME_PAGE.href, undefined, { scroll: false });
    };
    const [changeText, setChangeText] = useState();
    return (
        <div className="components__seconderror">
            <div className="components__seconderror-form p-4 ">
                <h1 className="components__seconderror-firsttext text-center">VertZéro is overwhelmed</h1>
                <h4 className="components__seconderror-secondtext text-center ">Wait a moment and try again, please.</h4>
                <button onClick={handleNextPage} type="submit" className="components__seconderror-form-firstbutton">
                    Go homepage
                </button>
            </div>
        </div>
    );
};

export default SecondErrorForm;
