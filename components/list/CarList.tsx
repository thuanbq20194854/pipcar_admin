import styled from '@emotion/styled';
import { Avatar, Checkbox, Empty, Input, List, Space, theme, Tooltip, Typography } from 'antd';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsDashLg, BsSearch } from 'react-icons/bs';
import { GiPositionMarker } from 'react-icons/gi';
import { IoMdCar } from 'react-icons/io';
import { MdOutlineAirlineSeatReclineNormal } from 'react-icons/md';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMediaQuery } from 'react-responsive';
import useApp from 'src/hooks/useApp';
import useDebounce from 'src/hooks/useDebounce';
import useModalDangerConfirm from 'src/hooks/useModalDangerConfirm';
import { agencyApi } from 'src/redux/query/agency.query';
import { TListFilter, useDeleteCarMutation, useGetCarListQuery } from 'src/redux/query/car.query';
import { driverApi } from 'src/redux/query/driver.query';
import { useAppDispatch } from 'src/redux/store';
import { TCar } from 'src/types/car.types';
import { ErrorCode } from 'src/types/response.types';
import Button from '../button/Button';
import CreateCarModal from '../modal/CreateCarModal';
import DeliverCarModal from '../modal/DeliverCarModal';
import UpdateGpsModal from '../modal/UpdateGpsModal';
import Tag from '../tag/Tag';

function CarList() {
  const {
    query: { agencyId },
  } = useRouter();
  const dispatch = useAppDispatch();
  const { notification } = useApp();
  const mediaAbove1023 = useMediaQuery({ minWidth: 1023 });
  const [filterValue, setFilterValue] = useState<TListFilter>({
    agency: String(agencyId),
    page: 1,
    limit: 6,
    keyword: '',
  });
  const debouncedFilter = useDebounce(filterValue, 500);
  const { isFetching, data } = useGetCarListQuery(debouncedFilter, {
    skip: !agencyId,
    refetchOnMountOrArgChange: true,
  });
  const carList = data?.data?.car_list || [];
  const carListMetaData = data?.data?.meta_data || undefined;
  const [carListCombined, setCarListCombined] = useState<TCar[]>([]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isShowSearch, setIsShowSearch] = useState(false);

  const [deleteCarMutate, { isLoading }] = useDeleteCarMutation();

  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteCarMutate(id)
        .unwrap()
        .then(({ data, message }) => {
          dispatch(agencyApi.util.invalidateTags([{ type: 'Agencies', id: String(agencyId) }]));
          dispatch(driverApi.util.invalidateTags([{ type: 'Drivers', id: 'LIST' }]));
          notification.success({ message, placement: 'bottomLeft' });
        })
        .catch((err) => {
          if ([ErrorCode.BadRequest, ErrorCode.DataNotFound].includes(err.response_code))
            notification.error({ message: err.error[0].message, placement: 'bottomLeft' });
        });
    },
  });

  const ddToDmsString = (dd: number, isLongitude: boolean) => {
    const degrees = Math.floor(Math.abs(dd));
    const minutes = Math.floor((Math.abs(dd) - degrees) * 60);
    const seconds = Math.round(((Math.abs(dd) - degrees) * 60 - minutes) * 60);
    const direction = isLongitude ? (dd > 0 ? 'E' : 'W') : dd > 0 ? 'N' : 'S';
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const openLocation = (lat: any, long: any) => {
    const latDmsString = ddToDmsString(lat, false);
    const longDmsString = ddToDmsString(long, true);
    return window.open(
      `https://www.google.com/maps/place/${latDmsString}+${longDmsString}`,
      '_blank',
    );
  };

  const [updateGpsList, setUpdateGpsList] = useState<any[]>([]);
  const markGpsChange = (carId: any) => {
    if (carId === 'all') {
      if (updateGpsList.length) setUpdateGpsList([]);
      else {
        setUpdateGpsList(carListCombined.map((item) => item._id));
      }
    } else {
      const result = updateGpsList.find((element) => element === carId);
      if (result) setUpdateGpsList(updateGpsList.filter((e) => e != result));
      else setUpdateGpsList((prevArray) => [...prevArray, carId]);
    }
  };

  useEffect(() => {
    if (filterValue.page === 1) {
      setCarListCombined(carList);
    } else if (!!carListMetaData && filterValue.page <= carListMetaData.totalPage) {
      setCarListCombined(uniqBy([...carListCombined, ...carList], '_id'));
    }
  }, [carList, carListCombined, carListMetaData, filterValue.page]);

  return (
    <ListWrapper id='CarList'>
      <div>
        <UpdateGpsModal carList={updateGpsList} />
        <Checkbox
          style={{ float: 'right', marginRight: '3%' }}
          checked={updateGpsList.length == carListCombined.length}
          indeterminate={updateGpsList.length > 0 && updateGpsList.length < carListCombined.length}
          onClick={() => markGpsChange('all')}
        ></Checkbox>
      </div>
      {!!carList.length && !!carListMetaData ? (
        <InfiniteScroll
          dataLength={carListMetaData.total || 0}
          next={() =>
            setFilterValue({
              ...filterValue,
              page: filterValue.page + 1,
            })
          }
          hasMore={filterValue.page < carListMetaData.totalPage}
          loader={<></>}
          endMessage={<></>}
          scrollableTarget='CarList'
        >
          <List<TCar>
            loading={isFetching}
            dataSource={carListCombined}
            renderItem={(item) => (
              <div className='item-container' key={item._id} data-id={item._id}>
                <Avatar shape='square' size={68} icon={<IoMdCar />}>
                  {item.name}
                </Avatar>
                <div className='info-container'>
                  <Typography.Text strong ellipsis>
                    <Tooltip placement='topLeft' title={item.name}>
                      {item.name}
                    </Tooltip>
                  </Typography.Text>
                  <Typography.Text type='secondary'>{item.plates}</Typography.Text>
                  <Tag icon={<MdOutlineAirlineSeatReclineNormal />}>{item.type}</Tag>
                </div>
                <div className='action-container'>
                  <DeliverCarModal carId={item._id} />
                  <Button
                    icon={<BsDashLg />}
                    type='dashed'
                    onClick={() => handleConfirm(item._id, item.name)}
                  ></Button>
                  <div className='location' onClick={() => openLocation(item.lat, item.long)}>
                    <GiPositionMarker /> Location
                  </div>
                  <Checkbox
                    checked={updateGpsList.find((e) => e === item._id)}
                    onChange={() => markGpsChange(item._id)}
                  ></Checkbox>
                </div>
              </div>
            )}
          ></List>
        </InfiniteScroll>
      ) : (
        <div className='item-empty'>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 28 }}
            description={
              <Space size={0}>
                <Typography.Text ellipsis type='secondary' style={{ maxWidth: 120 }}>
                  Not found {`"${filterValue.keyword}"`}
                </Typography.Text>
                ,
                <CreateCarModal buttonProps={{ type: 'link', size: 'small' }} />
              </Space>
            }
          />
        </div>
      )}
      <Space.Compact
        block
        size='large'
        className='create-btn-container'
        style={{ backgroundColor: colorBgContainer }}
      >
        {isShowSearch ? (
          <Input
            allowClear
            autoFocus
            placeholder='Search Car by Name, Plate...'
            value={filterValue.keyword}
            onChange={(e) => setFilterValue({ ...filterValue, page: 1, keyword: e.target.value })}
            suffix={
              <Typography.Text
                className='cancel-search-action'
                type='secondary'
                underline
                onClick={() => {
                  setIsShowSearch(false);
                  setFilterValue({ ...filterValue, keyword: '' });
                }}
                title='Hide search'
              >
                Cancel
              </Typography.Text>
            }
          />
        ) : (
          <CreateCarModal />
        )}
        <Button
          type={isShowSearch ? 'primary' : 'dashed'}
          size='large'
          icon={<BsSearch size={18} />}
          onClick={() => setIsShowSearch(true)}
        ></Button>
      </Space.Compact>
    </ListWrapper>
  );
}

