import { Bell, User, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../UI/index.js';
import Button from '../UI/Button.js';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
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

        {/* Search Bar */}
        <motion.div
          className="flex-1 max-w-2xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search properties, inventory..."
              icon={<Search size={18} className="text-gray-400" />}
              iconPosition="left"
              fullWidth
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-sky-400 focus:ring-sky-200"
            />
          </div>
        </motion.div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2.5"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-600" />
            <motion.span
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full ring-2 ring-white shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </Button>

          {/* User Profile */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 pl-3 border-l border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <motion.div
              className="relative w-10 h-10 bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 rounded-full flex items-center justify-center ring-2 ring-gray-200 flex-shrink-0 shadow-lg cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={20} className="text-white" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
