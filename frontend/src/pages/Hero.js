import React from 'react';
import Navbar from '../components/navBar';
import '../styles/hero.scss'

const Hero = () => {
    return(
        <div id='hero-container'>
            <Navbar loginButton={true} signupButton={true} logo={true} title={true} logoLink='/'></Navbar>

            <div id='hero-landing'>
                <h1 id='hero-title'>Diagrams are <span id='hero-title-em'>Hard</span> to make...</h1>
                <p id='hero-subtitle'>The text based diagramming tool to make visual solutions easy</p>
                <img id='hero-image' src='/images/LumaExample.png' alt="example of luma" />
            </div>
        </div>
    )
};

export default Hero;