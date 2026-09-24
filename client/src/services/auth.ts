import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

import { AuthRequest, AuthResponse, RegisterRequest, SelfUserResponse } from '@/types/auth'
import { apiBaseQuery } from '@/utils/api'

const api = createApi({
  reducerPath: 'auth',
  baseQuery: apiBaseQuery,
  tagTypes: ['Auth'],
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 259200, // 3 days
  endpoints: (builder) => ({
    postLogin: builder.mutation<AuthResponse, AuthRequest>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    postRegister: builder.mutation<any, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    postLogout: builder.mutation<AuthResponse, AuthRequest>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getSelfUser: builder.query<SelfUserResponse, void>({
      query: () => ({
        url: '/auth/selfUser',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
})

// Export hooks for usage in functional components
export const { usePostLoginMutation, usePostRegisterMutation, useGetSelfUserQuery } = api

export default api
