import { NavLink } from 'react-router-dom';
import styles from './PageNav.module.css';

import Logo from './Logo';

function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/industries">Across Industries</NavLink>
        </li>
        <li>
          <NavLink to="/annualTemperature">Annual Temperature Changes</NavLink>
        </li>
        <li>
          <NavLink to="/acrossAirports">Across Airports</NavLink>
        </li>
        <li>
          <NavLink to="/databaseCount">Database Count</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
