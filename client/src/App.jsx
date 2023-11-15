import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import GeneralVisualization from './pages/GeneralVisualization';
import AcrossRegions from './pages/AcrossRegions';
import RankingDatasets from './pages/RankingDatasets';
import SearchByDataset from './pages/SearchByDataset';
import PageNotFound from './pages/PageNotFound';
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
