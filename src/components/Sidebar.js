import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarLink = ({ to, icon, children }) => {
  return (
    <li>
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'active' : ''}`
        }
      >
        <i className={`fas ${icon} w-6 text-center text-lg`}></i>
        {/* Text hides on screens smaller than 'lg' */}
        <span className="hidden lg:inline ml-3">{children}</span>
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  return (
    // Wide on 'lg' screens, narrow (w-20) on mobile
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 lg:w-64 bg-white shadow-lg z-40 transition-all duration-300">
      <div className="h-full flex flex-col justify-between p-4">
        
        {/* Top: Admin Profile */}
        <div>
          <div className="flex items-center space-x-3 p-2 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-amber-600 text-xl"></i>
            </div>
            {/* Text hides on screens smaller than 'lg' */}
            <div className="hidden lg:block">
              <span className="font-medium text-gray-800">Admin User</span>
              <span className="block text-sm text-gray-500">Administrator</span>
            </div>
          </div>

          {/* Middle: Navigation Links */}
          <nav>
            <ul className="space-y-2">
              <SidebarLink to="/admin" icon="fa-bed">
                Booking Rooms
              </SidebarLink>
              <SidebarLink to="/admin/offline-booking" icon="fa-calendar-plus">
                Offline Booking
              </SidebarLink>
              <SidebarLink to="/admin/orders" icon="fa-utensils">
                Order Food
              </SidebarLink>
              <SidebarLink to="/admin/customers" icon="fa-users">
                Customer Details
              </SidebarLink>
              <SidebarLink to="/admin/update-menu" icon="fa-edit">
                Update Menu
              </SidebarLink>
            </ul>
          </nav>
        </div>

        {/* Bottom: Sign Out */}
        <div>
          <button className="sidebar-item w-full">
            <i className="fas fa-sign-out-alt w-6 text-center text-lg"></i>
            {/* Text hides on screens smaller than 'lg' */}
            <span className="hidden lg:inline ml-3">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;