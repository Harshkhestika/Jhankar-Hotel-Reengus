import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    // This outer header has the correct padding to avoid the sidebar
    // pl-20 (mobile) or lg:pl-64 (desktop)
    // pr-6 provides padding on the right edge
    <header className="fixed top-0 left-0 right-0 bg-white text-gray-800 shadow-md z-50 pl-20 lg:pl-64 pr-6 transition-all duration-300">
      
      {/* This is the 3-Column Grid layout.
        It creates 3 equal columns *within* the padded space.
      */}
      <div className="grid grid-cols-3 items-center h-16">
        
        {/* Left Side: "Hotel Admin Dashboard" */}
        {/* 'justify-start' aligns the text to the far left of this column */}
        <div className="flex items-center justify-start">
          <span className="text-xl font-bold text-amber-700">Hotel Admin Dashboard</span>
        </div>

        {/* Center: Logo and Hotel Name */}
        {/* 'justify-center' perfectly centers the logo in the middle column */}
        <div className="flex items-center justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
              JH
            </div>
            <span className="text-xl font-bold font-display text-amber-800 hidden sm:block">
              Jhankar Hotel
            </span>
          </Link>
        </div>
        
        {/* Right Side: Links and Notification Bell */}
        {/* 'justify-end' aligns the links to the far right of this column */}
        <div className="flex items-center justify-end space-x-4">
          <Link to="/" className="font-medium text-gray-600 hover:text-amber-600 transition hidden md:block">
            Home Page
          </Link>
          <a href="/#about" className="font-medium text-gray-600 hover:text-amber-600 transition hidden md:block">
            About Page
          </a>
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition relative"
            >
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>
            
            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                <div className="py-2 px-4 bg-gray-50 border-b">
                  <span className="font-semibold text-gray-700">Notifications</span>
                </div>
                <div className="divide-y">
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">New Booking: Room 302</p>
                    <p className="text-xs text-gray-500">Offline booking by Admin</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Food Order: Room 104</p>
                    <p className="text-xs text-gray-500">2x Veg Thali</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Room 205 marked for Maintenance</p>
                    <p className="text-xs text-gray-500">By Admin</p>
                  </div>
                </div>
                <div className="py-2 px-4 bg-gray-50 border-t text-center">
                  <a href="#" className="text-sm font-medium text-amber-600 hover:text-amber-800">
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;