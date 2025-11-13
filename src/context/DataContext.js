import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  initialRoomsData, 
  initialOrdersData, 
  initialCustomersData,
  initialFoodMenuData
} from './initialData'; 

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const GST_RATE = 0.18; // 18% GST

export const DataProvider = ({ children }) => {
  const [rooms, setRooms] = useState(initialRoomsData);
  const [orders, setOrders] = useState(initialOrdersData);
  const [customers, setCustomers] = useState(initialCustomersData);
  const [foodMenu, setFoodMenu] = useState(initialFoodMenuData);

  // --- Customer Bill Calculation ---
  useEffect(() => {
    setCustomers(prevCustomers => {
      return prevCustomers.map(customer => {
        const customerOrders = orders.filter(o => o.roomNo === customer.roomNo);
        const foodCharges = customerOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        
        const subtotal = customer.roomCharges + foodCharges;
        const gst = subtotal * GST_RATE;
        const totalBill = subtotal + gst;

        return {
          ...customer,
          foodCharges,
          subtotal,
          gst,
          totalBill,
        };
      });
    });
  }, [orders, rooms]); // Re-run if orders or rooms change


  // --- Customer Data Logic ---
  // --- UPDATED to accept paymentStatus ---
  const addCustomer = (guestDetails, room, paymentStatus) => {
    const checkIn = new Date(guestDetails.checkIn);
    const checkOut = new Date(guestDetails.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
    const roomCharges = room.price * nights;
    
    const subtotal = roomCharges; // No food charges yet
    const gst = subtotal * GST_RATE;
    const totalBill = subtotal + gst;

    const newCustomer = {
      id: `CUST-${Date.now()}`, // Use timestamp for unique ID
      customerId: `CUST-${(customers.length + 1).toString().padStart(3, '0')}`,
      customerName: `${guestDetails.firstName} ${guestDetails.lastName}`,
      phone: guestDetails.phone,
      email: guestDetails.email,
      roomNo: room.roomNo,
      checkInDate: guestDetails.checkIn,
      checkOutDate: guestDetails.checkOut,
      stayDuration: nights,
      foodCharges: 0,
      roomCharges: roomCharges,
      subtotal: subtotal,
      gst: gst,
      totalBill: totalBill,
      paymentStatus: paymentStatus, // <-- NEW FIELD ADDED
    };

    setCustomers(prev => [newCustomer, ...prev]);
    updateRoom(room.id, 'availability', 'Booked');
  };

  // --- NEW FUNCTION to update payment status ---
  const updateCustomerPaymentStatus = (customerId, status) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(customer =>
        customer.id === customerId ? { ...customer, paymentStatus: status } : customer
      )
    );
  };

  // --- Room Data Logic ---
  const updateRoom = (roomId, field, value) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
  };

  const addRoom = (roomDetails) => {
    const newRoom = {
      ...roomDetails,
      id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
      price: parseInt(roomDetails.price, 10),
    };
    setRooms(prevRooms => [newRoom, ...prevRooms]);
  };

  const getRoomStats = () => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.availability === 'Available').length;
    const bookedRooms = rooms.filter(r => r.availability === 'Booked').length;
    return { totalRooms, availableRooms, bookedRooms };
  };

  // --- Order Data Logic ---
  const addOrder = (newOrderData) => {
    const newOrder = {
      ...newOrderData,
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0],
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const deleteOrder = (orderId) => {
    const orderToDelete = orders.find(o => o.id === orderId);
    if (!orderToDelete) return;
    setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
  };

  // --- Food Menu Logic ---
  const addFoodItem = (categoryKey, itemDetails) => {
    const newItem = {
      ...itemDetails,
      id: `${categoryKey}-${Date.now()}`,
      price: parseInt(itemDetails.price, 10),
    };
    setFoodMenu(prevMenu => ({
      ...prevMenu,
      [categoryKey]: {
        ...prevMenu[categoryKey],
        items: [...prevMenu[categoryKey].items, newItem],
      },
    }));
  };

  const editFoodItem = (categoryKey, itemId, updatedDetails) => {
    setFoodMenu(prevMenu => ({
      ...prevMenu,
      [categoryKey]: {
        ...prevMenu[categoryKey],
        items: prevMenu[categoryKey].items.map(item =>
          item.id === itemId ? { ...item, ...updatedDetails, price: parseInt(updatedDetails.price, 10) } : item
        ),
      },
    }));
  };

  const deleteFoodItem = (categoryKey, itemId) => {
    setFoodMenu(prevMenu => ({
      ...prevMenu,
      [categoryKey]: {
        ...prevMenu[categoryKey],
        items: prevMenu[categoryKey].items.filter(item => item.id !== itemId),
      },
    }));
  };

  // --- Expose all values ---
  const value = {
    rooms,
    orders,
    customers,
    foodMenu,
    updateRoom,
    addRoom,
    getRoomStats,
    addOrder,
    deleteOrder,
    addCustomer,
    updateCustomerPaymentStatus, // <-- EXPOSE NEW FUNCTION
    getCustomerExpenses: (roomNo) => {
      // Find customer by room number
      const customer = customers.find(c => c.roomNo === roomNo);
      if (!customer) return { foodOrders: [], roomCharge: 0 };
    
      const { roomCharges, stayDuration, checkInDate } = customer;
      
      const roomChargeItem = {
        date: checkInDate,
        desc: `Room Charges (${stayDuration} nights @ Rs. ${(roomCharges / (stayDuration || 1)).toLocaleString()}/night)`,
        amount: roomCharges,
      };

      const foodOrders = orders
        .filter(o => o.roomNo === roomNo)
        .map(o => ({
          ...o,
          date: o.date,
          desc: `Food Order #${o.id} (${o.foodItems})`,
          amount: o.totalAmount,
        }));
      
      // Return roomCharge as a number, not an object
      return { foodOrders, roomCharge: roomCharges };
    },
    addFoodItem,
    editFoodItem,
    deleteFoodItem,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};