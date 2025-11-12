import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts';
import ToastContainer from './components/Toast/ToastContainer';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Properties } from './pages/Properties';
import DiscoverMore from './pages/Properties/DiscoverMore';
import AddProperty from './pages/Properties/AddProperty';
import EditProperty from './pages/Properties/EditProperty';
import PropertyDetail from './pages/Properties/PropertyDetail';
import { Search } from './pages/Search';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/new" element={<AddProperty />} />
            <Route path="properties/:id/edit" element={<EditProperty />} />
            <Route path="properties/:id" element={<PropertyDetail />} />
            <Route path="properties/discover-more" element={<DiscoverMore />} />
            <Route path="search" element={<Search />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
