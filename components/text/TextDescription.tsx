import styled from '@emotion/styled';
import { Typography } from 'antd';

type TProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  split?: string;
};

function TextDescription({ children, icon, split }: TProps) {
  return (
    <TextDescriptionWrapper>
      {icon}
      {split && <span className='split'>{split}</span>}
      <Typography.Text type='secondary'>{children}</Typography.Text>
    </TextDescriptionWrapper>
  );
}
const TextDescriptionWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
  & > svg {
    flex-shrink: 0;
    align-self: flex-start;
  }
  .split {
    margin: 0 4px;
    flex-shrink: 0;
  }
  .ant-typography {
    word-break: break-word;
    line-height: 1.2714285714285714;
  }
`;

export default TextDescription;
