import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, Film, Trophy, Music, Plane } from 'lucide-react';

const categoryIcons = {
  movie: Film,
  sports: Trophy,
  concert: Music,
  travel: Plane
};

const getCategoryColor = (category) => {
  const colors = {
    movie: 'from-purple-500 to-pink-500',
    sports: 'from-green-500 to-blue-500',
    concert: 'from-yellow-500 to-red-500',
    travel: 'from-blue-500 to-indigo-500'
  };
  return colors[category] || 'from-gray-500 to-gray-600';
};

export default function ActivityCard({ activity, index, onClick }) {
  // Safety checks with fallback values
  if (!activity) {
    return null;
  }

  const IconComponent = categoryIcons[activity.category] || Film;
  const schedule = activity.schedule && activity.schedule.length > 0 ? activity.schedule[0] : null;
  const images = activity.images && Array.isArray(activity.images) ? activity.images : [];
  const venue = activity.venue || {};
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={activity.title || 'Activity'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute top-3 left-3 bg-gradient-to-r ${getCategoryColor(activity.category)} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1`}>
          <IconComponent size={14} />
          <span className="capitalize">{activity.category || 'Event'}</span>
        </div>
        {activity.rating && activity.rating > 0 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-sm flex items-center space-x-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>{activity.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {activity.title || 'Untitled Activity'}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {activity.description || 'No description available'}
        </p>

        {/* Schedule Info */}
        {schedule && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar size={14} className="mr-2" />
              <span>
                {schedule.date ? new Date(schedule.date).toLocaleDateString() : 'Date TBD'}
              </span>
              <Clock size={14} className="ml-4 mr-2" />
              <span>{schedule.time || 'Time TBD'}</span>
            </div>
            {venue.name && (
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={14} className="mr-2" />
                <span className="truncate">
                  {venue.name}{venue.city ? `, ${venue.city}` : ''}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Default info when no schedule */}
        {!schedule && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar size={14} className="mr-2" />
              <span>Schedule to be announced</span>
            </div>
            {venue.name && (
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={14} className="mr-2" />
                <span className="truncate">
                  {venue.name}{venue.city ? `, ${venue.city}` : ''}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-green-600">
            {schedule?.price?.regular ? (
              <>
                ₹{schedule.price.regular}
                <span className="text-sm text-gray-500 font-normal"> onwards</span>
              </>
            ) : (
              <span className="text-gray-500">Price TBD</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {schedule?.price?.regular ? 'Book Now' : 'View Details'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
