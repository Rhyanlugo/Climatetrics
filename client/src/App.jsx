import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import DatabaseCount from './pages/DatabaseCount';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import AcrossIndustriesByContinent from './pages/across_industries/AcrossIndustriesByContinent';
import AcrossIndustriesByCountry from './pages/across_industries/AcrossIndustriesByCountries';
import AcrossIndustriesLayout from './pages/across_industries/AcrossIndustriesLayout';
import AcrossAirportsByRegion from './pages/airport_severity/AcrossAirportByRegion';
import AcrossAirportsByAirport from './pages/airport_severity/AcrossAirportsByAirport';
import AcrossAirports from './pages/airport_severity/AcrossAirportsLayout';
import AnnualTemperatureChangeLayout from './pages/annual_temperature_change/AnnualTemperatureChangeLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="industries" element={<AcrossIndustriesLayout />}>
          <Route index element={<Navigate replace to={'byCountries'} />} />
          <Route path="byCountries" element={<AcrossIndustriesByCountry />} />
          <Route path="byContinent" element={<AcrossIndustriesByContinent />} />
        </Route>
        <Route
          path="annualTemperature"
          element={<AnnualTemperatureChangeLayout />}
        />
        <Route path="acrossAirports" element={<AcrossAirports />}>
          <Route index element={<Navigate replace to={'byAirport'} />} />
          <Route path="byAirport" element={<AcrossAirportsByAirport />} />
          <Route path="byRegion" element={<AcrossAirportsByRegion />} />
        </Route>
        <Route path="databaseCount" element={<DatabaseCount />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
