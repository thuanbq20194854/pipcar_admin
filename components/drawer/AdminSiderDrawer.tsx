import styled from '@emotion/styled';
import { Drawer, theme } from 'antd';
import { BsXLg } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';
import { setVisibleItem } from 'src/redux/reducer/visible.reducer';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import SiderUserDropdown from '../dropdown/SiderUserDropdown';
import AdminMenuNav from '../menu/AdminMenuNav';
import LogoWithText from '../shared/LogoWithText';

function AdminSiderDrawer() {
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });

  const { visibleItem } = useAppSelector((s) => s.visible);

  const dispatch = useAppDispatch();
  return (
    <StyledDrawer
      closeIcon={<BsXLg size={20} />}
      title={<LogoWithText fontSize={28} logoSize={32} />}
      placement={'left'}
      onClose={() => dispatch(setVisibleItem(null))}
      open={visibleItem === 'sideadmindrawervisible'}
      width={220}
    >
      <AdminMenuNav />
      <SiderUserDropdown />
    </StyledDrawer>
  );
}

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header-title {
    flex-direction: row-reverse;
  }
  .ant-drawer-body {
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .ant-drawer-close {
    margin: 0;
  }
  .ant-drawer-header {
    border: none;
  }
`;

export default AdminSiderDrawer;
