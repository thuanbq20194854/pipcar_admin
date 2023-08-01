import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useState } from 'react';

function TextEllipsisMiddle({
  children = '',
  suffixCount = 6,
  maxWidth = 100,
  copyable = false,
}: {
  suffixCount?: number;
  maxWidth?: number;
  children: string;
  copyable?: boolean;
}) {
  const suffix = children.slice(-suffixCount).trim();
  const [ellipsisSuffix, setEllipsisSuffix] = useState<{ suffix: string } | false>({
    suffix,
  });
  const start = children.slice(0, children.length - suffixCount).trim();
  return (
    <TextStyled
      style={{ maxWidth: !ellipsisSuffix ? '100%' : maxWidth }}
      ellipsis={ellipsisSuffix}
      className='text-ellipsis-middle'
      onClick={() => setEllipsisSuffix((prev) => (!prev ? { suffix } : false))}
      copyable={
        copyable
          ? {
              text: children,
            }
          : undefined
      }
    >
      {!ellipsisSuffix ? children : start}
    </TextStyled>
  );
}

const TextStyled = styled(Typography.Text)`
  .ant-typography-copy .anticon-copy {
    color: ${({ theme }) => theme.generatedColors[4]};
  }
`;

export default TextEllipsisMiddle;
