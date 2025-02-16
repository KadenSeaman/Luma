import '../styles/renderer.scss';

import { AppContext } from "../context/appContext";

import { useContext, useEffect, useRef, useState } from 'react';
import { Queue } from '@datastructures-js/queue';

import Viewport from './viewport';
import Node from './node';
import Edge from './edge';

function Renderer() {
    return (
        <RendererContent />
    )
}

function RendererContent() {
    const renderer = useRef(null);
    const textRuler = useRef(null);
    const { rendererWidth, rootNode, forceRender } = useContext(AppContext);

    const [formattedNodeData, setFormattedNodeData] = useState([]);
    const [formattedEdgeData, setFormattedEdgeData] = useState([]);

    const rendererStyle = {
        width: `${rendererWidth}vw`
    }

    useEffect(() => {

        /*
            Modified Sugiyama Method

            1. Seperate all non connected graphs into their own components
            2. Break all cycles within a componenet
            3. Assign levels based upon hierarchy
            4. Create dummy nodes for edges that span multiple levels
            5. Reduce crossing 
        */

        const calculatePositions = () => {
            // estimate size of node
            assignNodeSizes();

            // assign unique ids to each node and return a map of id to node and node name to id
            const [nodeIdToNode, nodeNameToId] = assignNodeIds();

            // create an adjList of all nodes and edges
            const adjList = createAdjList(nodeNameToId);

            // create an adjList where each key is node and the values are incoming edges
            const incomingAdjList = createIncomingAdjList(nodeNameToId);

            // seperate all nodes into connected components
            const components = createSeperateComponents(adjList, incomingAdjList);

            // create a minimum feedback arc set which is acyclic and the minimum amount of edges have been reversed to eliminate cycles
            const fasGraphs = [];
            for(const component of components) fasGraphs.push(createFASGraph(component, incomingAdjList));

            // assign levels to each non acyclic graph
            const levels = [];
            for(const acyclicGraph of fasGraphs) levels.push(assignLevel(acyclicGraph, nodeIdToNode));

            // create dummy nodes so edges span max 1 layer
            const dummyGraph = [];
            const dummyLevels = [];

            for(let i = 0; i < fasGraphs.length; i++){
                const [graphRes, levelRes] = insertDummyNodes(fasGraphs[i], levels[i]); 

                dummyGraph.push(graphRes);
                dummyLevels.push(levelRes);
            }


            // turn the levels map into array so you can assign an ordering
            const orderedLevels = [];
            
            for(const level of dummyLevels){
                orderedLevels.push(convertLevelsToArray(level));
            }

            // reduce edge crossings
            const optimizedLevels = [];

            for(let i = 0; i < dummyGraph.length; i++){
                const optimizedLevel = minimizeEdgeCrossings(dummyGraph[i], orderedLevels[i]);
                optimizedLevels.push(optimizedLevel);
            }

            let componentOffsetX = 0;

            for(let i = 0; i < optimizedLevels.length; i++){
                const curComponentWidth = assignPositions(optimizedLevels[i], nodeIdToNode, componentOffsetX);

                componentOffsetX += curComponentWidth;
            }

            assignPaths(nodeIdToNode, nodeNameToId);

            setFormattedNodeData(rootNode.nodes);
            setFormattedEdgeData(rootNode.edges);
            forceRender();
        }

        const assignPaths = (nodeIdToNode, nodeNameToId) => {
            for(const edge of rootNode.edges || []){
                if(!nodeNameToId.has(edge.source) || !nodeNameToId.has(edge.target) || edge.source === edge.target) continue;

                const sourceId = nodeNameToId.get(edge.source);
                const targetId = nodeNameToId.get(edge.target);

                const sourceNode = nodeIdToNode.get(sourceId);
                const targetNode = nodeIdToNode.get(targetId);

                edge.rootX = sourceNode.x + sourceNode.width / 2;
                edge.rootY = sourceNode.y + sourceNode.height / 2;
                edge.targetX = targetNode.x + targetNode.width / 2;
                edge.targetY = targetNode.y + targetNode.height / 2;
            }
        }

        const assignPositions = (levels, nodeIdToNode, componentOffsetX) => {
            let componentWidth = 0;

            // loop through each level
            let levelYOffset = 0;

            const Y_PADDING = 100;
            const X_PADDING = 100;

            for(let i = 0; i < levels.length; i++){
                // get max height of a node to make sure the entire level can contain it
                let maxHeight = 0;
                let levelXOffset = 0;

                for(const nodeId of levels[i]){
                    maxHeight = Math.max(maxHeight, nodeIdToNode.get(nodeId).height)
                }

                for(const nodeId of levels[i]){
                    const node = nodeIdToNode.get(nodeId);

                    node.x = levelXOffset + componentOffsetX;
                    node.y = levelYOffset + Y_PADDING;

                    levelXOffset += node.width + X_PADDING;
                }

                levelYOffset += maxHeight + Y_PADDING;

                // component height = sum of all max heights of every level 
                componentWidth = Math.max(componentWidth, levelXOffset);
            }

            return componentWidth;
        }

        const convertLevelsToArray = (levels) => {
            const deepestLevel = Math.max(...levels.values());
            const orderedLevels = [];

            for(let i = 0; i <= deepestLevel; i++){
                orderedLevels.push([]);
            }

            for(const [id, level] of levels){
                orderedLevels[level].push(id);
            }

            return orderedLevels;
        }

        const minimizeEdgeCrossings = (adjList, levels) => {
            let cycles = 0;

            while(cycles < 4){
                for(let i = 1; i < levels.length; i++){
                    const currentLayer = levels[i];
                    const prevLayer = levels[i - 1];

                    const barycenters = new Map();

                    for(const nodeId of currentLayer){
                        const neighbors = adjList.get(nodeId);
                        let sum = 0;
                        let count = 0;
                        for(const neighborId of neighbors){
                            if(prevLayer.includes(neighborId)){
                                sum += prevLayer.indexOf(neighborId);
                                count++;
                            }
                        }

                        const barycenter = count > 0 ? sum / count : 0;
                        barycenters.set(nodeId, barycenter);
                    }

                    currentLayer.sort((a,b) => barycenters.get(a) - barycenters.get(b));
                }

                for(let i = levels.length - 2; i >= 0; i--){
                    const currentLayer = levels[i];
                    const prevLayer = levels[i + 1];

                    const barycenters = new Map();

                    for(const nodeId of currentLayer){
                        const neighbors = adjList.get(nodeId);
                        let count = 0;
                        let sum = 0;

                        for(const neighborId of neighbors){
                            if(prevLayer.includes(neighborId)){
                                sum += prevLayer.indexOf(neighborId);
                                count++;
                            }
                        }

                        const barycenter = count > 0 ? sum / count : 0;
                        barycenters.set(nodeId,barycenter);
                    }

                    currentLayer.sort((a,b) => barycenters.get(a) - barycenters.get(b));
                }

                cycles++;
            }

            return levels;
        }
        
        const insertDummyNodes = (adjList, levels) => {
            const newAdjList = new Map(adjList); // copy original adjList
            const newLevels = new Map(levels); // copy the original levels


            // iterate through all nodes in adj list
            for(const nodeId of adjList.keys()){
                const updatedNeighbors = new Set();

                // iterate through each neighbor of current node
                for(const neiId of adjList.get(nodeId)){
                    const startLevel = levels.get(nodeId);
                    const endLevel = levels.get(neiId);

                    // if edge is spans more than 1 level, insert dummy nodes
                    if(endLevel > startLevel + 1){
                        let prevNodeId = nodeId;

                        // start isnserting dummy nodes at intermediate levels
                        for(let level = startLevel + 1; level < endLevel; level++){
                            const dummyNodeId = `Dummy_${nodeId}_${neiId}_${level}`;

                            // add the dummy node to the new adjlist
                            newAdjList.set(dummyNodeId, new Set());

                            // add the dummy node to the new levels map
                            newLevels.set(dummyNodeId, level);

                            // connect the previous node to the dummy node
                            newAdjList.get(prevNodeId).add(dummyNodeId);

                            // update the previous node to teh current dummy node
                            prevNodeId = dummyNodeId;
                        }

                        newAdjList.get(prevNodeId).add(neiId);
                    }
                    else {
                        updatedNeighbors.add(neiId);
                    }
                }

                newAdjList.set(nodeId, updatedNeighbors);
            }

            return [newAdjList, newLevels];
        }

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
    
    
                node.width = Math.max(100, calculatedWidth + node.padding * 2 + 20);
                node.height = Math.max(100, calculatedHeight + node.padding * 2);
            }
        }

        const assignNodeIds = () => {
            const nodeIdToNode = new Map();
            const nodeNameToId = new Map();

            let nodeCount = 0;

            for(const node of rootNode.nodes || []){
                node.id = `n${nodeCount}`;
                nodeIdToNode.set(node.id, node);
                nodeNameToId.set(node.name, node.id);
                nodeCount++;
            }

            return [nodeIdToNode, nodeNameToId];
        }

        const createSeperateComponents = (adjList, incomingAdjList) => {
            const visited = new Set();

            const components = [];

            const dfs = (nodeId, graphMap) => {
                if(visited.has(nodeId)) return;
                visited.add(nodeId);

                graphMap.set(nodeId, adjList.get(nodeId));

                for(const neiId of graphMap.get(nodeId)){
                    dfs(neiId, graphMap);
                }
                for(const neiId of incomingAdjList.get(nodeId)){
                    dfs(neiId, graphMap);
                }

                return graphMap;
            }

            for(const node of rootNode.nodes || []){
                const nodeId = node.id;


                if(visited.has(nodeId)) continue;
                components.push(dfs(nodeId, new Map()));
            }

            return components;
        }

        const createAdjList = (nodeNameToId) => {
            const adjList = new Map();

            for(const node of rootNode.nodes || []){
                adjList.set(node.id, new Set());
            }

            for(const edge of rootNode.edges || []){
                const sourceId = nodeNameToId.get(edge.source);
                const targetId = nodeNameToId.get(edge.target);

                if(sourceId === undefined || targetId === undefined || sourceId === targetId) continue;

                adjList.get(sourceId).add(targetId);
            }

            return adjList;
        };

        const createIncomingAdjList = (nodeNameToId) => {
            const adjList = new Map();

            for(const node of rootNode.nodes || []){
                adjList.set(node.id, new Set());
            }

            for(const edge of rootNode.edges || []){
                const sourceId = nodeNameToId.get(edge.source);
                const targetId = nodeNameToId.get(edge.target);

                if(sourceId === undefined || targetId === undefined) continue;

                adjList.get(targetId).add(sourceId);
            }

            return adjList;
        };

        const createFASGraph = (adjList, incomingAdjList) => {
            const visited = new Set();

            const dfs = (nodeId) => {

                if(visited.has(nodeId)){
                    greedyMakeAcyclic(nodeId, adjList, incomingAdjList);
                }
                visited.add(nodeId);

                for(const targetId of adjList.get(nodeId) || []){
                    dfs(targetId);
                }
            }


            for(const nodeId of adjList.keys()){
                if(visited.has(nodeId)) continue;

                dfs(nodeId);
            }

            return adjList;
        }

        const greedyMakeAcyclic = (nodeId, adjList, incomingAdjList) => {
            const outgoingEdges = adjList.get(nodeId);
            const incomingEdges = incomingAdjList.get(nodeId);

            // np O (n + m) where n is incoming and m is outgoing

            if(outgoingEdges.length > incomingEdges.length){
                // flip incoming to outgoing
                for(const incomingId of incomingEdges){
                    // remove incoming edge
                    adjList.get(incomingId).delete(nodeId);
                    // add new outgoing in place
                    adjList.get(nodeId).add(incomingId);
                }
            }
            else{
                // flip outgoing to incoming
                for(const outgoingId of outgoingEdges){
                    // remove outgoing edge
                    adjList.get(nodeId).delete(outgoingId)

                    // add new incoming in place
                    adjList.get(outgoingId).add(nodeId);
                }
            }
        }

        const assignLevel = (adjList) => {

            const topologicalSort = () =>{
                const inDegree = new Map();
                for(const nodeId of adjList.keys()){
                    inDegree.set(nodeId, 0);
                }
    
                for(const neiIdSet of adjList.values()){
                    for(const neiId of neiIdSet){
                        inDegree.set(neiId, inDegree.get(neiId) + 1);
                    }
                }
    
                const queue = new Queue();
    
                for(const nodeId of inDegree.keys()){
                    if(inDegree.get(nodeId) === 0) queue.push(nodeId);
                }
    
                const topologicalOrder = [];
    
                while(!queue.isEmpty()){
                    const nodeId = queue.pop();
    
                    topologicalOrder.push(nodeId);
    
                    for(const neiId of adjList.get(nodeId)){
                        inDegree.set(neiId, inDegree.get(neiId) - 1);
                        if(inDegree.get(neiId) === 0){
                            queue.push(neiId);
                        }
                    }
                }
    
                return topologicalOrder;
            }

            // use kahns algorithm to process nodes by level
            const topoSorted = topologicalSort();


            // assign levels to nodes
            const levels = new Map();

            for(const nodeId of topoSorted){
                let maxPredLevel = -1;

                for(const pred of adjList.keys().filter(n => adjList.get(n).has(nodeId))){
                    if(levels.get(pred) > maxPredLevel){
                        maxPredLevel = levels.get(pred);
                    }
                }

                levels.set(nodeId, maxPredLevel + 1);
            }

            return levels;
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