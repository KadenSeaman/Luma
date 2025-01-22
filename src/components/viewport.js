import '../styles/viewport.scss';
import { RendererContext } from '../context/rendererContext';
import { useState, useRef, useContext } from 'react';

function Viewport() {

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 10;
    const RENDER_DEBUG_MENU = true;
    const RENDER_SELECT_BOX = true;

    const { offsetX, offsetY, scale, updateOffsetX, updateOffsetY, updateScale } = useContext(RendererContext);

    const viewport = useRef(null);

    const absoluteXRef = useRef(0);
    const absoluteYRef = useRef(0);

    const prevRelativeXRef = useRef(0);
    const prevRelativeYRef = useRef(0);

    const relativeXRef = useRef(0);
    const relativeYRef = useRef(0);

    const startSelectXRef = useRef(0);
    const startSelectYRef = useRef(0);

    const [selectX, setSelectX] = useState(0);
    const [selectY, setSelectY] = useState(0);

    const [selectWidth, setSelectWidth] = useState(0);
    const [selectHeight, setSelectHeight] = useState(0);

    const [dragging, setDragging] = useState(false);
    const [selecting, setSelecting] = useState(false);

    let cursorType = useRef('default');

    const zoomOutButton = () => zoom(-1, false);
    const zoomInButton = () => zoom(1, false);
    const resetViewportButton = () => resetViewport();

    const resetViewport = () => {
        updateScale(1);
        updateOffsetX(0);
        updateOffsetY(0);
    }

    const updateMousePositions = (e) => {
        const rect = viewport.current.getBoundingClientRect();

        absoluteXRef.current = e.clientX - rect.left;
        absoluteYRef.current = e.clientY - rect.top;

        prevRelativeXRef.current = relativeXRef.current;
        prevRelativeYRef.current = relativeYRef.current;

        relativeXRef.current = absoluteXRef.current - viewport.current.clientWidth / 2;
        relativeYRef.current = absoluteYRef.current - viewport.current.clientHeight / 2;
    }

    const startDrag = () => {
        setDragging(true);
        cursorType.current = 'grabbing';
    }

    const drag = () => {
        const dragDisX = relativeXRef.current - prevRelativeXRef.current;
        const dragDisY = relativeYRef.current - prevRelativeYRef.current;

        updateOffsetX(offsetX + dragDisX);
        updateOffsetY(offsetY + dragDisY);
    }

    const endDrag = () =>{
        setDragging(false);
        cursorType.current = 'default';
    }

    const startSelect = () => {
        setSelecting(true);
        startSelectXRef.current = absoluteXRef.current;
        startSelectYRef.current = absoluteYRef.current;
    }

    const select = () => {
        //if user clicks and selects to the left move visual starts
        const newSelectX = absoluteXRef.current < startSelectXRef.current ? absoluteXRef.current : startSelectXRef.current;
        const newSelectY = absoluteYRef.current < startSelectYRef.current ? absoluteYRef.current : startSelectYRef.current;
        
        setSelectX(newSelectX);
        setSelectY(newSelectY);

        const newSelectWidth = Math.abs(startSelectXRef.current - absoluteXRef.current);
        const newSelectHeight = Math.abs(startSelectYRef.current - absoluteYRef.current);

        setSelectWidth(newSelectWidth);
        setSelectHeight(newSelectHeight);
    }

    const endSelect = () => {
        setSelecting(false);
        setSelectX(0);
        setSelectY(0);
        setSelectHeight(0);
        setSelectWidth(0);
    }

    const normalizeZoom = (deltaY) => deltaY < 0 ? -1 : 1;

    const zoom = (dir, useMouseOffset) => {
        // calculate newScale
        const newScale = scale + dir;

        // prevent zoom past extremes
        if(newScale < ZOOM_MIN || newScale > ZOOM_MAX) return;

        // calculate effective gap between scales
        const oldEffectiveWindowWidth = viewport.current.offsetWidth / scale;
        const newEffectiveWindowWidth = viewport.current.offsetWidth / newScale;
        const offsetBetweenWindowWidths = oldEffectiveWindowWidth - newEffectiveWindowWidth;

        const oldEffectiveWindowHeight = viewport.current.offsetHeight / scale;
        const newEffectiveWindowHeight = viewport.current.offsetHeight / newScale;
        const offsetBetweenWindowHeights = oldEffectiveWindowHeight - newEffectiveWindowHeight;

        // caclulate mouseoffset

        const mouseOffsetX = useMouseOffset ? relativeXRef.current / newScale : 0;
        const mouseOffsetY = useMouseOffset ? relativeYRef.current / newScale : 0;

        // calculate final new offsets
        const newOffsetX = offsetX - offsetBetweenWindowWidths / 2 - mouseOffsetX;
        const newOffsetY = offsetY - offsetBetweenWindowHeights / 2 - mouseOffsetY;

        updateOffsetX(newOffsetX);
        updateOffsetY(newOffsetY);
        updateScale(newScale);
    }

    const handleMouseMove = (e) => {
        updateMousePositions(e);
        if(dragging) drag();
        if(selecting) select();
    }

    const handleMouseDown = (e) => {
        e.preventDefault();
        if(e.button === 1) startDrag();
        if(e.button === 0) startSelect();
    }

    const handleMouseUp = (e) => {
        e.preventDefault();
        if(e.button === 1) endDrag();
        if(e.button === 0) endSelect();
    }

    const handleWheel = (e) => {
        e.preventDefault();

        const dir = normalizeZoom(-e.deltaY);
        // only scroll towards mouse on zoom in
        const useMouseOffset = e.deltaY < 0;

        zoom(dir, useMouseOffset);
    }

    const backgroundStyle = {
        backgroundSize: `${scale * 40}px ${scale * 40}px`,
        backgroundPosition: `${offsetX * scale}px ${offsetY * scale}px`,
        backgroundImage: `linear-gradient(to right, lightgrey 1px, transparent 1px),
        linear-gradient(to top, lightgrey 1px, transparent 1px)`,
        cursor: cursorType.current,
    }

    const selectStyle = {
        width: `${selectWidth}px`,
        height: `${selectHeight}px`,
        left: `${selectX}px`,
        top: `${selectY}px`,
    }

    return <div ref={viewport} id='viewport' onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onWheel={handleWheel}>
        <div id='grid-background' style={backgroundStyle}></div>

        <div id='viewport-buttons'>
            <button id='zoom-out' onMouseDown={zoomOutButton}>-</button>
            <button id='zoom-in' onMouseDown={zoomInButton}>+</button>
            <button id='reset-viewport' onMouseDown={resetViewportButton}>reset</button>
        </div>
        {RENDER_DEBUG_MENU && <div id='debug'>
            <p>x position: {-offsetX.toFixed()}</p>
            <p>y position: {offsetY.toFixed()}</p>
            <p>scale: {scale}</p>
            <p>mouseX: {relativeXRef.current.toFixed()}</p>
            <p>mouseY: {relativeYRef.current.toFixed()}</p>
        </div>}
        {RENDER_SELECT_BOX && selecting && <div id='select' style={selectStyle}></div>}
    </div>
}

export default Viewport;