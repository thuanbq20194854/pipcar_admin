import { ButtonProps, Form, Input, Select, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import useApp from 'src/hooks/useApp';
import { agencyApi } from 'src/redux/query/agency.query';
import { useCreateCarMutation, useGetAllCarTypesQuery } from 'src/redux/query/car.query';
import { useAppDispatch } from 'src/redux/store';
import { ErrorCode } from 'src/types/response.types';
import { mappedErrorToFormError } from 'src/utils/utils-error';
import Button from '../button/Button';
import Modal from './Modal';

function CreateCarModal({ buttonProps }: { buttonProps?: Omit<ButtonProps, 'onClick'> }) {
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

  const handleOk = () => {
    form
      .validateFields()
      .then(({ lat_long, ...formData }) => {
        const [lat, long] = lat_long.replace(',', ' ').replace(/\s+/g, ' ').trim().split(' ');
        createMutate({
          ...formData,
          agency_id: String(agencyId),
          lat: lat ? lat : '',
          long: long ? long : '',
          car_type_id: carTypeId,
        })
          .unwrap()
          .then(({ data, message }) => {
            notification.success({ message, placement: 'bottomLeft' });
            form.resetFields();
            dispatch(agencyApi.util.invalidateTags([{ type: 'Agencies', id: String(agencyId) }]));
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
          <Form
            form={form}
            layout='vertical'
            size='large'
            initialValues={{
              lat_long:
                agencyData?.lat_address === ''
                  ? ''
                  : `${agencyData?.lat_address}, ${agencyData?.long_address}`,
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
          </Form>
        </Modal>
      )}
    </Fragment>
  );
}

export default CreateCarModal;
