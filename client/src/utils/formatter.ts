import { DateTime } from 'luxon'

export const tailingSlash = (url: string) => url.replace(/\/$/, '')
export const formatEpoch = (seconds: number, format: string) => DateTime.fromSeconds(seconds).toFormat(format)

export const calculateDurationText = (start: number, end: number): string => {
  const diffMs = end - start
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)
  return `${diffHours} jam ${diffMinutes} menit ${diffSeconds} detik`
}
