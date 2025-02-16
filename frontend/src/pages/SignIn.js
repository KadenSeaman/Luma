import NavBar from "../components/navBar";
import { Link } from 'react-router-dom';
import '../styles/signIn.scss';

const SignIn = () => {


    return (
        <div id='sign-in-container'>
            <NavBar logo={true} title={true} logoLink='/'/>
            <div id='login-page'>
                <div id='sign-in'>
                    <h1 id='sign-in-title'>Sign In</h1>
                    <form id='sign-in-form' action='/Home'>
                        <div id='input-container'>
                            <input classname='sign-in-input' type="text" name="username" id="username" placeholder="Username:"/>
                            <input classname='sign-in-input' type="password" name="password" id="password" placeholder="Password:"/>
                        </div>
                        <p className="tooltip" >Not a member? <Link to='SignUp'/> Sign Up Instead</p>
                        <p className="tooltip"id='top-tooltip'>Forgot Your Password?</p>
                        <button className='sign-in-btn' type="submit">Sign In</button>
                    </form>
                </div>
                <div id="welcome-back">
                    <h1 id='username-title'>Welcome Back!</h1>
                    <p id='username-tip'>Enter your username and password to login</p>
                </div>
            </div>
        </div>
    )
}

export default SignIn;