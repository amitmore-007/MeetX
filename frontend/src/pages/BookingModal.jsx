import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Check } from 'lucide-react';

export default function BookingModal({ isOpen, activity, onClose, onConfirm }) {
  if (!activity) return null;

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
          >
            <div className="bg-blue-600 p-4 text-white">
              <h3 className="text-lg font-bold">Confirm Booking</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Are you sure you want to book:</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-bold text-gray-800">{activity.title}</h4>
                <p className="text-gray-600 text-sm">{formatDate(activity.date)}</p>
                {activity.location && (
                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <MapPin size={14} className="text-blue-500" />
                    <span>{activity.location}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <Check size={18} />
                  <span>Confirm</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}