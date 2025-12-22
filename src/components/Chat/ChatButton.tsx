import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from './ChatWindow.js';
import { useLocation } from 'react-router-dom';

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getFunnelStage = (): 'listing' | 'managing' | 'awareness' => {
    if (location.pathname.includes('/properties/new') || location.pathname.includes('/properties/edit')) {
      return 'listing';
    }
    if (location.pathname.includes('/properties') || location.pathname.includes('/dashboard')) {
      return 'managing';
    }
    return 'awareness';
  };

  const getCurrentPage = (): string => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/properties/new')) return 'add-property';
    if (path.includes('/properties/edit')) return 'edit-property';
    if (path.includes('/properties/')) return 'property-detail';
    if (path.includes('/properties')) return 'properties-list';
    if (path.includes('/discover-more')) return 'discover-more';
    return 'unknown';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg z-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Open AI Butler"
        title="AI Butler - Get Help"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        role="landlord"
        funnelStage={getFunnelStage()}
        currentPage={getCurrentPage()}
      />
    </>
  );
};

