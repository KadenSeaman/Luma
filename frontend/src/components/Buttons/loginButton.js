import { Link } from 'react-router-dom';
import '../../styles/buttons.scss'

const LoginButton = () => {
    return (
        <Link class='login-btn' to='/SignIn'><p>Sign In</p></Link>
    )
}

export default LoginButton