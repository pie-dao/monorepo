import ky from 'ky-universal';
import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

function useStrapiCollection<T>(query: string, options?: any) {
  return useQuery([query], async () => {
    const queryString = qs.stringify(
      {
        ...options,
      },
      {
        encodeValuesOnly: true,
        charset: 'iso-8859-1',
      },
    );

    const requestUrl = `/api/${query}${queryString ? `?${queryString}` : ''}`;
    const response = await ky(requestUrl);
    return response.json<T>();
  });
}

export { useStrapiCollection };
