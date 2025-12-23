import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children || null;
};

export default ScrollToTop;
