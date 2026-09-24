import { useCallback, useEffect, useState } from 'react'

import {
  useCreateAttendanceMutation,
  useGetTodayAttendanceQuery,
  useUpdateAttendanceMutation,
} from '@/services/attendance'
import { useGetSelfUserQuery } from '@/services/auth'

import { getLatestAttendanceRecord } from '../utils/attendance-helper'
import { calculateDurationText } from '../utils/formatter'

export function useAttendance() {
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false)
  const [isClockedOut, setIsClockedOut] = useState<boolean>(false)
  const [attendanceRecordId, setAttendanceRecordId] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [workDuration, setWorkDuration] = useState<string>('')
  const [checkInTimestamp, setCheckInTimestamp] = useState<number | null>(null)

  const { data: selfUserData, isLoading: loadingUser } = useGetSelfUserQuery()
  const userDataAny = selfUserData?.data as any
  const staffId = userDataAny?.id || selfUserData?.data?.[0]?.id || ''

  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const todayDateStr = `${year}-${month}-${day}`

  const {
    data: todayAttendance,
    isLoading: loadingAttendance,
    refetch,
  } = useGetTodayAttendanceQuery({ staffId, date: todayDateStr }, { skip: !staffId })

  const [createAttendance, { isLoading: loadingIn }] = useCreateAttendanceMutation()
  const [updateAttendance, { isLoading: loadingOut }] = useUpdateAttendanceMutation()

  const resetAttendanceState = useCallback(() => {
    setIsClockedIn(false)
    setIsClockedOut(false)
    setAttendanceRecordId('')
    setCheckInTimestamp(null)
    setWorkDuration('')
  }, [])

  // SINKRONISASI DATA DARI SERVER
  useEffect(() => {
    if (!todayAttendance) return

    const latestRecord = getLatestAttendanceRecord(todayAttendance)

    if (latestRecord) {
      const recordId = latestRecord.id || latestRecord.attributes?.id
      const checkInTime = latestRecord.attributes?.checkInTime || latestRecord.checkInTime
      const checkOutTime = latestRecord.attributes?.checkOutTime || latestRecord.checkOutTime
      const recordDate = checkInTime ? checkInTime.split('T')[0] : ''

      if (recordDate !== todayDateStr) {
        resetAttendanceState()
        return
      }

      setAttendanceRecordId(recordId || '')

      if (checkOutTime) {
        setIsClockedIn(false)
        setIsClockedOut(true)

        if (checkInTime) {
          setWorkDuration(calculateDurationText(new Date(checkInTime).getTime(), new Date(checkOutTime).getTime()))
        }
      } else if (checkInTime) {
        setIsClockedIn(true)
        setIsClockedOut(false)
        setCheckInTimestamp(new Date(checkInTime).getTime())
      }
    } else {
      resetAttendanceState()
    }
  }, [todayAttendance, todayDateStr, resetAttendanceState])

  // AUTO REFETCH SAAT BERGANTI HARI
  useEffect(() => {
    const intervalRefetch = setInterval(() => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const currentLocalDateStr = `${year}-${month}-${day}`

      if (currentLocalDateStr !== todayDateStr) {
        refetch()
      }
    }, 60000)

    return () => clearInterval(intervalRefetch)
  }, [todayDateStr, refetch])

  const handleClockIn = async () => {
    try {
      const timestampNow = Date.now()
      const result = await createAttendance({
        attendanceId: `ATT-${timestampNow}`,
        staffId: staffId,
        checkInTime: new Date(timestampNow).toISOString(),
        status: 'Present',
      }).unwrap()

      const responseData = result.data as any
      const createdId = responseData?.id || responseData?.[0]?.id

      setAttendanceRecordId(createdId)
      setCheckInTimestamp(timestampNow)
      setIsClockedIn(true)
      setIsClockedOut(false)
      setMessage('home:clockin-smessage')
      refetch()
    } catch (error: any) {
      setMessage(error?.data?.message || 'home:clockin-emessage')
    }
  }

  const handleClockOut = async () => {
    if (!attendanceRecordId) {
      setMessage('home:validate-message')
      return
    }

    setMessage('')
    try {
      await updateAttendance({
        id: attendanceRecordId,
        attributes: { checkOutTime: new Date().toISOString() },
      }).unwrap()

      if (checkInTimestamp) {
        setWorkDuration(calculateDurationText(checkInTimestamp, Date.now()))
      }

      setIsClockedIn(false)
      setIsClockedOut(true)
      setMessage('home:clockout-smessage')
      refetch()
    } catch (error: any) {
      setMessage(error?.data?.message || 'home:clockout-emessage')
    }
  }

  return {
    isClockedIn,
    isClockedOut,
    message,
    workDuration,
    staffId,
    isLoading: loadingUser || loadingAttendance,
    loadingIn,
    loadingOut,
    handleClockIn,
    handleClockOut,
  }
}
