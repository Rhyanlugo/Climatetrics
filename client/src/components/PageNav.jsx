import { NavLink } from 'react-router-dom';
import styles from './PageNav.module.css';

import Logo from './Logo';

function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/visualization">General Visualization</NavLink>
        </li>
        <li>
          <NavLink to="/regions">Across Regions</NavLink>
        </li>
        <li>
          <NavLink to="/Ranking">Ranking Datasets</NavLink>
        </li>
        <li>
          <NavLink to="/search">Search By Datasets</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
