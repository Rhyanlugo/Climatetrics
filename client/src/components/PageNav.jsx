import { NavLink } from 'react-router-dom';
import styles from './PageNav.module.css';

import Logo from './Logo';
import { useState } from 'react';

const acrossIndustries = [
  {
    path: '/industries/byCountries',
    name: 'By Countries',
  },
  {
    path: '/industries/byContinent',
    name: 'By Continent',
  },
];

function PageNav() {
  const [dropdown, setDropdown] = useState(false);

  function handleDropdown() {
    console.log('clicked');
    setDropdown(!dropdown);
  }

  return (
    <nav className={styles.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/industries/byCountries">
            Across Industries - By Country
          </NavLink>
          <br />
          <NavLink to="/industries/byContinent">
            Across Industries - By Continent
          </NavLink>
          {/* <button onClick={handleDropdown} className="uppercase">
            Across Countries
          </button>
          {dropdown && <Dropdown />} */}
        </li>
        <li>
          <NavLink to="/annualTemperature">Annual Temperature Changes</NavLink>
        </li>
        <li>
          {/* <NavLink to="/acrossAirports">Across Airports</NavLink> */}
          <NavLink to="/acrossAirports/byAirport">
            Flight Delays - By Airport
          </NavLink>
          <br />
          <NavLink to="/acrossAirports/byRegion">
            Flight Delays - By Region
          </NavLink>
        </li>
        <li>
          <NavLink to="/databaseCount">Database Count</NavLink>
        </li>
      </ul>
    </nav>
  );
}

function Dropdown({ handleDropdown }) {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/industries/byCountries" onClick={handleDropdown}>
            By Countries
          </NavLink>
        </li>
        <li>
          <NavLink to="/industries/byContinent" onClick={handleDropdown}>
            By Continent
          </NavLink>{' '}
        </li>
      </ul>
    </div>
  );
}

export default PageNav;
