import { useState, useEffect } from 'react';

const usePageScroll = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener('scroll', updatePosition);

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

export default usePageScroll;