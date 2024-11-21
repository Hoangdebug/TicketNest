import Button from '@components/commons/Button';
import Input from '@components/commons/Input';
import Table from '@components/commons/Table';
import { setModal } from '@redux/actions';
import { fetchBanCustomerByAdmin } from '@redux/actions/api';
import { http, images } from '@utils/constants';
import React, { createRef, useState } from 'react';
import Img from 'react-cool-img';
import { useDispatch } from 'react-redux';

const AdminListCustomerComponents: IAdminListCustomerComponents<IAdminListCustomerComponentsProps> = (props) => {
    const { customers, updateCustomers } = props;
    const dispatch = useDispatch();

    const [state, setState] = useState<IAdminListCustomerComponentsState>({
        search: '',
        sortBy: '',
        sortOrder: 'asc',
    });
    const { search, sortBy, sortOrder } = state;

    const tableRef = createRef<ITableComponentHandle>();

    const handleConfirmDelete = (id: string) => {
        dispatch(
            setModal({
                isShow: true,
                content: (
                    <>
                        <div className="text-center bases__margin--bottom31">
                            <Img src={images.ICON_TIMES} className="bases__width--90 bases__height--75" />
                        </div>
                        <div className="bases__text--bold bases__font--14 text-center">Do you want to ban this user</div>
                    </>
                ),
                button: (
                    <Button
                        className="bases__margin--right32"
                        fontSize="14"
                        textColor="white"
                        buttonText="OK"
                        background="blue"
                        onClick={() => {
                            handleFetchDeleteUser([id]);
                            dispatch(
                                setModal({
                                    isShow: false,
                                }),
                            );
                        }}
                    />
                ),
            }),
        );
    };

    const handleFetchDeleteUser = async (idsToDelete: string[]) => {
        dispatch(
            await fetchBanCustomerByAdmin(idsToDelete.join(','), (res: IAdminCustomerBanAPIRes | IErrorAPIRes | null) => {
                if (res && res?.code === http.SUCCESS_CODE) {
                    const updatedCustomers = customers?.filter((customer) => !idsToDelete.includes(customer?._id ?? ''));
                    if (Array.isArray(updatedCustomers) && updateCustomers) {
                        updateCustomers(updatedCustomers);
                    }
                    dispatch(
                        setModal({
                            isShow: true,
                            content: (
                                <>
                                    <div className="text-center bases__margin--bottom31">
                                        <Img src={images.ICON_SUCCESS} className="bases__width--90 bases__height--75" />
                                    </div>
                                    <div className="bases__text--bold bases__font--14 text-center">Ban user susscess !</div>
                                </>
                            ),
                        }),
                    );
                }
            }),
        );
    };
    const handleOnChange = (field: string, value: string) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };
    const filteredCustomers = customers?.filter((customer) => {
        const searchLower = search?.toLowerCase();
        return (
            customer?.username?.toLowerCase().includes(searchLower as string) ||
            customer?.phone?.toLowerCase().includes(searchLower as string) ||
            customer?.type?.toLowerCase().includes(searchLower as string)
        );
    });

    const sortedCustomers = [...(filteredCustomers as [])].sort((a, b) => {
        if (!sortBy) return 0;
        const fieldA = a[sortBy]?.toString().toLowerCase() || '';
        const fieldB = b[sortBy]?.toString().toLowerCase() || '';

        if (sortOrder === 'asc') {
            return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
        } else {
            return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
        }
    });

    const handleSort = (column: string) => {
        setState((prevState) => ({
            ...prevState,
            sortBy: column,
            sortOrder: prevState.sortBy === column && prevState.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    };

    const renderData = sortedCustomers?.map((item) => {
        const editBtn = {
            export: {
                srcIcon: images.ICON_DELETE,
                onClick: () => handleConfirmDelete(item?._id ?? ''),
            },
        };

        let userType;
        switch (item.type) {
            case 'Admin':
                userType = 'ADMIN';
                break;
            case 'Organizer':
                userType = 'ORGANIZER';
                break;
            case 'User':
                userType = 'USER';
                break;
            default:
                userType = item?.type;
        }

        return {
            ...item,
            type: userType,
            ...editBtn,
        };
    });

    const tableEventRender: ITableComponentProps = {
        heads: [
            {
                title: 'Ban User',
                isSort: false,
                className: 'text-center',
            },
            {
                title: 'Users Name',
                isSort: true,
                onClick: () => handleSort('username'),
                className: 'text-center',
            },
            {
                title: 'Days Of Birth',
                isSort: true,
                className: 'text-center',
                onClick: () => handleSort('dob'),
            },
            {
                title: 'Gender',
                isSort: true,
                className: 'text-center',
                onClick: () => handleSort('gender'),
            },
            {
                title: 'Phone',
                isSort: true,
                className: 'text-center',
                onClick: () => handleSort('phone'),
            },
            {
                title: 'Address',
                isSort: true,
                className: 'text-center',
            },
            {
                title: 'Permission ',
                isSort: true,
                className: 'text-center',
                onClick: () => handleSort('type'),
            },
        ],
        body: {
            columns: [
                {
                    field: 'export',
                    isButton: true,
                    className: 'd-flex justify-content-center',
                },
                {
                    field: 'username',
                    className: 'text-center',
                },
                {
                    field: 'dob',
                    className: 'text-center',
                },
                {
                    field: 'gender',
                    className: 'text-center',
                },
                {
                    field: 'phone',
                    className: 'text-center',
                },
                {
                    field: 'address',
                    className: 'text-center',
                },
                {
                    field: 'type',
                    className: 'text-center',
                },
            ],
            rows: renderData,
        },
    };

    return (
        <div className="pages__organizer-table">
            <Input placeholder="Enter your keywords....." value={search} onChange={(value: string) => handleOnChange('search', value)} />
            <Table ref={tableRef} heads={tableEventRender.heads} body={tableEventRender.body} total={customers?.length} />
        </div>
    );
};

export default AdminListCustomerComponents;
