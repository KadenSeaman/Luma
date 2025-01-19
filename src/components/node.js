import { useRendererLayout } from '../context/rendererLayoutContext';
import '../styles/node.scss';



function Node({data, index}) {

    const {offsetX, offsetY, scale} = useRendererLayout();

    console.log(data);

    const fields = data.fields;
    const methods = data.methods;

    const nodeStyle = {
        left: `${(index * 200 + offsetX) * scale}px`,
        top: `${(0 * 200 + offsetY) * scale}px`,
        fontSize: `${12 * scale}px`,
        padding: `${10 * scale}px`,
    }

    return (
        <div className='node' style={nodeStyle}>
            <h1>{data.name}</h1>
            {(methods.length > 0 || fields.length > 0) && (<div className='divider'></div>)} 
            {fields.length > 0 && fields.map((field,i) => <p key={i}>{field.toString()}</p>)}
            {methods.length > 0 && fields.length > 0 && (<div className='divider'></div>)} 
            {methods.length > 0 && methods.map((method,i) => <p key={i}>{method.toString()}</p>)}
        </div>
    )
}

export default Node;