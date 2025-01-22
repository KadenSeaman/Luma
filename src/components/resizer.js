import { useContext } from "react";
import { AppContext } from "../context/appContext";
import '../styles/resizer.scss';

function Resizer() {
    
    const { resizerHeight, resizerWidth } = useContext(AppContext);

    const resizerStyle = {
        width: resizerWidth + 'vw',
        height: resizerHeight + 'vh'
    }

    return (
        <div id='resizer' style={resizerStyle}/>
    )
}
export default Resizer;