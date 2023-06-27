import { renderHook } from '@testing-library/react-hooks';
import { useTodayPercentageBetweenTwoDates } from '../useDifferenceBetweenTwoDates';

describe('useTodayPercentageBetweenTwoDates', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.now());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return 0% when startDate or endDate is not provided', () => {
    const { result } = renderHook(() =>
      useTodayPercentageBetweenTwoDates(null, null),
    );

    expect(result.current).toBe(0);
  });

  test('should calculate the correct percentage when startDate and endDate are provided', () => {
    const startDate = new Date('2023-06-01').getTime(); // June 1, 2023
    const endDate = new Date('2023-06-10').getTime(); // June 10, 2023

    jest.setSystemTime(new Date('2023-06-05').getTime()); // June 5, 2023
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    const { result } = renderHook(() =>
      useTodayPercentageBetweenTwoDates(startDate, endDate),
    );

    expect(result.current).toBe(44.44444444444444);
  });

  test('should limit the percentage to a maximum of 100%', () => {
    const startDate = new Date('2023-06-01').getTime(); // June 1, 2023
    const endDate = new Date('2023-06-10').getTime(); // June 10, 2023

    jest.setSystemTime(new Date('2023-06-12').getTime()); // June 12, 2023

    const { result } = renderHook(() =>
      useTodayPercentageBetweenTwoDates(startDate, endDate),
    );

    expect(result.current).toBe(100);
  });
});
