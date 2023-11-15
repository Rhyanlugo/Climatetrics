import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

function Logo() {
  return (
    <Link to="/">
      <img src="/logo.svg" alt="Climatetrics logo" className={styles.logo} />
    </Link>
  );
}

export default Logo;
