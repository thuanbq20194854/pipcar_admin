import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../types/user.types';
import { authApi } from '../query/auth.query';
import { userApi } from '../query/user.query';

type TState = { data: TUser | null };
const initialState: TState = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      if (action.payload == null) state.data = null;
      else state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getCurrentUser.matchFulfilled, (state, { payload }) => {
      state.data = payload.data.user_detail;
    });
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state, action) => {
      state.data = null;
    });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
