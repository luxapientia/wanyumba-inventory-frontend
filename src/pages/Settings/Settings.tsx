import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-sky-900 to-cyan-900 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Manage your account settings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
          <p className="text-sm text-gray-500">Manage your personal information</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
          <p className="text-sm text-gray-500">Configure notification preferences</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
          <p className="text-sm text-gray-500">Update password and security settings</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="text-center py-12">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          </motion.div>
          <p className="text-gray-500">Settings configuration coming soon...</p>
        </div>
      </motion.div>
    </div>
  );
}
