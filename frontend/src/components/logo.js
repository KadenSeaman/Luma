import '../styles/logo.scss';
import { Link } from 'react-router-dom';

const Logo = (props) => {
    const { logoLink } = props;

    return (
        <Link id='logo' to={logoLink}/>
    )
}

export default Logo;