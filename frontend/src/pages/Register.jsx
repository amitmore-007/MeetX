import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); 
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validation rules
  const validateName = (name) => {
    if (!name) return 'Name is required';
    // Only letters and spaces allowed
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) return 'Name can only contain letters and spaces';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name must be less than 50 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    // Exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-()]/g, ''))) 
      return 'Phone number must be exactly 10 digits';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  // Validate current step
  const validateStep = (stepNum) => {
    const newErrors = {};
    
    if (stepNum === 1) {
      const nameError = validateName(form.name);
      const emailError = validateEmail(form.email);
      
      if (nameError) newErrors.name = nameError;
      if (emailError) newErrors.email = emailError;
    } else if (stepNum === 2) {
      const phoneError = validatePhone(form.phone);
      const passwordError = validatePassword(form.password);
      
      if (phoneError) newErrors.phone = phoneError;
      if (passwordError) newErrors.password = passwordError;
    }
    
    return newErrors;
  };

  // Field validation on blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    let validationError = '';
    switch (field) {
      case 'name':
        validationError = validateName(form.name);
        break;
      case 'email':
        validationError = validateEmail(form.email);
        break;
      case 'phone':
        validationError = validatePhone(form.phone);
        break;
      case 'password':
        validationError = validatePassword(form.password);
        break;
      default:
        break;
    }
    
    if (validationError) {
      setErrors(prev => ({ ...prev, [field]: validationError }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle field change
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Only validate on change if the field has been touched and has an error
    if (touched[field] && errors[field]) {
      handleBlur(field);
    }
  };

  // Next step with validation
  const nextStep = (e) => {
    e.preventDefault();
    const stepErrors = validateStep(1);
    
    if (Object.keys(stepErrors).length === 0) {
      setStep(2);
      setErrors({});
    } else {
      setErrors(stepErrors);
      // Mark all fields as touched to show errors
      setTouched({ ...touched, name: true, email: true });
    }
  };

  // Form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep(2);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setTouched({ ...touched, phone: true, password: true });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await API.post('/auth/register', form);
      // Success animation
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      
      // Handle validation errors from server
      if (error.response && error.response.data && error.response.data.errors) {
        // Convert array of errors to object with field names as keys
        const newErrors = error.response.data.errors.reduce((acc, curr) => {
          acc[curr.field] = curr.message;
          return acc;
        }, {});
        setErrors(newErrors);
        
        // If error is in step 1 fields, go back to step 1
        if (newErrors.name || newErrors.email) {
          setStep(1);
        }
      } else {
        // Handle other errors (like email already exists)
        setErrors({ general: error.response?.data?.msg || 'Registration failed' });
      }
    }
  };

  // Helper function to get error for a field
  const getError = (field) => errors[field];

  // Form steps animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // Error message component - removed animation to keep it static
  const ErrorMessage = ({ error }) => (
    <div className="flex items-center mt-1 text-sm text-red-600">
      <AlertCircle className="h-4 w-4 mr-1" />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl"
      >
        {/* General error message - removed animation */}
        {errors.general && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errors.general}
          </div>
        )}
        
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-600">Join our community today</p>
        </div>
        
        {/* Progress indicator */}
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold inline-block text-purple-600">
              Step {step} of 2
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {step === 1 ? '50%' : '100%'}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-purple-100">
            <motion.div 
              initial={{ width: "50%" }}
              animate={{ width: step === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.5 }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-indigo-600"
            ></motion.div>
          </div>
        </div>

        {step === 1 ? (
          <motion.form 
            key="step1"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-8 space-y-6"
            onSubmit={nextStep}
            noValidate
          >
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-purple-500" />
                  </div>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    placeholder="Full Name" 
                    required
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`pl-10 w-full px-4 py-3 border ${getError('name') ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                {getError('name') && <ErrorMessage error={getError('name')} />}
              </div>
              
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-500" />
                  </div>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    placeholder="Email" 
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`pl-10 w-full px-4 py-3 border ${getError('email') ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                {getError('email') && <ErrorMessage error={getError('email')} />}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Continue
              <span className="absolute right-3 inset-y-0 flex items-center">
                <ArrowRight className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
              </span>
            </motion.button>
          </motion.form>
        ) : (
          <motion.form 
            key="step2"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-5 w-5 text-purple-500" />
                  </div>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    placeholder="Phone Number" 
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className={`pl-10 w-full px-4 py-3 border ${getError('phone') ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                {getError('phone') && <ErrorMessage error={getError('phone')} />}
              </div>
              
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-500" />
                  </div>
                  <motion.input 
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    placeholder="Password" 
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`pl-10 w-full px-4 py-3 border ${getError('password') ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {getError('password') && <ErrorMessage error={getError('password')} />}
              </div>
            </div>

            <div className="flex items-center">
              <input 
                id="terms" 
                name="terms" 
                type="checkbox" 
                required 
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" 
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="text-purple-600 hover:text-purple-500">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>
              </label>
            </div>

            <div className="flex space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
                className="flex-1 group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Register
                    <span className="absolute right-3 inset-y-0 flex items-center">
                      <Check className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;