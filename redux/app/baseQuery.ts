import { BaseQueryFn, retry } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
axios.interceptors.request.use((config) => {
  config.headers = {
    'Content-Type': 'application/json',
  };
  config.withCredentials = true;
  return config;
});

const baseQuery: BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  },
  unknown,
  unknown
> = retry(
  async ({ url, method, data, params }, api, extraOptions) => {
    try {
      const result = await axios({ url: baseUrl + url, method, data, params });
      return { data: result.data };
    } catch (err: any) {
      const { data } = err.response!;
      return { error: data || err.message };
    }
  },
  { maxRetries: 0 },
);

export default baseQuery;
