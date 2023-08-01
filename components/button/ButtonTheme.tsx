import { FloatButton } from 'antd';
import { FaRegMoon } from 'react-icons/fa';
import { ImSun } from 'react-icons/im';
import { toggleThemeMode } from 'src/redux/reducer/theme.reducer';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

function ButtonTheme() {
  const { mode } = useAppSelector((s) => s.theme);
  const dispatch = useAppDispatch();
  return (
    <FloatButton
      shape='square'
      icon={mode === 'dark' ? <ImSun size={15} /> : <FaRegMoon size={15} />}
      onClick={() => dispatch(toggleThemeMode(null))}
      style={{ bottom: 24 }}
    />
  );
}

export default ButtonTheme;
