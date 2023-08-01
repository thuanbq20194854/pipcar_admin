import { Dropdown } from 'antd';
import { BsSortDownAlt } from 'react-icons/bs';
import Button from '../button/Button';

type TSortDropdownProps = {
  items?: { key: string; label: string }[];
  value?: string;
  onChange?: (v?: string) => void;
  children?: React.ReactNode;
};

function SortDropdown({ items, value, onChange, children }: TSortDropdownProps) {
  return (
    <Dropdown
      menu={{
        items: items,
        selectable: true,
        selectedKeys: !!value ? [value] : undefined,
        onSelect: ({ key }) => onChange?.(key),
        onDeselect: ({ key }) => onChange?.(undefined),
      }}
      trigger={['click']}
      arrow={{ pointAtCenter: true }}
      placement='bottomRight'
    >
      {!!children ? (
        children
      ) : (
        <Button type='text' size='large' block icon={<BsSortDownAlt size={22} />}></Button>
      )}
    </Dropdown>
  );
}

export const ButtonItem = <Button size='large' block icon={<BsSortDownAlt size={20} />}></Button>;

export default SortDropdown;
