import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme, Typography } from 'antd';
import Link from 'src/components/next/Link';
import { LogoSvg } from '../icons';
const { useToken } = theme;

type TLogoWithTextProps = {
  logoSize?: number;
  fontSize?: number;
  fontWeight?: number;
};

const gradient = keyframes`
0% {
  background-position: 0 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0 50%;
}`;

const LogoWrapper = styled.div<TLogoWithTextProps>`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-shrink: 0;
  column-gap: 4;
  .logo-text {
    font-size: ${(props) => props.fontSize + 'px'} !important;
    font-weight: ${(props) => props.fontWeight} !important;
    &-gradient {
      color: transparent;
      animation: ${gradient} 5s ease-in-out infinite;
      background: ${({ theme }) =>
        `linear-gradient(to right,${theme.generatedColors[4]},${theme.generatedColors[2]},${theme.generatedColors[4]},${theme.colorPrimary})`};
      background-size: 300%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

function LogoWithText({ logoSize = 24, fontSize = 16, fontWeight = 500 }: TLogoWithTextProps) {
  const {
    token: { colorText },
  } = useToken();
  return (
    <Link href='/' className='logo-wrapper'>
      <LogoWrapper fontSize={fontSize} fontWeight={fontWeight}>
        {logoSize > 0 && (
          <LogoSvg width={logoSize} height={logoSize} style={{ color: colorText }} />
        )}
        {fontSize > 0 && (
          <>
            <Typography.Text className='logo-text'>Pip</Typography.Text>
            <span className='logo-text logo-text-gradient'>Car</span>
          </>
        )}
      </LogoWrapper>
    </Link>
  );
}

export default LogoWithText;
