import styled from '@emotion/styled';
import { Badge, theme } from 'antd';
import { HiBell } from 'react-icons/hi';
import { HiOutlineBars3BottomLeft } from 'react-icons/hi2';
import { useMediaQuery } from 'react-responsive';
import { setVisibleItem } from 'src/redux/reducer/visible.reducer';
import { useAppDispatch } from 'src/redux/store';
import PMBreadcrumb from '../breadcrumb/PMBreadcrumb';
import Button from '../button/Button';
import LogoWithText from '../shared/LogoWithText';
import StyledHeader from './StyledHeader';

function PMHeader() {
  const {
    token: { colorBgLayout, colorBgBase },
  } = theme.useToken();
  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const dispatch = useAppDispatch();

  return (
    <HeaderWrapper style={{ background: mediaAbove767 ? colorBgLayout : colorBgBase }}>
      <div className='header-left'>
        {mediaAbove767 ? (
          <PMBreadcrumb />
        ) : (
          <>
            <LogoWithText fontSize={28} logoSize={32} />
            <Button
              className='sider-drawer-button'
              type='text'
              shape='circle'
              onClick={() => dispatch(setVisibleItem('sideadmindrawervisible'))}
            >
              <HiOutlineBars3BottomLeft size={28} />
            </Button>
          </>
        )}
      </div>
      <div className='header-right'>
        <Badge count={1} offset={[-6, 6]}>
          <button
            className='btn-noti'
            onClick={() => dispatch(setVisibleItem('sideadminnotivisible'))}
          >
            <HiBell size={26} />
          </button>
        </Badge>
      </div>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled(StyledHeader)``;

export default PMHeader;
