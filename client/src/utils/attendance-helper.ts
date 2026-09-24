export const getLatestAttendanceRecord = (todayAttendance: any) => {
  const records = todayAttendance?.data || []
  const recordList = Array.isArray(records) ? records : [records]

  if (recordList.length === 0 || recordList[0] === null) return null

  const sortedRecords = [...recordList].sort((a, b) => {
    const timeA = new Date(a.attributes?.checkInTime || a.checkInTime || 0).getTime()
    const timeB = new Date(b.attributes?.checkInTime || b.checkInTime || 0).getTime()
    return timeB - timeA
  })

  return sortedRecords[0]
}
