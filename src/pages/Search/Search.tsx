import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Input } from '../../components/UI/index.js';
import Button from '../../components/UI/Button.js';

export default function Search() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-sky-900 to-cyan-900 bg-clip-text text-transparent">
          Search
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Search and filter properties</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search properties by title, address, or description..."
                icon={<SearchIcon size={18} className="text-gray-400" />}
                iconPosition="left"
                fullWidth
                className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-sky-400 focus:ring-sky-200"
              />
            </div>
            <Button leftIcon={<Filter size={18} />} variant="secondary">
              Filters
            </Button>
          </div>
          <div className="text-center py-12 text-gray-500">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Start typing to search properties...</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
