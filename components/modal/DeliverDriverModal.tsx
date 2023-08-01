import styled from '@emotion/styled';
import { Alert, Avatar, Badge, Empty, Form, Pagination, Radio, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { BsFillPersonFill, BsGeoAlt, BsStarFill } from 'react-icons/bs';
import { FiPhone } from 'react-icons/fi';
import { GiCheckboxTree } from 'react-icons/gi';
import { IoMdCar } from 'react-icons/io';
import { RxIdCard } from 'react-icons/rx';
import { useMediaQuery } from 'react-responsive';
import useApp from 'src/hooks/useApp';
import useModalDangerConfirm from 'src/hooks/useModalDangerConfirm';
import { TListFilter, useGetCarListQuery } from 'src/redux/query/car.query';
import {
  useDeliverDriverMutation,
  useGetDriverDetailQuery,
  useUnDeliverDriverMutation,
} from 'src/redux/query/driver.query';
import { ErrorCode } from 'src/types/response.types';
import { mappedErrorToFormError } from 'src/utils/utils-error';
import Button from '../button/Button';
import Tag from '../tag/Tag';
import TextDescription from '../text/TextDescription';
import { ModalBodyWrapper as CommonModalBodyWrapper } from './DeliverCarModal';
import Modal from './Modal';

type TProps = {
  driverId: string;
};

function DeliverCarModal({ driverId }: TProps) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mediaAbove1023 = useMediaQuery({ minWidth: 1023 });
  const mediaBelow376 = useMediaQuery({ maxWidth: 376 });
  const mediaBelow481 = useMediaQuery({ maxWidth: 481 });
  const mediaBetween424768 = useMediaQuery({ minWidth: 424, maxWidth: 768 });

  const {
    query: { agencyId },
  } = useRouter();
  const { notification } = useApp();
  const [filterValue, setFilterValue] = useState<TListFilter>({
    agency: String(agencyId),
    page: 1,
    limit: 6,
    isDriven: false,
  });
  const { isFetching: isFetchingCarList, data: dataCarList } = useGetCarListQuery(filterValue, {
    skip: !agencyId || !isModalOpen,
    refetchOnMountOrArgChange: true,
  });
  const carList = dataCarList?.data?.car_list || [];
  const carListMetaData = dataCarList?.data?.meta_data || undefined;

  const { data, isFetching } = useGetDriverDetailQuery(driverId, {
    skip: !isModalOpen,
    refetchOnMountOrArgChange: true,
  });
  const driverDetail = data?.data.driver_detail;

  const [deliverMutate, { isLoading: isLoadingDeliver }] = useDeliverDriverMutation();
  const [unDeliverMutate, { isLoading: isLoadingUndeliver }] = useUnDeliverDriverMutation();
  const isLoading = isLoadingDeliver || isLoadingUndeliver;

  const watchCarId = Form.useWatch('carId', form);

  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      unDeliverMutate(id)
        .unwrap()
        .then(({ data, message }) => {
          notification.success({ message, placement: 'bottomLeft' });
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
      .then(({ carId }) => {
        deliverMutate({ driverId, car: carId })
          .unwrap()
          .then(({ data, message }) => {
            notification.success({ message, placement: 'bottomLeft' });
            form.resetFields();
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
                <span style={{ marginRight: 8 }}>Deliver driver</span>
                {!!driverDetail?.car_id && (
                  <Button
                    icon={<GiCheckboxTree size={18} />}
                    type='dashed'
                    size='small'
                    onClick={() => handleConfirm(driverId, driverDetail.name, 'cancel deliver')}
                  >
                    Cancel
                  </Button>
                )}
              </>
            ) : (
              'Deliver driver'
            )
          }
          okText='Deliver'
          cancelText='Cancel'
          okButtonProps={{ size: 'large', disabled: isLoading || !watchCarId }}
          cancelButtonProps={{ size: 'large', disabled: isLoading }}
          style={{ top: 64 }}
        >
          <ModalBodyWrapper>
            {!!driverDetail ? (
              <div className='detail-container'>
                <div className='avatar-container'>
                  <Avatar shape='square' size={68} icon={<BsFillPersonFill />}>
                    {driverDetail.name}
                  </Avatar>
                  {(driverDetail?.rank || 0) < 1000 && (
                    <Tag color='gold' icon={<BsStarFill />} className='rank-tag' split='•'>
                      {driverDetail.rank}
                    </Tag>
                  )}
                </div>
                <div className='info-container'>
                  <Typography.Title level={mediaBelow376 ? 4 : 3} style={{ margin: 0 }} ellipsis>
                    {driverDetail.name}
                  </Typography.Title>
                  <TextDescription icon={<RxIdCard />} split='•'>
                    {driverDetail.license_id}
                  </TextDescription>
                  <TextDescription icon={<FiPhone />} split='•'>
                    {driverDetail.phone}
                  </TextDescription>
                  <TextDescription icon={<BsGeoAlt />} split='•'>
                    {driverDetail.address}
                  </TextDescription>
                </div>
                <div className='action-container'>
                  {(driverDetail?.rank || 0) > 999 && (
                    <Tag color='gold' icon={<BsStarFill />} className='rank-tag' split='•'>
                      {driverDetail.rank}
                    </Tag>
                  )}
                  {!mediaBelow481 && !!driverDetail?.car_id && (
                    <Button
                      icon={<GiCheckboxTree size={18} />}
                      type='dashed'
                      onClick={() => handleConfirm(driverId, driverDetail.name, 'cancel deliver')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className='item-empty' style={{ marginBottom: 12 }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}

            {!!driverDetail?.car_id && (
              <Alert
                type='info'
                showIcon
                icon={<IoMdCar size={28} />}
                message={
                  <div className='driving-car'>
                    <div className='info-container'>
                      <Typography.Text strong ellipsis className='name'>
                        {(driverDetail.car_id as any).name}
                      </Typography.Text>
                      <Typography.Text type='secondary' ellipsis className='plates'>
                        {(driverDetail.car_id as any).plates} • {(driverDetail.car_id as any).type}
                      </Typography.Text>
                    </div>
                    <div className='badge-container'>
                      <Badge status='processing' text='Currently Driving' />
                    </div>
                  </div>
                }
              />
            )}

            {carList.length > 0 ? (
              <Form form={form} layout='vertical' size='large' disabled={isLoading}>
                <Form.Item
                  name='carId'
                  label='Choose a car for delivery'
                  hasFeedback={isLoading}
                  validateStatus={isLoading ? 'validating' : undefined}
                  rules={[{ required: true, message: '• CarId is required' }]}
                >
                  <Radio.Group size='large' className='list-group'>
                    {carList.map((item) => (
                      <Radio.Button
                        className={
                          watchCarId === item._id ? 'list-wrapper checked' : 'list-wrapper'
                        }
                        value={item._id}
                        key={item._id}
                      >
                        <Avatar shape='square' size={52} icon={<IoMdCar />}>
                          {item.name}
                        </Avatar>
                        <div className='list-item-container'>
                          <div className='info-container'>
                            <Typography.Text strong ellipsis>
                              {item.name}
                            </Typography.Text>
                            <Typography.Text type='secondary' ellipsis>
                              {item.plates} • {item.type}
                            </Typography.Text>
                          </div>
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
                  description='Not found any available car'
                />
              </div>
            )}
            <div className='pagination-container'>
              {(carListMetaData?.totalPage || 0) > 1 && (
                <Pagination
                  size='small'
                  showSizeChanger={false}
                  current={filterValue.page}
                  onChange={(page, pageSize) =>
                    setFilterValue({ ...filterValue, page, limit: pageSize })
                  }
                  pageSize={filterValue.limit}
                  total={carListMetaData?.total || 0}
                />
              )}
            </div>
          </ModalBodyWrapper>
        </Modal>
      )}
    </Fragment>
  );
}

const ModalBodyWrapper = styled(CommonModalBodyWrapper)`
  .detail-container {
    margin-bottom: 24px;
    align-items: flex-start;
    .rank-tag {
      margin: 0;
    }
    .avatar-container {
      display: flex;
      flex-direction: column;
      position: relative;
      .rank-tag {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
      }
    }
    .info-container {
      margin-left: 12px;
    }
    .action-container {
      margin-left: auto;
    }
  }
`;

export default DeliverCarModal;
