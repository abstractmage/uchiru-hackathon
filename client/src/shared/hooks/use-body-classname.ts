import { useEffect } from 'react';
import { getBodyClassName } from '../helpers/get-body-classname';

export const useBodyClassName = () => {
  useEffect(() => {
    const hangBodyClassName = () => {
      const classNames = getBodyClassName();
      document.body.className = classNames;
    };

    const handleResize = () => hangBodyClassName();

    hangBodyClassName();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
};
