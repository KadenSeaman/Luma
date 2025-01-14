import './styles/app.scss';

import { AppLayoutProvider, useAppLayout, DEFAULT_VALUES } from './context/appLayoutContext'

import Resizer from './components/resizer';
import Renderer from './components/renderer';
import Editor from './components/editor';
import React, { useState } from 'react';

function App() {
  return (
    <AppLayoutProvider>
      <AppContent />
    </AppLayoutProvider>
  )
}

function AppContent() {
  const { grabbing, setGrabbing, setEditorWidth, setRendererWidth, setResizerWidth, setEditorHeight, setRendererHeight, setResizerHeight} = useAppLayout();
  let [cursorStyle, setCursorStyle] = useState('default');

  const handleResize = () => {
      setEditorWidth(DEFAULT_VALUES.DEFAULT_EDITOR_WIDTH_PERCENTAGE);
      setResizerWidth(DEFAULT_VALUES.DEFAULT_RESIZER_WIDTH_PERCENTAGE);
      setRendererWidth(DEFAULT_VALUES.DEFAULT_RENDERER_WIDTH_PERCENTAGE);
      setEditorHeight(DEFAULT_VALUES.DEFAULT_EDITOR_HEIGHT_PERCENTAGE);
      setRendererHeight(DEFAULT_VALUES.DEFAULT_RENDERER_HEIGHT_PERCENTAGE);
      setResizerHeight(DEFAULT_VALUES.DEFAULT_RESIZER_HEIGHT_PERCENTAGE);
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
      const newEditorWidth = e.clientX / window.innerWidth * 100;
      const newResizerWidth = DEFAULT_VALUES.DEFAULT_RESIZER_WIDTH_PERCENTAGE;
      const newRendererWidth = 100 - newEditorWidth - newResizerWidth;

      setEditorWidth(newEditorWidth);
      setResizerWidth(newResizerWidth);
      setRendererWidth(newRendererWidth)
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
    <div id='app' onResize={handleResize} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} style={appStyle}>
      <Editor  />
      <Resizer />
      <Renderer />
    </div>
  );
}

export default App;