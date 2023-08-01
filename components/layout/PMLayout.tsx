import styled from '@emotion/styled';
import { Affix, Layout as AntdLayout } from 'antd';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { useMediaQuery } from 'react-responsive';
import { setSiderCollapsed } from 'src/redux/reducer/visible.reducer';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import Button from '../button/Button';
import StyledLayout from './StyledLayout';

const LogoWithText = dynamic(() => import('../shared/LogoWithText'));
const SiderUserDropdown = dynamic(() => import('../dropdown/SiderUserDropdown'));
const PMHeader = dynamic(() => import('../header/PMHeader'));
const PMMenuNav = dynamic(() => import('../menu/PMMenuNav'));
const PMSiderDrawer = dynamic(() => import('../drawer/PMSiderDrawer'));

const PMLayout = ({ children }: { children: ReactNode }) => {
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const { isSiderCollapsed } = useAppSelector((s) => s.visible);
  const dispatch = useAppDispatch();

  return (
    <LayoutWrapper>
      {mediaAbove767 && (
        <Affix offsetTop={0.001} style={{ height: '100vh' }}>
          <AntdLayout.Sider
            className='sider'
            width={220}
            theme='light'
            breakpoint='lg'
            style={{ height: '100vh' }}
            trigger={null}
            collapsible
            collapsed={isSiderCollapsed}
          >
            <LogoWithText fontSize={!isSiderCollapsed ? 28 : 0} logoSize={32} />
            <PMMenuNav />
            <SiderUserDropdown collapsed={isSiderCollapsed} />
            <Button
              className='collapse-button'
              shape='circle'
              icon={
                isSiderCollapsed ? (
                  <AiOutlineMenuUnfold size={18} />
                ) : (
                  <AiOutlineMenuFold size={18} />
                )
              }
              onClick={() => dispatch(setSiderCollapsed(!isSiderCollapsed))}
            ></Button>
          </AntdLayout.Sider>
        </Affix>
      )}
      <AntdLayout>
        <PMHeader />
        {children}
      </AntdLayout>
      <PMSiderDrawer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled(StyledLayout)``;

export default PMLayout;
