import '../styles/renderer.scss';

import { AppContext } from "../context/appContext";
import { RendererProvider } from '../context/rendererContext';

import { useContext, useEffect, useRef, useState } from 'react'

import Viewport from './viewport';
import Node from './node';

function Renderer() {
    return (
        <RendererProvider>
            <RendererContent />
        </RendererProvider>
    )
}

function RendererContent() {
    let renderer = useRef(null);
    const { rendererHeight, rendererWidth, rootNode } = useContext(AppContext);

    const rendererStyle = {
        width: `${rendererWidth}vw`,
        height: `${rendererHeight}vh`,
    }

    console.log(rootNode);

    return (
        <div ref={renderer} id='renderer' style={rendererStyle}>
            <Viewport></Viewport>
            <div id='node-container'>
                {rootNode && (rootNode.nodes || []).map((node, i) => <Node key={i} data={node} />)}
            </div>
        </div>
    )
}

export default Renderer;