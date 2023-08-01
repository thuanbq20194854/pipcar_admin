import styled from '@emotion/styled';
import { Avatar, AvatarProps, Badge } from 'antd';
import { BsCheckLg, BsPerson, BsShieldShaded } from 'react-icons/bs';

type TProps = AvatarProps & {
  isActive?: boolean;
  role?: string;
  badge?: React.ReactNode;
  offset?: [string | number, string | number];
};

function RoleAvatar({ role, isActive, offset, children, badge, ...props }: TProps) {
  return (
    <AvatarWrapper
      count={
        !!role ? (
          <div className='count-content'>
            {role === 'ADMIN' ? <BsShieldShaded size={10.2} /> : <BsCheckLg size={10} />}
          </div>
        ) : (
          badge
        )
      }
      offset={offset || [0, 28]}
      className={!isActive ? 'inactive' : ''}
    >
      <Avatar size={32} icon={<BsPerson />} className='avatar-container' {...props}>
        {children}
      </Avatar>
    </AvatarWrapper>
  );
}

const AvatarWrapper = styled(Badge)`
  .count-content {
    color: #fafafa;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.generatedColors[4]};
    width: 16px;
    height: 16px;
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .avatar-container {
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
    box-shadow: ${({ theme }) =>
      `0 0 0 2px ${theme.generatedColors[0]}, 0 0 0 3.6px ${theme.generatedColors[4]}`};
    background-color: ${({ theme }) => theme.generatedColors[1]};
  }
  &.inactive .avatar-container {
    opacity: 0.4;
  }
  &.inactive .count-content {
    opacity: 0.4;
  }
`;

export default RoleAvatar;
