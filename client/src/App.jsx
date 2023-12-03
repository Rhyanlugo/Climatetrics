import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AcrossAirports from './pages/AcrossAirports';
import AcrossIndustries from './pages/acrossindustries/AcrossIndustries';
import AnnualTemperatureChange from './pages/AnnualTemperatureChange';
import Homepage from './pages/Homepage';
import DatabaseCount from './pages/DatabaseCount';
import PageNotFound from './pages/PageNotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="industries" element={<AcrossIndustries />} />
        <Route path="annualTemperature" element={<AnnualTemperatureChange />} />
        <Route path="acrossAirports" element={<AcrossAirports />} />
        <Route path="databaseCount" element={<DatabaseCount />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
