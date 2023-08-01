import { Form, Input, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { GiPositionMarker } from 'react-icons/gi';
import useApp from 'src/hooks/useApp';
import { useUpdateGpsCarMutation } from 'src/redux/query/car.query';
import { ErrorCode } from 'src/types/response.types';
import { mappedErrorToFormError } from 'src/utils/utils-error';
import Button from '../button/Button';
import Modal from './Modal';

type TProps = {
  carList: string[];
};

const UpdateGpsModal = ({ carList }: TProps) => {
  const {
    query: { agencyId },
  } = useRouter();
  const { notification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const watchLatLong = Form.useWatch('lat_long', form);

  const [updateGpsMutate, { isLoading }] = useUpdateGpsCarMutation();

  const showModal = () => {
    if (carList.length === 0)
      return notification.error({ message: 'No car selected!', placement: 'bottomRight' });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((formData) => {
        const [lat, long] = formData.lat_long
          .replace(',', ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ');
        const newFormData = {
          lat,
          long,
          car_list: carList,
        };

        updateGpsMutate(newFormData)
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
        icon={<GiPositionMarker size={18} />}
        type='link'
        onClick={showModal}
      >
        {'Update GPS for selected car'}
      </Button>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          confirmLoading={isLoading}
          onOk={handleOk}
          onCancel={handleCancel}
          title={'Update GPS for Selected Car'}
          okText='Update'
          cancelText='Cancel'
          okButtonProps={{ size: 'large', disabled: isLoading || !watchLatLong }}
          cancelButtonProps={{ size: 'large', disabled: isLoading }}
        >
          <Form form={form} layout='vertical' size='large' disabled={isLoading}>
            <Form.Item name='lat_long' label={'New location'} required>
              <Input placeholder='Lat, long...'></Input>
            </Form.Item>
          </Form>
          <Typography.Text strong ellipsis>
            {`${carList.length} car(s) selected!`}
          </Typography.Text>
        </Modal>
      )}
    </Fragment>
  );
};

export default UpdateGpsModal;
