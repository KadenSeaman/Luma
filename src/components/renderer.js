import '../styles/renderer.scss';

import { useAppLayout } from "../context/appLayoutContext";
import { useRef } from 'react'

import Viewport from './viewport';
import Node from './node';

import { RendererProvider } from '../context/rendererContext';


function Renderer() {
    return (
        <RendererProvider>
            <RendererContent />
        </RendererProvider>
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
        <div ref={renderer} id='renderer' style={rendererStyle}>
            <Viewport></Viewport>

            <div id='node-container'>
                {rootNode && rootNode.nodes.map((nodeData, i) => <Node key={i} data={nodeData} index={i} ></Node>)}
            </div>
        </div>
    )
}

export default Renderer;