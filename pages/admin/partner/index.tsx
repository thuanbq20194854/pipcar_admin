import styled from '@emotion/styled';
import { Card, Col, Divider, Dropdown, List, Row, Segmented, Space, theme, Typography } from 'antd';
import { useState } from 'react';
import { BsPlusLg, BsSortDownAlt } from 'react-icons/bs';
import { FaLock, FaUnlockAlt } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import RoleAvatar from 'src/components/avatar/RoleAvatar';
import AdminBreadcrumb from 'src/components/breadcrumb/AdminBreadcrumb';
import Button from 'src/components/button/Button';
import LocalSearch from 'src/components/input/LocalSearch';
import StyledListContainer from 'src/components/list/StyledListContainer';
import Link from 'src/components/next/Link';
import useChangeStatusUser from 'src/hooks/useChangeStatusUser';
import useDebounce from 'src/hooks/useDebounce';
import WithAdmin from 'src/hooks/withAdmin';
import { TListFilter, useGetFilteredUsersQuery } from 'src/redux/query/user.query';
import { TMetaBase } from 'src/types/response.types';
import { TUser } from 'src/types/user.types';

const initialFilterValue: TListFilter = { page: 1, limit: 10 };

function HomePage() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const mediaAbove400 = useMediaQuery({ minWidth: 400 });
  const [usersFilterValue, setUsersFilterValue] = useState<TListFilter>(initialFilterValue);
  const debouncedFilter = useDebounce(usersFilterValue, 500);
  const {
    data: usersFilteredQuery,
    isSuccess: getUsersSuccess,
    isFetching: getUsersFetching,
  } = useGetFilteredUsersQuery(debouncedFilter, { refetchOnMountOrArgChange: true });

  const usersFilteredData = getUsersSuccess ? usersFilteredQuery?.data?.user_list || [] : [];
  const usersFilteredMetaData: TMetaBase | undefined = getUsersSuccess
    ? usersFilteredQuery?.data?.meta_data
    : undefined;

  const { handleChangeUserStatus, blockUserLoading, unBlockUserLoading } = useChangeStatusUser();

  const handleLocalSearch = ({ keySearch }: { keySearch: string }) => {
    setUsersFilterValue({ ...usersFilterValue, keyword: keySearch });
  };
  const handleSelectSort = (value: string) => {
    setUsersFilterValue({ ...usersFilterValue, sort: value });
  };
  const handleTabChange = (value: string) => {
    setUsersFilterValue({ ...usersFilterValue, status: +value || undefined });
  };

  return (
    <PageWrapper className='main-page'>
      <Row className='page-header'>
        <Col flex='auto'>
          {!mediaAbove767 && <AdminBreadcrumb />}
          <Typography.Title className='page-title' level={2}>
            Partner List
          </Typography.Title>
        </Col>
        <Col flex='none'>
          <Link href='/admin/partner/create'>
            <Button type='primary' icon={<BsPlusLg />}>
              {mediaAbove400 ? 'Add new PM' : 'Add'}
            </Button>
          </Link>
        </Col>
      </Row>
      <Card
        style={{ width: '100%' }}
        bodyStyle={{ padding: 0 }}
        tabList={[
          {
            key: '',
            tab: 'ALL',
          },
          {
            key: '1',
            tab: 'Active',
          },
          {
            key: '2',
            tab: 'Blocked',
          },
        ]}
        activeTabKey={String(usersFilterValue.status || '')}
        onTabChange={(key) => handleTabChange(key)}
      >
        <Space
          className='header-filter-container'
          wrap={false}
          split={<Divider type='vertical' />}
          size={0}
        >
          <LocalSearch
            placeholder={mediaAbove400 ? 'Search by Name, Phone...' : 'by Name, Phone...'}
            onFinish={handleLocalSearch}
            onValuesChange={(changedValue, values) => handleLocalSearch(values)}
          />
          <Dropdown
            menu={{
              items: [
                { key: 'name_asc', label: `Tên A->Z` },
                { key: 'name_desc', label: `Tên Z->A` },
                { key: 'createdAt_desc', label: 'Ngày tạo mới nhất' },
                { key: 'createdAt_asc', label: 'Ngày tạo cũ nhất' },
              ],
              selectable: true,
              selectedKeys: !!usersFilterValue.sort ? [usersFilterValue.sort] : undefined,
              onSelect: ({ key }) => handleSelectSort(key),
            }}
            arrow={{ pointAtCenter: true }}
            placement='bottomRight'
          >
            <Button size='large' block icon={<BsSortDownAlt size={20} />}></Button>
          </Dropdown>
        </Space>
        <ListContainer
          loading={getUsersFetching}
          dataSource={usersFilteredData}
          pagination={{
            metadata: usersFilteredMetaData,
            onChange: (page, pageSize) =>
              setUsersFilterValue({ ...usersFilterValue, page, limit: pageSize }),
          }}
          renderItem={(item) => (
            <List.Item className='item-container'>
              <List.Item.Meta
                avatar={
                  <Link href={`/admin/partner/${item._id}`}>
                    <RoleAvatar
                      size={40}
                      offset={[0, 34]}
                      role={item.role}
                      isActive={item.status === 1}
                    ></RoleAvatar>
                  </Link>
                }
                title={
                  <Link href={`/admin/partner/${item._id}`} className='user-name'>
                    {item.name}
                  </Link>
                }
                description={item.phone}
              />
              <Segmented
                value={item.status === 1 ? 'unlock' : 'lock'}
                className={
                  item.status === 1 ? 'ant-segmented-status unlock' : 'ant-segmented-status lock'
                }
                options={[
                  {
                    value: 'unlock',
                    icon: <FaUnlockAlt />,
                  },
                  {
                    value: 'lock',
                    icon: <FaLock />,
                  },
                ]}
                disabled={blockUserLoading || unBlockUserLoading}
                onChange={(v) => handleChangeUserStatus(item._id, v as string)}
              />
            </List.Item>
          )}
        ></ListContainer>
      </Card>
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  padding: 0 24px 24px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  .page-header {
    padding: 24px 0;
    .page-title {
      margin: 0;
    }
  }
  .header-filter-container {
    width: 100%;
    padding: 24px 24px 24px;
    .ant-space-item:first-of-type {
      flex: 1 1 auto;
    }
  }

  @media screen and (max-width: 767.98px) {
    & {
      height: 100%;
    }
  }

  @media screen and (max-width: 400.98px) {
    & {
      padding: 0 0 24px;
      height: 100%;
    }
    .page-header {
      padding: 24px;
    }
    .ant-card {
      border: none !important;
      border-radius: 0;
    }
  }
`;

const ListContainer = styled(StyledListContainer<TUser>)``;

export default WithAdmin(HomePage);
