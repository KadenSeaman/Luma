import '../styles/topRibbon.scss';
import '../styles/buttons.scss'

const TopRibbon = ({ document, editorContent }) => {


    const save = async (e) => {
        e.preventDefault();

        await fetch('/diagrams', {
            method: 'PATCH',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                title: 'New Document',
                userID: "Kaden-Dev",
                tabs: 'none',
                favorite: false,
                editorContent: editorContent,
            })
        })
    }

    return (
        <div id='top-ribbon'>
            <button className='ribbon-button'>File</button>    
            <button onClick={save} className='ribbon-button'>Save</button>    
        </div>
    )
}

export default TopRibbon;