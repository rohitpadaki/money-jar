import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import HoneyJarIcon from './HoneyJarIcon';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <div className="min-h-screen bg-honey-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-honey-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-honey-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <HoneyJarIcon size={40} />
              <span className="text-xl font-bold text-honey-800">Money Jar</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-honey-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user && user.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <span className="text-gray-700 font-medium hidden sm:block">
                  {user && user.username ? user.username : ""}
                </span>
              </div>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <User size={20} />
              </button>
              
              <Link
                to="/login"
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={logout}
                title="Logout"
              >
                <LogOut size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;