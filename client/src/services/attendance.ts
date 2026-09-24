import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

import { AttendanceAttributes, AttendanceResponse } from '@/types/attendance'
import { apiBaseQuery } from '@/utils/api'

const api = createApi({
  reducerPath: 'attendance',
  baseQuery: apiBaseQuery,
  tagTypes: ['Attendance'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    // Clock In (Create data baru)
    createAttendance: builder.mutation<AttendanceResponse, AttendanceAttributes>({
      query: (attributes) => ({
        url: '/attendances',
        method: 'POST',
        body: {
          data: {
            type: 'attendance',
            attributes,
          },
        },
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Clock Out / Update data berdasarkan ID record attendance
    updateAttendance: builder.mutation<AttendanceResponse, { id: string; attributes: Partial<AttendanceAttributes> }>({
      query: ({ id, attributes }) => ({
        url: `/attendances/${id}`,
        method: 'PUT',
        body: {
          data: {
            type: 'attendance',
            attributes,
          },
        },
      }),
      invalidatesTags: ['Attendance'],
    }),

    getTodayAttendance: builder.query<any, { staffId: string; date: string }>({
      query: (params) => ({
        url: '/attendances',
        params,
      }),
      providesTags: ['Attendance'],
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
})

export const { useCreateAttendanceMutation, useUpdateAttendanceMutation, useGetTodayAttendanceQuery } = api
export default api
