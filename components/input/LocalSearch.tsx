import styled from '@emotion/styled';
import { Form, Input, theme } from 'antd';
import { BsSearch } from 'react-icons/bs';
import Button from '../button/Button';

const ContentWrapper = styled.div`
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? '#424242' : '#d9d9d9')};
  background: ${({ theme }) => (theme.mode === 'dark' ? '#141414' : '#fff')};
  border-radius: 8px;
  .ant-input-prefix {
    color: #d9d9d9;
    margin-inline-end: 8px;
  }
  &:focus-within {
    border-color: ${({ theme }) => theme.generatedColors[4]};
  }
  &:hover {
    border-color: ${({ theme }) => theme.generatedColors[3]};
  }
`;

type TLocalSearchProps<TFormData> = {
  onFinish?: (values: TFormData) => void;
  onValuesChange?: (changedValues: any, values: TFormData) => void;
  placeholder?: string;
};

const LocalSearch = <T extends { keySearch: string }>({
  onFinish,
  onValuesChange,
  placeholder = 'Search...',
}: TLocalSearchProps<T>) => {
  const [form] = Form.useForm<T>();
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();

  return (
    <ContentWrapper className='localsearch'>
      <Form form={form} size='middle' onFinish={onFinish} onValuesChange={onValuesChange}>
        <Form.Item name='keySearch' noStyle>
          <Input
            bordered={false}
            style={{ paddingRight: 6 }}
            placeholder={placeholder}
            allowClear
            prefix={<BsSearch size={18} color={colorTextPlaceholder} />}
            suffix={
              <Button type='primary' htmlType='submit' size='middle'>
                <BsSearch size={18} />
              </Button>
            }
          />
        </Form.Item>
      </Form>
    </ContentWrapper>
  );
};

export default LocalSearch;
