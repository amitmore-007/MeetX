import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  LogOut, 
  Bell,
  Bookmark,
  Check,
  XCircle,
  Film,
  Music,
  Plane,
  Trophy,
  MapPin,
  Calendar,
  Search
} from 'lucide-react';
import API from '../api';
import ActivityCard from '../components/ActivityCard';
import BookingsList from './BookingsList';

const categories = [
  { id: 'all', name: 'All', icon: Activity },
  { id: 'movie', name: 'Movies', icon: Film },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'concert', name: 'Music', icon: Music },
  { id: 'travel', name: 'Travel', icon: Plane },
];

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('activities');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCity) params.append('city', selectedCity);
      
      const res = await API.get(`/activities?${params}`);
      
      // Handle different response structures
      if (res.data && Array.isArray(res.data)) {
        // Old API structure - direct array
        setActivities(res.data);
        setTotalPages(1);
      } else if (res.data && res.data.activities && Array.isArray(res.data.activities)) {
        // New API structure - object with activities array
        setActivities(res.data.activities);
        setTotalPages(res.data.totalPages || 1);
      } else {
        // Fallback - empty array
        setActivities([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Fetch activities error:', error);
      setActivities([]); // Set empty array on error
      setTotalPages(1);
      showNotification('Failed to fetch activities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings');
      
      // Handle response structure safely
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      setBookings([]); // Set empty array on error
      showNotification('Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);
      fetchBookings();
      showNotification('Booking canceled successfully!', 'success');
    } catch (error) {
      showNotification('Failed to cancel booking', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => navigate('/login'), 1500);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleActivityClick = (activity) => {
    navigate(`/activity/${activity._id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (activeTab === 'activities') {
      fetchActivities();
    } else {
      fetchBookings();
    }
  }, [activeTab, selectedCategory, searchTerm, selectedCity, currentPage, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Enhanced Navbar */}
      <nav className="bg-white shadow-lg px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">TicketHub</h1>
              <p className="text-xs text-gray-500">Your Gateway to Entertainment</p>
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer"
            >
              <Bell size={20} className="text-gray-600" />
              {bookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {bookings.length}
                </span>
              )}
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-300"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Discover Amazing Experiences</h2>
          <p className="text-gray-600 text-lg">Movies, Sports, Concerts, Travel & More</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex border-b border-gray-300 justify-center">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-8 py-3 font-medium text-lg transition-all duration-300 ${
                activeTab === 'activities' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Activity size={20} />
                <span>Explore</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-8 py-3 font-medium text-lg transition-all duration-300 ${
                activeTab === 'bookings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bookmark size={20} />
                <span>My Bookings</span>
              </div>
            </button>
          </div>
        </motion.div>

        {activeTab === 'activities' && (
          <>
            {/* Filters */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 space-y-4"
            >
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search movies, events, travel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>

              {/* Category Filters */}
              <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                      }`}
                    >
                      <IconComponent size={18} />
                      <span className="font-medium">{category.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* City Filter */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-md">
                  <MapPin size={18} className="text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="border-none outline-none bg-transparent text-gray-600"
                  >
                    <option value="">All Cities</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Activities Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                >
                  {activities && activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <ActivityCard
                        key={activity._id || index}
                        activity={activity}
                        index={index}
                        onClick={() => handleActivityClick(activity)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-lg">No activities found</p>
                      <p className="text-gray-400">Try adjusting your filters</p>
                    </div>
                  )}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-full transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'bookings' && !loading && (
          <BookingsList 
            bookings={bookings} 
            onCancelBooking={cancelBooking} 
          />
        )}
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white flex items-center space-x-2`}
          >
            {notification.type === 'success' ? (
              <Check size={18} />
            ) : (
              <XCircle size={18} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}