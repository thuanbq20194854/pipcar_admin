import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import baseQueryWithReauth from './baseQueryWithReauth';

export const emptySplitApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  endpoints: () => ({}),
});

export const emptySplitApiWithReauth = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
