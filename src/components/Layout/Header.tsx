import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === '/' || pathname === '') return 'Dashboard';
  if (pathname === '/properties') return 'My Properties';
  if (pathname.includes('/properties/') && pathname.includes('/edit')) return 'Edit Property';
  if (pathname.includes('/properties/') && !pathname.includes('/edit') && !pathname.includes('/discover-more')) return 'Property Details';
  if (pathname === '/properties/discover-more') return 'Discover More';
  if (pathname === '/admin/properties') return 'Manage Properties';
  if (pathname === '/admin/properties/pending') return 'Pending Approval';
  if (pathname.includes('/admin/properties/')) return 'Property Details';
  if (pathname === '/analytics') return 'Analytics';
  if (pathname === '/settings') return 'Settings';
  return 'Inventory';
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <motion.button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-gray-700" />
        </motion.button>

        {/* Page Title */}
        <motion.h1
          className="text-xl sm:text-2xl font-bold text-gray-900 flex-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {pageTitle}
        </motion.h1>
      </div>
    </header>
  );
};

export default Header;
