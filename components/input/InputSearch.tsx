import { Input, InputProps, theme } from 'antd';
import { BsSearch } from 'react-icons/bs';

type TInputSearchProps = InputProps & {};

function InputSearch(props: TInputSearchProps) {
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  return (
    <Input
      size='large'
      style={{ padding: '0 0 0 12px' }}
      allowClear
      prefix={<BsSearch size={18} color={colorTextPlaceholder} style={{ marginRight: 4 }} />}
      {...props}
    />
  );
}

export default InputSearch;
