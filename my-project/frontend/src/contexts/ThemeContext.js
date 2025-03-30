import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always use dark mode
  const [mounted, setMounted] = useState(false);

  // Run this effect only on client-side after first render
  useEffect(() => {
    setMounted(true);
    
    // Apply dark theme as soon as component mounts
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Provide the context value (without toggle function)
  return (
    <ThemeContext.Provider value={{ darkMode: true, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);