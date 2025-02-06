import '../styles/bottomRibbon.scss';
import '../styles/buttons.scss'

import { RendererContext } from '../context/rendererContext';
import { useContext } from 'react';

const BottomRibbon = () => {
    const { scale, offsetX, offsetY, updateOffsetX, updateOffsetY, updateScale, viewportOffsetHeight, viewportOffsetWidth, ZOOM_MIN, ZOOM_MAX } = useContext(RendererContext);

    const handleZoomInButton = () => {
        let newScale = scale;

        if(newScale >= 1){
            newScale++;
        }
        else{
            newScale += 0.1;
        }
        
        // prevent zoom past extremes
        if(newScale <= ZOOM_MIN || newScale >= ZOOM_MAX) return;

        // calculate effective gap between scales
        const oldEffectiveWindowWidth = viewportOffsetWidth / scale;
        const newEffectiveWindowWidth = viewportOffsetWidth / newScale;
        const offsetBetweenWindowWidths = oldEffectiveWindowWidth - newEffectiveWindowWidth;

        const oldEffectiveWindowHeight = viewportOffsetWidth / scale;
        const newEffectiveWindowHeight = viewportOffsetWidth / newScale;
        const offsetBetweenWindowHeights = oldEffectiveWindowHeight - newEffectiveWindowHeight;

        
        // calculate final new offsets
        const newOffsetX = offsetX - offsetBetweenWindowWidths / 2;
        const newOffsetY = offsetY - offsetBetweenWindowHeights / 2;

        updateOffsetX(newOffsetX);
        updateOffsetY(newOffsetY);
        updateScale(newScale);
    }
    const handleZoomOutButton = () => {
        let newScale = scale;

        if(newScale > 1){
            newScale--;
        }
        else{
            newScale -= 0.1;
        }

        // prevent zoom past extremes
        if(newScale < ZOOM_MIN || newScale > ZOOM_MAX) return;

        // calculate effective gap between scales
        const oldEffectiveWindowWidth = viewportOffsetWidth / scale;

        const newEffectiveWindowWidth = viewportOffsetWidth / newScale;
        const offsetBetweenWindowWidths = oldEffectiveWindowWidth - newEffectiveWindowWidth;

        const oldEffectiveWindowHeight = viewportOffsetHeight / scale;
        const newEffectiveWindowHeight = viewportOffsetHeight / newScale;
        const offsetBetweenWindowHeights = oldEffectiveWindowHeight - newEffectiveWindowHeight;

        // calculate final new offsets
        const newOffsetX = offsetX - offsetBetweenWindowWidths / 2;
        const newOffsetY = offsetY - offsetBetweenWindowHeights / 2;

        updateOffsetX(newOffsetX);
        updateOffsetY(newOffsetY);
        updateScale(newScale);
    }


    const resetViewport = () => {
        updateOffsetX(0);
        updateOffsetY(0);
        updateScale(1);
    }

    return (
        <div id='bottom-ribbon'>
            <button onClick={resetViewport} className="bottom-ribbon-zoom-button">reset</button>
            <button onClick={handleZoomOutButton} className="bottom-ribbon-zoom-button">-</button>
            <div id='zoom-level'><p>{(scale * 100).toFixed()}%</p></div>
            <button onClick={handleZoomInButton} className="bottom-ribbon-zoom-button">+</button>
        </div>
    )
}

export default BottomRibbon;