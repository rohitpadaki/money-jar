import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import HoneyJarIcon from '../components/HoneyJarIcon';
import api from '../api';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [usernameError, setUsernameError] = useState(null); // Added for potential username validation feedback
  const navigate = useNavigate();

  // Password validation regex and messages
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
  const passwordRequirements = [
    '8-16 characters long',
    'at least one uppercase letter',
    'at least one lowercase letter',
    'at least one number',
    'at least one special character'
  ];

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 8 || password.length > 16) {
      return 'Password must be 8-16 characters long.';
    }
    if (!passwordRegex.test(password)) {
      return `Password must contain ${passwordRequirements.slice(1).join(', ')}.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordError(null);
    setUsernameError(null);

    // Client-side validation for matching passwords
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    // Client-side validation for password complexity
    const clientPasswordError = validatePassword(formData.password);
    if (clientPasswordError) {
      setPasswordError(clientPasswordError);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        username: formData.username, // backend expects "username"
        name: formData.name,
        password: formData.password,
      });

      if (response.data && response.data.user) {
        // Registration succeeded, redirect to login (or auto-login, up to you)
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      // Check if the error response contains validation messages from the backend
      const backendErrors = err.response?.data?.message;

      if (Array.isArray(backendErrors)) {
        // Handle an array of error messages (common with class-validator)
        let displayError = '';
        backendErrors.forEach(msg => {
          if (msg.includes('password')) { // Look for password-related errors
            setPasswordError(msg);
          } else if (msg.includes('username')) { // Look for username-related errors
            setUsernameError(msg);
          } else {
            displayError += msg + ' ';
          }
        });
        if (displayError) setError(displayError.trim());
        if (!passwordError && !usernameError && !displayError) {
          setError("An error occurred during registration. Please check your inputs.");
        }
      } else if (typeof backendErrors === 'string') {
        // Handle a single string error message
        if (backendErrors.includes('password')) {
          setPasswordError(backendErrors);
        } else if (backendErrors.includes('username')) {
          setUsernameError(backendErrors);
        } else {
          setError(backendErrors);
        }
      } else {
        // Fallback for other error formats
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Client-side validation feedback as user types (optional, but good UX)
    if (name === 'password') {
      const errorMsg = validatePassword(value);
      setPasswordError(errorMsg);
    }
    // You could add similar validation for username if needed
    if (name === 'username') {
        setUsernameError(null); // Clear username error when typing, re-validate on submit
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex justify-center">
            <HoneyJarIcon size={80} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Your Money Jar</h2>
          <p className="mt-2 text-gray-600">Join the sweetest way to split expenses</p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-honey-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="input-field !pl-10"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Create a Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-honey-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  required
                  className="input-field !pl-10"
                  placeholder="Enter your Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              {usernameError && <p className="mt-1 text-sm text-red-600">{usernameError}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-honey-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field !pl-10 !pr-10"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-honey-400 hover:text-honey-600 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-honey-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field !pl-10 !pr-10"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-honey-400 hover:text-honey-600 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center btn-primary py-3 text-base"
            >
              Create your jar
            </button>
            {error && <div className="mt-3 text-red-500">{error}</div>}
          </div>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-honey-600 hover:text-honey-500">
              Sign in to your hive
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;