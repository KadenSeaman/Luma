import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext(null);

export const DEFAULT_VALUES = {
  DEFAULT_EDITOR_WIDTH_PERCENTAGE: 49,
  DEFAULT_EDITOR_HEIGHT_PERCENTAGE: 100,
  DEFAULT_RESIZER_WIDTH_PERCENTAGE: 1,
  DEFAULT_RESIZER_HEIGHT_PERCENTAGE: 100,
  DEFAULT_RENDERER_WIDTH_PERCENTAGE: 50,
  DEFAULT_RENDERER_HEIGHT_PERCENTAGE: 100,
}

export function AppLayoutProvider({ children }) {
  // Initialize all values
  const [state, setState] = useState(() => {
    
    // Try to load from localStorage first
    const saved = localStorage.getItem('appLayoutState');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default values
    return {
      editorHeight: DEFAULT_VALUES.DEFAULT_EDITOR_HEIGHT_PERCENTAGE,
      editorWidth: DEFAULT_VALUES.DEFAULT_EDITOR_WIDTH_PERCENTAGE,
      resizerHeight: DEFAULT_VALUES.DEFAULT_RESIZER_HEIGHT_PERCENTAGE,
      resizerWidth: DEFAULT_VALUES.DEFAULT_RESIZER_WIDTH_PERCENTAGE,
      rendererHeight: DEFAULT_VALUES.DEFAULT_RENDERER_HEIGHT_PERCENTAGE,
      rendererWidth: DEFAULT_VALUES.DEFAULT_RENDERER_WIDTH_PERCENTAGE,
      grabbing: false,
      rootNode: null,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('appLayoutState', JSON.stringify(state));
  }, [state]);

  // Create setter functions for each value
  const setEditorHeight = (value) => setState(prev => ({ ...prev, editorHeight: value }));
  const setEditorWidth = (value) => setState(prev => ({ ...prev, editorWidth: value }));
  const setResizerHeight = (value) => setState(prev => ({ ...prev, resizerHeight: value }));
  const setResizerWidth = (value) => setState(prev => ({ ...prev, resizerWidth: value }));
  const setRendererHeight = (value) => setState(prev => ({ ...prev, rendererHeight: value }));
  const setRendererWidth = (value) => setState(prev => ({ ...prev, rendererWidth: value }));
  const setGrabbing = (value) => setState(prev => ({ ...prev, grabbing: value }));
  const setRootNode = (value) => setState(prev => ({ ...prev, rootNode: value }));

  return (
    <LayoutContext.Provider value={{
      ...state,
      setEditorHeight,
      setEditorWidth,
      setResizerHeight,
      setResizerWidth,
      setRendererHeight,
      setRendererWidth,
      setGrabbing,
      setRootNode: setRootNode,
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

// Custom hook to use the layout context
export function useAppLayout() {
  const context = useContext(LayoutContext);
  if (context === null) {
    throw new Error('useAppLayout must be used within a AppLayoutProvider');
  }
  return context;
}