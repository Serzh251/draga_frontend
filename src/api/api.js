import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import configApi from './config-api';
import logout from '../components/auth/logout';
import Cookies from 'js-cookie';

// Базовый запрос с авторизацией
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

// Автоматическое обновление токена при 401
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

// Определяем теги для кэширования и инвалидации
export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Fields', 'Points', 'CleanPoints', 'Years', 'GridCells', 'UserGeoData', 'DefaultMapCenter'],
  endpoints: (builder) => ({
    // 🔐 Login
    login: builder.mutation({
      query: (credentials) => ({
        url: configApi.LOGIN_URL,
        method: 'POST',
        body: credentials,
      }),
    }),

    // 🗺️ Поля
    fetchFields: builder.query({
      query: () => configApi.LIST_FIELDS,
      providesTags: ['Fields'],
    }),

    // 📍 Точки (сырые)
    fetchPoints: builder.query({
      query: ({ year, depth_min, depth_max, field }) => {
        const params = new URLSearchParams();
        if (year) params.append('year', Array.isArray(year) ? year.join(',') : year);
        if (depth_min) params.append('depth_min', depth_min);
        if (depth_max) params.append('depth_max', depth_max);
        if (field) params.append('field', Array.isArray(field) ? field.join(',') : field);
        return `${configApi.GET_POINTS}?is_working=true&${params.toString()}`;
      },
      providesTags: ['Points'],
    }),

    // 🧹 Очищенные точки
    fetchCleanPoints: builder.query({
      query: ({ year, depth_min, depth_max, field }) => {
        const params = new URLSearchParams();
        if (year) params.append('year', Array.isArray(year) ? year.join(',') : year);
        if (depth_min) params.append('depth_min', depth_min);
        if (depth_max) params.append('depth_max', depth_max);
        if (field) params.append('field', Array.isArray(field) ? field.join(',') : field);
        return `${configApi.GET_CLEAN_POINTS}?${params.toString()}`;
      },
      providesTags: ['CleanPoints'],
    }),

    // 📅 Уникальные годы
    fetchYears: builder.query({
      query: () => configApi.GET_UNIQUE_YEARS,
      providesTags: ['Years'],
    }),

    // 🟨 Ячейки сетки (пагинация)
    fetchGridCells: builder.query({
      query: (page = 1) => `${configApi.GET_GRID_CELLS}?page=${page}`,
      transformResponse: (response) => ({
        features: response.results?.features || [],
        hasMore: !!response.next_page,
      }),
      providesTags: ['GridCells'],
    }),

    // 📦 Геоданные пользователя
    fetchUserGeoData: builder.query({
      query: () => configApi.LIST_USER_GEO_DATA,
      providesTags: ['UserGeoData'],
    }),

    createUserGeoData: builder.mutation({
      query: (newGeoData) => ({
        url: configApi.CREATE_USER_GEO_DATA,
        method: 'POST',
        body: newGeoData,
      }),
      invalidatesTags: ['UserGeoData'],
    }),

    deleteUserGeoData: builder.mutation({
      query: (id) => ({
        url: `${configApi.LIST_USER_GEO_DATA}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserGeoData'],
    }),

    fetchDefaultMapCenter: builder.query({
      query: () => configApi.SETUP_DEFAULT_MAP_CENTER,
    }),

    createOrUpdateDefaultMapCenter: builder.mutation({
      query: (data) => ({
        url: configApi.SETUP_DEFAULT_MAP_CENTER,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DefaultMapCenter'],
    }),
    // 🚤 Список треков
    fetchTrackList: builder.query({
      query: () => configApi.GET_TRACK_LIST,
      providesTags: ['TrackList'],
    }),

    // 🌊 Точки одного трека (без пагинации)
    fetchTrackPoints: builder.query({
      query: ({ trackId }) => {
        return `${configApi.GET_TRACK_POINTS.replace(':id', trackId)}`;
      },
      providesTags: (result, error, { trackId }) => [{ type: 'TrackPoints', id: trackId }],
    }),
  }),
});

// Экспортируем хуки
export const {
  useLoginMutation,
  useFetchFieldsQuery,
  useFetchPointsQuery,
  useFetchCleanPointsQuery,
  useFetchYearsQuery,
  useLazyFetchGridCellsQuery,
  useFetchUserGeoDataQuery,
  useCreateUserGeoDataMutation,
  useDeleteUserGeoDataMutation,
  useFetchDefaultMapCenterQuery,
  useCreateOrUpdateDefaultMapCenterMutation,
  useFetchTrackListQuery,
  useFetchTrackPointsQuery,
} = api;
