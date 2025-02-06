import { useContext } from "react";
import { AppContext } from "../context/appContext";
import '../styles/resizer.scss';

function Resizer() {
    
    const { resizerWidth, grabbing } = useContext(AppContext);

    const resizerStyle = {
        width: resizerWidth + 'vw',
    }

    if(grabbing) resizerStyle.background = 'linear-gradient(var(--yellowPrimary), var(--coralPrimary))'; 

    return (
        <div id='resizer' style={resizerStyle}/>
    )
}
export default Resizer;