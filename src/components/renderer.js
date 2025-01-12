import { useLayout } from "../context/appLayoutContext";

function Renderer() {

    const { rendererHeight, rendererWidth } = useLayout();
    
    const rendererStyle = {
        width: rendererWidth + 'px',
        height: rendererHeight + 'px',
    }

    return (
        <div id='renderer' style={rendererStyle}/>
    )
}
export default Renderer;