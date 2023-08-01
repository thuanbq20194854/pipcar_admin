import styled from '@emotion/styled';
import { Divider, Skeleton, Typography } from 'antd';
import RoleAvatar from 'src/components/avatar/RoleAvatar';
import WithAuth from 'src/hooks/withAuth';
import { useAppSelector } from 'src/redux/store';
import { formatDate } from 'src/utils/utils-date';

function Page() {
  const { data: userState } = useAppSelector((s) => s.user);

  return (
    <PageWrapper>
      {!!userState ? (
        <div className='profile-wrapper'>
          <div className='top-wrapper'>
            <RoleAvatar isActive={userState.status === 1} size={100}></RoleAvatar>
            <Typography.Title level={3} ellipsis style={{ margin: 0 }} className='name'>
              {userState.name}
            </Typography.Title>
            <Typography.Text type='secondary' className='phone'>
              {userState.phone}
            </Typography.Text>
          </div>
          <Divider style={{ margin: '16px 0 12px' }} />

          <div className='createdAt-wrapper'>
            <Typography.Text type='secondary'>
              Ngày tạo: {formatDate(userState.createdAt, 'DD-MM-YYYY HH:mm')}
            </Typography.Text>
          </div>
        </div>
      ) : (
        <div className='profile-wrapper'>
          <Skeleton active />
        </div>
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  scale: 120%;
  height: 60vh;
  display: flex;
  background-color: var(--bg-color);
  margin: 0 0 0 20%;
  padding: 24px 12px 24px 24px;
  .profile-wrapper {
    background-color: var(--bg-color);
    box-shadow: var(--box-shadow);
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    position: relative;
    .top-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & > .ant-badge {
        margin: 8px auto 16px;
        display: block;
      }
    }
  }
`;

export default WithAuth(Page);
