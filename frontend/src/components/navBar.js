import '../styles/navbar.scss';

import SignupButton from './Buttons/signupButton';
import LoginButton from './Buttons/loginButton';
import Logo from './logo';

const NavBar = (props) => {
    const { loginButton = false,
            signupButton = false, 
            logo = false, 
            title = false,
            logoLink = ''
    } = props;

    return (
        <nav id='navbar'>
            <div id='logo-title-container'>
                {logo && <Logo  logoLink={logoLink}/>}
                {title && <h1 id='title'>Luma</h1>}
            </div>

            <div id='signup-login-container'>
                {loginButton && <LoginButton />}
                {signupButton && <SignupButton />}
            </div>
        </nav>
    )
}

export default NavBar;