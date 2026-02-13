// contexts/ValveContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ValveContext = createContext();

export function ValveProvider({ children }) {
  const [valveMode, setValveMode] = useState({
    all: 'auto', bokchoy: 'auto', pechay: 'auto', mustasa: 'auto'
  });

  // Global localStorage sync
  useEffect(() => {
    const saved = localStorage.getItem('valveStates');
    if (saved) setValveMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('valveStates', JSON.stringify(valveMode));
  }, [valveMode]);

  return (
    <ValveContext.Provider value={{ valveMode, setValveMode }}>
      {children}
    </ValveContext.Provider>
  );
}

export const useValve = () => useContext(ValveContext);
