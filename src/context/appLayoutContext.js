import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext(null);

const DEFAULT_EDITOR_WIDTH_PERCENTAGE = 0.49;
const DEFAULT_EDITOR_HEIGHT_PERCENTAGE = 1;
const DEFAULT_RESIZER_WIDTH_PERCENTAGE = 0.01;
const DEFAULT_RESIZER_HEIGHT_PERCENTAGE = 1;
const DEFAULT_RENDERER_WIDTH_PERCENTAGE = 0.50;
const DEFAULT_RENDERER_HEIGHT_PERCENTAGE = 1;

export function LayoutProvider({ children }) {
  // Initialize all values
  const [state, setState] = useState(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('layoutState');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default values
    return {
      editorHeight: window.innerHeight * DEFAULT_EDITOR_HEIGHT_PERCENTAGE,
      editorWidth: window.innerWidth * DEFAULT_EDITOR_WIDTH_PERCENTAGE,
      resizerHeight: window.innerHeight * DEFAULT_RESIZER_HEIGHT_PERCENTAGE,
      resizerWidth: window.innerWidth * DEFAULT_RESIZER_WIDTH_PERCENTAGE,
      rendererHeight: window.innerHeight * DEFAULT_RENDERER_HEIGHT_PERCENTAGE,
      rendererWidth: window.innerWidth * DEFAULT_RENDERER_WIDTH_PERCENTAGE,
      grabbing: false
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('layoutState', JSON.stringify(state));
  }, [state]);

  // Create setter functions for each value
  const setEditorHeight = (value) => setState(prev => ({ ...prev, editorHeight: value }));
  const setEditorWidth = (value) => setState(prev => ({ ...prev, editorWidth: value }));
  const setResizerHeight = (value) => setState(prev => ({ ...prev, resizerHeight: value }));
  const setResizerWidth = (value) => setState(prev => ({ ...prev, resizerWidth: value }));
  const setRendererHeight = (value) => setState(prev => ({ ...prev, rendererHeight: value }));
  const setRendererWidth = (value) => setState(prev => ({ ...prev, rendererWidth: value }));
  const setGrabbing = (value) => setState(prev => ({ ...prev, grabbing: value }));

  return (
    <LayoutContext.Provider value={{
      ...state,
      setEditorHeight,
      setEditorWidth,
      setResizerHeight,
      setResizerWidth,
      setRendererHeight,
      setRendererWidth,
      setGrabbing
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

// Custom hook to use the layout context
export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === null) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}