import { Form, Input } from 'antd';
import { Fragment } from 'react';

function PasswordFormItems() {
  const form = Form.useFormInstance();
  return (
    <Fragment>
      <Form.Item
        name='password'
        label='New Password'
        rules={[
          { required: true, message: '• Password is required' },
          { min: 8, message: '• Password must be at least 8 characters long' },
        ]}
      >
        <Input.Password placeholder='New Password...' />
      </Form.Item>
      <Form.Item
        label='Confirm Password'
        validateTrigger={'onKeyUp'}
        name='confirm'
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: '• Confirm Password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('• Confirm Password not matched!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder='Confirm Password...' />
      </Form.Item>
    </Fragment>
  );
}

export default PasswordFormItems;
