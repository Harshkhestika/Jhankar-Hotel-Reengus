// --- New Rooms Data ---
// Floor 1: 101-110 (Mix of Single/Double)
// Floor 2: 201-210 (Mix of Double/Triple)
// Floor 3: 301-310 (Mix of Triple/Dormitory)
const createRooms = () => {
  let rooms = [];
  let id = 1;

  // --- NEW: Placeholder Image URLs ---
  const placeholders = {
    Single: 'https://placehold.co/400x300/fef3c7/b45309?text=Single+Room',
    Double: 'https://placehold.co/400x300/fde68a/b45309?text=Double+Room',
    Triple: 'https://placehold.co/400x300/fef3c7/b45309?text=Triple+Room',
    Dormitory: 'https://placehold.co/400x300/fde68a/b45309?text=Dormitory',
  };

  // Floor 1
  for (let i = 1; i <= 10; i++) {
    const roomNo = 100 + i;
    let type, price;
    if (i <= 5) {
      type = 'Single';
      price = 2500;
    } else {
      type = 'Double';
      price = 4000;
    }
    // --- UPDATED: Added 'image' property ---
    rooms.push({ 
      id: id++, 
      roomNo: roomNo.toString(), 
      type, 
      price, 
      availability: 'Available', 
      image: placeholders[type] // Add placeholder image
    });
  }

  // Floor 2
  for (let i = 1; i <= 10; i++) {
    const roomNo = 200 + i;
    let type, price;
    if (i <= 6) {
      type = 'Double';
      price = 4000;
    } else {
      type = 'Triple';
      price = 5500;
    }
    // --- UPDATED: Added 'image' property ---
    rooms.push({ 
      id: id++, 
      roomNo: roomNo.toString(), 
      type, 
      price, 
      availability: 'Available', 
      image: placeholders[type] 
    });
  }

  // Floor 3
  for (let i = 1; i <= 10; i++) {
    const roomNo = 300 + i;
    let type, price;
    if (i <= 5) {
      type = 'Triple';
      price = 5500;
    } else {
      type = 'Dormitory';
      price = 1200;
    }
    // --- UPDATED: Added 'image' property ---
    rooms.push({ 
      id: id++, 
      roomNo: roomNo.toString(), 
      type, 
      price, 
      availability: 'Available', 
      image: placeholders[type] 
    });
  }

  // Manually set a few as booked
  rooms[1].availability = 'Booked'; // 102
  rooms[3].availability = 'Booked'; // 104
  rooms[15].availability = 'Booked'; // 206
  rooms[28].availability = 'Booked'; // 309

  return rooms;
};

export const initialRoomsData = createRooms();

// --- Updated Customers & Orders ---

export const initialCustomersData = [
  { 
    id: 'CUST-001', 
    customerName: "John Doe", 
    roomNo: "102", 
    checkInDate: "2025-10-10", 
    checkOutDate: "2025-10-15", 
    stayDuration: 5, 
    foodCharges: 0, // Will be auto-calculated
    roomCharges: 12500, // 2500 * 5
    totalBill: 12500,
    paymentStatus: 'Complete', // <-- NEW FIELD
  },
  { 
    id: 'CUST-002', 
    customerName: "Jane Smith", 
    roomNo: "104", 
    checkInDate: "2025-10-12", 
    checkOutDate: "2025-10-17", 
    stayDuration: 5, 
    foodCharges: 0,
    roomCharges: 12500, // 2500 * 5
    totalBill: 12500,
    paymentStatus: 'Pending', // <-- NEW FIELD
  },
  { 
    id: 'CUST-003', 
    customerName: "Robert Johnson", 
    roomNo: "206", 
    checkInDate: "2025-10-08", 
    checkOutDate: "2025-10-16", 
    stayDuration: 8, 
    foodCharges: 0,
    roomCharges: 32000, // 4000 * 8
    totalBill: 32000,
    paymentStatus: 'Complete', // <-- NEW FIELD
  },
  { 
    id: 'CUST-004', 
    customerName: "Emily Davis", 
    roomNo: "309", 
    checkInDate: "2025-10-11", 
    checkOutDate: "2025-10-18", 
    stayDuration: 7, 
    foodCharges: 0,
    roomCharges: 8400, // 1200 * 7
    totalBill: 8400,
    paymentStatus: 'Pending', // <-- NEW FIELD
  }
];

