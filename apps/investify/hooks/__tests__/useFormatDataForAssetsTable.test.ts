import { renderHook } from '@testing-library/react-hooks';
import { useFormatDataForAssetsTable } from '../useFormatDataForAssetsTable';

describe('useFormattedBalance', () => {
  it('should be possible to render default to zero with no data', async () => {
    const { result } = renderHook(() =>
      useFormatDataForAssetsTable(undefined, undefined, undefined, undefined),
    );
    console.log(result.current);
  });
});
