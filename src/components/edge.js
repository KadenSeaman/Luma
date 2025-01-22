import { useContext } from 'react';
import { RendererContext } from '../context/rendererContext';

export default function Edge({data}){
    const {offsetX, offsetY, scale} = useContext(RendererContext);
    const {rootX, rootY, targetX, targetY} = data;


    const startX = (rootX + offsetX + 50) * scale;
    const startY = (rootY + offsetY + 50) * scale;
    const endX = (targetX + offsetX + 50) * scale;
    const endY = (targetY + offsetY + 50) * scale; 

    return (
        <line x1={startX} y1={startY} x2={endX} y2={endY} stroke='white' stroke-width={2 * scale}/>
    )
}