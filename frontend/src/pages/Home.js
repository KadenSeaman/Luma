import React, { useEffect, useState } from 'react';
import '../styles/home.scss'

import Logo from '../components/logo';
import NewDiagramButton from '../components/Buttons/newDiagramButton';
import HomeDiagram from '../components/homeDiagram';
import { Link } from 'react-router-dom';


const Home = () => {

    const [documents, setDocuments] = useState();

    useEffect(() => {
        
        const getUserDocuments = async () => {
            const response = await fetch('/diagrams', {
                METHOD: 'GET',
                headers: { "Content-Type": "application/json"}
            });

            if(response.ok){
                const data = await response.json();
                setDocuments(data);
            }
        }

        getUserDocuments();
    }, [])

    return(
        <div id='homeContainer'>
            <div id='left-panel'>
                <ul id='left-panel-list'>
                    <li>
                        <div id='logo-title-container'>
                            <Logo  logoLink={'/'}/>
                            <h1 id='title'>Luma</h1>
                        </div>  
                    </li>
                    <li>
                        <NewDiagramButton />
                    </li>
                    <li>
                        <Link className='left-panel-list-item'>Home</Link>
                    </li>
                    <li>
                        <Link className='left-panel-list-item'>Recents</Link>
                    </li>
                    <li>
                        <Link className='left-panel-list-item'>Favorites</Link>
                    </li>
                </ul>
            </div>
            <div id="main-panel">
                <h1 id='main-panel-title'>Recent Diagrams</h1>
                <div id='diagram-container'>
                    {documents !== undefined && documents.map((doc, i) => {
                        return <HomeDiagram key={i} title={doc.title} docId={doc._id}/>
                    })}
                </div>
            </div>
        </div>
    )
};

export default Home;