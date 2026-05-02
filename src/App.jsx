import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TrackingList from './pages/TrackingList';
import AlumniDetail from './pages/AlumniDetail';
import AlumniTeridentifikasi from './pages/AlumniTeridentifikasi';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="tracking" element={<TrackingList />} />
          <Route path="tracking/:id" element={<AlumniDetail />} />
          <Route path="teridentifikasi" element={<AlumniTeridentifikasi />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
