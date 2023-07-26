import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

interface QueryMap {
  [key: string]: number;
}

export function useSelectedIndexFromQuery(
  queryKey: string,
  map: QueryMap,
): [number, Dispatch<SetStateAction<number>>] {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const getTabIndex = (tabName: string | string[]) => {
      if (tabName) {
        const formattedTabName = Array.isArray(tabName)
          ? tabName[0].toLowerCase().replace(' ', '_')
          : tabName.toLowerCase().replace(' ', '_');

        return map[formattedTabName];
      }
    };

    const selectedFromQuery = getTabIndex(router.query[queryKey]);

    if (selectedFromQuery !== undefined) {
      setSelectedIndex(selectedFromQuery);
    }
  }, [router.query, queryKey, map]); // Note: map added as a dependency

  return [selectedIndex, setSelectedIndex];
}
