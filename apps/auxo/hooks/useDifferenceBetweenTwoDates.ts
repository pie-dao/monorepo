import { useMemo } from 'react';

const useTodayPercentageBetweenTwoDates = (
  startDate: number,
  endDate: number,
) => {
  return useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    let percentage =
      ((today.getTime() - start.getTime()) /
        (end.getTime() - start.getTime())) *
      100;
    percentage = Math.min(percentage, 100);

    return percentage;
  }, [startDate, endDate]);
};

const useHasFinishedBetweenTwoDates = (endDate: number): boolean => {
  const percentage = useTodayPercentageBetweenTwoDates(Date.now(), endDate);
  return percentage >= 100;
};

export { useTodayPercentageBetweenTwoDates, useHasFinishedBetweenTwoDates };
