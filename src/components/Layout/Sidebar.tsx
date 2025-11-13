import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Package,
  Settings,
  BarChart3,
  Activity,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Database,
  Compass,
  Plus,
  Shield,
  CheckCircle,
  ClipboardList,
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['properties', 'admin']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

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
      icon: Package,
      label: 'Properties',
      color: 'from-cyan-500 via-teal-500 to-emerald-600',
      glow: 'rgba(6, 182, 212, 0.3)',
      subItems: [
        {
          path: '/properties',
          label: 'My Properties',
          icon: Database,
        },
        {
          path: '/properties/new',
          label: 'Add Property',
          icon: Plus,
        },
        {
          path: '/properties/discover-more',
          label: 'Discover More',
          icon: Compass,
        },
      ],
    },
    {
      path: '/admin',
      icon: Shield,
      label: 'Admin',
      color: 'from-purple-500 via-pink-500 to-rose-600',
      glow: 'rgba(168, 85, 247, 0.3)',
      subItems: [
        {
          path: '/admin/properties',
          label: 'Manage Properties',
          icon: ClipboardList,
        },
        {
          path: '/admin/properties/pending',
          label: 'Pending Approval',
          icon: CheckCircle,
        },
      ],
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
      color: 'from-teal-500 via-cyan-500 to-blue-600',
      glow: 'rgba(20, 184, 166, 0.3)',
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      color: 'from-slate-500 via-gray-500 to-slate-600',
      glow: 'rgba(100, 116, 139, 0.3)',
    },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.subItems) {
      return item.subItems.some(
        (subItem) => location.pathname === subItem.path
      ) || location.pathname.startsWith(item.path + '/');
    }
    return (
      location.pathname === item.path ||
      (item.path !== '/' && location.pathname.startsWith(item.path))
    );
  };

  const isSubItemActive = (subItemPath: string) => {
    return location.pathname === subItemPath;
  };

  return (
    <aside className="fixed top-0 left-0 h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 w-20 lg:w-64 xl:w-72 flex-shrink-0 z-40 border-r border-sky-500/20">
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
            const isExpanded = expandedItems.includes(item.path);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Main Item */}
                <div className="relative">
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpanded(item.path)}
                      className="w-full group relative"
                    >
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

                          {/* Label - Hidden on mobile, visible on lg+ */}
                          <div className="hidden lg:flex flex-col flex-1 min-w-0 items-start">
                            <span
                              className={`font-semibold text-sm truncate text-left ${
                                isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>

                          {/* Expand/Collapse Icon */}
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronDown size={14} className={`lg:w-4 lg:h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            ) : (
                              <ChevronRight size={14} className={`lg:w-4 lg:h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </button>
                  ) : (
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

                          {/* Label - Hidden on mobile, visible on lg+ */}
                          <div className="hidden lg:flex flex-col flex-1 min-w-0">
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
                              className="hidden lg:block w-2 h-2 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 shadow-lg relative z-10"
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

                      {/* Tooltip for collapsed state */}
                      <div className="lg:hidden absolute left-full ml-4 px-3 py-2 bg-slate-800/95 backdrop-blur-sm text-white text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 top-1/2 -translate-y-1/2 border border-sky-500/20">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                      </div>
                    </Link>
                  )}

                  {/* Sub-menu Items */}
                  {hasSubItems && (
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 lg:ml-8 mt-2 space-y-1 border-l-2 border-sky-500/20 pl-1 lg:pl-4">
                            {item.subItems.map((subItem) => {
                              const isSubActive = isSubItemActive(subItem.path);
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  className="block group relative"
                                >
                                  <motion.div
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex items-center justify-center lg:justify-start gap-3 lg:gap-4 px-2 lg:px-5 py-3 lg:py-4 rounded-xl transition-all duration-200 ${
                                      isSubActive
                                        ? 'bg-sky-500/20 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                  >
                                    {SubIcon && (
                                      <SubIcon
                                        size={18}
                                        className={`flex-shrink-0 ${
                                          isSubActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                        }`}
                                      />
                                    )}
                                    <span className="text-sm font-medium hidden lg:block">
                                      {subItem.label}
                                    </span>
                                  </motion.div>
                                  {/* Tooltip for mobile */}
                                  <div className="lg:hidden absolute left-full ml-4 px-3 py-2 bg-slate-800/95 backdrop-blur-sm text-white text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 top-1/2 -translate-y-1/2 border border-sky-500/20">
                                    {subItem.label}
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
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
            <div className="hidden lg:block flex-1 min-w-0">
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
        <div className="text-center lg:text-left">
          <p className="text-[10px] lg:text-xs font-semibold text-sky-300/60 truncate">
            <span className="hidden lg:inline">Version </span>1.0.0
          </p>
          <p className="hidden lg:block text-[10px] text-sky-400/40 mt-1 truncate">
            © 2024 Wanyumba Inventory
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
