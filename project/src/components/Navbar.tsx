import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, Calendar, Mail, Heart, Settings, Shield, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, setShowAuthModal } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Heart },
    { path: '/about', label: 'About', icon: Users },
    { path: '/events', label: 'Departments', icon: Calendar },
    { path: '/sponsorship', label: 'Sponsorship', icon: Heart },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/Screenshot 2025-06-29 112911.png"
              alt="Chaitanya Spandana Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chaitanya Spandana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Register Now
                </Link>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/admin"
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    title="Super Admin"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/department-admin"
                    className="p-2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
                    title="Department Admin"
                  >
                    <Shield className="h-5 w-5" />
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 hidden lg:block">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
                      title="Sign Out"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={handleSignInClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Sign in</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Chaitanya Spandana Logo */}
              <div className="flex justify-center py-4">
                <img
                  src="/Screenshot 2025-06-29 112911.png"
                  alt="Chaitanya Spandana Logo"
                  className="h-16 w-16 object-contain"
                />
              </div>
              
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg mt-4"
                  >
                    Register Now
                  </Link>
                  <div className="flex space-x-2 mt-4">
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 flex-1"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Super Admin</span>
                    </Link>
                    <Link
                      to="/department-admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-all duration-200 flex-1"
                    >
                      <Shield className="h-5 w-5" />
                      <span>Dept Admin</span>
                    </Link>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Signed in as: {user.user_metadata?.full_name || user.email}
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleSignInClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg mt-4"
                >
                  Sign in
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;