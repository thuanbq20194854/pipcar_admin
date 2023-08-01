import styled from '@emotion/styled';
import { Card, Col, Divider, Form, List, Row, Space, Tag, theme, Typography } from 'antd';
import { Fragment, useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';
import TypeAgencyAvatar from 'src/components/avatar/TypeAgencyAvatar';
import PMBreadcrumb from 'src/components/breadcrumb/PMBreadcrumb';
import Button from 'src/components/button/Button';
import SortDropdown from 'src/components/dropdown/SortDropdown';
import ConfirmRegisterModal from 'src/components/form/ConfirmRegisterModal';
import InputSearch from 'src/components/input/InputSearch';
import StyledListContainer from 'src/components/list/StyledListContainer';
import Link from 'src/components/next/Link';
import useDebounce from 'src/hooks/useDebounce';
import WithAuth from 'src/hooks/withAuth';
import { TListFilter, useGetRegisterListQuery } from 'src/redux/query/register.query';
import { setExtraState, setVisibleItem } from 'src/redux/reducer/visible.reducer';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { TRegister } from 'src/types/register.types';
import { TMetaBase } from 'src/types/response.types';

const initialFilterValue: TListFilter = { page: 1, limit: 10, status: 0 };

function RegisterListPage() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { extraState, visibleItem } = useAppSelector((s) => s.visible);
  const dispatch = useAppDispatch();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const mediaAbove500 = useMediaQuery({ minWidth: 500 });

  const [selectedTab, setSelectedTab] = useState('isAgency_true_status_0');
  const [usersFilterValue, setUsersFilterValue] = useState<TListFilter>({
    ...initialFilterValue,
    isAgency: true,
  });

  const debouncedFilter = useDebounce(usersFilterValue, 500);
  const {
    data: registersFilteredQuery,
    isSuccess: getRegistersSuccess,
    isFetching: getRegistersFetching,
  } = useGetRegisterListQuery(debouncedFilter, { refetchOnMountOrArgChange: true });
  const registersFilteredData = getRegistersSuccess
    ? registersFilteredQuery?.data?.register_list || []
    : [];
  const usersFilteredMetaData: TMetaBase | undefined = getRegistersSuccess
    ? registersFilteredQuery?.data?.meta_data
    : undefined;

  const [form] = Form.useForm();

  const handleConfirmRegister = ({ id, code }: any) => {
    dispatch(setVisibleItem('ConfirmRegisterModal'));
    dispatch(setExtraState({ id, code }));
  };

  const handleTabChange = (key: string) => {
    const items = key.split('_');
    let filter: { [key: string]: string } = {};
    for (let i = 0; i < items.length; i += 2) {
      filter[items[i]] = items[i + 1];
    }
    setUsersFilterValue({ ...initialFilterValue, ...filter });
    setSelectedTab(key);
  };
  return (
    <PageWrapper className='main-page'>
      <Row className='page-header'>
        <Col flex='auto'>
          {!mediaAbove767 && <PMBreadcrumb />}
          <Typography.Title className='page-title' level={2}>
            Register Unconfirmed List
          </Typography.Title>
        </Col>
        <Col flex='none'></Col>
      </Row>
      <Card
        style={{ width: '100%' }}
        bodyStyle={{ padding: 0 }}
        tabList={[
          {
            key: 'isAgency_true_status_0',
            tab: 'Agency',
          },
          {
            key: 'isTransportationDriver_true_status_0',
            tab: 'Trans & Driver',
          },
          {
            key: 'isTransportation_true_status_0',
            tab: 'Transportation',
          },
          {
            key: 'isDriver_true_status_0',
            tab: 'Driver',
          },
        ]}
        activeTabKey={selectedTab}
        onTabChange={(key) => handleTabChange(key)}
      >
        <Form
          className='filter-container'
          form={form}
          onFinish={(formValues) => {
            const { sort, keyword } = formValues as any;
            setUsersFilterValue({ ...usersFilterValue, sort, keyword });
          }}
          onValuesChange={(values) => {
            const { sort, keyword } = values as any;
            setUsersFilterValue({ ...usersFilterValue, sort, keyword });
          }}
        >
          <Form.Item noStyle name='keyword'>
            <InputSearch
              placeholder={mediaAbove500 ? 'Search by Name, Phone...' : 'by Name, Phone...'}
              suffix={
                <>
                  <Divider type='vertical' />
                  <Form.Item noStyle name='sort'>
                    <SortDropdown
                      items={[
                        { key: 'name_asc', label: `Tên A->Z` },
                        { key: 'name_desc', label: `Tên Z->A` },
                        { key: 'createdAt_desc', label: 'Ngày tạo mới nhất' },
                        { key: 'createdAt_asc', label: 'Ngày tạo cũ nhất' },
                      ]}
                    />
                  </Form.Item>
                </>
              }
            />
          </Form.Item>
        </Form>
        <ListContainer
          loading={getRegistersFetching}
          dataSource={registersFilteredData}
          pagination={{
            metadata: usersFilteredMetaData,
            onChange: (page, pageSize) =>
              setUsersFilterValue({ ...usersFilterValue, page, limit: pageSize }),
          }}
          renderItem={(item) => (
            <List.Item className='item-container'>
              <Space split={<Divider type='vertical' />}>
                <List.Item.Meta
                  avatar={
                    <Link href={`/register/${item._id}`}>
                      <TypeAgencyAvatar
                        size={48}
                        offset={[0, 34]}
                        isActive={item.status === 1}
                        isDriver={item.isDriver}
                        isTransportation={item.isTransportation}
                      ></TypeAgencyAvatar>
                    </Link>
                  }
                  title={
                    <Link href={`/register/${item._id}`} className='user-name'>
                      {item.name}
                    </Link>
                  }
                  description={
                    <Typography.Text copyable={{ tooltips: false }} ellipsis>
                      {item.phone}
                    </Typography.Text>
                  }
                />
              </Space>
              <Space split={<Divider type='vertical' />} size={mediaAbove767 ? 8 : 0}>
                {mediaAbove767 && (
                  <Fragment>
                    <Space>
                      {item.isTransportation && <Tag color='geekblue'>Transportation</Tag>}
                      {item.isDriver && <Tag color='blue'>Driver</Tag>}
                    </Space>

                    <Tag color={item.status === 1 ? 'success' : 'error'}>
                      <Typography.Text copyable={{ tooltips: false }}>{item.code}</Typography.Text>
                    </Tag>
                  </Fragment>
                )}

                <Button
                  className='confirm-button'
                  icon={<BsCheckLg />}
                  ghost
                  type='primary'
                  size={mediaAbove767 ? 'middle' : 'small'}
                  disabled={item?.status === 1 || visibleItem === 'ConfirmRegisterModal'}
                  loading={(extraState?.id || 'ConfirmRegisterModal') === item._id}
                  onClick={() =>
                    !!item._id && handleConfirmRegister({ id: item._id, code: item.code })
                  }
                >
                  {item?.status === 1 ? 'Confirmed' : 'Confirm'}
                </Button>
              </Space>
            </List.Item>
          )}
        ></ListContainer>
      </Card>
      {visibleItem === 'ConfirmRegisterModal' && !!extraState && <ConfirmRegisterModal />}
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
  .filter-container {
    width: 100%;
    padding: 24px 24px 12px 24px;
  }

  @media screen and (max-width: 767.98px) {
    & {
      height: 100%;
      padding: 0 12px;
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

const ListContainer = styled(StyledListContainer<TRegister>)`
  .ant-list-item-meta-title {
    width: 220px;
    max-width: 220px;
  }
`;

export default WithAuth(RegisterListPage);
