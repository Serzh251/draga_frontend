import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import configApi from './config-api';
import logout from '../components/auth/logout';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: configApi.BASE_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = Cookies.get('refreshToken');
    const refreshResult = await baseQuery(
      {
        url: configApi.TOKEN_REFRESH,
        method: 'POST',
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const newAccessToken = refreshResult.data.access;
      Cookies.set('accessToken', newAccessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: configApi.LOGIN_URL,
        method: 'POST',
        body: credentials,
      }),
    }),
    fetchFields: builder.query({
      query: () => configApi.LIST_FIELDS,
    }),
    fetchPoints: builder.query({
      query: ({ year, depth_min, depth_max, field }) => {
        const params = new URLSearchParams();
        if (year) params.append('year', Array.isArray(year) ? year.join(',') : year);
        if (depth_min) params.append('depth_min', depth_min);
        if (depth_max) params.append('depth_max', depth_max);
        if (field) params.append('field', Array.isArray(field) ? field.join(',') : field);
        return `${configApi.GET_POINTS}?is_working=true&${params.toString()}`;
      },
    }),
    fetchCleanPoints: builder.query({
      query: ({ year, depth_min, depth_max, field }) => {
        const params = new URLSearchParams();
        if (year) params.append('year', Array.isArray(year) ? year.join(',') : year);
        if (depth_min) params.append('depth_min', depth_min);
        if (depth_max) params.append('depth_max', depth_max);
        if (field) params.append('field', Array.isArray(field) ? field.join(',') : field);
        return `${configApi.GET_CLEAN_POINTS}?${params.toString()}`;
      },
    }),
    fetchYears: builder.query({
      query: () => configApi.GET_UNIQUE_YEARS,
    }),
    fetchGridCells: builder.query({
      query: (page = 1) => `${configApi.GET_GRID_CELLS}?page=${page}`,
      transformResponse: (response) => ({
        features: response.results?.features || [],
        hasMore: !!response.next_page,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useFetchFieldsQuery,
  useFetchPointsQuery,
  useFetchCleanPointsQuery,
  useFetchYearsQuery,
  useLazyFetchGridCellsQuery,
} = api;
