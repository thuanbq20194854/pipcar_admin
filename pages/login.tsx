import styled from '@emotion/styled';
import { Card, Carousel, Form, Input, Layout } from 'antd';
import dynamic from 'next/dynamic';
import { useId } from 'react';
import { FaLock, FaPhoneAlt } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import useApp from 'src/hooks/useApp';
import WithoutAuth from 'src/hooks/withoutAuth';
import { useLoginMutation } from 'src/redux/query/auth.query';
import { useAppSelector } from 'src/redux/store';
import { ErrorCode } from 'src/types/response.types';
import { loginImages } from 'src/utils/images';
import { mappedErrorToFormError } from 'src/utils/utils-error';

const LogoWithText = dynamic(() => import('src/components/shared/LogoWithText'));
const Button = dynamic(() => import('src/components/button/Button'));

const LoginPage = () => {
  const mediaAbove875 = useMediaQuery({ minWidth: 875 });
  const unique = useId();
  const [form] = Form.useForm();
  const { refreshToken, userState } = useAppSelector((s) => ({
    refreshToken: s.auth.refreshToken,
    userState: s.user.data,
  }));
  const { notification } = useApp();

  const [loginMutate, { isLoading }] = useLoginMutation();

  const handleSubmit = (formData: any) => {
    loginMutate(formData)
      .unwrap()
      .then(({ data, message }) => {
        notification.success({ message, placement: 'bottomRight' });
      })
      .catch((err) => {
        if ([ErrorCode.BadRequest, ErrorCode.DataNotFound].includes(err.response_code))
          notification.error({ message: err.error[0].message, placement: 'bottomLeft' });
        if ([ErrorCode.RequestValidationError].includes(err.response_code))
          form.setFields(mappedErrorToFormError(err.error));
      });
  };
  return (
    <PageWrapper>
      <div className='main-container'>
        {mediaAbove875 && (
          <div className='slide-container'>
            <Carousel autoplay pauseOnHover={false} className='slide-carousel' effect='fade'>
              {loginImages.map((item, index) => (
                <picture key={unique + 'slide' + index} className='slide-image'>
                  <img src={item} alt={unique} />
                </picture>
              ))}
            </Carousel>
          </div>
        )}
        <Card className='form-container' bordered>
          <div className='form-header'>
            <LogoWithText fontSize={34} logoSize={36} />
          </div>
          <Form
            form={form}
            layout='vertical'
            size='large'
            requiredMark={false}
            onFinish={handleSubmit}
            disabled={(!!refreshToken && !!userState?.role) || isLoading}
          >
            <Form.Item
              name='phone'
              hasFeedback={isLoading}
              validateStatus={isLoading ? 'validating' : undefined}
              rules={[{ required: true, message: '• Phone is required' }]}
            >
              <Input prefix={<FaPhoneAlt />} type='tel' placeholder='Phone number...' />
            </Form.Item>
            <Form.Item
              name='password'
              hasFeedback={isLoading}
              validateStatus={isLoading ? 'validating' : undefined}
              rules={[
                { required: true, message: '• Password is required' },
                { min: 8, message: '• Password must be at least 8 characters long' },
              ]}
            >
              <Input.Password prefix={<FaLock />} placeholder='Password...' />
            </Form.Item>
            <Form.Item>
              <Button loading={isLoading} type='primary' htmlType='submit' block>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div className='footer'>
        <div className='links'>
          <a href='https://info.pippip.vn/' target='_blank' rel='noreferrer'>
            About Pippip
          </a>
          <a
            href='https://docs.google.com/document/d/1o2vT3psHEXMvtx_vgyOrvP0UcuxMJVDFrSf5U1PDvVY/edit?usp=sharing'
            target='_blank'
            rel='noreferrer'
          >
            Driver Recruit Policy
          </a>
          <a
            href='https://docs.google.com/document/d/1m201PmIjYD5X-OaCN1ce3M7yevL1A8Xu47i6Zs07W-M/edit?usp=sharing'
            target='_blank'
            rel='noreferrer'
          >
            Customers Service Term
          </a>
          <a
            href='https://docs.google.com/document/d/12_x1PTXsrZlJt5h83NeVOyIk7zs49moXX4Jge4lj-2Q/edit?usp=sharing'
            target='_blank'
            rel='noreferrer'
          >
            Suppliers Term
          </a>
        </div>
        <div className='copyright'>© {new Date().getFullYear()} Pippip. All rights reserved.</div>
      </div>
    </PageWrapper>
  );
};

const PageWrapper = styled(Layout)`
  height: 100vh;
  overflow: hidden;
  .main-container {
    width: 100%;
    flex-grow: 1;
    align-items: center;
    flex-wrap: nowrap;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
  .slide-container {
    background-image: url('/iphone.png');
    background-position: -46px 0;
    background-size: 468.32px 634.15px;
    background-repeat: no-repeat;
    width: 380.32px;
    margin-right: 32px;
    z-index: 0;
  }
  .ant-carousel {
    width: 258px;
    margin-right: 14px;
    margin-left: auto;
  }
  .slide-carousel {
    height: 558.15px;
    width: 258px;
    margin-top: 24px;
    z-index: 0;
  }
  .slide-image {
    position: relative;
    height: 545.15px;
    width: 258px;
    border-radius: 24px;
    overflow: hidden;
    & img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
    }
  }

  .form-container {
    flex-grow: 1;
    width: 100%;
    max-width: 384px;
    height: 100%;
    max-height: 440px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    position: relative;
    .form-header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 32px 0;
    }
    .ant-card-body {
      padding: 24px 32px;
    }
    .ant-input-prefix {
      color: #8e8e8e;
    }
    .ant-form-item-explain {
      margin-bottom: 12px;
    }

    .ant-form-item-label label {
      height: fit-content !important;
    }
  }

  .footer {
    padding-bottom: 52px;
    padding-top: 24px;
  }

  .links {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .links a {
    text-decoration: none;
    color: #8e8e8e;
    font-size: 13px;
    line-height: 18px;
    margin: 0 8px 12px 8px;
  }

  .copyright {
    padding: 12px 0;
    color: #8e8e8e;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
  }
  @media screen and (max-width: 767.98px) {
    .form-container .ant-card-body {
      padding: 24px 24px;
    }
  }
  @media screen and (max-width: 384.98px) {
    .form-container {
      border: none !important;
      border-radius: 0;
    }
    .links a {
      margin-bottom: 8px;
    }
    .form-error-list li {
      line-height: 1.4;
    }
  }
`;

export default WithoutAuth(LoginPage);
