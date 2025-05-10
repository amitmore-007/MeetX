import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';

// Helper function to extract date and time components
const getDateParts = (dateString) => {
  if (!dateString) return { day: '--', month: '--', time: '--:--' };
  
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.toLocaleString('en-US', { month: 'short' }),
    time: date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

export default function ActivitiesList({ activities, onBookActivity }) {
  return (
    <motion.div
      key="activities"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {activities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-4 text-gray-400"
          >
            <Calendar size={48} className="mx-auto" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-700">No activities available</h3>
          <p className="text-gray-500 mt-2">Check back later for new activities</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const dateParts = getDateParts(activity.date);
            return (
              <motion.div
                key={activity._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Calendar size={20} />
                      <span className="font-medium">{dateParts.month} {dateParts.day}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={20} />
                      <span>{dateParts.time}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  {activity.location && (
                    <div className="flex items-center space-x-2 mb-4 text-gray-600">
                      <MapPin size={16} className="text-blue-500" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onBookActivity(activity)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus size={18} />
                    <span>Book Now</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}