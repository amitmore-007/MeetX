import { motion } from 'framer-motion';
import { Bookmark, MapPin, X } from 'lucide-react';

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

export default function BookingsList({ bookings, onCancelBooking }) {
  return (
    <motion.div
      key="bookings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-4 text-gray-400"
          >
            <Bookmark size={48} className="mx-auto" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-700">No bookings made yet</h3>
          <p className="text-gray-500 mt-2">Browse activities and book something exciting</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => {
            // Check if booking.activity exists before accessing its properties
            if (!booking || !booking.activity) {
              return null; // Skip rendering this booking
            }
            
            return (
              <motion.div
                key={booking._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white md:w-32 md:h-32 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{getDateParts(booking.activity.date).day}</span>
                    <span className="text-sm uppercase">{getDateParts(booking.activity.date).month}</span>
                    <span className="text-xs mt-2">{getDateParts(booking.activity.date).time}</span>
                  </div>
                  <div className="p-5 flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{booking.activity.title}</h3>
                    <p className="text-gray-600">{booking.activity.description}</p>
                    {booking.activity.location && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin size={16} className="text-green-500" />
                        <span>{booking.activity.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCancelBooking(booking._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}