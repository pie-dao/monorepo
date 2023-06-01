import { AVG_SECONDS_IN_MONTH } from '../constants';
import {
  addMonths,
  formatDate,
  fromLockedAtToMonths,
  getRemainingMonths,
  getRemainingTimeInMonths,
  getMonthsSinceStake,
} from '../dates';

describe('addMonths', () => {
  test('adds the specified number of months to the given date', () => {
    const date = new Date(2022, 0, 1); // January 1, 2022
    const numOfMonths = 3;
    const result = addMonths(numOfMonths, date);
    expect(result.getMonth()).toBe(3); // April
    expect(result.getFullYear()).toBe(2022);
    expect(result.getDate()).toBe(1);
  });
});

describe('formatDate', () => {
  test('formats the date string in the specified locale', () => {
    const date = '2022-01-01';
    const locale = 'en-US';
    const result = formatDate(date, locale);
    expect(result).toBe('Jan 1, 2022');
  });
});

describe('fromLockedAtToMonths', () => {
  test('converts a duration in seconds to months', () => {
    const duration = 6 * 30 * 24 * 60 * 60; // 6 months in seconds
    const result = fromLockedAtToMonths(duration);
    expect(result).toBe(6); // 6 months
  });
});

describe('getRemainingMonths', () => {
  test('returns the number of remaining months between two dates', () => {
    const startDate = new Date(2022, 0, 1); // January 1, 2022
    const endDate = new Date(2022, 5, 1); // June 1, 2022
    const result = getRemainingMonths(startDate, endDate);
    expect(result).toBe(5); // 5 months remaining
  });
});

describe('getMonthsSinceStake', () => {
  test('returns the number of months since the lockedAt date', () => {
    const lockedAt = new Date(2022, 0, 1).getTime() / 1000; // January 1, 2022
    const result = getMonthsSinceStake(lockedAt);
    expect(result).toBeGreaterThanOrEqual(0); // Months since stake can be 0 or greater
  });
});
