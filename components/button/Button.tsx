import styled from '@emotion/styled';
import { Button as AntdButton, ButtonProps, Tooltip } from 'antd';
import { forwardRef, ForwardRefRenderFunction } from 'react';

type TButtonProps = ButtonProps & { tooltip?: string };

const ButtonStyled = styled(AntdButton)``;
const Button: ForwardRefRenderFunction<HTMLElement, TButtonProps> = (
  { children, tooltip, ...props },
  forwardedRef,
) => {
  if (!!tooltip)
    return (
      <Tooltip destroyTooltipOnHide title={tooltip}>
        <ButtonStyled {...props} ref={forwardedRef}>
          {children}
        </ButtonStyled>
      </Tooltip>
    );

  return (
    <ButtonStyled {...props} ref={forwardedRef}>
      {children}
    </ButtonStyled>
  );
};

export const ButtonGroup = AntdButton.Group;

export default forwardRef<HTMLElement, TButtonProps>(Button);
