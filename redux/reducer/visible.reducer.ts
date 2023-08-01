import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TState = {
  isSiderCollapsed: boolean;
  visibleItem: string | null;
  extraState: any;
};

const initialState: TState = { isSiderCollapsed: false, visibleItem: null, extraState: null };

const visibleSlice = createSlice({
  name: 'visible',
  initialState,
  reducers: {
    setVisibleItem(state, action: PayloadAction<string | null>) {
      state.visibleItem = action.payload;
      if (action.payload === null) state.extraState = null;
    },
    setSiderCollapsed(state, action: PayloadAction<boolean>) {
      state.isSiderCollapsed = action.payload;
    },
    setExtraState(state, action: PayloadAction<any>) {
      state.extraState = action.payload;
    },
  },
});

export const { setVisibleItem, setSiderCollapsed, setExtraState } = visibleSlice.actions;

export default visibleSlice.reducer;
