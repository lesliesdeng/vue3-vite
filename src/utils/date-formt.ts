import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'

dayjs.extend(utc)

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function utcToDateTimeFormat(utcDate: string, format: string = DATE_TIME_FORMAT) {
  return dayjs.utc(utcDate).utcOffset(8).format(format)
}

// 时长格式化
dayjs.extend(duration)

const DURATION_FORMAT = 'HH:mm:ss'

interface durationObj {
  seconds: number
  minutes: number
  hours?: number
}

export function durationTimeFormat(duration: durationObj, format: string = DURATION_FORMAT) {
  return dayjs.duration(duration).format(format)
}
