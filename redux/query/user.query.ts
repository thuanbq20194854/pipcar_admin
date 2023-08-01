import { createApi } from '@reduxjs/toolkit/query/react';
import { TBaseFilter } from 'src/types/global.types';
import { TResponse, TResponseWithMeta } from 'src/types/response.types';
import { TUser } from 'src/types/user.types';
import baseQueryWithReauth from '../app/baseQueryWithReauth';

export type TListFilter = TBaseFilter & {
  status?: number;
};

export type TUpdateUserInfoByIdData = Pick<TUser, 'name' | 'phone'> & {
  password?: string;
};

export type TCreateUserData = Pick<TUser, 'name' | 'phone' | 'role'> & {
  password?: string;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users'],
  keepUnusedDataFor: 600,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<TResponse<{ user_detail: TUser }>, { rt: boolean }>({
      query: () => ({ url: '/auth/pip/user/me', method: 'get' }),
      providesTags: (result) =>
        result?.data?.user_detail._id
          ? [
              { type: 'Users', id: result?.data?.user_detail._id },
              { type: 'Users', id: 'ME' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
      extraOptions: {},
    }),
    // [ADMIN]
    getFilteredUsers: builder.query<TResponseWithMeta<{ user_list: TUser[] }>, any>({
      query: (filter) => ({ url: '/auth/pip/user', method: 'get', params: filter }),
      providesTags: (result) =>
        !!result?.data?.user_list.length
          ? [
              ...result.data.user_list.map(({ _id }) => ({ type: 'Users' as const, id: _id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    // [ADMIN]
    getUserById: builder.query<TResponse<{ user_detail: TUser }>, string>({
      query: (userId) => ({ url: `/auth/pip/user/detail/${userId}`, method: 'get' }),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    // [ADMIN]
    createUser: builder.mutation<TResponse, { data: TCreateUserData }>({
      query: ({ data }) => ({
        url: '/auth/pip/user',
        method: 'post',
        data: data,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    // [ADMIN]
    updateUserInfoById: builder.mutation<TResponse, { id: string; data: TUpdateUserInfoByIdData }>({
      query: ({ id, data }) => ({
        url: `/auth/pip/user/update_info/${id}`,
        method: 'put',
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id: id }],
    }),
    // [ADMIN]
    blockUserById: builder.mutation<TResponse, string>({
      query: (userId) => ({ url: `/auth/pip/user/block/${userId}`, method: 'put' }),
      invalidatesTags: (result, error, id) => [{ type: 'Users', id: id }],
    }),
    // [ADMIN]
    unBlockUserById: builder.mutation<TResponse, string>({
      query: (userId) => ({ url: `/auth/pip/user/unblock/${userId}`, method: 'put' }),
      invalidatesTags: (result, error, id) => [{ type: 'Users', id: id }],
    }),
    // [ADMIN]
    deleteUserById: builder.mutation<TResponse, string>({
      query: (userId) => ({ url: `/auth/pip/user/delete/${userId}`, method: 'put' }),
      invalidatesTags: (result, error, id) => [{ type: 'Users', id: id }],
    }),
  }),
});
export const {
  useGetCurrentUserQuery,
  useGetFilteredUsersQuery,
  useGetUserByIdQuery,
  useBlockUserByIdMutation,
  useDeleteUserByIdMutation,
  useUnBlockUserByIdMutation,
  useUpdateUserInfoByIdMutation,
  useCreateUserMutation,
} = userApi;
