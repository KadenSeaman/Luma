import { useAppLayout } from "../context/appLayoutContext";
import '../styles/renderer.scss';
import { useRef } from 'react'

import Viewport from './viewport';

import { RendererLayoutProvider } from '../context/rendererLayoutContext';


function Renderer() {
    return (
        <RendererLayoutProvider>
            <RendererContent />
        </RendererLayoutProvider>
    )
}

function RendererContent() {
    const { rendererHeight, rendererWidth } = useAppLayout();

    let renderer = useRef(null);

    const rendererStyle = {
        width: `${rendererWidth}vw`,
        height: `${rendererHeight}vh`,
    }

    const overlayViewBox = `0 0 ${rendererWidth * window.innerWidth} ${rendererHeight * window.innerHeight}`;

    return (
        <div ref={renderer} id='renderer' style={rendererStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='xMidYMid meet' viewBox={overlayViewBox} id='relationship-overlay'></svg>
            <Viewport></Viewport>
        </div>
    )
}

export default Renderer;