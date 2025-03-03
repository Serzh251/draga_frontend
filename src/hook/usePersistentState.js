import { useState, useEffect } from 'react';

const usePersistentState = (key, defaultValue) => {
  const loadState = () => {
    const savedState = localStorage.getItem(key);
    return savedState ? JSON.parse(savedState) : defaultValue;
  };

  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
};

export default usePersistentState;
