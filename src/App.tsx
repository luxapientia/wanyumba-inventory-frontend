import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts';
import ToastContainer from './components/Toast/ToastContainer';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Properties } from './pages/Properties';
import AddProperty from './pages/Properties/AddProperty';
import DiscoverMore from './pages/Properties/DiscoverMore';
import EditProperty from './pages/Properties/EditProperty';
import PropertyDetail from './pages/Properties/PropertyDetail';
import { ManageProperties, PendingApproval, AdminPropertyDetail } from './pages/Admin';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { ChatButton } from './components/Chat/ChatButton';

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
            <Route path="admin/properties" element={<ManageProperties />} />
            <Route path="admin/properties/pending" element={<PendingApproval />} />
            <Route path="admin/properties/:id" element={<AdminPropertyDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <ToastContainer />
        <ChatButton />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
