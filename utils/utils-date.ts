import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DateISO } from 'src/types/global.types';
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export const dateFormat = 'DD-MM-YYYY';

export const formatFromNow = (date: DateISO) => dayjs(date).fromNow();

export const formatDate = (date: DateISO, format = dateFormat) => dayjs(date).format(format);

export const isSameTime = (date1: DateISO, date2: DateISO) => dayjs(date1).isSame(dayjs(date2));

export const isBetweenDate = (date: DateISO, fromDate: DateISO, toDate: DateISO) =>
  dayjs(date).isBetween(fromDate, toDate);

export const sorterByDate =
  <T extends Record<string, any>>(sorterKey: keyof T) =>
  (a: T, b: T) =>
    dayjs(b[sorterKey]).valueOf() - dayjs(a[sorterKey]).valueOf();
