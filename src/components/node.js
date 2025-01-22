import { useContext } from 'react';
import { RendererContext } from '../context/rendererContext';
import '../styles/node.scss';



function Node({data, ref}) {

    const {id = 0, name, fields, methods, fontSize, padding} = data; 
    const {offsetX, offsetY, scale} = useContext(RendererContext);



    const nodeStyle = {
        opacity: 1,
        left: `${(id * 200 + offsetX) * scale}px`,
        top: `${(0 * 200 + offsetY) * scale}px`,
        fontSize: `${fontSize * scale}px`,
        padding: `${padding * scale}px`,
    }

    return (
        <div ref={ref} className='node' style={nodeStyle}>
            <h1>{name}</h1>
            {(methods.length > 0 || fields.length > 0) && (<div className='divider'></div>)} 
            {fields.length > 0 && fields.map((field,i) => <p key={i}>{field.toString()}</p>)}
            {methods.length > 0 && fields.length > 0 && (<div className='divider'></div>)} 
            {methods.length > 0 && methods.map((method,i) => <p key={i}>{method.toString()}</p>)}
        </div>
    )
}

export default Node;