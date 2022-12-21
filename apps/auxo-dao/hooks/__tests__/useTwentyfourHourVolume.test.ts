import { renderHook } from '@testing-library/react-hooks';
import { useTwentyfourHourVolume } from '../useTwentyfourHourVolume';

describe('useTwentyfourHourVolume', () => {
  it('should be possible to render nothing with no data', async () => {
    const { result } = renderHook(() => useTwentyfourHourVolume(undefined));
    expect(result.current).toBe(null);
  });
  it('should be possible to render a positive return', async () => {
    const { result } = renderHook(() => useTwentyfourHourVolume(200));
    expect(result.current).toBe('+200%');
  });
  it('should be possible to render a negative return', async () => {
    const { result } = renderHook(() => useTwentyfourHourVolume(-123));
    expect(result.current).toBe('-123%');
  });
});
