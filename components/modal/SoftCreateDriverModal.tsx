import { ButtonProps, Form, Input, Modal, Space } from 'antd';

import { useRouter } from 'next/router';

import { Fragment, useState } from 'react';

import { BsFillPersonPlusFill } from 'react-icons/bs';

import useApp from 'src/hooks/useApp';

import { useCreateDriverMutation } from 'src/redux/query/driver.query';

import { IDriver } from 'src/types/driver.types';

import Button from '../button/Button';

interface SoftCreateDriverModalProps {
  buttonProps?: Omit<ButtonProps, 'onClick'>;
  onAddDriver: (addedCar: IDriver) => void;
}

function SoftCreateDriverModal({
  buttonProps,
  onAddDriver,
}: {
  buttonProps?: Omit<ButtonProps, 'onClick'>;
  onAddDriver: (driver: IDriver) => void;
}) {
  const {
    query: { agencyId },
  } = useRouter();
  const { notification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [createMutate, { isLoading }] = useCreateDriverMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(({ lat_long, ...formData }) => {
      const [lat, long] = lat_long
        ? lat_long.replace(',', ' ').replace(/\s+/g, ' ').trim().split(' ')
        : ['', ''];

      console.log({
        ...formData,
        lat: lat ? lat : '',
        long: long ? long : '',
      });

      onAddDriver({
        ...formData,
        id: new Date().toISOString(),
        lat: lat ? lat : '',
        long: long ? long : '',
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
        icon={<BsFillPersonPlusFill />}
        type='dashed'
        size='large'
        onClick={showModal}
        {...buttonProps}
      >
        Create new driver
      </Button>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          title='Create Driver'
          okText='Create'
          cancelText='Cancel'
          okButtonProps={{ size: 'large', disabled: isLoading }}
          cancelButtonProps={{ size: 'large', disabled: isLoading }}
          style={{ top: 24 }}
        >
          <Form
            form={form}
            layout='vertical'
            size='large'
            initialValues={{
              lat_long: '',
            }}
            disabled={isLoading}
          >
            <Form.Item
              name='name'
              label='Name'
              hasFeedback={isLoading}
              validateStatus={isLoading ? 'validating' : undefined}
              rules={[{ required: true, message: '• Name is required' }]}
            >
              <Input placeholder='Driver name..., ex: Pipcar Driver' />
            </Form.Item>
            <Form.Item
              name='phone'
              label='Phone'
              hasFeedback={isLoading}
              validateStatus={isLoading ? 'validating' : undefined}
              rules={[{ required: true, message: '• Phone is required' }]}
            >
              <Input type='tel' placeholder='Phone number..., ex: 0989123456' />
            </Form.Item>
            <Form.Item name='license_id' label='LicenseID'>
              <Input type='tel' placeholder='LicenseID..., ex: 123400006789' />
            </Form.Item>
            <Form.Item name='address' label='Address'>
              <Input.TextArea placeholder='Address...' autoSize={{ minRows: 2 }} showCount />
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

export default SoftCreateDriverModal;
