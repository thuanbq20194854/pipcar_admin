import { Avatar, Empty, Input, List, Space, theme, Tooltip, Typography } from 'antd';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsDashLg, BsFillPersonFill, BsSearch } from 'react-icons/bs';
import { GiPositionMarker } from 'react-icons/gi';
import InfiniteScroll from 'react-infinite-scroll-component';
import useApp from 'src/hooks/useApp';
import useDebounce from 'src/hooks/useDebounce';
import useModalDangerConfirm from 'src/hooks/useModalDangerConfirm';
import { agencyApi } from 'src/redux/query/agency.query';
import { carApi } from 'src/redux/query/car.query';
import {
  TListFilter,
  useDeleteDriverMutation,
  useGetDriverListQuery,
} from 'src/redux/query/driver.query';
import { useAppDispatch } from 'src/redux/store';
import { TDriver } from 'src/types/driver.types';
import { ErrorCode } from 'src/types/response.types';
import Button from '../button/Button';
import CreateDriverModal from '../modal/CreateDriverModal';
import DeliverDriverModal from '../modal/DeliverDriverModal';
import { ListWrapper } from './CarList';

function DriverList() {
  const {
    query: { agencyId },
  } = useRouter();
  const dispatch = useAppDispatch();
  const { notification } = useApp();
  const [filterValue, setFilterValue] = useState<TListFilter>({
    agency: String(agencyId),
    page: 1,
    limit: 6,
    keyword: '',
  });
  const debouncedFilter = useDebounce(filterValue, 500);
  const { isFetching, data } = useGetDriverListQuery(debouncedFilter, {
    skip: !agencyId,
    refetchOnMountOrArgChange: true,
  });
  const driverList = data?.data?.driver_list || [];
  const driverListMetaData = data?.data?.meta_data || undefined;
  const [driverListCombined, setDriverListCombined] = useState<TDriver[]>([]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isShowSearch, setIsShowSearch] = useState(false);

  const [deleteDriverMutate, { isLoading }] = useDeleteDriverMutation();

  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteDriverMutate(id)
        .unwrap()
        .then(({ data, message }) => {
          dispatch(agencyApi.util.invalidateTags([{ type: 'Agencies', id: String(agencyId) }]));
          dispatch(carApi.util.invalidateTags([{ type: 'Cars', id: 'LIST' }]));
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

  useEffect(() => {
    if (filterValue.page === 1) {
      setDriverListCombined(driverList);
    } else if (!!driverListMetaData && filterValue.page <= driverListMetaData.totalPage) {
      setDriverListCombined(uniqBy([...driverListCombined, ...driverList], '_id'));
    }
  }, [driverList, driverListCombined, driverListMetaData, filterValue.page]);

  return (
    <ListWrapper id='DriverList'>
      <div style={{ height: 22 }}></div>
      {!!driverList.length && !!driverListMetaData ? (
        <InfiniteScroll
          dataLength={driverListMetaData.total || 0}
          next={() =>
            setFilterValue({
              ...filterValue,
              page: filterValue.page + 1,
            })
          }
          hasMore={filterValue.page < driverListMetaData.totalPage}
          loader={<></>}
          endMessage={<></>}
          scrollableTarget='DriverList'
        >
          <List<TDriver>
            loading={isFetching}
            dataSource={driverList}
            renderItem={(item) => (
              <div className='item-container' key={item._id} data-id={item._id}>
                <Avatar shape='square' size={68} icon={<BsFillPersonFill />}>
                  {item.name}
                </Avatar>
                <div className='info-container'>
                  <Typography.Text strong ellipsis>
                    <Tooltip placement='topLeft' title={item.name}>
                      {item.name}
                    </Tooltip>
                  </Typography.Text>
                  <Typography.Text type='secondary'>{item.phone}</Typography.Text>
                </div>
                <div className='action-container'>
                  <DeliverDriverModal driverId={item._id} />
                  <Button
                    icon={<BsDashLg />}
                    type='dashed'
                    onClick={() => handleConfirm(item._id, item.name)}
                  ></Button>
                  {item.lat && item.long ? (
                    <div className='location' onClick={() => openLocation(item.lat, item.long)}>
                      <GiPositionMarker /> Location
                    </div>
                  ) : (
                    <></>
                  )}
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
                <CreateDriverModal buttonProps={{ type: 'link', size: 'small' }} />
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
            placeholder='Search Driver by Name, Phone...'
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
          <CreateDriverModal />
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

export default DriverList;
