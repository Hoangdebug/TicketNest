import { IBasePageProps, IBasePage } from '@interfaces/pages/base';

interface IFavouriteListPageProps extends IBasePageProps {}

interface IFavouriteListPage<P = {}> extends IBasePage<P> {}

interface IFavouriteListState {
    favourites?: IFavouriteDataApi[];
    isLoading?: boolean;
}
