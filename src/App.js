import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import customer-facing layouts and pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Order from './pages/Order';

// Import admin layout and panels
import AdminLayout from './components/AdminLayout';
import BookingRoomsPanel from './components/admin/BookingRoomsPanel';
import OfflineBookingPanel from './components/admin/OfflineBookingPanel';
import OrderFoodPanel from './components/admin/OrderFoodPanel';
import CustomerDetailsPanel from './components/admin/CustomerDetailsPanel';
import UpdateMenuPanel from './components/admin/UpdateMenuPanel';
// We are REMOVING AdminLogin and ProtectedRoute

function App() {
  return (
    <Routes>
      {/* --- Customer Facing Routes (Public) --- */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="booking" element={<Booking />} />
        <Route path="order" element={<Order />} />
      </Route>

      {/* --- Admin Panel Routes (Public, for now) --- */}
      {/* We are REMOVING the ProtectedRoute wrapper */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<BookingRoomsPanel />} />
        <Route path="offline-booking" element={<OfflineBookingPanel />} />
        <Route path="orders" element={<OrderFoodPanel />} />
        <Route path="customers" element={<CustomerDetailsPanel />} />
        <Route path="update-menu" element={<UpdateMenuPanel />} />
      </Route>
    </Routes>
  );
}

export default App;