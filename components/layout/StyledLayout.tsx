import styled from '@emotion/styled';
import { Layout } from 'antd';

const StyledLayout = styled(Layout)`
  overflow: hidden;
  & .sider {
    position: relative;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%),
      0 2px 4px 0 rgb(0 0 0 / 2%);
    max-height: 100vh;
    .logo-wrapper {
      height: 64px;
      padding: 0 27px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .ant-layout-sider-children {
      display: flex;
      flex-direction: column;
    }

    .ant-menu-item-group-title {
      padding-left: 28px;
    }
    .ant-layout-sider-children {
      margin-bottom: 80px;
    }
    .side-menu .side-menu-item {
      display: flex;
      align-items: center;
      padding-left: calc(50% - 14px);
      & > * {
        flex-shrink: 0;
      }
    }
    .collapse-button {
      position: absolute;
      top: 32px;
      right: 0;
      transform: translate(50%, -50%);
      z-index: 10;
    }
  }

  .ant-statistic-content {
    display: flex;
    align-items: center;
    .ant-statistic-content-prefix {
      height: fit-content;
      display: flex;
    }
  }

  .ant-segmented-status {
    background-color: ${({ theme }) => (theme.mode === 'dark' ? '#141414' : '#f0f0f0')};
    .ant-segmented-group label {
      color: #8e8e8e;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.lock .ant-segmented-item-selected {
      color: red;
    }
    &.unlock .ant-segmented-item-selected {
      color: ${({ theme }) => theme.generatedColors[6]};
    }
  }
`;

export default StyledLayout;
