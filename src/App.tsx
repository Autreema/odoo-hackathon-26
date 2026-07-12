import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import VehicleList from './pages/Vehicles/VehicleList';
import DriverList from './pages/Drivers/DriverList';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
        {/* Sidebar Left */}
        <Sidebar />

        {/* Content Right */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar Header */}
          <Topbar />

          {/* Main scrollable body */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
            <Routes>
              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/vehicles" replace />} />
              <Route path="/dashboard" element={<Navigate to="/vehicles" replace />} />
              
              {/* CRUD Routes */}
              <Route path="/vehicles" element={<VehicleList />} />
              <Route path="/drivers" element={<DriverList />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/vehicles" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
