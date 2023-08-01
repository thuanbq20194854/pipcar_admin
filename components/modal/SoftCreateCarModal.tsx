import { ButtonProps, Form, Input, Modal, Select, Space, Typography } from 'antd';

import { useRouter } from 'next/router';

import { Fragment, useId, useState } from 'react';

import { BsPlusLg } from 'react-icons/bs';

import useApp from 'src/hooks/useApp';

import { agencyApi } from 'src/redux/query/agency.query';

import { useCreateCarMutation, useGetAllCarTypesQuery } from 'src/redux/query/car.query';

import { useAppDispatch } from 'src/redux/store';

import styled from '@emotion/styled';
import { ICar } from 'src/types/car.types';
import Button from '../button/Button';

interface SoftCreateCarModalProps {
  buttonProps?: Omit<ButtonProps, 'onClick'>;
  onAddCar: (addedCar: ICar) => void;
}

function SoftCreateCarModal({ buttonProps, onAddCar }: SoftCreateCarModalProps) {
  const {
    query: { agencyId },
  } = useRouter();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notification } = useApp();
  const [createMutate, { isLoading }] = useCreateCarMutation();

  const agencyDetailData = agencyApi.useGetAgencyDetailQuery(String(agencyId), {
    skip: !agencyId,
    refetchOnMountOrArgChange: true,
  });
  const agencyData = agencyDetailData.data?.data.agency_detail;

  const { data } = useGetAllCarTypesQuery();

  const carTypes = data?.data.car_types;

  const [carTypeId, setCarTypeId] = useState<number>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const randomId = useId();
  console.log('randomId: ', randomId);
  console.log('useId(): ', useId());
  const handleOk = () => {
    form.validateFields().then(({ lat_long, ...formData }) => {
      const [lat, long] = lat_long
        ? lat_long.replace(',', ' ').replace(/\s+/g, ' ').trim().split(' ')
        : ['', ''];

      console.log({
        ...formData,
        lat: lat ? lat : '',
        long: long ? long : '',
        car_type_id: carTypeId,
      });

      onAddCar({
        ...formData,
        id: new Date().toISOString(),
        lat: lat ? lat : '',
        long: long ? long : '',
        car_type_id: carTypeId,
      });
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
        block
        icon={<BsPlusLg />}
        type='dashed'
        size='large'
        onClick={showModal}
        {...buttonProps}
      >
        Create new car
      </Button>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          confirmLoading={isLoading}
          onOk={handleOk}
          onCancel={handleCancel}
          title='Create a new car'
          okText='Create'
          cancelText='Cancel'
          okButtonProps={{ size: 'large', disabled: isLoading }}
          cancelButtonProps={{ size: 'large', disabled: isLoading }}
        >
          <Form form={form} layout='vertical' size='large' disabled={isLoading}>
            <Form.Item
              name='name'
              label='Name'
              hasFeedback={isLoading}
              validateStatus={isLoading ? 'validating' : undefined}
              rules={[{ required: true, message: '• Name is required' }]}
            >
              <Input placeholder='Car name..., ex: Toyota Vios' />
            </Form.Item>
            <Form.Item
              name='plates'
              label='Plates'
              hasFeedback={isLoading}
              validateStatus={isLoading ? 'validating' : undefined}
              rules={[{ required: true, message: '• Plates is required' }]}
            >
              <Input placeholder='Car plates..., ex: 29A-12345' />
            </Form.Item>
            <Form.Item
              name='type'
              label={
                <div>
                  Type, <Typography.Text type='secondary'>ex: 5 seats</Typography.Text>
                </div>
              }
              hasFeedback={isLoading}
              validateStatus={isLoading ? 'validating' : undefined}
              rules={[{ required: true, message: '• Type is required' }]}
            >
              <Select
                value={carTypeId}
                onChange={(value) => setCarTypeId(value)}
                placeholder='Choose car type'
                options={carTypes?.map((item) => ({
                  label: item.name,
                  value: item.name_id,
                }))}
              ></Select>
            </Form.Item>
            <Form.Item label='Map' tooltip='Lat | Long'>
              <Space.Compact block size='large'>
                <Form.Item name='lat_long' noStyle>
                  <Input placeholder='Lat, Long' step='0.00001' style={{ width: '100%' }} />
                </Form.Item>
              </Space.Compact>
            </Form.Item>

            <Button
              className='red-color'
              htmlType='reset'
              block
              // disabled={isLoading}
              danger={true}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Reset
            </Button>
          </Form>
        </Modal>
      )}
    </Fragment>
  );
}

export default SoftCreateCarModal;

const SoftCreateCarModalContainer = styled.div`
  .red-color {
    background-color: red;
  }
`;
