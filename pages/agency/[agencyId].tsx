import styled from '@emotion/styled';
import {
  Badge,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Segmented,
  Space,
  Statistic,
  Tabs,
  theme,
  Typography,
} from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsArrowUp } from 'react-icons/bs';
import { FaLock, FaUnlockAlt } from 'react-icons/fa';
import { IoMdCar } from 'react-icons/io';
import { MdEmojiTransportation } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import TypeAgencyAvatar from 'src/components/avatar/TypeAgencyAvatar';
import PMBreadcrumb from 'src/components/breadcrumb/PMBreadcrumb';
import Button from 'src/components/button/Button';
import InputCode from 'src/components/input/InputCode';
import CarList from 'src/components/list/CarList';
import DriverList from 'src/components/list/DriverList';
import useApp from 'src/hooks/useApp';
import useChangeStatusAgency from 'src/hooks/useChangeStatusAgency';
import WithAuth from 'src/hooks/withAuth';
import {
  useGetAgencyDetailQuery,
  useUpdateAgencyDetailMutation,
} from 'src/redux/query/agency.query';
import { ErrorCode } from 'src/types/response.types';
import { getRandomInt } from 'src/utils/utils';
import { mappedErrorToFormError } from 'src/utils/utils-error';

function AgencyDetailPage() {
  const {
    query: { agencyId },
  } = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { message } = useApp();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const [selectedTab, setSelectedTab] = useState('Profile');
  const [form] = Form.useForm();

  const { handleChangeStatus, blockLoading, unBlockLoading } = useChangeStatusAgency();
  const { isFetching, refetch, data } = useGetAgencyDetailQuery(String(agencyId), {
    skip: !agencyId,
    refetchOnMountOrArgChange: true,
  });
  const agencyData = data?.data.agency_detail;

  const [updateAgency, { isLoading }] = useUpdateAgencyDetailMutation();
  useEffect(() => {
    form.setFieldsValue({
      ...agencyData,
      lat_long:
        agencyData?.lat_address === ''
          ? ''
          : `${agencyData?.lat_address}, ${agencyData?.long_address}`,
    });
    setMap(`${agencyData?.lat_address}, ${agencyData?.long_address}`);
  }, [isFetching, agencyData, form]);

  const handleUpdateInfo = ({ lat_long, ...formData }: any) => {
    let [lat_address, long_address] = lat_long
      .replace(',', ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');

    if (lat_long.trim() === '') {
      lat_address = '';
      long_address = '';
    }
    const newFormData = {
      lat_address,
      long_address,
      ...formData,
    };
    !!agencyId &&
      updateAgency({ id: String(agencyId), data: newFormData })
        .unwrap()
        .then((res) => {
          message.success(res.message);
        })
        .catch((err) => {
          if ([ErrorCode.BadRequest, ErrorCode.DataNotFound].includes(err.response_code))
            message.error(err.error[0].message);
          if (err.response_code === ErrorCode.RequestValidationError) {
            form.setFields(mappedErrorToFormError(err.error));
          }
        });
  };

  const handleReset = () => {
    form.setFieldsValue(agencyData);
  };

  const MAP_API_KEY = 'AIzaSyC5MTim8olw6C3i3_uQj6tj-dfMEuGViZE';
  const [MAP, setMap] = useState('21.004366,105.846573');
  const updateMap = (lat_long: string) => {
    setMap(lat_long.replace(',', ' ').replace(/\s+/g, ' ').trim().replace(' ', ','));
    if (lat_long == '') setMap('21.004366,105.846573');
  };

  return (
    <PageWrapper className='main-page'>
      <Row className='page-header' gutter={[0, 0]}>
        {!mediaAbove767 && (
          <Col span={24} style={{ marginBottom: 12 }}>
            <PMBreadcrumb />
          </Col>
        )}
        {!!agencyData && (
          <Col span={24} className='page-header-info'>
            <TypeAgencyAvatar
              size={48}
              offset={[0, 34]}
              isActive={agencyData.status === 1}
              isDriver={agencyData.isDriver}
              isTransportation={agencyData.isTransportation}
            ></TypeAgencyAvatar>
            <Typography.Title className='page-title' level={2} ellipsis>
              {agencyData.name}
            </Typography.Title>
            <Badge dot status={agencyData?.status === 1 ? 'success' : 'error'}>
              <Segmented
                value={agencyData?.status === 1 ? 'unlock' : 'lock'}
                className={
                  agencyData?.status === 1
                    ? 'ant-segmented-status unlock'
                    : 'ant-segmented-status lock'
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
                onChange={(v) => !!agencyId && handleChangeStatus(String(agencyId), v as string)}
              />
            </Badge>
          </Col>
        )}
        <Col span={24}>
          <Tabs
            defaultActiveKey='Profile'
            onChange={(t) => setSelectedTab(t)}
            size='large'
            style={{
              background: 'transparent',
            }}
            tabBarExtraContent={{
              left: <div className='timeline'></div>,
            }}
            tabBarStyle={{
              marginBottom: 0,
              padding: 0,
            }}
            tabBarGutter={24}
            items={[
              {
                label: 'Profile',
                key: 'Profile',
                disabled: isFetching || isLoading,
              },

              {
                label: !!agencyData?.isTransportation && 'Driver & Car',
                key: !!agencyData?.isTransportation ? 'Driver_Car' : '',
                disabled: !!agencyData?.isTransportation && (isFetching || isLoading),
              },
            ]}
          />
        </Col>
      </Row>
      {selectedTab === 'Profile' && (
        <Form
          form={form}
          layout='vertical'
          size='large'
          onFinish={handleUpdateInfo}
          disabled={isFetching || isLoading || selectedTab !== 'Profile'}
          autoComplete='off'
          requiredMark={false}
          // style={{ display: selectedTab === 'Profile' ? 'block' : 'none' }}
        >
          <Row gutter={[24, 24]}>
            <Col flex='auto' className='col-left'>
              <Card>
                <Form.Item
                  name='name'
                  label='Name'
                  rules={[{ required: true, message: '• Name is required' }]}
                >
                  <Input type='text' placeholder='Name...' />
                </Form.Item>
                <Form.Item
                  name='phone'
                  label='PhoneNumber'
                  rules={[{ required: true, message: '• Phone is required' }]}
                >
                  <Input type='tel' placeholder='PhoneNumber...' />
                </Form.Item>
              </Card>

              <Card>
                <Form.Item
                  name='address'
                  label='Address'
                  // rules={[{ required: true, message: '• Address is required' }]}
                >
                  <Input.TextArea placeholder='Address...' autoSize={{ minRows: 2 }} showCount />
                </Form.Item>
                <Form.Item label='Map' tooltip='Lat | Long'>
                  <Space.Compact block size='large'>
                    <Form.Item name='lat_long' noStyle>
                      <Input
                        onChange={(e) => updateMap(e.target.value)}
                        placeholder='Lat, long...'
                        step='0.00001'
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
                <iframe
                  height={200}
                  src={`https://www.google.com/maps/embed/v1/place?key=${MAP_API_KEY}&q=${MAP}`}
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                ></iframe>
              </Card>

              <Card>
                <Form.Item
                  name='code'
                  label='Code'
                  rules={[{ required: true, type: 'string', message: '• Code is required' }]}
                >
                  <InputCode
                    onClickGenerate={() => {
                      form.setFieldValue('code', String(getRandomInt()));
                    }}
                  />
                </Form.Item>
              </Card>
            </Col>
            <Col flex='320px' className='col-right'>
              <Card>
                <Form.Item label='Type' required>
                  <div className='checkbox-type-group'>
                    <Form.Item
                      name='isDriver'
                      valuePropName='checked'
                      noStyle
                      rules={[{ type: 'boolean', message: '• isDriver is invalid' }]}
                    >
                      <Checkbox className='checkbox-item'>
                        <IoMdCar size={20} />
                        <span>Driver</span>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name='isTransportation'
                      valuePropName='checked'
                      noStyle
                      rules={[{ type: 'boolean', message: '• isTransportation is invalid' }]}
                    >
                      <Checkbox className='checkbox-item'>
                        <MdEmojiTransportation size={24} />
                        <span>Transportation</span>
                      </Checkbox>
                    </Form.Item>
                  </div>
                </Form.Item>
                <div>
                  <Statistic
                    loading={isFetching}
                    title='Cars owned'
                    value={agencyData?.hasCar || 0}
                    prefix={<IoMdCar size={32} />}
                  />
                </div>
                <Divider />
                {/* <PointSlideFormItem /> */}
                <Form.Item
                  name='point'
                  label='Point'
                  extra={'Rate agency to return agency priority search'}
                >
                  <InputNumber step={1} style={{ width: '100%' }} />
                </Form.Item>
                <Divider />
                <Form.Item
                  name='rank'
                  label='Rank'
                  extra={'Rate agency to return agency priority search'}
                >
                  <InputNumber step={1} style={{ width: '100%' }} />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Divider />
          <Form.Item className='actions-container'>
            <Button htmlType='reset' block disabled={isLoading} onClick={() => handleReset()}>
              Reset
            </Button>
            <Button htmlType='submit' block loading={isLoading} type='primary' icon={<BsArrowUp />}>
              Update
            </Button>
          </Form.Item>
        </Form>
      )}
      {selectedTab === 'Driver_Car' && (
        <div className='tab2-container'>
          <div className='tab2-left' style={{ backgroundColor: colorBgContainer }}>
            <DriverList />
          </div>
          <div className='tab2-right' style={{ backgroundColor: colorBgContainer }}>
            <CarList />
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  padding: 0 24px;
  .page-header {
    padding: 24px 0;
    & .timeline {
      position: relative;
      width: 58px;
      height: 24px;
      margin-right: 14px;
      &::before {
        content: '';
        width: 2px;
        height: 12px;
        background: ${({ theme }) => theme.colorPrimary};
        position: absolute;
        left: 50%;
        top: 2px;
        transform: translate(-50%, -100%);
      }
      &::after {
        content: '';
        position: absolute;
        background: ${({ theme }) => theme.colorPrimary};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
      }
    }
  }
  .page-header-info {
    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;
    padding-left: 4px;
    .page-title {
      margin-left: 18px;
    }
    .ant-badge:last-child {
      margin-left: auto;
    }
  }
  .ant-form-vertical {
    .col-right,
    .col-left {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .point-container {
      position: relative;
      .point-actions {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .ant-input-textarea-show-count::after {
      position: absolute;
      top: 0;
      right: 0;
      transform: translateY(calc(-100% - 8px));
    }
    .actions-container {
      .ant-form-item-control-input-content {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 24px;
      }
      & button[type='reset'] {
        width: 160px;
      }
      & button[type='submit'] {
        width: 296px;
      }
    }
  }
  .checkbox-type-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    .checkbox-item {
      padding: 8px 24px 8px 8px;
      border: 1px solid #d9d9d9;
      position: relative;
      align-items: center;
      border-radius: 8px;
      margin-left: 0;
      & span:last-of-type {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      &.ant-checkbox-wrapper-checked {
        border: 1px solid ${({ theme }) => theme.colorPrimary};
        color: ${({ theme }) => theme.colorPrimary};
      }
      .ant-checkbox {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-50%, 50%);
      }
    }
  }
  .tab2-container {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    flex-wrap: nowrap;
    margin-bottom: 24px;
    .tab2-left {
      background-color: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 50%;
    }
    .tab2-right {
      background-color: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 50%;
    }
    @media screen and (max-width: 767.98px) {
      flex-direction: column;
      .tab2-right,
      .tab2-left {
        max-width: 100%;
      }
    }
  }

  @media screen and (max-width: 767.98px) {
    .ant-form-vertical {
      .col-right {
        flex: 0 0 auto !important;
      }
    }
  }
  @media screen and (max-width: 400.98px) {
    padding: 0 12px;
    .page-header-info {
      .page-title {
        font-size: 22px;
      }
    }
  }
`;

export default WithAuth(AgencyDetailPage);
