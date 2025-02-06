import { createContext, useRef, useState } from 'react';

export const RendererContext = createContext();

export const RendererProvider = ({ children }) => {
  const [renderTrigger, setRenderTrigger] = useState(0); // eslint-disable-line no-unused-vars
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);
  const scaleRef = useRef(1);
  const viewportOffsetWidthRef = useRef(0);
  const viewportOffsetHeightRef = useRef(0);

  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 10;

  const updateOffsetX = newOffsetX => {
    offsetXRef.current = newOffsetX;
    setRenderTrigger(prev => prev + 1);
  }
  const updateOffsetY = newOffsetY => {
    offsetYRef.current = newOffsetY;
    setRenderTrigger(prev => prev + 1);
  }
  const updateScale = newScale => {
    if(newScale <= ZOOM_MIN || newScale >= ZOOM_MAX){

    }
    else{
      scaleRef.current = newScale;
      setRenderTrigger(prev => prev + 1);
    };
  }
  const updateViewportOffsetWidth = newViewportOffsetWidth => {
    viewportOffsetWidthRef.current = newViewportOffsetWidth;
  }
  const updateViewportOffsetHeight = newViewportOffsetHeight => {
    viewportOffsetHeightRef.current = newViewportOffsetHeight;
  }

  return (
    <RendererContext.Provider value = {{
      offsetX: offsetXRef.current,
      offsetY: offsetYRef.current,
      scale: scaleRef.current,
      viewportOffsetHeight: viewportOffsetHeightRef.current,
      viewportOffsetWidth: viewportOffsetWidthRef.current,
      updateOffsetX,
      updateOffsetY,
      updateScale,
      updateViewportOffsetHeight,
      updateViewportOffsetWidth,
      ZOOM_MAX,
      ZOOM_MIN
    }}>{children}</RendererContext.Provider>
  )
}