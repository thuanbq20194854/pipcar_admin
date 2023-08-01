import { combineReducers, configureStore, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { getPersistConfig } from 'redux-deep-persist';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { agencyApi } from './query/agency.query';
import { authApi } from './query/auth.query';
import { carApi } from './query/car.query';
import { driverApi } from './query/driver.query';
import { provincesApi } from './query/provinces.query';
import { registerApi } from './query/register.query';
import { userApi } from './query/user.query';

import authReducer, { setRefreshToken } from './reducer/auth.reducer';
import themeReducer from './reducer/theme.reducer';
import userReducer, { setUser } from './reducer/user.reducer';
import visibleReducer from './reducer/visible.reducer';

const themeConfig = {
  key: 'theme',
  version: 1,
  storage,
};
const visibleConfig = {
  key: 'visible',
  version: 1,
  storage: storage,
  whitelist: ['isSiderCollapsed'],
};
const authConfig = {
  key: 'auth',
  version: 1,
  storage: storage,
  whitelist: ['refreshToken'],
};

// user: persistReducer(userPersistConfig, userReducer),

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  theme: themeReducer,
  visible: visibleReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [agencyApi.reducerPath]: agencyApi.reducer,
  [registerApi.reducerPath]: registerApi.reducer,
  [provincesApi.reducerPath]: provincesApi.reducer,
  [driverApi.reducerPath]: driverApi.reducer,
  [carApi.reducerPath]: carApi.reducer,
});

const persistReducerConfig = getPersistConfig({
  key: 'root',
  version: 1,
  storage: storage,
  whitelist: [
    'auth.refreshToken',
    'visible.isSiderCollapsed',
    'theme',
    'user.data.role',
    'user.data.status',
  ],
  rootReducer: reducers,
});

const persistedReducer = persistReducer(persistReducerConfig, reducers);

export const rtkQueryErrorLogger: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (process.env.NODE_ENV !== 'production') console.warn(action.payload);
    if (action.payload.response_code === -603) {
      api.dispatch(setRefreshToken(null));
      api.dispatch(setUser(null));
      window.history.replaceState({}, '', '/login');
    }
    // const { status, data } = action.payload;
    // if (![404, 401].includes(status))
    //   message.error({ content: `${status || 400} : ${data?.err || "Đã có lỗi xảy ra"}` });
  }

  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) =>
    gDM({ serializableCheck: false }).concat(
      authApi.middleware,
      userApi.middleware,
      agencyApi.middleware,
      registerApi.middleware,
      provincesApi.middleware,
      driverApi.middleware,
      carApi.middleware,
      rtkQueryErrorLogger,
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
