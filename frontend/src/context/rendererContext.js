import { createContext, useRef, useState } from 'react';

export const RendererContext = createContext();

export const RendererProvider = ({ children }) => {
  const [renderTrigger, setRenderTrigger] = useState(0); // eslint-disable-line no-unused-vars
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);
  const scaleRef = useRef(1);

  const updateOffsetX = newOffsetX => {
    offsetXRef.current = newOffsetX;
    setRenderTrigger(prev => prev + 1);
  }
  const updateOffsetY = newOffsetY => {
    offsetYRef.current = newOffsetY;
    setRenderTrigger(prev => prev + 1);
  }
  const updateScale = newScale => {
    scaleRef.current = newScale;
    setRenderTrigger(prev => prev + 1);
  }

  return (
    <RendererContext.Provider value = {{
      offsetX: offsetXRef.current,
      offsetY: offsetYRef.current,
      scale: scaleRef.current,
      updateOffsetX,
      updateOffsetY,
      updateScale,
    }}>{children}</RendererContext.Provider>
  )
}