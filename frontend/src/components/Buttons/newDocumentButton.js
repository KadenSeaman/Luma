import { Link } from 'react-router-dom';
import '../../styles/buttons.scss'

const NewDocumentButton = () => {
    return (
        <Link class='new-document-btn' to='/LumaApp'><p>+ New Document</p></Link>
    )
}

export default NewDocumentButton