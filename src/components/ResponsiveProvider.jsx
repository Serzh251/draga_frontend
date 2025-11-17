// components/ResponsiveProvider.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIsMobile } from '@/store/slices/uiSlice';

const ResponsiveProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIsMobile = () => {
      const isCurrentMobile = window.innerWidth < 768;
      dispatch(setIsMobile(isCurrentMobile));
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default ResponsiveProvider;
