import { useTheme } from '@emotion/react';
import { Modal as AntdModal, ModalProps } from 'antd';
import { useMediaQuery } from 'react-responsive';

type TProps = ModalProps;

function Modal({ children, style = {}, centered = false, ...props }: TProps) {
  const mediaBelow768 = useMediaQuery({ maxWidth: 767.9 });
  const mediaStyle = mediaBelow768 ? { padding: 0, ...style, top: 0 } : style;
  const mediaCentered = mediaBelow768;
  const { mode } = useTheme();
  return (
    <AntdModal
      wrapClassName={`modal-sticky-footer ${mode}`}
      centered={mediaCentered}
      style={{ ...mediaStyle }}
      {...props}
    >
      {children}
    </AntdModal>
  );
}

export default Modal;
