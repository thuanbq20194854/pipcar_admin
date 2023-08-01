import { createApi } from '@reduxjs/toolkit/query/react';
import { TCar } from 'src/types/car.types';
import { TDriver } from 'src/types/driver.types';
import { ID, TBaseFilter } from 'src/types/global.types';
import { TResponse, TResponseWithMeta } from 'src/types/response.types';
import baseQueryWithReauth from '../app/baseQueryWithReauth';

export type TListFilter = TBaseFilter & {
  agency?: string;
  isDriven?: boolean;
};

export type TCreateCarData = {
  agency_id: ID;
  plates: string;
  type: string;
  name: string;
  lat?: string;
  long?: string;
  updated_gps_time?: number;
};
export type TUpdateCarDetailData = {};

export type TCarType = {
  name: string;
  name_id: number;
  __v: number;
  id: string;
};

export type TUpdateGpsCar = {
  lat: string;
  long: string;
  car_list: string[];
};

export const carApi = createApi({
  reducerPath: 'carApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Cars'],
  keepUnusedDataFor: 600,
  endpoints: (builder) => ({
    // [ADMIN,PM]
    getCarList: builder.query<TResponseWithMeta<{ car_list: TCar[] }>, TListFilter>({
      query: (filter) => ({ url: '/car', method: 'get', params: filter }),
      providesTags: (result) =>
        !!result?.data?.car_list.length
          ? [
              ...result.data.car_list.map(({ _id }) => ({
                type: 'Cars' as const,
                id: _id,
              })),
              { type: 'Cars', id: 'LIST' },
            ]
          : [{ type: 'Cars', id: 'LIST' }],
    }),

    getAllCarTypes: builder.query<TResponse<{ car_types: TCarType[] }>, void>({
      query: () => ({ url: `/car_type`, method: `get` }),
    }),

    getCarDetail: builder.query<
      TResponse<{ car_detail: TCar; driver_detail: TDriver | null }>,
      string
    >({
      query: (carId) => ({ url: `/car/detail/${carId}`, method: 'get' }),
      providesTags: (result, error, id) => [{ type: 'Cars', id }],
    }),
    // [ADMIN,PM]
    createCar: builder.mutation<TResponse, TCreateCarData>({
      query: ({ agency_id, ...data }) => ({
        url: `/car?agency=${agency_id}`,
        method: 'post',
        data: data,
      }),
      invalidatesTags: [{ type: 'Cars', id: 'LIST' }],
    }),
    updateGpsCar: builder.mutation<TResponse, TUpdateGpsCar>({
      query: (data) => ({
        url: `/car/update_gps_by_car_list`,
        method: 'put',
        data,
      }),
    }),
    // [ADMIN,PM]
    deleteCar: builder.mutation<TResponse, string>({
      query: (carId) => ({ url: `/car/${carId}`, method: 'delete' }),
      invalidatesTags: [{ type: 'Cars', id: 'LIST' }],
    }),
  }),
});
export const {
  useCreateCarMutation,
  useGetCarDetailQuery,
  useGetCarListQuery,
  useUpdateGpsCarMutation,
  useDeleteCarMutation,
  useGetAllCarTypesQuery,
} = carApi;
