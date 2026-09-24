import { BaseResponse } from './common'

export interface AttendanceAttributes {
  attendanceId: string
  staffId: string
  checkInTime: string
  checkOutTime?: string
  status?: string
}

export interface Attendance extends AttendanceAttributes {
  id: string
  createdAt?: string
  updatedAt?: string
}

export type AttendanceResponse = BaseResponse<Attendance>
