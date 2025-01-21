import '../styles/viewport.scss';
import { RendererContext } from '../context/rendererContext';
import { useState, useRef, useContext } from 'react';

function Viewport() {

    const DEBUG = true;
    const { offsetX, offsetY, scale, updateOffsetX, updateOffsetY, updateScale } = useContext(RendererContext);

    let viewport = useRef(null);

    let absoluteXRef = useRef(0);
    let absoluteYRef = useRef(0);

    let prevRelativeXRef = useRef(0);
    let prevRelativeYRef = useRef(0);

    let relativeXRef = useRef(0);
    let relativeYRef = useRef(0);

    let [dragging,setDragging] = useState(false);

    let cursorType = useRef('default');

    const updateMousePositions = (e) => {
        absoluteXRef.current = e.clientX - viewport.current.getBoundingClientRect().left;
        absoluteYRef.current = e.clientY - viewport.current.getBoundingClientRect().top;

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

    const handleMouseMove = (e) => {
        updateMousePositions(e);
        if(dragging) drag();
    }

    const handleMouseDown = (e) => {
        e.preventDefault();
        if(e.button === 1) startDrag();
    }

    const handleMouseUp = (e) => {
        e.preventDefault();
        if(e.button === 1) endDrag();
    }

    const backgroundStyle = {
        backgroundSize: `${scale * 40}px ${scale * 40}px`,
        backgroundPosition: `${offsetX * scale}px ${offsetY * scale}px`,
        backgroundImage: `linear-gradient(to right, lightgrey 1px, transparent 1px),
        linear-gradient(to top, lightgrey 1px, transparent 1px)`,
        cursor: cursorType.current,
    }

    // const selectStyle = {
    //     opacity: `${selecting ? '1' : '0'}`,
    //     width: `${selectWidth}px`,
    //     height: `${selectHeight}px`,
    //     left: `${selectX}px`,
    //     top: `${selectY}px`,
    // }

    return <div ref={viewport} id='viewport' onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div id='grid-background' style={backgroundStyle}></div>

        {/* <div id='viewport-buttons'>
            <button id='zoom-out' onMouseDown={zoomOutButton}>-</button>
            <button id='zoom-in' onMouseDown={zoomInButton}>+</button>
            <button id='reset-viewport' onMouseDown={resetViewportButton}>reset</button>
        </div> */}
        {DEBUG && <div id='debug'>
            <p>x position: {-offsetX.toFixed()}</p>
            <p>y position: {offsetY.toFixed()}</p>
            <p>scale: {scale}</p>
            <p>mouseX: {relativeXRef.current.toFixed()}</p>
            <p>mouseY: {relativeYRef.current.toFixed()}</p>
        </div>}
        {/* {SELECT && <div id='select' style={selectStyle}></div>} */}
    </div>
}

export default Viewport;