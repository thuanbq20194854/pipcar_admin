import styled from '@emotion/styled';
import { Layout } from 'antd';

const StyledHeader = styled(Layout.Header)`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 64px;
  padding: 24px !important;
  gap: 24px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  @media screen and (max-width: 767.98px) {
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%),
      0 2px 4px 0 rgb(0 0 0 / 2%);
  }

  .header-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    gap: 8px;
    .logo-wrapper {
      display: flex;
    }
    .sider-drawer-button svg {
      flex-shrink: 0;
    }
  }
  .header-right {
    margin-left: auto;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    .ant-avatar-circle {
      cursor: pointer;
      user-select: none;
      flex-shrink: 0;
      box-shadow: ${(props) => `0 0 0 2px #fff, 0 0 0 3px ${props.theme.colorPrimary}`};
    }
    .btn-noti {
      border: none;
      position: relative;
      background-color: transparent;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      color: #8c8c8c;

      & svg {
        z-index: 1;
      }
      &::after {
        content: '';
        width: 32px;
        height: 32px;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
      }
      &:hover {
        color: #595959;
        &::after {
          background-color: rgba(191, 191, 191, 0.25);
        }
      }
    }
    .ant-badge-count {
      z-index: 1;
    }
  }
`;
export default StyledHeader;
