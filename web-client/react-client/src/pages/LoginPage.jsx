import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import HoneyJarIcon from '../components/HoneyJarIcon';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/auth/login", {
        username: username, // backend expects "username"
        password,
      });

      if (response.data && response.data.access_token) {
        login(response.data.access_token); 
        // Store the JWT token
        localStorage.setItem('authToken', response.data.access_token);
        navigate('/dashboard');
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something is wrong, try again."
      );
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to Money Jar</h2>
          <p className="mt-2 text-gray-600">Split expenses sweet as honey</p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-honey-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  // type="email"
                  // autoComplete="email"
                  required
                  className="input-field !pl-10"
                  placeholder="Example: WinnieThePooh"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
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
                  autoComplete="current-password"
                  required
                  className="input-field !pl-10 !pr-10"
                  placeholder="Example: I love Honey"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-honey-400 hover:text-honey-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-honey-500 focus:ring-honey-500 border-honey-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label> */}
            </div>

            {/* <div className="text-sm">
              <a href="#" className="font-medium text-honey-600 hover:text-honey-500">
                Forgot your password?
              </a>
            </div> */}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center btn-primary py-3 text-base"
            >
              Sign in to your hive
            </button>
            {error && <div className="mb-2 text-red-500">{error}</div>}
          </div>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="font-medium text-honey-600 hover:text-honey-500">
              Create your jar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;