import { motion } from 'framer-motion';
import { Package, Plus } from 'lucide-react';
import Button from '../../components/UI/Button.js';

export default function Properties() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-sky-900 to-cyan-900 bg-clip-text text-transparent">
            Properties
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your property inventory
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-12 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="text-center py-16">
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
            <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No properties yet
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first property
          </p>
          <Button
            as="link"
            to="/properties/new"
            leftIcon={<Plus size={18} />}
            variant="primary"
          >
            Create First Property
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

