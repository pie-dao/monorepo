import { act, renderHook } from '@testing-library/react-hooks';
import moment from 'moment';
import useCountdown from '../useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern'); // use Jest's modern timer mock functions
    jest.setSystemTime(Date.now()); // start from "now"
  });

  afterEach(() => {
    jest.useRealTimers(); // go back to real timers after each test
  });

  it('should return correct countdown for a future date', () => {
    const futureDate = moment().add(3, 'hours').add(30, 'minutes').toDate();

    const { result } = renderHook(() => useCountdown(futureDate));

    expect(result.current).toEqual('0M 0D 3H 30M');

    act(() => {
      jest.advanceTimersByTime(90 * 60 * 1000); // advance timers by 90 minutes
    });

    expect(result.current).toEqual('0M 0D 2H 0M');
  });

  it('should return "Date has passed" for a past date', () => {
    const pastDate = moment().subtract(1, 'day').toDate();
    const { result } = renderHook(() => useCountdown(pastDate));

    expect(result.current).toEqual('Activating...');
  });
});
