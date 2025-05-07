import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  LogOut, 
  Clock, 
  User, 
  Bookmark, 
  Activity, 
  X, 
  Check, 
  Plus,
  Bell,
  MapPin,
} from 'lucide-react';
import API from '../api';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();
  
  const tabRef = useRef(null);
  
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await API.get('/activities');
      setActivities(res.data);
    } catch (error) {
      showNotification('Failed to fetch activities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch (error) {
      showNotification('Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bookActivity = async (activityId) => {
    try {
      await API.post('/bookings', { activityId });
      fetchBookings();
      showNotification('Activity booked successfully!', 'success');
      setShowBookingModal(false);
    } catch (error) {
      showNotification('Failed to book activity', 'error');
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

  const handleOpenBookingModal = (activity) => {
    setSelectedActivity(activity);
    setShowBookingModal(true);
  };

  const filteredActivities = activities.filter(activity => 
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchActivities();
    fetchBookings();
    
    // Auto-scroll tab indicator on tab change
    if (tabRef.current) {
      const activeTabElement = document.querySelector(`[data-tab="${activeTab}"]`);
      if (activeTabElement) {
        const tabLeft = activeTabElement.offsetLeft;
        const tabWidth = activeTabElement.offsetWidth;
        tabRef.current.style.left = `${tabLeft}px`;
        tabRef.current.style.width = `${tabWidth}px`;
      }
    }
  }, [activeTab, navigate]);

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

  // Extract date and time components
  const getDateParts = (dateString) => {
    if (!dateString) return { day: '--', month: '--', time: '--:--' };
    
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('en-US', { month: 'short' }),
      time: date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <Activity className="text-blue-600" size={24} />
          <h1 className="text-xl font-bold text-gray-800">ActivityHub</h1>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {bookings.length}
            </span>
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
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800">Welcome back!</h2>
          <p className="text-gray-600">Discover and book amazing activities.</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button className="absolute right-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex border-b border-gray-300 relative">
            <button
              data-tab="activities"
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-3 font-medium text-sm transition-all duration-300 ${activeTab === 'activities' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <Activity size={18} />
                <span>Activities</span>
              </div>
            </button>
            <button
              data-tab="bookings"
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 font-medium text-sm transition-all duration-300 ${activeTab === 'bookings' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <Bookmark size={18} />
                <span>My Bookings</span>
              </div>
            </button>
            <div 
              ref={tabRef}
              className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'activities' && !loading && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredActivities.length === 0 ? (
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
                  {filteredActivities.map((activity, index) => {
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
                            onClick={() => handleOpenBookingModal(activity)}
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
          )}

          {activeTab === 'bookings' && !loading && (
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
                              onClick={() => cancelBooking(booking._id)}
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
          )}
        </AnimatePresence>
      </div>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {showBookingModal && selectedActivity && (
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
                  <h4 className="text-lg font-bold text-gray-800">{selectedActivity.title}</h4>
                  <p className="text-gray-600 text-sm">{formatDate(selectedActivity.date)}</p>
                  {selectedActivity.location && (
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <MapPin size={14} className="text-blue-500" />
                      <span>{selectedActivity.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => bookActivity(selectedActivity._id)}
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
              <X size={18} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}