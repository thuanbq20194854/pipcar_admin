import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const baseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: `https://provinces.open-api.vn/api`,
  }),
  { maxRetries: 0 },
);

type TBase = {
  name: string;
  code: number;
  division_type:
    | 'tỉnh'
    | 'thành phố trung ương'
    | 'huyện'
    | 'quận'
    | 'thành phố'
    | 'thị xã'
    | 'xã'
    | 'thị trấn'
    | 'phường';
  codename: string;
};

type TProvice = TBase & {
  phone_code: number;
  districts: TDistrict[];
};

type TDistrict = TBase & {
  province_code: number;
  wards: TWard[];
};

type TWard = TBase & {
  district_code: number;
};

export const provincesApi = createApi({
  reducerPath: 'provincesApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Provinces', 'Districts', 'Wards'],
  keepUnusedDataFor: 600,
  endpoints: (builder) => ({
    getAllProvincesDistricts: builder.query<TProvice[], any>({
      query: (pcode) => `/?depth=2`,
      providesTags: ['Provinces'],
    }),
    getProvinces: builder.query<(TProvice & { districts: [] })[], any>({
      query: () => `/p`,
      providesTags: ['Provinces'],
    }),
    getDistricts: builder.query<TProvice, number>({
      query: (pcode) => `/p/${pcode}?depth=2`,
      providesTags: ['Districts'],
    }),
    getWards: builder.query<TDistrict, number>({
      query: (dcode) => `/d/${dcode}?depth=2`,
      providesTags: ['Wards'],
    }),
  }),
});
export const {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
  useGetAllProvincesDistrictsQuery,
} = provincesApi;