export const ListWrapper = styled.div`
  position: relative;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  max-height: 481px;
  overflow-y: auto;
  overflow-x: hidden;
  .create-btn-container {
    margin-top: auto;
    position: sticky;
    bottom: 0;
    align-self: flex-end;
    &::before {
      content: '';
      position: absolute;
      top: -8px;
      right: -8px;
      bottom: -8px;
      left: -8px;
      background-color: inherit;
      border-radius: 0 0 8px 8px;
    }
  }
  .item-container {
    padding: 8px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? '#424242' : '#d9d9d9')};
    border-radius: 8px;
    .ant-avatar-square {
      border-radius: 4px;
      flex-shrink: 0;
    }
    .info-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .ant-typography-ellipsis {
        max-width: 124px;
      }
      .ant-tag {
        margin-top: 2px;
        padding-left: 6px;
        padding-right: 6px;
        border-radius: 4px;
      }
    }
    .action-container {
      margin-left: auto;
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      gap: 8px;
      .location {
        margin-left: 16px;
        color: #1677ff;
        cursor: pointer;
        :hover {
          color: #8fbeff;
        }
      }
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
  .ant-checkbox-inner,
  .ant-checkbox-input {
    margin-left: 8px;
    transform: scale(2);
    border: 0.5px solid #e2e2e2;
    border-radius: 3px;
  }
  .item-empty {
    height: 274px;
    border-radius: 8px;
    border: 1px dashed #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item-loader {
    height: 86px;
    border-radius: 8px;
    border: 1px dashed #d9d9d9;
  }
  .cancel-search-action {
    user-select: none;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colorPrimary};
    }
  }
`;

export default CarList;
