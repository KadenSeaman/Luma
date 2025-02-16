import '../../styles/buttons.scss'
import { useNavigate } from 'react-router-dom';

const NewDocumentButton = () => {

    const navigate = useNavigate();

    const createDiagram = async (e) => {
        e.preventDefault();

        const response = await fetch('/diagrams', {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                title: 'New Document',
                userID: "Kaden-Dev",
                tabs: 'none',
                favorite: false,
                editorContent: "",
            })
        })

        if(response.ok) {
            const data = await response.json();
            navigate(`/diagram/${data.id}`);
        }
    }

    return (
        <button onClick={createDiagram} className='new-document-btn'><p>+ New Diagram</p></button>
    )
}

export default NewDocumentButton