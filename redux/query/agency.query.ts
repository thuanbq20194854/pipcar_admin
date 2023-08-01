import { createApi } from '@reduxjs/toolkit/query/react';
import { TAgency } from 'src/types/agency.types';
import { TBaseFilter } from 'src/types/global.types';
import { TResponse, TResponseWithMeta } from 'src/types/response.types';
import baseQueryWithReauth from '../app/baseQueryWithReauth';

export type TListFilter = TBaseFilter & {
  status?: number;
  isAgency?: boolean;
  isTransportation?: boolean;
  isDriver?: boolean;
  hasCar?: number;
};

export type TCreateAgencyData = {};
export type TUpdateAgencyDetailData = {};

export const agencyApi = createApi({
  reducerPath: 'agencyApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Agencies'],
  keepUnusedDataFor: 600,
  endpoints: (builder) => ({
    // [ADMIN,PM]
    getAgencyList: builder.query<TResponseWithMeta<{ agency_list: TAgency[] }>, any>({
      query: (filter) => ({ url: '/agency', method: 'get', params: filter }),
      providesTags: (result) =>
        !!result?.data?.agency_list.length
          ? [
              ...result.data.agency_list.map(({ _id }) => ({
                type: 'Agencies' as const,
                id: _id,
              })),
              { type: 'Agencies', id: 'LIST' },
            ]
          : [{ type: 'Agencies', id: 'LIST' }],
    }),
    // [ADMIN,PM]
    getAgencyDetail: builder.query<TResponse<{ agency_detail: TAgency }>, string>({
      query: (agencyId) => ({ url: `/agency/detail/${agencyId}`, method: 'get' }),
      providesTags: (result, error, id) => [{ type: 'Agencies', id }],
    }),
    // [ADMIN,PM]
    createAgency: builder.mutation<TResponse<{ agency_id: string }>, { data: TCreateAgencyData }>({
      query: ({ data }) => ({
        url: '/agency',
        method: 'post',
        data: data,
      }),
      invalidatesTags: [{ type: 'Agencies', id: 'LIST' }],
    }),
    // [ADMIN,PM]
    updateAgencyDetail: builder.mutation<TResponse, { id: string; data: TUpdateAgencyDetailData }>({
      query: ({ id, data }) => ({
        url: `/agency/update_info/${id}`,
        method: 'put',
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Agencies', id: id }],
    }),
    // [ADMIN,PM]
    blockAgency: builder.mutation<TResponse, string>({
      query: (agencyId) => ({ url: `/agency/block/${agencyId}`, method: 'put' }),
      invalidatesTags: (result, error, id) => [{ type: 'Agencies', id: id }],
    }),
    // [ADMIN,PM]
    unBlockAgency: builder.mutation<TResponse, string>({
      query: (agencyId) => ({ url: `/agency/unblock/${agencyId}`, method: 'put' }),
      invalidatesTags: (result, error, id) => [{ type: 'Agencies', id: id }],
    }),
  }),
});
export const {
  useBlockAgencyMutation,
  useCreateAgencyMutation,
  useGetAgencyDetailQuery,
  useGetAgencyListQuery,
  useUnBlockAgencyMutation,
  useUpdateAgencyDetailMutation,
} = agencyApi;
