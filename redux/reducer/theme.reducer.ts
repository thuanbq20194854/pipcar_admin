import { generate } from '@ant-design/colors';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TState = {
  mode: 'light' | 'dark';
  generatedColors: string[];
  colorPrimary: string;
};

const colorPrimary = '#1D39C4';
const generatedColors = generate(colorPrimary);
const initialState: TState = {
  mode: 'light',
  generatedColors,
  colorPrimary,
};

const generateColorsFn = (colorPrimary = '#1D39C4', mode: 'light' | 'dark') =>
  generate(colorPrimary, {
    theme: mode === 'dark' ? 'dark' : 'default',
    backgroundColor: '#1f1f1f',
  });

const themeProviderSlice = createSlice({
  name: 'themeProvider',
  initialState: initialState,
  reducers: {
    toggleThemeMode(state, action: PayloadAction<null>) {
      if (state.mode === 'light') {
        state.mode = 'dark';
        state.generatedColors = generateColorsFn(state.colorPrimary, 'dark');
      } else {
        state.mode = 'light';
        state.generatedColors = generateColorsFn(state.colorPrimary, 'light');
      }
    },
    setThemeMode(state, action: PayloadAction<'light' | 'dark'>) {
      state.mode = action.payload;
      state.generatedColors = generateColorsFn(state.colorPrimary, action.payload);
    },
    setThemeColors(state, action: PayloadAction<string>) {
      state.colorPrimary = action.payload;
      state.generatedColors = generate(action.payload);
    },
  },
});

export const { setThemeColors, setThemeMode, toggleThemeMode } = themeProviderSlice.actions;

export default themeProviderSlice.reducer;
