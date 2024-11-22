import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Box, Img } from '@components/index';
import { IFavouriteListPageProps, IFavouriteListState } from '@interfaces/utils/apis/favouritelist';
import { images } from '@utils/constants';
import moment from 'moment';

const FavouriteListPage: React.FC<IFavouriteListPageProps> = () => {
  const dispatch = useDispatch();

  // Đảm bảo state có kiểu IFavouriteListState, không có sự kết hợp với hàm
  const [state, setState] = useState<IFavouriteListState>({
    favouriteList: [],
    isLoading: true,
  });

  const { favouriteList, isLoading } = state;

  // Fetch dữ liệu yêu thích từ API
  const fetchFavourites = async () => {
    try {
      const res = await axios.get('/api/favourites');
      setState({
        favouriteList: res.data?.favourites || [],  // Gán danh sách favourites
        isLoading: false,
      });
      dispatch({ type: 'SET_FAVOURITES', payload: res.data?.favourites });
    } catch (error) {
      console.error('Failed to fetch favourites', error);
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <div className="pages__favourite-list bases__padding--top70 p-4">
      <h2 className="bases__font20 fw-bolder pt-5">Favourite List</h2>
      <Box>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          favouriteList?.map((item, index) => (
            <div className="pages__favourite-list-card p-3" key={index}>
              <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                <Img src={images.ICON_USER} />
                <p className="m-0 fs-4 fw-bolder">{item?.name}</p>
              </span>
              <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                <Img src={images.ICON_DESCRIPTION} />
                <p className="m-0 fs-4">{item?.description}</p>
              </span>
              <span className="d-flex align-items-center flex-row gap-1 bases__text--black">
                <Img src={images.ICON_MONEY} />
                <p className="m-0 fs-4 fw-bolder">
                  {item?.price?.join(', ')} (Multiple Prices)
                </p>
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
