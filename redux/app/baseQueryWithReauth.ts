import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import type { AxiosRequestConfig } from 'axios';
import { ErrorCode } from '../../types/response.types';
import { setRefreshToken } from '../reducer/auth.reducer';
import { RootState } from '../store';
import baseQuery from './baseQuery';
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#preventing-multiple-unauthorized-errors
const mutex = new Mutex();
const baseQueryWithReauth: BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  },
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    [ErrorCode.PipTokenExpiredError, ErrorCode.NotAuthenticateError].includes(
      (result.error as any).response_code,
    )
  ) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const localRt = (api.getState() as RootState).auth.refreshToken;
        if (!localRt) {
          window.history.replaceState({}, '', '/login');
        } else {
          const refreshResult = await baseQuery(
            { url: '/auth/pip/refresh_token', method: 'post', data: { refresh_token: localRt } },
            api,
            extraOptions,
          );
          if (refreshResult.data) {
            // retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(setRefreshToken(null));
            window.history.replaceState({}, '', '/login');
          }
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
export default baseQueryWithReauth;
