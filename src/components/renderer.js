import '../styles/renderer.scss';

import { AppContext } from "../context/appContext";
import { RendererProvider } from '../context/rendererContext';

import { useContext, useEffect, useRef, useState } from 'react'

import Viewport from './viewport';
import Node from './node';
import Edge from './edge';

function Renderer() {
    return (
        <RendererProvider>
            <RendererContent />
        </RendererProvider>
    )
}

function RendererContent() {
    const renderer = useRef(null);
    const textRuler = useRef(null);
    const { rendererHeight, rendererWidth, rootNode, forceRender } = useContext(AppContext);

    const [formattedNodeData, setFormattedNodeData] = useState([]);
    const [formattedEdgeData, setFormattedEdgeData] = useState([]);

    
    


    const rendererStyle = {
        width: `${rendererWidth}vw`,
        height: `${rendererHeight}vh`,
    }

    useEffect(() => {
        const assignNodeSizes = () => {
            for(const node of rootNode.nodes || []){
                if(!textRuler.current) return;
    
                let calculatedWidth = 0;
                let calculatedHeight = 0;
    
                const canvas = textRuler.current;      
                const ctx = canvas.getContext("2d");
    
    
                // estimate title size
                const title = node.name;
                ctx.font = `${node.fontSize * 2}px Arial`;
                const titleMeasurements = ctx.measureText(title);
    
                const titleWidth = titleMeasurements.width;;
            
                calculatedWidth = Math.max(calculatedWidth, titleWidth);
                calculatedHeight += node.fontSize * 2 * 1.25 + node.fontSize * 1.25 * 2 + 16; // title is 2em
    
    
    
                // estimate width of fields
                ctx.font = `${node.fontSize}px Arial`;
                for(const field of node.fields){
                    const fieldMeasurement = ctx.measureText(field.toString());
    
                    calculatedWidth = Math.max(calculatedWidth, fieldMeasurement.width);
                    calculatedHeight += node.fontSize * 1.25 + node.fontSize * 2;
                }
    
                // estimate width of methods
                for(const method of node.methods){
                    const methodMeasurement = ctx.measureText(method.toString());
    
                    calculatedWidth = Math.max(calculatedWidth, methodMeasurement.width);
                    calculatedHeight += node.fontSize * 1.25 + node.fontSize * 2;
                }
    
    
                node.width = Math.max(100, calculatedWidth + node.padding * 2);
                node.height = Math.max(100, calculatedHeight + node.padding * 2);
            }
        }

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
            // estimate node width & height
            assignNodeSizes();

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

            for(const edge of rootNode.edges || []){
                if(!nodeNameToNode.has(edge.source)) continue;
                if(!nodeNameToNode.has(edge.target)) continue;

                const src = nodeNameToNode.get(edge.source);
                const target = nodeNameToNode.get(edge.target);


                edge.rootX = src.x + src.width / 2;
                edge.rootY = src.y + src.height / 2;
                edge.targetX = target.x + target.width / 2;
                edge.targetY = target.y + target.height / 2;
            }

            setFormattedNodeData(rootNode.nodes);
            setFormattedEdgeData(rootNode.edges);
            forceRender();
        }
        
        if(rootNode) calculatePositions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rootNode])


    return (
        <div ref={renderer} id='renderer' style={rendererStyle}>
            <Viewport></Viewport>
            <svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid meet' viewBox={`0 0 ${renderer.current?.offsetWidth} ${renderer.current?.offsetHeight}`}  id='edge-container'>
                {formattedEdgeData.length > 0 && (formattedEdgeData || []).map((edge, i) => <Edge key={i} data={edge}/>)}
            </svg>
            <div id='node-container'>   
                {formattedNodeData.length > 0 && (formattedNodeData || []).map((node, i) => <Node key={i} data={node} />)}
            </div>
            <canvas id='text-calculator' ref={textRuler}></canvas>
        </div>
    )
}

export default Renderer;