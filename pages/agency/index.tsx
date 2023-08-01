import styled from '@emotion/styled';
import { Card, Col, Divider, Form, List, Row, Segmented, Space, Tag, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { FaLock, FaUnlockAlt } from 'react-icons/fa';
import { IoMdCar } from 'react-icons/io';
import { useMediaQuery } from 'react-responsive';
import TypeAgencyAvatar from 'src/components/avatar/TypeAgencyAvatar';
import PMBreadcrumb from 'src/components/breadcrumb/PMBreadcrumb';
import Button from 'src/components/button/Button';
import SortDropdown from 'src/components/dropdown/SortDropdown';
import InputSearch from 'src/components/input/InputSearch';
import StyledListContainer from 'src/components/list/StyledListContainer';
import Link from 'src/components/next/Link';
import useChangeStatusAgency from 'src/hooks/useChangeStatusAgency';
import useDebounce from 'src/hooks/useDebounce';
import WithAuth from 'src/hooks/withAuth';
import { TListFilter, useGetAgencyListQuery } from 'src/redux/query/agency.query';
import { TAgency } from 'src/types/agency.types';
import { TMetaBase } from 'src/types/response.types';

const initialFilterValue: TListFilter = { page: 1, limit: 10, status: 1 };

function AgencyListPage() {
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const mediaAbove500 = useMediaQuery({ minWidth: 500 });

  const router = useRouter();
  const { tab } = router.query;
  const tabInitState: string | undefined = Array.isArray(tab) ? tab.join('') : tab;
  const [selectedTab, setSelectedTab] = useState(tabInitState);

  const [key, value] = tabInitState ? tabInitState.split('_') : ['isAgency', true];
  const [filterValue, setFilterValue] = useState<TListFilter>({
    ...initialFilterValue,
    [key]: value,
  });

  const debouncedFilter = useDebounce(filterValue, 500);
  const {
    data: agenciesFilteredQuery,
    isSuccess: getAgenciesSuccess,
    isFetching: getAgenciesFetching,
  } = useGetAgencyListQuery(debouncedFilter, { refetchOnMountOrArgChange: true });
  const agenciesFilteredData = getAgenciesSuccess
    ? agenciesFilteredQuery?.data?.agency_list || []
    : [];

  console.log('agenciesFilteredData: ', agenciesFilteredData);

  const filteredMetaData: TMetaBase | undefined = getAgenciesSuccess
    ? agenciesFilteredQuery?.data?.meta_data
    : undefined;

  const [form] = Form.useForm();

  const { handleChangeStatus, blockLoading, unBlockLoading } = useChangeStatusAgency();
  const handleTabChange = (key: string) => {
    setFilterValue(initialFilterValue);
    const items = key.split('_');
    let filter: { [key: string]: string } = {};
    for (let i = 0; i < items.length; i += 2) {
      filter[items[i]] = items[i + 1];
    }
    setFilterValue({ ...initialFilterValue, ...filter });
    setSelectedTab(key);
  };

  return (
    <PageWrapper className='main-page'>
      <Row className='page-header'>
        <Col flex='auto'>
          {!mediaAbove767 && <PMBreadcrumb />}
          <Typography.Title className='page-title' level={2}>
            Agency List
          </Typography.Title>
        </Col>
        <Col flex='none'>
          <Link href='/agency/create'>
            <Button type='primary' icon={<BsPlusLg />}>
              {mediaAbove500 ? 'Add new Agency' : 'Add'}
            </Button>
          </Link>
        </Col>
      </Row>
      <Card
        style={{ width: '100%' }}
        bodyStyle={{ padding: 0 }}
        tabList={[
          {
            key: 'isAgency_true_status_1',
            tab: 'Agency',
          },
          {
            key: 'isTransportationDriver_true_status_1',
            tab: 'Trans & Driver',
          },
          {
            key: 'isTransportation_true_status_1',
            tab: 'Transportation',
          },
          {
            key: 'isDriver_true_status_1',
            tab: 'Driver',
          },
          {
            key: 'status_2',
            tab: 'Blocked',
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
            setFilterValue({ ...filterValue, sort, keyword });
          }}
          onValuesChange={(values) => {
            const { sort, keyword } = values as any;
            setFilterValue({ ...filterValue, sort, keyword });
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
          loading={getAgenciesFetching}
          dataSource={agenciesFilteredData}
          pagination={{
            metadata: filteredMetaData,
            onChange: (page, pageSize) => setFilterValue({ ...filterValue, page, limit: pageSize }),
          }}
          renderItem={(item) => (
            <List.Item className='item-container'>
              <Space split={<Divider type='vertical' />}>
                <List.Item.Meta
                  style={{ width: 220, maxWidth: 220 }}
                  avatar={
                    <Link href={`/agency/${item._id}`}>
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
                    <Link href={`/agency/${item._id}`} className='user-name'>
                      {item.name}
                    </Link>
                  }
                  description={item.phone}
                />

                {mediaAbove500 && (
                  <Tag color='geekblue' icon={<IoMdCar />}>
                    {item.hasCar}
                  </Tag>
                )}
              </Space>
              <Space split={<Divider type='vertical' />}>
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
                  disabled={blockLoading || unBlockLoading}
                  onChange={(v) => handleChangeStatus(item._id, v as string)}
                />
              </Space>
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

const ListContainer = styled(StyledListContainer<TAgency>)``;

export default WithAuth(AgencyListPage);
