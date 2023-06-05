import { AVG_SECONDS_IN_MONTH } from './constants';

export function addMonths(numOfMonths: number, date = new Date()) {
  const dateCopy = new Date(date.getTime());
  dateCopy.setMonth(dateCopy.getMonth() + numOfMonths);
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
  return Math.ceil(date / AVG_SECONDS_IN_MONTH);
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

// get remaining time in months, start is expressed in timestamp, duration is expressed in seconds

export function getRemainingTimeInMonths(start: number, duration: number) {
  const now = new Date().getTime() / 1000;
  const end = start + duration;
  const remainingTime = end - now;
  return Math.ceil(remainingTime / AVG_SECONDS_IN_MONTH);
}

export function getMonthsSinceStake(lockedAt: number) {
  const now = new Date().getTime() / 1000;
  const remainingTime = now - lockedAt;
  return Math.ceil(remainingTime / AVG_SECONDS_IN_MONTH);
}
