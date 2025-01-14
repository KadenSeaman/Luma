import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext(null);

export function RendererLayoutProvider({ children }) {
  // Initialize all values
  const [state, setState] = useState(() => {
    
    // Try to load from localStorage first
    const saved = localStorage.getItem('rendererLayoutState');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default values
    return {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('rendererLayoutState', JSON.stringify(state));
  }, [state]);

  // Create setter functions for each value
  const setOffsetX = (value) => setState(prev => ({ ...prev, offsetX: value }));
  const setOffsetY = (value) => setState(prev => ({ ...prev, offsetY: value }));
  const setScale = (value) => setState(prev => ({ ...prev, scale: value }));


  return (
    <LayoutContext.Provider value={{
      ...state,
      setOffsetX,
      setOffsetY,
      setScale,
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

// Custom hook to use the layout context
export function useRendererLayout() {
  const context = useContext(LayoutContext);
  if (context === null) {
    throw new Error('useAppLayout must be used within a AppLayoutProvider');
  }
  return context;
}