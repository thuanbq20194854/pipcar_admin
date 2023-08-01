import { createApi } from '@reduxjs/toolkit/query/react';
import { TResponse } from 'src/types/response.types';
import baseQuery from '../app/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<
      TResponse<{
        refresh_token: string;
      }>,
      any
    >({
      query: (data) => ({
        url: '/auth/pip/login',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<TResponse<any>, void>({
      query: () => ({
        url: '/auth/pip/logout',
        method: 'post',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});
export const { useLoginMutation, useLogoutMutation } = authApi;
