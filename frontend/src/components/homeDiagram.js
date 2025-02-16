import '../styles/homeDiagram.scss';
import { Link } from "react-router-dom"

const HomeDiagram = ({ docId, title }) => {
    return (
        <div className="homeDiagram">
            <Link className='diagramTitle' to={`/diagram/${docId}`}>{title}</Link>
        </div>
    )
}

export default HomeDiagram