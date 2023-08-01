import styled from '@emotion/styled';
import { Dropdown, MenuProps, Typography } from 'antd';
import { Fragment, useMemo } from 'react';
import { BsGear } from 'react-icons/bs';
import { FaRegMoon } from 'react-icons/fa';
import { HiOutlineSelector } from 'react-icons/hi';
import { ImSun } from 'react-icons/im';
import useLogout from 'src/hooks/useLogout';
import { toggleThemeMode } from 'src/redux/reducer/theme.reducer';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import RoleAvatar from '../avatar/RoleAvatar';
import Link from '../next/Link';
import TextEllipsisMiddle from '../text/TextEllipsisMiddle';

function SiderUserDropdown({ collapsed }: { collapsed?: boolean }) {
  const { mode } = useAppSelector((s) => s.theme);
  const { data: userState } = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();

  const { handleLogout, isLoadingLogout } = useLogout();

  const dropitems = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'Setting',
        label: (
          <DropdownItemLink href='/admin/setting'>
            <span>Setting</span>
            <BsGear size={16} />
          </DropdownItemLink>
        ),
      },
      {
        key: 'ThemeMode',
        label: (
          <DropdownItemBtn onClick={() => dispatch(toggleThemeMode(null))}>
            <span>{mode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            {mode === 'dark' ? <ImSun size={15} /> : <FaRegMoon size={15} />}
          </DropdownItemBtn>
        ),
        disabled: isLoadingLogout,
      },
      {
        type: 'divider',
      },
      {
        key: 'Logout',
        label: <DropdownItemBtn onClick={() => handleLogout()}>Logout</DropdownItemBtn>,
        disabled: isLoadingLogout,
      },
    ],
    [isLoadingLogout, mode],
  );

  if (!userState) return <></>;

  return (
    <Dropdown menu={{ items: dropitems }} placement='topRight' destroyPopupOnHide>
      <DropdownReference style={{ paddingRight: !!collapsed ? 18 : 2 }}>
        <RoleAvatar role={userState.role} isActive={userState.status === 1}></RoleAvatar>
        {!collapsed && (
          <Fragment>
            <div className='user-container'>
              <Typography.Text style={{ width: 140 }} ellipsis className='user-name'>
                {userState.name}
              </Typography.Text>
              <TextEllipsisMiddle maxWidth={76} suffixCount={4} copyable>
                {userState.phone}
              </TextEllipsisMiddle>
            </div>
            <div className='bar-icon'>
              <HiOutlineSelector size={22} />
            </div>
          </Fragment>
        )}
      </DropdownReference>
    </Dropdown>
  );
}

const DropdownReference = styled.div`
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  padding: 16px 4px 16px 20px;
  margin: 4px;
  margin-top: auto;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.generatedColors[0]};
  border: 1px solid
    ${({ theme }) => (theme.mode === 'dark' ? theme.generatedColors[5] : theme.generatedColors[1])};
  cursor: pointer;
  flex-shrink: 0;
  .user-name {
    font-size: 15px;
    color: ${({ theme }) =>
      theme.mode === 'dark' ? theme.generatedColors[6] : theme.colorPrimary};
  }
  .ant-avatar-circle {
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
    box-shadow: ${({ theme }) =>
      `0 0 0 2px ${theme.generatedColors[0]}, 0 0 0 3.6px ${theme.generatedColors[4]}`};
    background-color: ${({ theme }) => theme.generatedColors[1]};
  }
  .user-container {
    display: flex;
    flex-direction: column;
    .text-ellipsis-middle {
      font-size: 12px;
      color: ${({ theme }) => theme.generatedColors[5]};
    }
  }
  .bar-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.generatedColors[4]};
  }
`;

const DropdownItemBtn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  padding: 4px;
`;

const DropdownItemLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  padding: 4px;
`;

export default SiderUserDropdown;
