import styled from '@emotion/styled';
import { Menu, MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { BsGear, BsHouseDoor, BsPeople, BsPersonPlus } from 'react-icons/bs';
import Link from '../next/Link';

export const items: Required<MenuProps>['items'] = [
  {
    label: <Link href='/'>General</Link>,
    icon: <BsHouseDoor size={22} />,
    key: '/',
    className: 'side-menu-item',
  },
  {
    label: 'Agency',
    type: 'group',
    children: [
      {
        label: <Link href='/agency'>List</Link>,
        icon: <BsPeople size={22} />,
        key: '/agency',
        className: 'side-menu-item',
      },
      {
        label: <Link href='/agency/create'>Create</Link>,
        icon: <BsPersonPlus size={22} />,
        key: '/agency/create',
        className: 'side-menu-item',
      },
    ],
  },
  {
    label: 'Register',
    type: 'group',
    children: [
      {
        label: <Link href='/register'>List</Link>,
        icon: <BsPeople size={22} />,
        key: '/register',
        className: 'side-menu-item',
      },
    ],
  },
  {
    label: 'Account',
    type: 'group',
    children: [
      {
        label: <Link href='/setting'>Setting</Link>,
        icon: <BsGear size={22} />,
        key: '/setting',
        className: 'side-menu-item',
      },
    ],
  },
];

function PMMenuNav() {
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

export default PMMenuNav;
