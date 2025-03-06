import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import configApi from './config-api';
import logout from '../components/auth/logout';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: configApi.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = Cookies.get('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 401) {
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
    getPoints: builder.query({
      query: () => '/points',
    }),
  }),
});

export const { useLoginMutation, useGetPointsQuery } = api;
