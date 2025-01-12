import './styles/app.scss';

import { LayoutProvider, useLayout } from './context/appLayoutContext'

import Resizer from './components/resizer';
import Renderer from './components/renderer';
import Editor from './components/editor';
import React, { useEffect, useState } from 'react';

function App() {
  return (
    <LayoutProvider>
      <AppContent></AppContent>
    </LayoutProvider>
  )
}

function AppContent() {
  const { grabbing, setGrabbing, setEditorWidth, setRendererWidth, setResizerWidth, editorWidth, setEditorHeight, setRendererHeight, setResizerHeight, rendererWidth, resizerWidth} = useLayout();

  let [cursorStyle, setCursorStyle] = useState('default');

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
  })



  const handleWindowResize = () => { 
    const prevWindowSize = editorWidth + rendererWidth + resizerWidth;

    setEditorWidth(window.innerWidth * (editorWidth / prevWindowSize));
    setResizerWidth(window.innerWidth * (resizerWidth / prevWindowSize));
    setRendererWidth(window.innerWidth * (rendererWidth / prevWindowSize));
    setEditorHeight(window.innerHeight);
    setResizerHeight(window.innerHeight);
    setRendererHeight(window.innerHeight);
  }

  const handleMouseDown = (e) => {
    if(e.target.id === 'resizer'){
      setGrabbing(true);
      setCursorStyle('grabbing')
    } 
  }

  const handleMouseUp = () => {
    setGrabbing(false);
    setCursorStyle('default')
  }

  const handleMouseMove = (e) => {
    if(e.clientX <= 0) setGrabbing(false);

    if(grabbing){
      setEditorWidth(Math.max(0, e.clientX));
      setRendererWidth(window.innerWidth - e.clientX - resizerWidth)
    }
    else{
      if(e.target.id === 'resizer'){
        setCursorStyle('grab');
      } 
      else{
        setCursorStyle('default');
      }
    }
  }


  const appStyle = {
    width: 100 + 'vw',
    height: 100 + 'vh',
    margin: 0 + 'px',
    padding: 0 + 'px',
    display: 'flex',
    flexDirection: 'row',
    gap: 0 + 'px',
    cursor: cursorStyle,
  }

  return (
    <div id='app' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} style={appStyle}>
      <Editor  />
      <Resizer />
      <Renderer />
    </div>
  );
}

export default App;