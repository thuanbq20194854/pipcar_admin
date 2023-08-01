import styled from '@emotion/styled';
import { Card, Col, Form, Input, Row, Space, Steps, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsBoxArrowUpRight, BsPlusLg } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';
import AdminBreadcrumb from 'src/components/breadcrumb/AdminBreadcrumb';
import Button from 'src/components/button/Button';
import { UserExpertIcon } from 'src/components/icons';
import useApp from 'src/hooks/useApp';
import WithAdmin from 'src/hooks/withAdmin';
import { useCreateUserMutation } from 'src/redux/query/user.query';
import { ErrorCode } from 'src/types/response.types';
import { mappedErrorToFormError } from 'src/utils/utils-error';

function CreatePage() {
  const { push } = useRouter();
  const { message } = useApp();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const mediaAbove1023 = useMediaQuery({ minWidth: 1023 });
  const mediaAbove376 = useMediaQuery({ minWidth: 376 });
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleCreateUser = ({ confirm, ...formData }: any) => {
    createUser({ data: { ...formData, role: 'PM' } })
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
                <BsBoxArrowUpRight /> <span>Check now</span>
              </Space>
            </Space>
          ),
          style: { cursor: 'pointer' },
          onClick: () => {
            push('/admin/partner');
            message.destroy();
          },
          duration: 3,
        });
        setCurrent(0);
        form.resetFields();
      })
      .catch((err) => {
        if ([ErrorCode.BadRequest, ErrorCode.DataNotFound].includes(err.response_code))
          message.error(err.error[0].message);
        if (err.response_code === ErrorCode.RequestValidationError) {
          form.setFields(mappedErrorToFormError(err.error));
        }
      });
  };

  return (
    <PageWrapper className='main-page'>
      <Row className='page-header' gutter={[0, 12]}>
        {!mediaAbove767 && (
          <Col span={24}>
            <AdminBreadcrumb />
          </Col>
        )}
        <Col flex='auto'>
          <Space>
            <Typography.Title className='page-title' level={2}>
              Add new
            </Typography.Title>
            <Button
              className='role-button'
              icon={<UserExpertIcon />}
              ghost
              type='primary'
              size={mediaAbove1023 ? 'large' : mediaAbove376 ? 'middle' : 'small'}
            >
              Partner Manager
            </Button>
          </Space>
        </Col>
        <Col flex='none'></Col>
      </Row>
      <Form
        form={form}
        layout='vertical'
        size='large'
        onFinish={handleCreateUser}
        disabled={isLoading}
        autoComplete='off'
      >
        <Steps
          current={current}
          onChange={(value: number) => setCurrent(value)}
          direction='vertical'
          progressDot={!mediaAbove376}
          size={mediaAbove1023 ? 'default' : 'small'}
          items={[
            {
              title: (
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
              ),
            },
            {
              title: (
                <Card>
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
                </Card>
              ),
            },
            {
              title: (
                <Form.Item className='actions-container' style={{ marginBottom: 0 }}>
                  <Button
                    htmlType='reset'
                    block
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrent(0);
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
              ),
            },
          ]}
        />
      </Form>
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  padding: 0 24px;
  .page-header {
    padding-bottom: 12px;
    .page-title {
      margin: 0;
    }
    .role-button svg {
      width: 16px;
      height: 16px;
    }
  }
  .ant-form-vertical {
    margin-top: 12px;
    .ant-steps-item-title {
      width: 100%;
      padding-bottom: 24px;
      padding-right: 0;
      line-height: 1.4 !important;
    }
  }
  .actions-container {
    .ant-form-item-control-input-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 24px;
    }
    & button[type='reset'] {
      width: 160px;
    }
    & button[type='submit'] {
      width: 424px;
    }
  }

  @media screen and (max-width: 1023.98px) {
    .page-title {
      font-size: 24px;
    }
  }

  @media screen and (max-width: 767.98px) {
    .page-header {
      padding-top: 24px;
    }
  }

  @media screen and (max-width: 376.98px) {
    & {
      padding: 0 0 12px;
    }
    .page-header {
      padding: 24px 24px 0;
      .page-title {
        font-size: 22px;
      }
    }
    .ant-form-vertical {
      padding-left: 6px;
      padding-right: 12px;
      .ant-steps-item-title {
        padding-bottom: 12px;
      }
      .ant-steps-item-icon {
        margin-inline-end: 6px !important;
      }
      .actions-container {
        .ant-form-item-control-input-content {
          flex-direction: column-reverse;
          gap: 12px;
        }
        & button {
          width: 100%;
          flex-shrink: 0;
        }
      }
    }
  }
`;

export default WithAdmin(CreatePage);
