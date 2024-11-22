import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Img } from '@components/index';
import { http, images } from '@utils/constants';
import moment from 'moment';
import { IFavouriteListPage, IFavouriteListPageProps, IFavouriteListState } from '@interfaces/pages/favorite';
import { fetchUserFavourites } from '@redux/actions/api';
import { ReduxStates } from '@redux/reducers';

const FavouriteListPage: IFavouriteListPage<IFavouriteListPageProps> = () => {
    const dispatch = useDispatch();
    const { profile } = useSelector((states: ReduxStates) => states);

    const [state, setState] = useState<IFavouriteListState>({
        favourites: [],
        isLoading: true,
    });

    const { favourites, isLoading } = state;

    useEffect(() => {
        handleFetchFavourites();
    }, []);

    const handleFetchFavourites = async () => {
        dispatch(
            await fetchUserFavourites(profile?._id?.toString() ?? '', (res: IFavouriteDataApiRes | IErrorAPIRes | null) => {
                if (res && res.code === http.SUCCESS_CODE) {
                    const favouritesData = (res as IFavouriteDataApiRes).result;
                    setState((prevState) => ({
                        ...prevState,
                        favourites: favouritesData,
                    }));
                }
            }),
        );
    };

    return (
        <div className="pages__favourite-list bases__padding--top70 p-4">
            <h2 className="bases__font20 fw-bolder pt-5">Favourite List</h2>
            <Box>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    favourites?.map((item, index) => (
                        <div className="pages__favourite-list-card p-3" key={index}>
                            <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                                <Img src={images.ICON_USER} />
                                <p className="m-0 fs-4 fw-bolder">{item?.name}</p>
                            </span>
                            <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                                {/* <Img src={images.} /> */}
                                <p className="m-0 fs-4">{item?.description}</p>
                            </span>
                            <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                                <Img src={images.ICON_MONEY} />
                                <p className="m-0 fs-4 fw-bolder">{item?.price?.join(', ')} (Multiple Prices)</p>
                            </span>
                            <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                                <Img src={images.ICON_LOCATION} />
                                <p className="m-0 fs-4">{item?.location}</p>
                            </span>
                            <p className="m-0 text-end bases__text--gray">
                                Event time: {moment(item.day_event).format('YYYY/MM/DD HH:mm')}
                            </p>
                            <p className="m-0 text-end bases__text--gray">
                                Start: {moment(item.day_start).format('YYYY/MM/DD HH:mm')} | End:{' '}
                                {moment(item.day_end).format('YYYY/MM/DD HH:mm')}
                            </p>
                        </div>
                    ))
                )}
            </Box>
        </div>
    );
};

export default FavouriteListPage;
