import React from 'react';

import styled from '@emotion/styled';
import { Avatar, AvatarProps, Badge } from 'antd';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { IoMdCar } from 'react-icons/io';
import { MdEmojiTransportation } from 'react-icons/md';

type TProps = AvatarProps & {
  isActive?: boolean;
  isTransportation?: boolean;
  isDriver?: boolean;
  badge?: React.ReactNode;
  customBadge?: React.ReactNode;
  offset?: [string | number, string | number];
};

function TypeAgencyAvatar({
  isDriver,
  isTransportation,
  customBadge,
  isActive,
  offset,
  children,
  badge,
  ...props
}: TProps) {
  const typeIcon = () => {
    if (!!isTransportation && !!isDriver) return <MdEmojiTransportation size={24} />;
    if (!!isTransportation && !isDriver) return <HiOutlineBuildingOffice2 size={24} />;
    if (!isTransportation && !!isDriver) return <IoMdCar size={20} />;
    return null;
  };
  return (
    <AvatarWrapper
      count={!!customBadge ? <div className='count-content'>{customBadge}</div> : badge}
      offset={offset || [0, 28]}
      className={!isActive ? 'inactive' : ''}
    >
      <Avatar size={32} icon={typeIcon()} className='avatar-container' {...props}>
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
    display: flex;
    justify-content: center;
    align-items: center;
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

export default TypeAgencyAvatar;
