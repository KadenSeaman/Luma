import '../styles/viewport.scss';

import { useRendererLayout } from '../context/rendererLayoutContext';
import { useState, useRef } from 'react';

function Viewport() {

    const { setOffsetX, setOffsetY, setScale, offsetX, offsetY, scale } = useRendererLayout();

    let viewport = useRef(null);

    let [prevRelativeMouseX, setPrevRelativeMouseX] = useState(0);
    let [prevRelativeMouseY, setPrevRelativeMouseY] = useState(0);
    let [relativeMouseX, setRelativeMouseX] = useState(0);
    let [relativeMouseY, setRelativeMouseY] = useState(0);
    let [absoluteMouseX, setAbsoluteMouseX] = useState(0);
    let [absoluteMouseY, setAbsoluteMouseY] = useState(0);
    let [cursorStyle, setCursorStyle] = useState('default');

    const ZOOM_MAX = 10;
    const ZOOM_MIN = 1;

    const DEBUG = true;
    const SELECT = true;

    let [startSelectX, setStartSelectX] = useState(0);
    let [startSelectY, setStartSelectY] = useState(0);
    let [selectX, setSelectX] = useState(0);
    let [selectY, setSelectY] = useState(0);
    let [selectWidth, setSelectWidth] = useState(0);
    let [selectHeight, setSelectHeight] = useState(0);

    let [dragging, setDragging] = useState(false);
    let [selecting, setSelecting] = useState(false);

    const zoomOutButton = () => {
        zoomViewport(-1, false);
    }
    const zoomInButton = () => {
        zoomViewport(1, false);
    }
    const resetViewportButton = () => {
        setOffsetX(0);
        setOffsetY(0);
        setScale(1);
    }
    const handleScroll = (e) => {
        e.preventDefault();

        const zoomingIn = e.deltaY < 0;

        zoomViewport(normalizeScroll(-e.deltaY), zoomingIn);
    }
    const handleMouseDown = (e) => {
        e.preventDefault();
        if(e.button === 1){
            // begin viewport drag
            setDragging(true);
            setCursorStyle('grabbing');
        } else if (e.button === 0){
            // begin selecting
            setSelecting(true);
            setStartSelectX(absoluteMouseX);
            setStartSelectY(absoluteMouseY);
        }
    }
    const handleMouseUp = (e) => {
        e.preventDefault();
        if(e.button === 1){
            setDragging(false);
            setCursorStyle('default');
        } else if (e.button === 0){
            setSelecting(false);
            setSelectWidth(0);
            setSelectHeight(0);
            setSelectX(0);
            setSelectY(0);
        }
    }
    const handleMouseOut = (e) => {
        e.preventDefault();
        setDragging(false);
        if(e.clientX < viewport.current.offsetLeft) setSelecting(false);
        setCursorStyle('default');
        setSelectWidth(0);
        setSelectHeight(0);
        setSelectX(0);
        setSelectY(0);
    }
    const handleMouseMove = (e) => {
        // prev relative & relative mouse's origin is at the center of the viewport
        setPrevRelativeMouseX(relativeMouseX);
        setPrevRelativeMouseY(relativeMouseY);

        setRelativeMouseX(e.clientX - viewport.current.getBoundingClientRect().left - viewport.current.clientWidth / 2);
        setRelativeMouseY(e.clientY - viewport.current.getBoundingClientRect().top - viewport.current.clientHeight / 2);

        // absolute mouse's origin is at the top left corner of the viewport
        setAbsoluteMouseX(e.clientX - viewport.current.getBoundingClientRect().left);
        setAbsoluteMouseY(e.clientY - viewport.current.getBoundingClientRect().top);

        
        if(selecting) select();
        if(dragging) dragViewport();
    }

    const normalizeScroll = (deltaY) => {
        return deltaY < 0 ? -1 : 1;
    }

    const zoomViewport = (dir, useMouseOffset) => {
        // prevent zooming from max/min limits
        if(scale + dir < ZOOM_MIN || scale + dir > ZOOM_MAX) return;

        const newScale = scale + dir;

        // set origin of zoom to be the center of the viewport
        const prevX = viewport.current.offsetWidth / scale;
        const newX = viewport.current.offsetWidth / newScale;

        const prevY = viewport.current.offsetHeight / scale;
        const newY = viewport.current.offsetHeight / newScale;

        const mouseOffsetX = useMouseOffset ? relativeMouseX / newScale : 0;
        const mouseOffsetY = useMouseOffset ? relativeMouseY / newScale : 0;

        const newOffsetX = offsetX - ((prevX - newX) / 2 + mouseOffsetX);
        const newOffsetY = offsetY - ((prevY - newY) / 2 + mouseOffsetY);

        setScale(newScale);
        setOffsetX(newOffsetX);
        setOffsetY(newOffsetY);

    }

    const dragViewport = () => {
        const newOffsetX = offsetX + (relativeMouseX - prevRelativeMouseX) / scale;
        const newOffsetY = offsetY + (relativeMouseY - prevRelativeMouseY) / scale;

        setOffsetX(newOffsetX);
        setOffsetY(newOffsetY);
    }

    const select = () => {
        //if user clicks and selects to the left move visual starts
        const newSelectX = absoluteMouseX < startSelectX ? absoluteMouseX : startSelectX;
        const newSelectY = absoluteMouseY < startSelectY ? absoluteMouseY : startSelectY;
        setSelectX(newSelectX);
        setSelectY(newSelectY);

        const newSelectWidth = Math.abs(startSelectX - absoluteMouseX);
        const newSelectHeight = Math.abs(startSelectY - absoluteMouseY);
        setSelectWidth(newSelectWidth);
        setSelectHeight(newSelectHeight);
    }

    const backgroundStyle = {
        backgroundSize: `${scale * 40}px ${scale * 40}px`,
        backgroundPosition: `${offsetX * scale}px ${offsetY * scale}px`,
        backgroundImage: `linear-gradient(to right, lightgrey 1px, transparent 1px),
        linear-gradient(to top, lightgrey 1px, transparent 1px)`,
        cursor: cursorStyle,
    }

    const selectStyle = {
        opacity: `${selecting ? '1' : '0'}`,
        width: `${selectWidth}px`,
        height: `${selectHeight}px`,
        left: `${selectX}px`,
        top: `${selectY}px`,
    }

    return <div ref={viewport} id='viewport' onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseOut={handleMouseOut} onMouseUp={handleMouseUp} onWheel={handleScroll}>
        <div id='grid-background' style={backgroundStyle}></div>

        <div id='viewport-buttons'>
            <button id='zoom-out' onMouseDown={zoomOutButton}>-</button>
            <button id='zoom-in' onMouseDown={zoomInButton}>+</button>
            <button id='reset-viewport' onMouseDown={resetViewportButton}>reset</button>
        </div>
        {DEBUG && <div id='debug'>
            <p>x position: {-offsetX.toFixed()}</p>
            <p>y position: {offsetY.toFixed()}</p>
            <p>scale: {scale}</p>
            <p>mouseX: {relativeMouseX.toFixed()}</p>
            <p>mouseY: {relativeMouseY.toFixed()}</p>
        </div>}
        {SELECT && <div id='select' style={selectStyle}></div>}
    </div>
}

export default Viewport;