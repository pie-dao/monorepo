import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useSelectedIndexFromQuery(
  queryKey: string,
  map: Record<string, number>,
): [number, (index: number) => void] {
  const router = useRouter();
  const [selectedIndex, setIndex] = useState(0);

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
      setIndex(selectedFromQuery);
    }
  }, [router.query, queryKey, map]);

  const setSelectedIndex = (index: number) => {
    setIndex(index);
    const tabName = Object.keys(map).find((key) => map[key] === index);

    const newQuery = { ...router.query, [queryKey]: tabName };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  return [selectedIndex, setSelectedIndex];
}
