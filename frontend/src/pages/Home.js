import React from 'react';
import '../styles/home.scss'

import Logo from '../components/logo';
import NewDocumentButton from '../components/Buttons/newDocumentButton';
import { Link } from 'react-router-dom';

const Home = () => {
    return(
        <div id='homeContainer'>
            <div id='left-panel'>
                <ul id='left-panel-list'>
                    <li>
                        <div id='logo-title-container'>
                            <Logo  logoLink={'/Home'}/>
                            <h1 id='title'>Luma</h1>
                        </div>  
                    </li>
                    <li>
                        <NewDocumentButton />
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
                <h1 id='main-panel-title'>Recent Documents</h1>
            </div>
        </div>
    )
};

export default Home;