import '../styles/app.scss';

import { AppProvider } from '../context/appContext';
import { RendererProvider } from '../context/rendererContext';
import { AppContext } from '../context/appContext'

import Resizer from '../components/resizer';
import Renderer from '../components/renderer';
import Editor from '../components/editor';
import NavBar from '../components/navBar';
import React, { useContext, useEffect, useState } from 'react';
import TopRibbon from '../components/topRibbon';
import BottomRibbon from '../components/bottomRibbon';

import { useParams } from 'react-router-dom';

function LumaApp() {
  return (
    <>
        <AppProvider>
          <AppContent />
        </AppProvider>
    </>
  )
}

function AppContent() {
  const { id } = useParams();

  useEffect(() => {
    const fetchDocument = async () => {
      const response = await fetch(`/api/documents/${id}`);
      if(response.ok){
        const data = await response.json();
        console.log(data);
      }
    }

    fetchDocument();
  },[id])

  const DEFAULT_VALUES = {
    DEFAULT_EDITOR_WIDTH_PERCENTAGE: 49,
    DEFAULT_EDITOR_HEIGHT_PERCENTAGE: 100,
    DEFAULT_RESIZER_WIDTH_PERCENTAGE: 1,
    DEFAULT_RESIZER_HEIGHT_PERCENTAGE: 100,
    DEFAULT_RENDERER_WIDTH_PERCENTAGE: 50,
    DEFAULT_RENDERER_HEIGHT_PERCENTAGE: 100,
  }

  const { grabbing, setGrabbing, setEditorWidth, setRendererWidth, setResizerWidth, setEditorHeight, setRendererHeight, setResizerHeight} = useContext(AppContext);
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
    height: 100 + 'vh',
    width: 100 + 'vw',
    margin: 0 + 'px',
    padding: 0 + 'px',
    display: 'flex',
    gap: 0 + 'px',
    cursor: cursorStyle,
  }

  return (
    <div id='app' onResize={handleResize} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} style={appStyle}>
      <RendererProvider>
        <NavBar logo={true} title={true} logoLink='/Home'></NavBar>
        <TopRibbon></TopRibbon>
        <div id='functional-app'>

            <Editor  />
            <Resizer />
            <Renderer />

        </div>
        <BottomRibbon></BottomRibbon>
      </RendererProvider>
    </div>
  );
}

export default LumaApp;