import SeatType1 from '@components/layouts/SeatType1';
import { ISeatType1Page, ISeatType1PageProps } from '@interfaces/pages/seattype1';
import { IEventDetailPageState } from '@interfaces/pages/eventdetail';
import { http, routes } from '@utils/constants';
import { authHelper } from '@utils/helpers';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchDetailsEvent } from '@redux/actions/api';
import moment from 'moment';

const SeatType1Page: ISeatType1Page<ISeatType1PageProps> = () => {
    const router = useRouter();
    const { id } = router.query;
    const token = authHelper.accessToken();
    const dispatch = useDispatch();

    const [state, setState] = useState<IEventDetailPageState>({
        eventDetails: undefined,
        event: [],
    });

    const { eventDetails } = state;
    const formattedDayEnd = moment(eventDetails?.day_end).format('MMM DD, YYYY HH:mm:ss');

    const handleDetailsEvent = async () => {
        dispatch(
            await fetchDetailsEvent(id?.toString() ?? '', (res: IEventDataApiRes | IErrorAPIRes | null) => {
                if (res && res.code === http.SUCCESS_CODE) {
                    const event = (res as IEventDataApiRes).result?.dataEvent;
                    setState((prevState) => ({
                        ...prevState,
                        eventDetails: event,
                    }));
                }
            }),
        );
    };

    console.log(eventDetails);
    useEffect(() => {
        if (!token) {
            router.push(routes.CLIENT.LOGIN_PAGE.href, undefined, { scroll: false });
        }
        handleDetailsEvent();
    }, []);

    return (
        <>
            <div className="components__seattype1">                
                <SeatType1 />
            </div>
        </>
    );
};

export default SeatType1Page;
