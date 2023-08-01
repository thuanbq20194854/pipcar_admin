import styled from '@emotion/styled';
import {
  Alert,
  Avatar,
  Badge,
  Descriptions,
  Divider,
  Empty,
  Form,
  Pagination,
  Popover,
  Radio,
  Space,
  Typography,
} from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { BsFillPersonFill, BsInfoCircleFill } from 'react-icons/bs';
import { GiCheckboxTree } from 'react-icons/gi';
import { IoMdCar } from 'react-icons/io';
import { MdOutlineAirlineSeatReclineNormal } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import useApp from 'src/hooks/useApp';
import useModalDangerConfirm from 'src/hooks/useModalDangerConfirm';
import { carApi, useGetCarDetailQuery } from 'src/redux/query/car.query';
import {
  TListFilter,
  useDeliverDriverMutation,
  useGetDriverListQuery,
  useUnDeliverCarMutation,
} from 'src/redux/query/driver.query';
import { useAppDispatch } from 'src/redux/store';
import { ErrorCode } from 'src/types/response.types';
import { mappedErrorToFormError } from 'src/utils/utils-error';
import Button from '../button/Button';
import Tag from '../tag/Tag';
import Modal from './Modal';

type TProps = {
  carId: string;
};

function DeliverCarModal({ carId }: TProps) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mediaAbove1023 = useMediaQuery({ minWidth: 1023 });
  const mediaBelow481 = useMediaQuery({ maxWidth: 481 });
  const mediaBelow376 = useMediaQuery({ maxWidth: 376 });
  const mediaBetween424768 = useMediaQuery({ minWidth: 424, maxWidth: 768 });
  const {
    query: { agencyId },
  } = useRouter();
  const { notification } = useApp();
  const dispatch = useAppDispatch();
  const [filterValue, setFilterValue] = useState<TListFilter>({
    agency: String(agencyId),
    page: 1,
    limit: 6,
    isDriving: false,
  });
  const { isFetching: isFetchingDriverList, data: dataDriverList } = useGetDriverListQuery(
    filterValue,
    {
      skip: !agencyId || !isModalOpen,
      refetchOnMountOrArgChange: true,
    },
  );
  const driverList = dataDriverList?.data?.driver_list || [];
  const driverListMetaData = dataDriverList?.data?.meta_data || undefined;

  const { data, isFetching } = useGetCarDetailQuery(carId, {
    skip: !isModalOpen,
    refetchOnMountOrArgChange: true,
  });
  const carDetail = data?.data.car_detail;
  const driverDetail = data?.data.driver_detail;

  const [deliverMutate, { isLoading: isLoadingDeliver }] = useDeliverDriverMutation();
  const [unDeliverCarMutate, { isLoading: isLoadingUndeliver }] = useUnDeliverCarMutation();
  const isLoading = isLoadingDeliver || isLoadingUndeliver;

  const watchDriverId = Form.useWatch('driverId', form);

  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      unDeliverCarMutate(id)
        .unwrap()
        .then(({ data, message }) => {
          notification.success({ message, placement: 'bottomLeft' });
          dispatch(carApi.util.invalidateTags([{ type: 'Cars', id: id }]));
          setIsModalOpen(false);
        })
        .catch((err) => {
          if ([ErrorCode.BadRequest, ErrorCode.DataNotFound].includes(err.response_code))
            notification.error({ message: err.error[0].message, placement: 'bottomLeft' });
        });
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(({ driverId }) => {
        deliverMutate({ car: carId, driverId })
          .unwrap()
          .then(({ data, message }) => {
            notification.success({ message, placement: 'bottomLeft' });
            form.resetFields();
            dispatch(carApi.util.invalidateTags([{ type: 'Cars', id: carId }]));
            setIsModalOpen(false);
          })
          .catch((err) => {
            if ([ErrorCode.BadRequest, ErrorCode.DataNotFound].includes(err.response_code))
              notification.error({ message: err.error[0].message, placement: 'bottomLeft' });
            if ([ErrorCode.RequestValidationError].includes(err.response_code))
              form.setFields(mappedErrorToFormError(err.error));
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <Button
        loading={isModalOpen}
        icon={<GiCheckboxTree size={18} />}
        type='link'
        onClick={showModal}
      >
        {(mediaAbove1023 || mediaBetween424768) && 'Deliver'}
      </Button>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          confirmLoading={isLoading}
          onOk={handleOk}
          onCancel={handleCancel}
          title={
            mediaBelow481 ? (
              <>
                <span style={{ marginRight: 8 }}>Deliver car to driver</span>
                {!!driverDetail && !!carDetail && (
                  <Button
                    icon={<GiCheckboxTree size={18} />}
                    type='dashed'
                    size={mediaBelow376 ? 'small' : 'middle'}
                    onClick={() => handleConfirm(carId, carDetail.name, 'cancel deliver')}
                  >
                    Cancel
                  </Button>
                )}
              </>
            ) : (
              'Deliver car to driver'
            )
          }
          okText='Deliver'
          cancelText='Cancel'
          okButtonProps={{ size: 'large', disabled: isLoading || !watchDriverId }}
          cancelButtonProps={{ size: 'large', disabled: isLoading }}
          style={{ top: 64 }}
        >
          <ModalBodyWrapper>
            {!!carDetail ? (
              <div className='detail-container'>
                <Avatar shape='square' size={68} icon={<IoMdCar />}>
                  {carDetail.name}
                </Avatar>
                <div className='info-container'>
                  <Typography.Title level={mediaBelow376 ? 4 : 3} style={{ margin: 0 }} ellipsis>
                    {carDetail.name}
                  </Typography.Title>
                  <Space
                    wrap
                    size={0}
                    split={<Divider type='vertical' />}
                    style={{ marginTop: 'auto' }}
                  >
                    <Tag icon={<MdOutlineAirlineSeatReclineNormal />}>{carDetail.type}</Tag>
                    <Typography.Text type='secondary'>{carDetail.plates}</Typography.Text>
                  </Space>
                </div>
                {!mediaBelow481 && !!driverDetail && (
                  <div className='action-container'>
                    <Button
                      icon={<GiCheckboxTree size={18} />}
                      type='dashed'
                      size={mediaBelow376 ? 'small' : 'middle'}
                      onClick={() => handleConfirm(carId, carDetail.name, 'cancel deliver')}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className='item-empty' style={{ marginBottom: 12 }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
            {!!driverDetail && (
              <Alert
                type='info'
                showIcon
                icon={<BsFillPersonFill size={28} />}
                message={
                  <div className='driving-car'>
                    <div className='info-container'>
                      <div>
                        <Typography.Text strong ellipsis className='name'>
                          {driverDetail.name}
                        </Typography.Text>
                        <Popover
                          arrow={false}
                          placement='bottomLeft'
                          overlayStyle={{ maxWidth: 320 }}
                          trigger={mediaAbove1023 ? 'hover' : 'click'}
                          content={
                            <Descriptions column={2} size='small'>
                              <Descriptions.Item label='LicenseID' span={2}>
                                {driverDetail.license_id}
                              </Descriptions.Item>
                              <Descriptions.Item label='Phone' span={2}>
                                {driverDetail.phone}
                              </Descriptions.Item>
                              <Descriptions.Item label='Address' span={2}>
                                {driverDetail.address}
                              </Descriptions.Item>
                            </Descriptions>
                          }
                        >
                          <BsInfoCircleFill className='info-icon' />
                        </Popover>
                      </div>
                      <Typography.Text type='secondary' ellipsis className='plates'>
                        {driverDetail.license_id} • {driverDetail.phone}
                      </Typography.Text>
                    </div>
                    <div className='badge-container'>
                      <Badge status='processing' text='Currently Driving' />
                    </div>
                  </div>
                }
              />
            )}
            {driverList.length > 0 ? (
              <Form form={form} layout='vertical' size='large' disabled={isLoading}>
                <Form.Item
                  name='driverId'
                  label='Choose driver'
                  hasFeedback={isLoading}
                  validateStatus={isLoading ? 'validating' : undefined}
                  rules={[{ required: true, message: '• DriverId is required' }]}
                >
                  <Radio.Group size='large' className='list-group'>
                    {driverList.map((item) => (
                      <Radio.Button
                        className={
                          watchDriverId === item._id ? 'list-wrapper checked' : 'list-wrapper'
                        }
                        value={item._id}
                        key={item._id}
                      >
                        <Avatar shape='square' size={52} icon={<BsFillPersonFill />}>
                          {item.name}
                        </Avatar>
                        <div className='info-container'>
                          <Typography.Text strong ellipsis>
                            {item.name}
                          </Typography.Text>
                          <Typography.Text type='secondary' ellipsis>
                            {item.phone}
                          </Typography.Text>
                        </div>
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Form>
            ) : (
              <div className='item-empty' style={{ marginTop: 12 }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description='Not found any available driver'
                />
              </div>
            )}
            <div className='pagination-container'>
              {(driverListMetaData?.totalPage || 0) > 1 && (
                <Pagination
                  size='small'
                  showSizeChanger={false}
                  current={filterValue.page}
                  onChange={(page, pageSize) =>
                    setFilterValue({ ...filterValue, page, limit: pageSize })
                  }
                  pageSize={filterValue.limit}
                  total={driverListMetaData?.total || 0}
                />
              )}
            </div>
          </ModalBodyWrapper>
        </Modal>
      )}
    </Fragment>
  );
}

export const ModalBodyWrapper = styled.div`
  position: relative;
  .detail-container {
    display: flex;
    margin-bottom: 12px;
    .ant-avatar-square {
      border-radius: 4px;
      flex-shrink: 0;
    }
    .info-container {
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .ant-typography-secondary {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        & > svg {
          margin-right: 4px;
        }
      }
      .ant-tag {
        padding-left: 6px;
        padding-right: 6px;
        border-radius: 4px;
        margin: 0;
      }
    }
    .action-container {
      margin-left: auto;
    }
  }
  .list-group {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-left: -8px;
    margin-bottom: -8px;
    @media screen and (max-width: 424.98px) {
      flex-direction: column;
    }
  }
  .list-wrapper {
    height: 52px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    padding-left: 60px;
    padding-right: 8px;
    border-radius: 4px !important;
    margin-left: 8px;
    margin-bottom: 8px;
    width: calc(50% - 8px);
    @media screen and (max-width: 424.98px) {
      width: calc(100% - 8px);
    }

    .ant-avatar-square {
      position: absolute;
      left: 0;
      top: 0;
      height: 100% !important;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0;
    }
    &.checked {
      .ant-avatar-square {
        background-color: ${({ theme }) => theme.colorPrimary};
      }
    }
  }
  .info-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 4px 0;
  }
  .ant-typography-ellipsis {
    max-width: 174px;
  }
  h3.ant-typography-ellipsis {
    max-width: 224px;
  }
  h4.ant-typography-ellipsis {
    max-width: 144px;
  }
  .ant-alert-info {
    border-radius: 4px;
    .ant-badge-status-text {
      color: ${({ theme }) => theme.colorPrimary};
    }
  }
  .driving-car {
    display: flex;
    align-items: flex-start;
    .ant-avatar-square {
      border-radius: 4px;
      background-color: #91caff;
    }
    .info-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 4px;
      .name {
        color: #1677ff;
      }
      .info-icon {
        color: #1677ff;
        margin-left: 8px;
        cursor: pointer;
        user-select: none;
      }
      .plates {
        color: #4ea7fb;
      }
    }
    .badge-container {
      margin-left: auto;
      align-self: center;
      @media screen and (max-width: 374.98px) {
        .ant-badge-status-text {
          display: none;
        }
      }
    }
  }
  .ant-form-vertical {
    margin-top: 24px;
  }
  .pagination-container {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translate(-6px, 72px);
    width: 240px;
    z-index: 1;
    @media screen and (max-width: 767.98px) {
      position: relative;
      width: 100%;
      transform: translate(0, 0);
      .ant-pagination {
        width: fit-content;
        margin-left: auto;
      }
    }
  }
  .item-empty {
    margin-top: 24px;
    border-radius: 8px;
    border: 1px dashed #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default DeliverCarModal;
