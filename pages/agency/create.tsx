import styled from '@emotion/styled';
import {
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';

import type { DefaultOptionType } from 'antd/es/cascader';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsBoxArrowUpRight, BsDashLg, BsPlusLg } from 'react-icons/bs';
import { IoMdCar } from 'react-icons/io';
import { MdEmojiTransportation, MdOutlineAirlineSeatReclineNormal } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import PMBreadcrumb from 'src/components/breadcrumb/PMBreadcrumb';
import Button from 'src/components/button/Button';
import useApp from 'src/hooks/useApp';
import WithAuth from 'src/hooks/withAuth';
import { useCreateAgencyMutation } from 'src/redux/query/agency.query';
import { ErrorCode } from 'src/types/response.types';
import { vietnameseSlug } from 'src/utils/utils';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import SoftCreateCarModal from 'src/components/modal/SoftCreateCarModal';
import SoftCreateDriverModal from 'src/components/modal/SoftCreateDriverModal';
import Link from 'src/components/next/Link';
import Tag from 'src/components/tag/Tag';
import { IDriver } from 'src/types/driver.types';
import { mappedErrorToFormError } from 'src/utils/utils-error';

const filter = (inputValue: string, path: DefaultOptionType[]) =>
  path.some(
    (option) =>
      vietnameseSlug(option.label as string, ' ').indexOf(vietnameseSlug(inputValue, ' ')) > -1,
  );

interface ICar {
  id: string;
  name: string;
  plates: string;
  type: string;
  lat?: string;
  long?: string;
}

