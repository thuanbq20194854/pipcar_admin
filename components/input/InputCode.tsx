import styled from '@emotion/styled';
import { Input, InputProps } from 'antd';
import { BsArrowRepeat } from 'react-icons/bs';
import Button from '../button/Button';

type TProps = InputProps & {
  onClickGenerate?: () => void;
};

function InputCode({ onClickGenerate, ...props }: TProps) {
  return (
    <InputStyled
      type='tel'
      placeholder='Code...'
      className='input-code'
      suffix={
        <Button
          size='middle'
          type='text'
          icon={<BsArrowRepeat size={18} />}
          tooltip='Generate new code'
          onClick={onClickGenerate}
        ></Button>
      }
      {...props}
    />
  );
}

const InputStyled = styled(Input)`
  padding-right: 6px;
  .ant-input-suffix {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    button {
      height: 100%;
    }
  }
`;

export default InputCode;
