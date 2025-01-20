import { useAppLayout } from "../context/appLayoutContext";
import '../styles/renderer.scss';
import { useRef } from 'react'

import Viewport from './viewport';
import Node from './node';

import { RendererLayoutProvider } from '../context/rendererLayoutContext';


function Renderer() {
    return (
        <RendererLayoutProvider>
            <RendererContent />
        </RendererLayoutProvider>
    )
}

function RendererContent() {
    const { rendererHeight, rendererWidth, rootNode } = useAppLayout();

    let renderer = useRef(null);

    const rendererStyle = {
        width: `${rendererWidth}vw`,
        height: `${rendererHeight}vh`,
    }

    return (
        <div ref={renderer} id='r   enderer' style={rendererStyle}>
            <Viewport></Viewport>

            <div id='node-container'>
                {rootNode && rootNode.nodes.map((nodeData, i) => <Node key={i} data={nodeData} index={i} ></Node>)}
            </div>
        </div>
    )
}

export default Renderer;