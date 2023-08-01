import styled from '@emotion/styled';
import { Badge, Card, Col, Form, Input, Row, Segmented, Space, Steps, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { FaLock, FaUnlockAlt } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import RoleAvatar from 'src/components/avatar/RoleAvatar';
import AdminBreadcrumb from 'src/components/breadcrumb/AdminBreadcrumb';
import Button from 'src/components/button/Button';
import SmPMList from 'src/components/list/SmPMList';
import useApp from 'src/hooks/useApp';
import useChangeStatusUser from 'src/hooks/useChangeStatusUser';
import WithAdmin from 'src/hooks/withAdmin';
import { useGetUserByIdQuery, useUpdateUserInfoByIdMutation } from 'src/redux/query/user.query';
import { ErrorCode } from 'src/types/response.types';
import { mappedErrorToFormError } from 'src/utils/utils-error';

function DetailPage() {
  const {
    query: { partnerId },
  } = useRouter();
  const { message } = useApp();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const mediaAbove1080 = useMediaQuery({ minWidth: 1080 });
  const [form] = Form.useForm();

  const { handleChangeUserStatus, blockUserLoading, unBlockUserLoading } = useChangeStatusUser();
  const { isFetching, error, data } = useGetUserByIdQuery(String(partnerId), {
    skip: !partnerId,
    refetchOnMountOrArgChange: true,
  });
  const userData = data?.data?.user_detail;

  const [updateUser, { isLoading }] = useUpdateUserInfoByIdMutation();

  useEffect(() => {
    form.setFieldsValue(userData);
  }, [isFetching, userData]);

  const handleUpdateInfo = ({ confirm, ...formData }: any) => {
    !!partnerId &&
      updateUser({ id: String(partnerId), data: formData })
        .unwrap()
        .then((res) => {
          form.setFieldsValue({ confirm: undefined, password: undefined });
          message.success(res.message);
        })
        .catch((err) => {
          if ([ErrorCode.BadRequest, ErrorCode.DataNotFound].includes(err.response_code))
            message.error(err.error[0].message);
          if (err.response_code === ErrorCode.RequestValidationError) {
            form.setFields(mappedErrorToFormError(err.error));
          }
        });
  };

  const handleReset = () => {
    form.setFieldsValue({ ...userData, confirm: undefined, password: undefined });
  };

  return (
    <PageWrapper className='main-page'>
      <Row gutter={[24, 24]}>
        <Col flex='auto' className='col-left'>
          <Row className='page-header' gutter={[0, 12]}>
            {!mediaAbove767 && (
              <Col span={24}>
                <AdminBreadcrumb />
              </Col>
            )}
            <Col flex='auto'>
              <Space style={{ padding: '0 4px' }}>
                <RoleAvatar
                  size={40}
                  offset={[0, 34]}
                  role={userData?.role}
                  isActive={userData?.status === 1}
                ></RoleAvatar>
                <Typography.Title className='page-title' level={2}>
                  {userData?.name}
                </Typography.Title>
              </Space>
            </Col>
            <Col flex='none'>
              <Badge dot status={userData?.status === 1 ? 'success' : 'error'}>
                <Segmented
                  value={userData?.status === 1 ? 'unlock' : 'lock'}
                  className={
                    userData?.status === 1
                      ? 'ant-segmented-status unlock'
                      : 'ant-segmented-status lock'
                  }
                  options={[
                    {
                      value: 'unlock',
                      icon: <FaUnlockAlt />,
                    },
                    {
                      value: 'lock',
                      icon: <FaLock />,
                    },
                  ]}
                  disabled={blockUserLoading || unBlockUserLoading}
                  onChange={(v) =>
                    !!partnerId && handleChangeUserStatus(String(partnerId), v as string)
                  }
                />
              </Badge>
            </Col>
          </Row>
          <Form
            form={form}
            layout='vertical'
            size='large'
            requiredMark={false}
            onFinish={handleUpdateInfo}
            disabled={isFetching || isLoading}
          >
            <Steps
              progressDot
              direction='vertical'
              current={2}
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
                    <Form.Item
                      shouldUpdate
                      className='actions-container'
                      style={{ marginBottom: 0 }}
                    >
                      {() => (
                        <Fragment>
                          <Button
                            htmlType='button'
                            block
                            disabled={isLoading}
                            onClick={() => handleReset()}
                          >
                            Reset
                          </Button>
                          <Button
                            htmlType='submit'
                            type='primary'
                            block
                            loading={isLoading}
                            disabled={
                              !form.isFieldsTouched(['phone', 'name']) ||
                              !!form.getFieldsError().filter(({ errors }) => errors.length).length
                            }
                          >
                            Update
                          </Button>
                        </Fragment>
                      )}
                    </Form.Item>
                  ),
                },
              ]}
            />
          </Form>
        </Col>
        {mediaAbove1080 && (
          <Col flex='288px' className='col-right'>
            <SmPMList />
          </Col>
        )}
      </Row>
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  padding: 0 24px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  .col-left {
    position: relative;
    .page-header {
      padding: 24px 12px 0 0;
    }
    .ant-form-vertical {
      display: flex;
      justify-content: center;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
      padding-left: 18px;
    }
    .ant-steps-item-title {
      width: 100%;
      padding-bottom: 24px;
      padding-right: 12px;
      line-height: 1.4 !important;
    }
    .actions-container {
      .ant-form-item-control-input-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 24px;
      }
      & button[type='button'] {
        width: 160px;
        flex-shrink: 0;
      }
    }
  }
  .col-right {
    margin-top: 12px;
    padding-top: 12px;
    padding-bottom: 12px;
    border-radius: 8px;
    height: fit-content;
    background-color: ${({ theme }) => (theme.mode === 'dark' ? '#141414' : '#f0f0f0')};
    .localsearch {
      background-color: transparent;
    }
    .ant-list-pagination {
      margin-top: 12px;
      .ant-pagination-item {
        background-color: transparent;
      }
    }
    .ant-list-item-meta-avatar {
      align-self: center;
    }
  }

  @media screen and (max-width: 1099.98px) {
    .col-right {
      flex: 0 0 256px !important;
    }
  }

  @media screen and (max-width: 1079.98px) {
    .col-left .page-header {
      padding-right: 0;
    }
    .col-left .ant-form-vertical .ant-steps-item-title {
      padding-right: 0;
    }
  }

  @media screen and (max-width: 767.98px) {
    & {
      height: 100%;
    }
  }

  @media screen and (max-width: 400.98px) {
    padding: 0 0 12px;
    .col-left {
      .page-header {
        padding: 24px 12px 24px 24px;
        .page-title {
          font-size: 22px;
        }
      }
      .ant-form-vertical {
        margin-top: 0;
        padding-left: 6px;
        padding-right: 12px;
        .ant-steps-item-title {
          padding-right: 0;
          padding-bottom: 12px;
        }
        .ant-steps-item-icon {
          margin-inline-end: 6px;
        }
      }
      .actions-container {
        .ant-form-item-control-input-content {
          flex-direction: column-reverse;
          gap: 12px;
        }
        & button[type='button'] {
          width: 100%;
          flex-shrink: 0;
        }
      }
      .ant-card {
        border: none !important;
      }
    }
  }
`;

export default WithAdmin(DetailPage);
