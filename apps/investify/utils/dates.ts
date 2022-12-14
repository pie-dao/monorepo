import { AVG_SECONDS_IN_MONTH } from './constants';

export function addMonths(numOfMonths: number, date = new Date()) {
  const dateCopy = new Date(date.getTime());
  const addMonthsInSecs = numOfMonths * AVG_SECONDS_IN_MONTH;
  dateCopy.setSeconds(dateCopy.getSeconds() + addMonthsInSecs);
  return dateCopy;
}
