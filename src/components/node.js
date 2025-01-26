import { useContext } from 'react';
import { RendererContext } from '../context/rendererContext';
import '../styles/node.scss';



function Node({data, ref}) {

    const {id = 0, name, fields, methods, fontSize, padding, width, height, x, y} = data; 
    const {offsetX, offsetY, scale} = useContext(RendererContext);

    const nodeStyle = {
        opacity: id === 0 ? 0 : 1,
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        left: `${(x + offsetX) * scale}px`,
        top: `${(y + offsetY) * scale}px`,
        fontSize: `${fontSize * scale}px`,
        padding: `${padding * scale}px`,
        borderRadius: `${15 * scale}px`,
    }

    return (
        <div id={id} ref={ref} className='node' style={nodeStyle}>
            <h1>{name}</h1>
            {(methods.length > 0 || fields.length > 0) && (<div className='divider'></div>)} 
            {fields.length > 0 && fields.map((field,i) => <p key={i}>{field.toString()}</p>)}
            {methods.length > 0 && fields.length > 0 && (<div className='divider'></div>)} 
            {methods.length > 0 && methods.map((method,i) => <p key={i}>{method.toString()}</p>)}
        </div>
    )
}

export default Node;