export const initialOrdersData = [
  { id: 1, roomNo: "102", customerName: "John Doe", foodItems: "Continental Breakfast", quantity: 2, date: "2025-10-15", totalAmount: 900 },
  { id: 2, roomNo: "104", customerName: "Jane Smith", foodItems: "Vegetarian Thali", quantity: 1, date: "2025-10-15", totalAmount: 600 },
  { id: 3, roomNo: "206", customerName: "Robert Johnson", foodItems: "Non-Vegetarian Buffet", quantity: 3, date: "2025-10-15", totalAmount: 2700 },
  { id: 4, roomNo: "309", customerName: "Emily Davis", foodItems: "BBQ Night Special", quantity: 2, date: "2025-10-15", totalAmount: 2400 },
  // Add more orders for John Doe to test the dropdown
  { id: 5, roomNo: "102", customerName: "John Doe", foodItems: "Vegetarian Thali", quantity: 1, date: "2025-10-16", totalAmount: 600 },
];

// --- Food Menu Data ---
export const initialFoodMenuData = {
  breakfast: {
    name: 'Breakfast',
    time: 'Served until 11:00 AM',
    items: [
      { id: 'breakfast-continental', name: 'Continental Breakfast', desc: 'Fresh fruits, pastries, juice, coffee/tea', price: 450, img: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=250&fit=crop' },
      { id: 'breakfast-indian', name: 'Indian Breakfast', desc: 'Poha, paratha, chutney, yogurt', price: 350, img: 'https://images.unsplash.com/photo-1598214887288-8f67a6f2e767?w=400&h=250&fit=crop' },
      { id: 'breakfast-english', name: 'English Breakfast', desc: 'Eggs, bacon, toast, baked beans', price: 550, img: 'https://images.unsplash.com/photo-1580988070835-430c82a1215a?w=400&h=250&fit=crop' },
    ],
  },
  lunch: {
    name: 'Lunch',
    time: 'Served 12:00 PM - 3:00 PM',
    items: [
      { id: 'lunch-veg-thali', name: 'Vegetarian Thali', desc: 'Dal, vegetables, roti, rice, salad, dessert', price: 600, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=250&fit=crop' },
      { id: 'lunch-nonveg-thali', name: 'Non-Vegetarian Thali', desc: 'Chicken curry, dal, roti, rice, salad, dessert', price: 800, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=250&fit=crop' },
      { id: 'lunch-rajasthani', name: 'Rajasthani Special', desc: 'Dal Baati Churma, Gatte ki Sabzi, Buttermilk', price: 750, img: 'https://images.unsplash.com/photo-1617469176348-639603a35f87?w=400&h=250&fit=crop' },
    ],
  },
  dinner: {
    name: 'Dinner',
    time: 'Served 7:00 PM - 11:00 PM',
    items: [
      { id: 'dinner-veg-buffet', name: 'Vegetarian Buffet', desc: 'Multiple vegetable dishes, breads, rice, desserts', price: 700, img: 'https://images.unsplash.com/photo-1528605248644-14dd04022b16?w=400&h=250&fit=crop' },
      { id: 'dinner-nonveg-buffet', name: 'Non-Vegetarian Buffet', desc: 'Chicken, fish, mutton dishes with sides', price: 900, img: 'https://images.unsplash.com/photo-1606755962773-d324e7452491?w=400&h=250&fit=crop' },
      { id: 'dinner-bbq', name: 'BBQ Night Special', desc: 'Grilled meats and vegetables with live counter', price: 1200, img: 'https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?w=400&h=250&fit=crop' },
    ],
  },
};