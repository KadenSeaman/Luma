import { useContext } from 'react';
import { RendererContext } from '../context/rendererContext';

export default function Edge({data}){
    const { offsetX, offsetY, scale } = useContext(RendererContext);
    const { rootX, rootY, targetX, targetY } = data;


    const startX = (rootX + offsetX) * scale;
    const startY = (rootY + offsetY) * scale;
    const endX = (targetX + offsetX) * scale;
    const endY = (targetY + offsetY) * scale; 

    return (
        <line x1={startX} y1={startY} x2={endX} y2={endY} stroke='white' strokeWidth={2 * scale}/>
    )
}