import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import { DataProvider } from '../context/DataContext';
import { NotificationProvider } from '../context/NotificationContext';

const AdminLayout = () => {
  return (
    <NotificationProvider>
      <DataProvider>
        <div className="font-inter bg-gray-100 min-h-screen">
          <AdminHeader />
          <div className="flex pt-16">
            <Sidebar />
            {/* Main content adjusts its left margin based on screen size */}
            <main className="flex-1 p-4 md:p-6 ml-20 lg:ml-64 transition-all duration-300">
              <Outlet />
            </main>
          </div>
        </div>
      </DataProvider>
    </NotificationProvider>
  );
};

export default AdminLayout;