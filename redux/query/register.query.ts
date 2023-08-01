import { createApi } from '@reduxjs/toolkit/query/react';
import { TBaseFilter } from 'src/types/global.types';
import { TRegister } from 'src/types/register.types';
import { TResponse, TResponseWithMeta } from 'src/types/response.types';
import baseQueryWithReauth from '../app/baseQueryWithReauth';

export type TListFilter = TBaseFilter & {
  status?: number;
  isAgency?: boolean;
  isTransportation?: boolean;
  isDriver?: boolean;
};

export type TCreateRegisterData = {};
export type TUpdateRegisterDetailData = {};
export type TConfirmRegisterDetailData = {
  id: string;
  code: string;
  address: string;
  lat_address: string;
  long_address: string;
  lat: string;
  long: string;
};

export const registerApi = createApi({
  reducerPath: 'registerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Registers'],
  keepUnusedDataFor: 600,
  endpoints: (builder) => ({
    // [ADMIN,PM]
    getRegisterList: builder.query<TResponseWithMeta<{ register_list: TRegister[] }>, any>({
      query: (filter) => ({ url: '/register', method: 'get', params: filter }),
      providesTags: (result) =>
        !!result?.data?.register_list.length
          ? [
              ...result.data.register_list.map(({ _id }) => ({
                type: 'Registers' as const,
                id: _id,
              })),
              { type: 'Registers', id: 'LIST' },
            ]
          : [{ type: 'Registers', id: 'LIST' }],
    }),
    // [ADMIN,PM]
    getRegisterDetail: builder.query<TResponse<{ register_detail: TRegister }>, string>({
      query: (registerId) => ({ url: `/register/detail/${registerId}`, method: 'get' }),
      providesTags: (result, error, id) => [{ type: 'Registers', id }],
    }),
    // [ADMIN,PM]
    createRegister: builder.mutation<TResponse, { data: TCreateRegisterData }>({
      query: ({ data }) => ({
        url: '/register',
        method: 'post',
        data: data,
      }),
      invalidatesTags: [{ type: 'Registers', id: 'LIST' }],
    }),
    // [ADMIN,PM]
    updateRegisterDetail: builder.mutation<
      TResponse,
      { id: string; data: TUpdateRegisterDetailData }
    >({
      query: ({ id, data }) => ({
        url: `/register/update_info/${id}`,
        method: 'put',
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Registers', id: id }],
    }),
    // [ADMIN,PM]
    confirmRegister: builder.mutation<TResponse, TConfirmRegisterDetailData>({
      query: ({ id, code, ...data }) => ({
        url: `/register/confirm/${id}?code=${code}`,
        method: 'post',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Registers', id: id }],
    }),
  }),
});
export const {
  useConfirmRegisterMutation,
  useCreateRegisterMutation,
  useGetRegisterDetailQuery,
  useGetRegisterListQuery,
  useUpdateRegisterDetailMutation,
} = registerApi;
