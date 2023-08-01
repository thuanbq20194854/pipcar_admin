import { Empty, List } from 'antd';
import { useRouter } from 'next/router';
import VirtualList from 'rc-virtual-list';
import { Fragment, useState } from 'react';
import { BsCaretRightFill } from 'react-icons/bs';
import useDebounce from 'src/hooks/useDebounce';
import { TListFilter, useGetFilteredUsersQuery } from 'src/redux/query/user.query';
import { TMetaBase } from 'src/types/response.types';
import { TUser } from 'src/types/user.types';
import RoleAvatar from '../avatar/RoleAvatar';
import Button from '../button/Button';
import LocalSearch from '../input/LocalSearch';
import Link from '../next/Link';

const initialFilterValue: TListFilter = { page: 1, limit: 10 };

function SmPMList() {
  const {
    query: { partnerId },
  } = useRouter();
  const [usersFilterValue, setUsersFilterValue] = useState<TListFilter>(initialFilterValue);
  const debouncedFilter = useDebounce(usersFilterValue, 500);
  const {
    data: usersFilteredQuery,
    isSuccess: getUsersSuccess,
    isFetching: getUsersFetching,
  } = useGetFilteredUsersQuery(debouncedFilter, {
    refetchOnMountOrArgChange: true,
  });
  const usersFilteredData = getUsersSuccess ? usersFilteredQuery?.data?.user_list || [] : [];
  const usersFilteredMetaData: TMetaBase | undefined = getUsersSuccess
    ? usersFilteredQuery?.data?.meta_data
    : undefined;
  const handleLocalSearch = ({ keySearch }: { keySearch: string }) => {
    setUsersFilterValue({ ...usersFilterValue, keyword: keySearch });
  };
  return (
    <Fragment>
      <LocalSearch
        placeholder='Search by Name, Phone...'
        onFinish={handleLocalSearch}
        onValuesChange={(changedValue, values) => handleLocalSearch(values)}
      />
      {!!usersFilteredData.length && !!usersFilteredMetaData ? (
        <List<TUser>
          loading={getUsersFetching}
          style={{ marginTop: 24 }}
          pagination={
            usersFilteredMetaData.totalPage > 1 && {
              onChange: (page, pageSize) =>
                setUsersFilterValue({ ...usersFilterValue, page, limit: pageSize }),
              total: usersFilteredMetaData.total || 0,
              pageSize: usersFilteredMetaData.limit,
              current: usersFilteredMetaData.page,
            }
          }
        >
          <VirtualList
            data={usersFilteredData}
            height={usersFilteredData.length > 8 ? 73 * 7.7 : 73 * usersFilteredData.length}
            itemHeight={73}
            itemKey='_id'
          >
            {(item) => (
              <List.Item key={item._id} style={{ padding: '12px 20px 12px 4px' }}>
                <List.Item.Meta
                  avatar={
                    <RoleAvatar
                      size={40}
                      offset={[0, 34]}
                      role={item.role}
                      isActive={item.status === 1}
                    ></RoleAvatar>
                  }
                  title={item.name}
                  description={item.phone}
                />
                <Link href={`/admin/partner/${item._id}`}>
                  <Button
                    type='link'
                    disabled={item._id === String(partnerId)}
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

export default SmPMList;
