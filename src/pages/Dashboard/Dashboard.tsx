import {
  Package,
  TrendingUp,
  Eye,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Sparkles,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/UI/Button.js';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  gradient: string;
  delay?: number;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  gradient,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden card-hover">
        {/* Gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-cyan-100/50 rounded-bl-full opacity-50" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {change && (
              <motion.p
                className="text-sm text-green-600 flex items-center gap-1 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
              >
                <ArrowUpRight size={14} />
                {change}
              </motion.p>
            )}
          </div>
          <motion.div
            className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-sky-900 to-cyan-900 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>
        <Button
          as="link"
          to="/properties/new"
          leftIcon={<Plus size={20} />}
          size="lg"
        >
          New Property
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={0}
          change="+12% from last month"
          icon={Package}
          gradient="from-sky-500 to-blue-600"
          delay={0.1}
        />
        <StatCard
          title="Active Properties"
          value={0}
          change="+5 new this week"
          icon={TrendingUp}
          gradient="from-cyan-500 to-teal-600"
          delay={0.2}
        />
        <StatCard
          title="Total Views"
          value={0}
          change="+23% increase"
          icon={Eye}
          gradient="from-blue-500 to-cyan-600"
          delay={0.3}
        />
        <StatCard
          title="Inquiries"
          value={0}
          change="+8 new messages"
          icon={MessageSquare}
          gradient="from-teal-500 to-emerald-600"
          delay={0.4}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Sparkles className="w-5 h-5 text-sky-500" />
          </div>
          <div className="space-y-4">
            <div className="text-center py-12 text-gray-500">
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
                <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              </motion.div>
              <p className="text-sm">No recent activity</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
            <Sparkles className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="space-y-3">
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/properties/new"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-sky-500 hover:bg-sky-50/50 transition-all duration-300 group"
              >
                <div className="p-2.5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Create New Property</p>
                  <p className="text-sm text-gray-500">Add a new property</p>
                </div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/properties"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50/50 transition-all duration-300 group"
              >
                <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">View All Properties</p>
                  <p className="text-sm text-gray-500">Manage your inventory</p>
                </div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/properties/discover-more"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50/50 transition-all duration-300 group"
              >
                <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Discover More</p>
                  <p className="text-sm text-gray-500">Explore new properties</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
