import { useLayout } from "../context/appLayoutContext";
import '../styles/resizer.scss';

function Resizer() {
    
    const { resizerHeight, resizerWidth } = useLayout();

    const resizerStyle = {
        width: resizerWidth + 'px',
        height: resizerHeight + 'px',
    }

    return (
        <div id='resizer' style={resizerStyle}/>
    )
}
export default Resizer;