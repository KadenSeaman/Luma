import '../styles/topRibbon.scss';
import '../styles/buttons.scss'

const TopRibbon = () => {
    return (
        <div id='top-ribbon'>
            <button className='ribbon-button'>File</button>    
            <button className='ribbon-button'>Save</button>    
        </div>
    )
}

export default TopRibbon;