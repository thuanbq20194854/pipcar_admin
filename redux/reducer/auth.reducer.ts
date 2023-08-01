import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../query/auth.query';

type TState = {
  refreshToken: string | null;
};

const initialState: TState = { refreshToken: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.refreshToken = payload.data.refresh_token;
    });
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state, action) => {
      state.refreshToken = null;
    });
  },
});

export const { setRefreshToken } = authSlice.actions;

export default authSlice.reducer;
