import styled from '@emotion/styled';
import { Tag as AntdTag, TagProps, Tooltip } from 'antd';
import { forwardRef, ForwardRefRenderFunction } from 'react';

type TTagProps = TagProps & { tooltip?: string; isHideBordered?: boolean; split?: string };

const TagStyled = styled(AntdTag)<Pick<TTagProps, 'isHideBordered' | 'split'>>`
  display: flex;
  justify-content: center;
  align-items: center;
  .split {
    margin: 0 4px;
  }
  &.hide-bordered {
    border: none;
  }
`;

const Tag: ForwardRefRenderFunction<HTMLElement, TTagProps> = (
  { children, tooltip, isHideBordered, className = '', split, ...props },
  forwardedRef,
) => {
  const finalClassName = !!isHideBordered ? 'hide-bordered' + className : className;
  if (!!tooltip)
    return (
      <Tooltip destroyTooltipOnHide title={tooltip}>
        <TagStyled className={finalClassName} {...props} ref={forwardedRef}>
          {!!split ? <span className='split'>{split}</span> : <></>}
          {children}
        </TagStyled>
      </Tooltip>
    );

  return (
    <TagStyled className={finalClassName} {...props} ref={forwardedRef}>
      {!!split ? <span className='split'>{split}</span> : <></>}
      {children}
    </TagStyled>
  );
};

export default forwardRef<HTMLElement, TTagProps>(Tag);
