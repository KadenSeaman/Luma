function NodeRuler(props) {
    const {data, ref} = props; 

    const {name = '', fields = [], methods = [], fontSize = 12, padding = 10, width = 0, height = 0} = data;  // eslint-disable-line no-unused-vars

    const rulerStyle = {
        fontSize: `${fontSize}px`,
        padding: `${padding}px`,
    }

    return (
        <div ref={ref} id="ruler-node" className='node' style={rulerStyle}>
            <h1>{name}</h1>
            {(methods.length > 0 || fields.length > 0) && (<div className='divider'></div>)} 
            {fields.length > 0 && fields.map((field,i) => <p key={i}>{field.toString()}</p>)}
            {methods.length > 0 && fields.length > 0 && (<div className='divider'></div>)} 
            {methods.length > 0 && methods.map((method,i) => <p key={i}>{method.toString()}</p>)}
        </div>
    )
}

export default NodeRuler;