function CreateAgencyPage() {
  const { push } = useRouter();
  const { message } = useApp();
  const [form] = Form.useForm();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const [createAgency, { isLoading }] = useCreateAgencyMutation();

  const [isTransportationChecked, setIsTransportationChecked] = useState<boolean>(false);
  const [driverList, setDriverList] = useState<IDriver[]>([]);
  const [carList, setCarList] = useState<ICar[]>([]);

  const handleAddCar = (appendedCar: ICar) => {
    setCarList((prev) => [...prev, appendedCar]);
  };

  const handleDeleteCar = (id: string) => {
    let newCarLists = carList.filter((car) => car.id !== id);

    setCarList((prev) => [...newCarLists]);
  };

  const handleAddDriver = (appendedDriver: IDriver) => {
    setDriverList((prev) => [...prev, appendedDriver]);
  };

  const handleDeleteDriver = (id: string) => {
    const newDriverList = driverList.filter((driver) => driver.id !== id);

    setDriverList((prev) => [...newDriverList]);
  };

  console.log('isTransportationChecked: ', isTransportationChecked);

  const handleCreateAgency = ({ lat_long, ...formData }: any) => {
    const [lat_address, long_address] = lat_long
      .replace(',', ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');

    /* address, lat , long không cần phải pass vào */
    const newFormData = {
      ...formData,

      lat_address: lat_address ? lat_address : '',
      long_address: long_address ? long_address : '',
      driverList:
        driverList.length > 0 && isTransportationChecked
          ? driverList.map((driver) => ({ name: driver.name, phone: driver.phone }))
          : [],
      carList:
        carList.length > 0 && isTransportationChecked
          ? carList.map((car) => ({
              name: car.name,
              plates: car.plates,
              car_type_id: car.type,
            }))
          : [],
    };
    console.log('newFormData: ', newFormData);

    createAgency({ data: newFormData })
      .unwrap()
      .then((res) => {
        message.success({
          content: (
            <Space direction='vertical' size={2} align='start'>
              <div>{res.message}</div>
              <Space
                style={{ color: '#52c41a', textDecoration: 'underline' }}
                wrap={false}
                size={2}
              >
                <BsBoxArrowUpRight />
                <Link href={`/agency/${res.data.agency_id}`}>Check Now</Link>
              </Space>
            </Space>
          ),
          style: { cursor: 'pointer' },
          // onClick: () => {
          //   push('/agency');
          //   message.destroy();
          // },
          duration: 3,
        });
        form.resetFields();

        console.log('create res: ', res);
      })
      .catch((err) => {
        if ([ErrorCode.BadRequest, ErrorCode.DataNotFound].includes(err.response_code))
          message.error(err.error[0].message);
        if (err.response_code === ErrorCode.RequestValidationError) {
          form.setFields(mappedErrorToFormError(err.error));
        }
      });
  };

  const MAP_API_KEY = 'AIzaSyC5MTim8olw6C3i3_uQj6tj-dfMEuGViZE';
  const [MAP, setMap] = useState('21.004366,105.846573');
  const updateMap = (lat_long: string) => {
    setMap(lat_long.replace(',', ' ').replace(/\s+/g, ' ').trim().replace(' ', ','));
    if (lat_long == '') setMap('21.004366,105.846573');
  };

  const handleTransportationCheckedChange = (event: CheckboxChangeEvent) => {
    setIsTransportationChecked(event.target.checked);
    console.log(event.target);
  };

  return (
    <PageWrapper className='main-page'>
      <Row className='page-header' gutter={[0, 12]}>
        {!mediaAbove767 && (
          <Col span={24}>
            <PMBreadcrumb />
          </Col>
        )}
        <Col flex='auto'>
          <Space>
            <Typography.Title className='page-title' level={2}>
              Add new Agency
            </Typography.Title>
          </Space>
        </Col>
        <Col flex='none'></Col>
      </Row>
      <Form
        form={form}
        layout='vertical'
        size='large'
        onFinish={handleCreateAgency}
        disabled={isLoading}
        autoComplete='off'
        initialValues={{
          // hasCar: 0,
          point: 0,
          rank: 0,
          isDriver: false,
          isTransportation: isTransportationChecked,
          address: '',
          lat_long: '',
          updated_gps_time: 0,
        }}
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
              <Form.Item name='address' label='Address'>
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
              {/* <iframe
                height={200}
                src={`https://www.google.com/maps/embed/v1/place?key=${MAP_API_KEY}&q=${MAP}`}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              ></iframe> */}
            </Card>
            <Card>
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

            <Form.Item className='actions-container'>
              <Button
                htmlType='reset'
                block
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Reset
              </Button>
              <Button
                htmlType='submit'
                block
                loading={isLoading}
                type='primary'
                icon={<BsPlusLg />}
              >
                Create
              </Button>
            </Form.Item>
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
                    <Checkbox
                      className='checkbox-item'
                      onChange={(e) => handleTransportationCheckedChange(e)}
                      value={isTransportationChecked}
                    >
                      <MdEmojiTransportation size={24} />
                      <span>Transportation</span>
                    </Checkbox>
                  </Form.Item>
                </div>
              </Form.Item>
              {/* <div>
                <Statistic title='Cars owned' value={0} prefix={<IoMdCar size={32} />} />
              </div> */}

              {isTransportationChecked && (
                <>
                  <div className='list-container'>
                    {carList.map((car, index) => (
                      // <div className key={index}>{car.name}</div>
                      <div className='item-container' key={index}>
                        {/* <Avatar shape='square' size={68} icon={<IoMdCar />}>
                          {item.name}
                        </Avatar> */}
                        <div className='info-container'>
                          <Typography.Text strong ellipsis>
                            <Tooltip placement='topLeft' title={car.name}>
                              {car.name}
                            </Tooltip>
                          </Typography.Text>
                          <Typography.Text type='secondary'>{car.plates}</Typography.Text>
                        </div>
                        <Tag icon={<MdOutlineAirlineSeatReclineNormal />}>{car.type}</Tag>
                        <div className='action-container'>
                          {/* <DeliverCarModal carId={'123'} /> */}
                          <Button
                            icon={<BsDashLg />}
                            type='dashed'
                            onClick={() => handleDeleteCar(car.id)}
                          ></Button>

                          {/* <div
                            className='location'
                            onClick={() => openLocation(item.lat, item.long)}
                          >
                            <GiPositionMarker /> Location
                          </div>
                          <Checkbox
                            checked={updateGpsList.find((e) => e === item._id)}
                            onChange={() => markGpsChange(item._id)}
                          ></Checkbox> */}
                        </div>
                      </div>
                    ))}
                  </div>
                  <SoftCreateCarModal onAddCar={handleAddCar} />
                  <Divider />
                  <div className='list-container'>
                    {driverList.map((driverItem) => (
                      <div className='item-container' key={driverItem.id} data-id={driverItem.id}>
                        {/* <Avatar shape='square' size={68} icon={<BsFillPersonFill />}>
                          {driverItem.name}
                        </Avatar> */}
                        <div className='info-container'>
                          <Typography.Text strong ellipsis>
                            <Tooltip placement='topLeft' title={driverItem.name}>
                              {driverItem.name}
                            </Tooltip>
                          </Typography.Text>
                          <Typography.Text type='secondary'>{driverItem.phone}</Typography.Text>
                        </div>
                        <div className='action-container'>
                          {/* <DeliverDriverModal driverId={driverItem.id} /> */}
                          <Button
                            icon={<BsDashLg />}
                            type='dashed'
                            onClick={() => handleDeleteDriver(driverItem.id)}
                          ></Button>
                          {/* {driverItem.lat && driverItem.long ? (
                            <div
                              className='location'
                              onClick={() => openLocation(driverItem.lat, driverItem.long)}
                            >
                              <GiPositionMarker /> Location
                            </div>
                          ) : (
                            <></>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                  <SoftCreateDriverModal onAddDriver={handleAddDriver} />
                </>
              )}
            </Card>
          </Col>
        </Row>

        <Divider />
      </Form>
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  padding: 0 24px;
  .ant-card-body {
    position: relative;
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
  .horizontal-form-item {
    .ant-form-item-row {
      flex-direction: row;
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

  .list-container {
    margin-bottom: 10px;
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
    .page-header {
      .page-title {
        font-size: 22px;
      }
    }
  }
`;

export default WithAuth(CreateAgencyPage);
