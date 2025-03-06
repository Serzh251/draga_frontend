import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import configApi from './config-api';
import logout from '../components/auth/logout';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: configApi.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
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
    fetchCleanPoints: builder.query({
      query: ({ year, depth_min, depth_max, field }) => {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (depth_min) params.append('depth_min', depth_min);
        if (depth_max) params.append('depth_max', depth_max);
        if (field) params.append('field', Array.isArray(field) ? field.join(',') : field);
        return `${configApi.GET_CLEAN_POINTS}?${params.toString()}`;
      },
    }),
  }),
});

export const { useLoginMutation, useFetchFieldsQuery, useFetchCleanPointsQuery } = api;
