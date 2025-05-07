// src/pages/Login.jsx
import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      
      // Add success animation before navigating
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      setIsLoading(false);
      // You can add error handling here
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-indigo-500" />
              </div>
              <motion.input 
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                placeholder="Email" 
                type="email" 
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-500" />
              </div>
              <motion.input 
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                placeholder="Password" 
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-500 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRight className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" />
                </span>
                Sign in
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;