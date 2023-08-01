import { createApi } from '@reduxjs/toolkit/query/react';
import { TDriver } from 'src/types/driver.types';
import { TBaseFilter } from 'src/types/global.types';
import { TResponse, TResponseWithMeta } from 'src/types/response.types';
import baseQueryWithReauth from '../app/baseQueryWithReauth';

export type TListFilter = TBaseFilter & {
  agency?: string;
  isDriving?: boolean;
};

export type TCreateDriverData = {
  agency?: string;
  phone: string;
  name: string;
  license_id: string;
  address: string;
  lat_address: string;
  long_address: string;
  lat: string;
  long: string;
};
export type TUpdateDriverDetailData = {};

export const driverApi = createApi({
  reducerPath: 'driverApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Drivers'],
  keepUnusedDataFor: 600,
  endpoints: (builder) => ({
    // [ADMIN,PM]
    getDriverList: builder.query<TResponseWithMeta<{ driver_list: TDriver[] }>, TListFilter>({
      query: (filter) => ({ url: '/driver', method: 'get', params: filter }),
      providesTags: (result) =>
        !!result?.data?.driver_list.length
          ? [
              ...result.data.driver_list.map(({ _id }) => ({
                type: 'Drivers' as const,
                id: _id,
              })),
              { type: 'Drivers', id: 'LIST' },
            ]
          : [{ type: 'Drivers', id: 'LIST' }],
    }),
    // [ADMIN,PM]
    getDriverDetail: builder.query<TResponse<{ driver_detail: TDriver }>, string>({
      query: (driverId) => ({ url: `/driver/detail/${driverId}`, method: 'get' }),
      providesTags: (result, error, id) => [{ type: 'Drivers', id }],
    }),
    // [ADMIN,PM]
    createDriver: builder.mutation<TResponse, TCreateDriverData>({
      query: ({ agency, ...data }) => ({
        url: `/driver?agency=${agency}`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Drivers', id: 'LIST' }],
    }),
    // [ADMIN,PM]
    deleteDriver: builder.mutation<TResponse<{ driver_detail: TDriver }>, string>({
      query: (driverId) => ({ url: `/driver/${driverId}`, method: 'delete' }),
      invalidatesTags: [{ type: 'Drivers', id: 'LIST' }],
    }),
    // [ADMIN,PM]
    deliverDriver: builder.mutation<TResponse, { driverId: string; car: string }>({
      query: ({ driverId, car }) => ({
        url: `/driver/${driverId}/deliver?car=${car}`,
        method: 'put',
      }),
      invalidatesTags: (result, error, { driverId }) => [{ type: 'Drivers', id: driverId }],
    }),
    // [ADMIN,PM]
    unDeliverDriver: builder.mutation<TResponse, string>({
      query: (driverId) => ({ url: `/driver/${driverId}/undeliver`, method: 'put' }),
      invalidatesTags: (result, error, id) => [{ type: 'Drivers', id: id }],
    }),
    // [ADMIN,PM]
    unDeliverCar: builder.mutation<TResponse, string>({
      query: (carId) => ({ url: `/car/${carId}/undeliver`, method: 'put' }),
      invalidatesTags: (result, error, id) => [{ type: 'Drivers', id: 'LIST' }],
    }),
  }),
});
export const {
  useDeliverDriverMutation,
  useCreateDriverMutation,
  useGetDriverDetailQuery,
  useGetDriverListQuery,
  useUnDeliverDriverMutation,
  useUnDeliverCarMutation,
  useDeleteDriverMutation,
} = driverApi;
