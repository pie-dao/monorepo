import { renderHook } from '@testing-library/react-hooks';
import { useFormattedBalance } from '../useFormattedBalance';

describe('useFormattedBalance', () => {
  it('should be possible to render default to zero with no data', async () => {
    const { result } = renderHook(() =>
      useFormattedBalance(undefined, undefined, undefined),
    );
    expect(result.current).toBe('$0.00');
  });
  it('should be possible to render an amount of USD Money', async () => {
    const { result } = renderHook(() =>
      useFormattedBalance(200, 'en-US', 'USD'),
    );
    expect(result.current).toBe('$200.00');
  });
  it('should be possible to render an amount of EUR Money', async () => {
    const { result } = renderHook(() =>
      useFormattedBalance(200.3, 'en-US', 'EUR'),
    );
    expect(result.current).toBe('€200.30');
  });
});
