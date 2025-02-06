import { Link } from 'react-router-dom';
import '../../styles/buttons.scss'

const LoginButton = () => {
    return (
        <Link class='login-btn' to='/Home'><p>Log In</p></Link>
    )
}

export default LoginButton