import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { LogoSvg } from '../icons';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  .modal-container {
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .modal-container .text-redirect {
    margin-top: 36px;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
  }
  .modal-container .text-counter {
    color: ${({ theme }) => theme.colorPrimary};
  }
`;

const Loader = () => {
  const { colorPrimary } = useTheme();
  return (
    <ModalWrapper>
      <div className='modal-container'>
        <LogoSvg width={120} height={120} color={colorPrimary} />
      </div>
    </ModalWrapper>
  );
};

export default Loader;
