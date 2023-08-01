import { Divider, Form, Input, InputNumber, Space } from 'antd';
import useApp from 'src/hooks/useApp';
import {
  TConfirmRegisterDetailData,
  useConfirmRegisterMutation,
} from 'src/redux/query/register.query';
import { setVisibleItem } from 'src/redux/reducer/visible.reducer';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { ErrorCode } from 'src/types/response.types';
import { mappedErrorToFormError } from 'src/utils/utils-error';
import Modal from '../modal/Modal';

type TProps = {};

const ConfirmRegisterModal = ({}: TProps) => {
  const { message } = useApp();
  const [form] = Form.useForm();
  const { extraState, visibleItem } = useAppSelector((s) => s.visible);
  const dispatch = useAppDispatch();

  const open = visibleItem === 'ConfirmRegisterModal' && !!extraState;

  const [confirmMutate, { isLoading: confirmLoading }] = useConfirmRegisterMutation();

  const handleConfirm = ({ lat, long, ...formData }: TConfirmRegisterDetailData) => {
    confirmMutate({ lat: formData.lat_address, long: formData.long_address, ...formData })
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
      })
      .finally(() => {
        form.resetFields();
        dispatch(setVisibleItem(null));
      });
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(setVisibleItem(null));
  };

  return (
    <Modal
      open={open}
      title={`Confirm Register - ${extraState.id}`}
      okText='Confirm'
      cancelText='Cancel'
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose
      onOk={() => {
        form
          .validateFields()
          .then(({ confirm, ...values }) => {
            handleConfirm({ id: extraState.id, ...values });
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Input
        type='tel'
        placeholder='Code...'
        disabled
        size='large'
        defaultValue={extraState.code}
      />
      <Divider />
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        size='large'
        initialValues={{
          code: extraState.code,
          address: 'Nhà B1, Đại học Bách Khoa Hà Nội',
          lat_address: '21.00383',
          long_address: '105.83916',
          lat: '21.00383',
          long: '105.83916',
        }}
      >
        <Form.Item
          name='address'
          label='Address'
          rules={[{ required: true, message: '• Address is required' }]}
        >
          <Input.TextArea placeholder='Address...' autoSize={{ minRows: 2 }} showCount />
        </Form.Item>
        <Form.Item label='Map' tooltip='Lat | Long'>
          <Space.Compact block size='large'>
            <Form.Item
              name='lat_address'
              noStyle
              rules={[{ required: true, message: '• lat_address is required' }]}
            >
              <InputNumber<string>
                placeholder='Lat...'
                stringMode
                step='0.00001'
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name='long_address'
              noStyle
              rules={[{ required: true, message: '• long_address is required' }]}
            >
              <InputNumber<string>
                placeholder='Long...'
                stringMode
                step='0.00001'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        {/* {!!latAddressForm && !!longAddressForm && (
                <iframe loading='lazy' src={iframeMapSrc}></iframe>
              )} */}
        <iframe
          src='https://www.google.com/maps/embed?language=en&pb=!1m14!1m8!1m3!1d931.1760760275844!2d105.8469656!3d21.004487!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac76827aaaab%3A0xf0580eb2ff0e1b64!2zVHLGsOG7nW5nIEPDtG5nIE5naOG7hyBUaMO0bmcgVGluIFRydXnhu4FuIFRow7RuZyAtIMSQ4bqhaSBI4buNYyBCw6FjaCBraG9hIEjDoCBu4buZaQ!5e0!3m2!1svi!2s!4v1673413674924!5m2!1svi!2s'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        ></iframe>
      </Form>
    </Modal>
  );
};

export default ConfirmRegisterModal;
