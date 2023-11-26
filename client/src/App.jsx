import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AcrossRegions from './pages/AcrossRegions';
import GeneralVisualization from './pages/GeneralVisualization';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import RankingDatasets from './pages/RankingDatasets';
import SearchByDataset from './pages/SearchByDataset';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="visualization" element={<GeneralVisualization />} />
        <Route path="regions" element={<AcrossRegions />} />
        <Route path="ranking" element={<RankingDatasets />} />
        <Route path="search" element={<SearchByDataset />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
