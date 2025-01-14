import { useAppLayout } from "../context/appLayoutContext";
import '../styles/resizer.scss';

function Resizer() {
    
    const { resizerHeight, resizerWidth } = useAppLayout();

    const resizerStyle = {
        width: resizerWidth + 'vw',
        height: resizerHeight + 'vh'
    }

    return (
        <div id='resizer' style={resizerStyle}/>
    )
}
export default Resizer;