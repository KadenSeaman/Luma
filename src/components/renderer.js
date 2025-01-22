import '../styles/renderer.scss';

import { AppContext } from "../context/appContext";
import { RendererProvider } from '../context/rendererContext';

import { useContext, useEffect, useRef } from 'react'

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
    const { rendererHeight, rendererWidth, rootNode, forceRender } = useContext(AppContext);

    const rendererStyle = {
        width: `${rendererWidth}vw`,
        height: `${rendererHeight}vh`,
    }

    useEffect(() => {
        const calculateLevel = (nodeId, adjList, level, visited, levels) => {
            if(visited.has(nodeId)) return;
            visited.add(nodeId);
    
            if(levels[level] === undefined) levels[level] = [];
            levels[level].push(nodeId);
    
            for(const dst of adjList.get(nodeId) || []){
                calculateLevel(dst, adjList, level + 1, visited, levels)
            }
        }

        const calculatePositions = () => {
            // assign id's to each node
            let nodeCount = 0;
            const nodeNameToNode = new Map();
            const nodeIdToNode = new Map();
    
            for(const node of rootNode.nodes || []){
                node.id = `n${nodeCount}`;
                nodeIdToNode.set(node.id, node);
                nodeNameToNode.set(node.name, node);
                nodeCount++;
            }
    
            // create an adjancency list
            const adjList = new Map();
    
            for(const node of rootNode.nodes || []){
                adjList.set(node.id, []);
            }
    
            for(const edge of rootNode.edges || []){


                if(!nodeNameToNode.has(edge.source)) continue;
                if(!nodeNameToNode.has(edge.target)) continue;
    
                const srcId = nodeNameToNode.get(edge.source).id;
                const targetId = nodeNameToNode.get(edge.target).id;
    
                adjList.get(srcId).push(targetId);
            }
    
            const visited = new Set();
            const levels = [];
    
            for(const node of rootNode.nodes) calculateLevel(node.id, adjList, 0, visited, levels);
            
            for(let i = 0; i < levels.length; i++){
                for(let j = 0; j < levels[i].length; j++){
                    const node = nodeIdToNode.get(levels[i][j]);
                    node.y = i * 200;
                    node.x = j * 200;
                }
            }

            forceRender();
        }
        
        if(rootNode) calculatePositions();
    }, [rootNode])



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