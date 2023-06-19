import { useRouter } from 'next/router';
import { useEffect } from 'react';

const formatPage = (path) => {
  const formattedPage = path.startsWith('/') ? path.slice(1) : path;
  return formattedPage.replace(/\//g, '-') || 'home';
};

export const useBodyClass = () => {
  const router = useRouter();
  useEffect(() => {
    const className = `page-${formatPage(router.pathname)}`;
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, [router.pathname]);
};
