// Khai báo các interface cho Favourite List

export interface IFavouriteListPageProps {
    // Các props mà page yêu cầu (có thể là các tham số liên quan đến dữ liệu yêu thích)
    userId: string;
    isLoading: boolean;
    onFetchFavourites: () => void;  // Ví dụ: hàm để fetch dữ liệu yêu thích
}

export interface IFavouriteListState {
    favourites: IFavouriteDataApi[];  // Danh sách các sự kiện yêu thích
    isLoading: boolean;
}

export interface IFavouriteListPage {
    props: IFavouriteListPageProps;
    state: IFavouriteListState;
    render: () => JSX.Element;  // Phương thức render hoặc renderPage
}

export interface IFavouriteDataApi {
    _id?: string; 
    name?: string; 
    description?: string; 
    day_start?: string; 
    day_end?: string; 
    day_event?: string; 
    ticket_number?: number[]; 
    price?: number[]; 
    location?: string; 
    ticket_type?: string[]; 
    quantity?: number[]; 
    event_type?: string; 
    status?: string; 
    is_active?: boolean;
    created_by?: string; 
    createdAt?: string; 
    updatedAt?: string; 
    images?: string; 
}

export interface IFavouriteDataApiRes extends IBaseAPIRes {
    favourites?: IFavouriteDataApi[];  // Danh sách các sự kiện yêu thích
}
