import React from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

// Main Component
const BookingRoomsPanel = () => {
  const { rooms, updateRoom, getRoomStats } = useData();
  const { totalRooms, availableRooms, bookedRooms } = getRoomStats();

  const roomTypes = {
    Single: rooms.filter(r => r.type === 'Single'),
    Double: rooms.filter(r => r.type === 'Double'),
    Triple: rooms.filter(r => r.type === 'Triple'),
    Dormitory: rooms.filter(r => r.type === 'Dormitory'),
  };

  return (
    <div id="booking-rooms-panel">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Rooms Management</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard icon="fa-door-closed" title="Total Rooms" value={totalRooms} color="blue" />
        <SummaryCard icon="fa-door-open" title="Available Rooms" value={availableRooms} color="green" />
        <SummaryCard icon="fa-bed" title="Booked Rooms" value={bookedRooms} color="red" />
      </div>

      {/* Main layout is now a single column (space-y-8) */}
      <div className="space-y-8">
        {Object.entries(roomTypes).map(([type, roomsOfType]) => (
          <RoomTypeSection 
            key={type}
            title={type}
            rooms={roomsOfType}
            onUpdateRoom={updateRoom}
          />
        ))}
      </div>
    </div>
  );
};

// --- Sub-Components ---

const SummaryCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]} mr-4`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

const RoomTypeSection = ({ title, rooms, onUpdateRoom }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold text-gray-800">{title} Rooms</h3>
        <p className="text-sm text-gray-500 mt-1">Manage availability for all {title.toLowerCase()} rooms.</p>
      </div>
      
      {/* This grid is now responsive:
        - 1 column on smallest screens (default)
        - 3 columns on 'md' screens (tablets)
        - 5 columns on 'lg' screens (desktops)
      */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {rooms.map(room => (
          <RoomStatusCard 
            key={room.id} 
            room={room} 
            onUpdateRoom={onUpdateRoom} 
          />
        ))}
      </div>
    </div>
  );
};

const RoomStatusCard = ({ room, onUpdateRoom }) => {
  const { showNotification } = useNotification();

  const handleAvailabilityChange = (e) => {
    const newAvailability = e.target.value;
    onUpdateRoom(room.id, 'availability', newAvailability);
    showNotification(`Room ${room.roomNo} set to ${newAvailability}`, 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'border-green-500 bg-green-50';
      case 'Booked':
        return 'border-red-500 bg-red-50';
      case 'Maintenance':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${getStatusColor(room.availability)}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg text-gray-800">Room {room.roomNo}</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-1">Price: <span className="font-medium">₹{room.price.toLocaleString()}</span></p>
      
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
        <select 
          value={room.availability}
          onChange={handleAvailabilityChange}
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="Available">Available</option>
          <option value="Booked">Booked</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>
    </div>
  );
};

export default BookingRoomsPanel;