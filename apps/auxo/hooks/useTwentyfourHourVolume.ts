import { useMemo } from 'react';

export function useTwentyfourHourVolume(volume: number): string | null {
  const formattedVolume = useMemo(() => {
    if (volume > 0) {
      return `+${volume}%`;
    } else if (volume < 0) {
      return `${volume}%`;
    }
    return null;
  }, [volume]);
  return formattedVolume;
}
