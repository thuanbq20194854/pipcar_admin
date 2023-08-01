import styled from '@emotion/styled';
import { Menu, MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { BsGear, BsHouseDoor, BsPeople, BsPersonPlus } from 'react-icons/bs';
import Link from '../next/Link';

export const items: Required<MenuProps>['items'] = [
  {
    label: <Link href='/admin'>General</Link>,
    icon: <BsHouseDoor size={22} />,
    key: '/admin',
    className: 'side-menu-item',
  },
  {
    label: 'Partner Manager',
    type: 'group',
    children: [
      {
        label: <Link href='/admin/partner'>List</Link>,
        icon: <BsPeople size={22} />,
        key: '/admin/partner',
        className: 'side-menu-item',
      },
      {
        label: <Link href='/admin/partner/create'>Create</Link>,
        icon: <BsPersonPlus size={22} />,
        key: '/admin/partner/create',
        className: 'side-menu-item',
      },
    ],
  },
  {
    label: 'Account',
    type: 'group',
    children: [
      {
        label: <Link href='/admin/setting'>Setting</Link>,
        icon: <BsGear size={22} />,
        key: '/admin/setting',
        className: 'side-menu-item',
      },
    ],
  },
];

function AdminMenuNav() {
  const { asPath, push } = useRouter();
  return (
    <MenuWrapper>
      <Menu
        selectable={false}
        theme='light'
        defaultSelectedKeys={[asPath]}
        style={{ backgroundColor: 'transparent' }}
        mode='inline'
        className='side-menu'
        items={items}
      />
    </MenuWrapper>
  );
}

const MenuWrapper = styled.div`
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default AdminMenuNav;
