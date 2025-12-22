import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Activity,
  TrendingUp,
  Database,
  Compass,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Dashboard',
      color: 'from-sky-500 via-blue-500 to-indigo-600',
      glow: 'rgba(14, 165, 233, 0.3)',
    },
    {
      path: '/properties',
      icon: Database,
      label: 'My Properties',
      color: 'from-cyan-500 via-teal-500 to-emerald-600',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
    {
      path: '/properties/discover-more',
      icon: Compass,
          label: 'Discover More',
      color: 'from-blue-500 via-indigo-500 to-purple-600',
      glow: 'rgba(59, 130, 246, 0.3)',
    },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    const currentPath = location.pathname;
    
    // Exact match for root path
    if (item.path === '/') {
      return currentPath === '/';
    }
    
    // Exact match
    if (currentPath === item.path) {
      return true;
    }
    
    // For /properties, it should match /properties, /properties/new, /properties/:id, and /properties/:id/edit
    // But NOT /properties/discover-more
    if (item.path === '/properties') {
      return (
        currentPath === '/properties' ||
        currentPath === '/properties/new' ||
        (currentPath.startsWith('/properties/') && 
         !currentPath.startsWith('/properties/discover-more'))
      );
    }
    
    // For specific paths like /properties/discover-more
    // Only match exact path or paths that start with it followed by /
    if (item.path === '/properties/discover-more') {
      return currentPath === item.path || currentPath.startsWith(`${item.path}/`);
    }
    
    // Default: check if current path starts with item path followed by /
    return currentPath.startsWith(`${item.path}/`);
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible on lg+ */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl w-64 xl:w-72 flex-shrink-0 z-40 border-r border-sky-500/20">
      {/* Logo & Brand */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-b border-sky-500/20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 animate-pulse"></div>
        </div>

        <div className="flex items-center lg:gap-3 justify-center lg:justify-start relative z-10">
          <motion.div
            className="relative p-2.5 lg:p-2 bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-600 rounded-xl shadow-lg flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <Activity size={24} className="text-white relative z-10" />
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500"
              animate={{
                opacity: [0.5, 0, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
          <div className="hidden lg:block min-w-0 flex-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white via-sky-200 to-cyan-200 bg-clip-text text-transparent truncate">
              Inventory
            </h2>
            <p className="text-xs text-sky-300/80 truncate font-medium">
              Property Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-2 lg:px-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                  <Link to={item.path} className="block group relative">
                      <motion.div
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative"
                      >
                        {/* Active indicator line with glow */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 via-cyan-400 to-teal-500 rounded-r-full shadow-lg"
                            style={{
                              boxShadow: `0 0 10px ${item.glow}`,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}

                        <div
                          className={`relative flex items-center gap-3 px-3 lg:px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-sky-500/30 via-cyan-500/30 to-teal-500/30 text-white shadow-lg backdrop-blur-sm'
                              : 'text-gray-400 hover:text-white hover:bg-white/5 backdrop-blur-sm'
                          }`}
                          style={
                            isActive
                              ? {
                                  boxShadow: `0 4px 20px ${item.glow}`,
                                }
                              : {}
                          }
                        >
                          {/* Animated background for active state */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-teal-500/20 animate-pulse"
                              animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                              }}
                              transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            />
                          )}

                          {/* Icon with gradient background */}
                          <div
                            className={`relative flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                              isActive
                                ? `bg-gradient-to-br ${item.color} shadow-lg`
                                : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                            }`}
                          >
                            <Icon
                              size={20}
                              className={isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                            />

                            {/* Pulse animation for active item */}
                            {isActive && (
                              <motion.div
                                className={`absolute inset-0 rounded-lg bg-gradient-to-br ${item.color}`}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 0, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: 'easeOut',
                                }}
                              />
                            )}
                          </div>

                        {/* Label - Visible on desktop */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <span
                            className={`font-semibold text-sm truncate ${
                                isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>

                        {/* Active indicator dot */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 shadow-lg relative z-10"
                            style={{
                              boxShadow: `0 0 10px ${item.glow}`,
                            }}
                          />
                        )}
                      </div>

                      {/* Hover effect overlay */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-10`} />
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Stats Section */}
        <div className="flex-shrink-0 p-3 lg:p-4 border-t border-sky-500/20">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-xl p-3 lg:p-4 cursor-pointer group backdrop-blur-sm border border-sky-500/20 overflow-hidden"
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-sky-500/20"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <div className="flex items-center lg:gap-3 justify-center lg:justify-start relative z-10">
              <motion.div
                className="flex-shrink-0 p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-md"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp size={18} className="text-white" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-sky-300/70 truncate font-medium">
                  System Status
                </p>
                <p className="text-sm font-bold text-emerald-400 truncate flex items-center gap-1">
                  <motion.span
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  All Systems Online
                </p>
                          </div>
                        </div>
                      </motion.div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 lg:p-4 border-t border-sky-500/20">
          <div className="text-left">
            <p className="text-xs font-semibold text-sky-300/60 truncate">
              Version 1.0.0
            </p>
            <p className="text-[10px] text-sky-400/40 mt-1 truncate">
              © 2024 Wanyumba Inventory
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer - Slides in from left */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-0 left-0 h-screen w-72 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50 border-r border-sky-500/20"
          >
            {/* Logo & Brand with Close Button */}
            <div className="flex-shrink-0 p-4 border-b border-sky-500/20 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 animate-pulse"></div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="relative p-2 bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-600 rounded-xl shadow-lg flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Activity size={24} className="text-white relative z-10" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white via-sky-200 to-cyan-200 bg-clip-text text-transparent">
                      Inventory
                    </h2>
                    <p className="text-xs text-sky-300/80 font-medium">
                      Property Manager
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-300" />
                </motion.button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 overflow-y-auto overflow-x-hidden">
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item);

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className="block group relative"
                      >
                      <motion.div
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative"
                      >
                        {/* Active indicator line with glow */}
                        {isActive && (
                          <motion.div
                              layoutId="activeIndicatorMobile"
                            className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 via-cyan-400 to-teal-500 rounded-r-full shadow-lg"
                            style={{
                              boxShadow: `0 0 10px ${item.glow}`,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}

                        <div
                            className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-sky-500/30 via-cyan-500/30 to-teal-500/30 text-white shadow-lg backdrop-blur-sm'
                              : 'text-gray-400 hover:text-white hover:bg-white/5 backdrop-blur-sm'
                          }`}
                          style={
                            isActive
                              ? {
                                  boxShadow: `0 4px 20px ${item.glow}`,
                                }
                              : {}
                          }
                        >
                          {/* Animated background for active state */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-teal-500/20 animate-pulse"
                              animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                              }}
                              transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            />
                          )}

                          {/* Icon with gradient background */}
                          <div
                            className={`relative flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                              isActive
                                ? `bg-gradient-to-br ${item.color} shadow-lg`
                                : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                            }`}
                          >
                            <Icon
                              size={20}
                              className={isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                            />

                            {/* Pulse animation for active item */}
                            {isActive && (
                              <motion.div
                                className={`absolute inset-0 rounded-lg bg-gradient-to-br ${item.color}`}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 0, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: 'easeOut',
                                }}
                              />
                            )}
                          </div>

                            {/* Label - Always visible on mobile drawer */}
                            <div className="flex flex-col flex-1 min-w-0">
                            <span
                              className={`font-semibold text-sm truncate ${
                                isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>

                          {/* Active indicator dot */}
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 shadow-lg relative z-10"
                              style={{
                                boxShadow: `0 0 10px ${item.glow}`,
                              }}
                            />
                          )}
                        </div>

                        {/* Hover effect overlay */}
                        {!isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-10`} />
                          </motion.div>
                        )}
                      </motion.div>
                                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Stats Section */}
            <div className="flex-shrink-0 p-4 border-t border-sky-500/20">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
                className="relative bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-xl p-4 cursor-pointer group backdrop-blur-sm border border-sky-500/20 overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-sky-500/20"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
                <div className="flex items-center gap-3 relative z-10">
            <motion.div
              className="flex-shrink-0 p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-md"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <TrendingUp size={18} className="text-white" />
            </motion.div>
                  <div className="flex-1 min-w-0">
              <p className="text-xs text-sky-300/70 truncate font-medium">
                System Status
              </p>
              <p className="text-sm font-bold text-emerald-400 truncate flex items-center gap-1">
                <motion.span
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                All Systems Online
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-sky-500/20">
              <div className="text-left">
                <p className="text-xs font-semibold text-sky-300/60 truncate">
                  Version 1.0.0
          </p>
                <p className="text-[10px] text-sky-400/40 mt-1 truncate">
            © 2024 Wanyumba Inventory
          </p>
        </div>
      </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
