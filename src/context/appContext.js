import React, { createContext, useState, useRef } from 'react';

export const AppContext = createContext(null);

export const DEFAULT_VALUES = {
  DEFAULT_EDITOR_WIDTH_PERCENTAGE: 49,
  DEFAULT_EDITOR_HEIGHT_PERCENTAGE: 100,
  DEFAULT_RESIZER_WIDTH_PERCENTAGE: 1,
  DEFAULT_RESIZER_HEIGHT_PERCENTAGE: 100,
  DEFAULT_RENDERER_WIDTH_PERCENTAGE: 50,
  DEFAULT_RENDERER_HEIGHT_PERCENTAGE: 100,
}

export function AppProvider({ children }) {
  const [renderTrigger, setRenderTrigger] = useState(0); // eslint-disable-line no-unused-vars
  const editorHeightRef = useRef(DEFAULT_VALUES.DEFAULT_EDITOR_HEIGHT_PERCENTAGE);
  const editorWidthRef = useRef(DEFAULT_VALUES.DEFAULT_EDITOR_WIDTH_PERCENTAGE);
  const resizerHeightRef = useRef(DEFAULT_VALUES.DEFAULT_RESIZER_HEIGHT_PERCENTAGE);
  const resizerWidthRef = useRef(DEFAULT_VALUES.DEFAULT_RESIZER_WIDTH_PERCENTAGE);
  const rendererHeightRef = useRef(DEFAULT_VALUES.DEFAULT_RENDERER_HEIGHT_PERCENTAGE);
  const rendererWidthRef = useRef(DEFAULT_VALUES.DEFAULT_RENDERER_WIDTH_PERCENTAGE);
  const grabbingRef = useRef(false);
  const rootNodeRef = useRef(null);

  const setEditorHeight = newHeight => {
    editorHeightRef.current = newHeight;
    setRenderTrigger(prev => prev + 1);
  }
  const setEditorWidth = newWidth => {
    editorWidthRef.current = newWidth;
    setRenderTrigger(prev => prev + 1);
  }

  const setResizerHeight = newHeight => {
    resizerHeightRef.current = newHeight;
    setRenderTrigger(prev => prev + 1);
  }
  const setResizerWidth = newWidth => {
    resizerWidthRef.current = newWidth;
    setRenderTrigger(prev => prev + 1);
  }

  const setRendererHeight = newHeight => {
    rendererHeightRef.current = newHeight;
    setRenderTrigger(prev => prev + 1);
  }
  const setRendererWidth = newWidth => {
    rendererWidthRef.current = newWidth;
    setRenderTrigger(prev => prev + 1);
  }

  const setGrabbing = newGrabbing => {
    grabbingRef.current = newGrabbing;
    setRenderTrigger(prev => prev + 1);
  }

  const setRootNode = newRootNode => {
    rootNodeRef.current = newRootNode;
    setRenderTrigger(prev => prev + 1);
  }



  return (
    <AppContext.Provider value={{
      editorHeight: editorHeightRef.current,
      editorWidth: editorWidthRef.current,
      resizerHeight: resizerHeightRef.current,
      resizerWidth: resizerWidthRef.current,
      rendererHeight: rendererHeightRef.current,
      rendererWidth: rendererWidthRef.current,
      grabbing: grabbingRef.current,
      rootNode: rootNodeRef.current,
      setEditorHeight,
      setEditorWidth,
      setResizerHeight,
      setResizerWidth,
      setRendererHeight,
      setRendererWidth,
      setGrabbing,
      setRootNode
    }}>
      {children}
    </AppContext.Provider>
  );
}