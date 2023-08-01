import { Empty, List } from 'antd';
import { useRouter } from 'next/router';
import VirtualList from 'rc-virtual-list';
import { Fragment, useState } from 'react';
import { BsCaretRightFill, BsDashLg } from 'react-icons/bs';
import useDebounce from 'src/hooks/useDebounce';
import { TListFilter, useGetRegisterListQuery } from 'src/redux/query/register.query';
import { TMetaBase } from 'src/types/response.types';
import { TUser } from 'src/types/user.types';
import TypeAgencyAvatar from '../avatar/TypeAgencyAvatar';
import Button from '../button/Button';
import LocalSearch from '../input/LocalSearch';
import Link from '../next/Link';

const initialFilterValue: TListFilter = { page: 1, limit: 10 };

function SmRegisterList() {
  const {
    query: { registerId },
  } = useRouter();
  const [filterValue, setFilterValue] = useState<TListFilter>(initialFilterValue);
  const debouncedFilter = useDebounce(filterValue, 500);
  const {
    data: filteredQuery,
    isSuccess: getSuccess,
    isFetching: getFetching,
  } = useGetRegisterListQuery(debouncedFilter, {
    refetchOnMountOrArgChange: true,
  });
  const filteredData = getSuccess ? filteredQuery?.data?.register_list || [] : [];
  const filteredMetaData: TMetaBase | undefined = getSuccess
    ? filteredQuery?.data?.meta_data
    : undefined;
  const handleLocalSearch = ({ keySearch }: { keySearch: string }) => {
    setFilterValue({ ...filterValue, keyword: keySearch });
  };
  return (
    <Fragment>
      <LocalSearch
        placeholder='Search by Name, Phone...'
        onFinish={handleLocalSearch}
        onValuesChange={(changedValue, values) => handleLocalSearch(values)}
      />
      {!!filteredData.length && !!filteredMetaData ? (
        <List<TUser>
          loading={getFetching}
          style={{ marginTop: 24 }}
          pagination={
            filteredMetaData.totalPage > 1 && {
              onChange: (page, pageSize) =>
                setFilterValue({ ...filterValue, page, limit: pageSize }),
              total: filteredMetaData.total || 0,
              pageSize: filteredMetaData.limit,
              current: filteredMetaData.page,
            }
          }
        >
          <VirtualList
            data={filteredData}
            height={filteredData.length > 8 ? 73 * 7.7 : 73 * filteredData.length}
            itemHeight={73}
            itemKey='_id'
          >
            {(item) => (
              <List.Item key={item._id} style={{ padding: '12px 20px 12px 4px' }}>
                <List.Item.Meta
                  avatar={
                    <TypeAgencyAvatar
                      size={40}
                      offset={[0, 34]}
                      isActive={item.status === 1}
                      isDriver={item.isDriver}
                      isTransportation={item.isTransportation}
                      customBadge={item.status === 0 && <BsDashLg size={10.2} />}
                    ></TypeAgencyAvatar>
                  }
                  title={item.name}
                  description={item.phone}
                />
                <Link href={`/register/${item._id}`}>
                  <Button
                    type='link'
                    disabled={item._id === String(registerId)}
                    style={{ padding: 0 }}
                  >
                    <BsCaretRightFill size={20} />
                  </Button>
                </Link>
              </List.Item>
            )}
          </VirtualList>
        </List>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Fragment>
  );
}

export default SmRegisterList;
