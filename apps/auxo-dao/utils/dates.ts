import { AVG_SECONDS_IN_MONTH } from './constants';

export function addMonths(numOfMonths: number, date = new Date()) {
  const dateCopy = new Date(date.getTime());
  const addMonthsInSecs = numOfMonths * AVG_SECONDS_IN_MONTH;
  dateCopy.setSeconds(dateCopy.getSeconds() + addMonthsInSecs);
  return dateCopy;
}

export function formatDate(
  date: string | number | Date,
  defaultLocale = 'en-US',
) {
  return new Date(date).toLocaleDateString(defaultLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function fromLockedAtToMonths(date: number) {
  return date / AVG_SECONDS_IN_MONTH;
}

export function getRemainingMonths(
  startDate: string | number | Date,
  endDate: string | number | Date,
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12;
  return months - start.getMonth() + end.getMonth();
}
