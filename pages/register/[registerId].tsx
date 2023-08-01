import styled from '@emotion/styled';
import { Badge, Card, Checkbox, Col, Form, Input, Row, Steps, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { BsArrowRepeat, BsArrowUp, BsCheckLg } from 'react-icons/bs';
import { IoMdCar } from 'react-icons/io';
import { MdEmojiTransportation } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import TypeAgencyAvatar from 'src/components/avatar/TypeAgencyAvatar';
import PMBreadcrumb from 'src/components/breadcrumb/PMBreadcrumb';
import Button from 'src/components/button/Button';
import ConfirmRegisterModal from 'src/components/form/ConfirmRegisterModal';
import SmRegisterList from 'src/components/list/SmRegisterList';
import useApp from 'src/hooks/useApp';
import WithAuth from 'src/hooks/withAuth';
import {
  useGetRegisterDetailQuery,
  useUpdateRegisterDetailMutation,
} from 'src/redux/query/register.query';
import { setExtraState, setVisibleItem } from 'src/redux/reducer/visible.reducer';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { ErrorCode } from 'src/types/response.types';
import { getRandomInt } from 'src/utils/utils';
import { mappedErrorToFormError } from 'src/utils/utils-error';

function RegisterDetailPage() {
  const {
    query: { registerId },
  } = useRouter();
  const { message } = useApp();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const mediaAbove1080 = useMediaQuery({ minWidth: 1080 });
  const [form] = Form.useForm();

  const { extraState, visibleItem } = useAppSelector((s) => s.visible);
  const dispatch = useAppDispatch();
  const { isFetching, isSuccess, error, data } = useGetRegisterDetailQuery(String(registerId), {
    skip: !registerId,
    refetchOnMountOrArgChange: true,
  });
  const userData = data?.data?.register_detail;

  const userIsComfirmed = userData?.status;

  const [updateRegister, { isLoading }] = useUpdateRegisterDetailMutation();

  useEffect(() => {
    form.setFieldsValue(userData);
  }, [isFetching, userData]);

  const handleUpdateInfo = ({ confirm, ...formData }: any) => {
    !!registerId &&
      updateRegister({ id: String(registerId), data: formData })
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

  const handleNewCode = () => {
    const newCode = getRandomInt();
    form.setFieldValue('code', String(newCode));
  };

  const handleConfirmRegister = () => {
    const code = form.getFieldValue('code');
    dispatch(setVisibleItem('ConfirmRegisterModal'));
    dispatch(setExtraState({ id: String(registerId), code }));
  };

  return (
    <PageWrapper className='main-page'>
      <Row gutter={[24, 24]}>
        <Col flex='auto' className='col-left'>
          <Row className='page-header' gutter={[0, 12]}>
            {!mediaAbove767 && (
              <Col span={24}>
                <PMBreadcrumb />
              </Col>
            )}
            {userData && (
              <Col span={24} className='page-header-info'>
                <TypeAgencyAvatar
                  size={40}
                  offset={[0, 34]}
                  isActive={userData.status === 1}
                  isDriver={userData.isDriver}
                  isTransportation={userData.isTransportation}
                ></TypeAgencyAvatar>
                <Typography.Title className='page-title' level={2} ellipsis>
                  {userData?.name}
                </Typography.Title>
                <Badge dot status={userData?.status === 1 ? 'success' : 'error'}>
                  <Button
                    className='confirm-button'
                    icon={<BsCheckLg />}
                    ghost
                    type='primary'
                    size={mediaAbove767 ? 'middle' : 'small'}
                    disabled={userData?.status === 1 || visibleItem === 'ConfirmRegisterModal'}
                    onClick={() => !!registerId && handleConfirmRegister()}
                  >
                    {userData?.status === 1 ? 'Confirmed' : 'Confirm'}
                  </Button>
                </Badge>
              </Col>
            )}
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
              current={3}
              items={[
                {
                  title: (
                    <Card>
                      <Form.Item
                        name='name'
                        label='Name'
                        rules={[{ required: true, message: '• Name is required' }]}
                      >
                        <Input type='text' placeholder='Name...' readOnly={!!userIsComfirmed} />
                      </Form.Item>
                      <Form.Item
                        name='phone'
                        label='PhoneNumber'
                        rules={[{ required: true, message: '• Phone is required' }]}
                      >
                        <Input
                          type='tel'
                          placeholder='PhoneNumber...'
                          readOnly={!!userIsComfirmed}
                        />
                      </Form.Item>
                    </Card>
                  ),
                },
                {
                  title: (
                    <Card>
                      <Form.Item label='Type' required>
                        <div className='checkbox-type-group'>
                          <Form.Item
                            name='isAgency'
                            valuePropName='checked'
                            noStyle
                            rules={[{ type: 'boolean', message: '• isAgency is invalid' }]}
                          >
                            <Checkbox className='checkbox-item' disabled={!!userIsComfirmed}>
                              <IoMdCar size={20} />
                              <span>Agency</span>
                            </Checkbox>
                          </Form.Item>
                          <Form.Item
                            name='isDriver'
                            valuePropName='checked'
                            noStyle
                            rules={[{ type: 'boolean', message: '• isDriver is invalid' }]}
                          >
                            <Checkbox className='checkbox-item' disabled={!!userIsComfirmed}>
                              <IoMdCar size={20} />
                              <span>Driver</span>
                            </Checkbox>
                          </Form.Item>
                          <Form.Item
                            name='isTransportation'
                            valuePropName='checked'
                            noStyle
                            rules={[{ type: 'boolean', message: '• isTransportation is invalid' }]}
                          >
                            <Checkbox className='checkbox-item' disabled={!!userIsComfirmed}>
                              <MdEmojiTransportation size={24} />
                              <span>Transportation</span>
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </Form.Item>
                    </Card>
                  ),
                },
                {
                  title: (
                    <Card>
                      <Form.Item
                        name='code'
                        label='Code'
                        rules={[{ required: true, type: 'string', message: '• Code is required' }]}
                      >
                        <Input
                          type='tel'
                          placeholder='Code...'
                          className='input-code'
                          readOnly={!!userIsComfirmed}
                          suffix={
                            <Button
                              size='middle'
                              type='text'
                              icon={<BsArrowRepeat size={18} />}
                              tooltip='Generate new code'
                              onClick={() => handleNewCode()}
                              disabled={!!userIsComfirmed}
                            ></Button>
                          }
                        />
                      </Form.Item>
                    </Card>
                  ),
                },

                {
                  title: !userIsComfirmed && (
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
                            icon={<BsArrowUp />}
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
            <SmRegisterList />
          </Col>
        )}
      </Row>
      {visibleItem === 'ConfirmRegisterModal' && !!extraState && <ConfirmRegisterModal />}
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
    .page-header-info {
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
      padding-left: 4px;
      .page-title {
        margin-left: 12px;
      }
      .ant-badge:last-child {
        margin-left: auto;
      }
    }
    .ant-form-vertical {
      display: flex;
      justify-content: center;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
      padding-left: 18px;
      .input-code {
        padding-right: 6px;
        .ant-input-suffix {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 100%;
          button {
            height: 100%;
          }
        }
      }
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
    .checkbox-type-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      .checkbox-item {
        padding: 8px 24px 8px 8px;
        border: 1px solid #d9d9d9;
        position: relative;
        align-items: center;
        border-radius: 8px;
        margin-left: 0;
        & span:last-of-type {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        &.ant-checkbox-wrapper-checked {
          border: 1px solid ${({ theme }) => theme.colorPrimary};
          color: ${({ theme }) => theme.colorPrimary};
        }
        &.ant-checkbox-wrapper-disabled {
          border: 1px solid #d9d9d9;
          color: ${({ theme }) => theme.colorPrimary};
        }
        .ant-checkbox {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(-50%, 50%);
        }
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

export default WithAuth(RegisterDetailPage);
