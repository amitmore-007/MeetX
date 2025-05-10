import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  LogOut, 
  Bell,
  Bookmark,
  Check
} from 'lucide-react';
import API from '../api';
import ActivitiesList from './ActivitiesList';
import BookingsList from './BookingsList';
import BookingModal from './BookingModal';

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
            <ActivitiesList 
              activities={filteredActivities} 
              onBookActivity={handleOpenBookingModal} 
            />
          )}

          {activeTab === 'bookings' && !loading && (
            <BookingsList 
              bookings={bookings} 
              onCancelBooking={cancelBooking} 
            />
          )}
        </AnimatePresence>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBookingModal}
        activity={selectedActivity}
        onClose={() => setShowBookingModal(false)}
        onConfirm={() => selectedActivity && bookActivity(selectedActivity._id)}
      />

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