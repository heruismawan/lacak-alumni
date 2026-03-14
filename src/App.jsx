import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InputAlumni from './pages/InputAlumni';
import TrackingList from './pages/TrackingList';
import Evidence from './pages/Evidence';
import History from './pages/History';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="input" element={<InputAlumni />} />
        <Route path="tracking" element={<TrackingList />} />
        <Route path="evidence" element={<Evidence />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App;
