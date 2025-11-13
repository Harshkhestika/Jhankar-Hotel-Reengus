// src/pages/Booking.js
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// --- Config ---
const roomConfig = {
  single: { name: 'Single Bed Room', price: 2500, max: 12 },
  double: { name: 'Double Bed Room', price: 4000, max: 8 },
  triple: { name: 'Triple Bed Room', price: 5500, max: 6 },
  dormitory: { name: 'Dormitory Bed', price: 1200, max: 20 },
};

const TAX_RATE = 0.18;

// --- Helper Functions ---
const getToday = () => new Date().toISOString().split('T')[0];
const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dates, setDates] = useState({
    checkIn: getToday(),
    checkOut: getTomorrow(),
  });
  const [rooms, setRooms] = useState({
    single: 0,
    double: 0,
    triple: 0,
    dormitory: 0,
  });
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    requests: '',
  });

  // --- Derived State & Memos ---
  const nights = useMemo(() => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nightsCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nightsCount > 0 ? nightsCount : 0;
  }, [dates]);

  const roomTotals = useMemo(() => {
    let roomTotal = 0;
    const details = {};
    for (const [key, quantity] of Object.entries(rooms)) {
      if (quantity > 0) {
        const price = roomConfig[key].price;
        const subtotal = price * quantity * nights;
        roomTotal += subtotal;
        details[key] = {
          ...roomConfig[key],
          quantity,
          subtotal,
        };
      }
    }
    return { roomTotal, details };
  }, [rooms, nights]);

  const finalTotals = useMemo(() => {
    const { roomTotal } = roomTotals;
    const tax = roomTotal * TAX_RATE;
    const grandTotal = roomTotal + tax;
    return { roomTotal, tax, grandTotal };
  }, [roomTotals]);

  // --- Event Handlers ---
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    const newDates = { ...dates, [id]: value };

    // Ensure checkout is not before checkin
    if (id === 'checkIn' && newDates.checkOut < value) {
      newDates.checkOut = value;
    }
    setDates(newDates);
  };

  const handleRoomChange = (roomType, quantity) => {
    const max = roomConfig[roomType].max;
    if (quantity >= 0 && quantity <= max) {
      setRooms(prev => ({ ...prev, [roomType]: quantity }));
    }
  };

  const handleGuestChange = (e) => {
    const { id, value } = e.target;
    setGuestDetails(prev => ({ ...prev, [id]: value }));
  };

  const goToStep = (step) => {
    window.scrollTo(0, 0);
    setCurrentStep(step);
  };

  const handleNextToGuest = () => {
    if (roomTotals.roomTotal <= 0) {
      alert('Please select at least one room and a valid date range.');
      return;
    }
    goToStep(2);
  };
  
  const handleNextToReview = () => {
    // Basic Validation
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      alert('Please fill in all required guest details.');
      return;
    }
    goToStep(3);
  };

  const handleConfirmBooking = () => {
    // Payment validation would go here
    const bookingId = 'JH' + Math.random().toString(36).substr(2, 6).toUpperCase();
    alert(`Thank you for your booking! Your reservation has been confirmed.\nBooking ID: ${bookingId}`);
    // Reset form
    setRooms({ single: 0, double: 0, triple: 0, dormitory: 0 });
    setDates({ checkIn: getToday(), checkOut: getTomorrow() });
    setGuestDetails({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', requests: '' });
    goToStep(1);
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display text-amber-800">Book Your Stay</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Select your rooms and complete your booking in just a few steps</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        {/* Step 1: Room Selection */}
        <div id="step-1" className={`step-content ${currentStep === 1 ? 'active' : ''}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 font-display text-center text-amber-800">Choose Your Accommodation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.entries(roomConfig).map(([key, config]) => (
                <RoomSelectionCard
                  key={key}
                  roomType={key}
                  config={config}
                  quantity={rooms[key]}
                  onRoomChange={handleRoomChange}
                  subtotal={roomTotals.details[key]?.subtotal || 0}
                />
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 font-display text-amber-800">Select Your Stay Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Check-in Date</label>
                  <input type="date" id="checkIn" value={dates.checkIn} min={getToday()} onChange={handleDateChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-600" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Check-out Date</label>
                  <input type="date" id="checkOut" value={dates.checkOut} min={dates.checkIn} onChange={handleDateChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><i className="fas fa-info-circle text-amber-600 mr-2"></i>Total Nights: <span className="font-bold">{nights}</span></p>
              </div>
            </div>
            
            {/* *** THIS IS THE FIRST FIX *** */}
            <RoomSummaryTable roomTotals={roomTotals} nights={nights} />
            
            <div className="flex justify-between">
              <Link to="/" className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition">
                <i className="fas fa-arrow-left mr-2"></i>Back to Home
              </Link>
              <button onClick={handleNextToGuest} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                Continue to Guest Details <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Step 2: Guest Details */}
        <div id="step-2" className={`step-content ${currentStep === 2 ? 'active' : ''}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 font-display text-center text-amber-800">Guest Information</h2>
            <GuestForm guestDetails={guestDetails} onChange={handleGuestChange} />
            <div className="flex justify-between">
              <button onClick={() => goToStep(1)} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition">
                <i className="fas fa-arrow-left mr-2"></i>Back to Rooms
              </button>
              <button onClick={handleNextToReview} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                Review & Payment <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Step 3: Review & Payment */}
        <div id="step-3" className={`step-content ${currentStep === 3 ? 'active' : ''}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 font-display text-center text-amber-800">Review Your Booking</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BookingReview dates={dates} nights={nights} roomTotals={roomTotals} finalTotals={finalTotals} />
              <PaymentForm finalTotals={finalTotals} onConfirm={handleConfirmBooking} />
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={() => goToStep(2)} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition">
                <i className="fas fa-arrow-left mr-2"></i>Back to Guest Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// --- Sub-Components for Booking Page ---

const StepIndicator = ({ currentStep }) => (
  <div className="step-indicator">
    <div className={`step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`} data-step="1">
      <div className="step-number">1</div>
      <div className="step-line"></div>
      <div className="step-label">Select Rooms</div>
    </div>
    <div className={`step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`} data-step="2">
      <div className="step-number">2</div>
      <div className="step-line"></div>
      <div className="step-label">Guest Details</div>
    </div>
    <div className={`step ${currentStep === 3 ? 'active' : ''}`} data-step="3">
      <div className="step-number">3</div>
      <div className="step-line"></div>
      <div className="step-label">Review & Pay</div>
    </div>
  </div>
);

const RoomSelectionCard = ({ roomType, config, quantity, onRoomChange, subtotal }) => (
  <div className="room-card bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="relative">
      <img src={`https://images.unsplash.com/${config.price === 2500 ? 'photo-1631049307264-da0ec9d70304' : config.price === 4000 ? 'photo-1566665797739-1674de7a421a' : config.price === 5500 ? 'photo-1611892440504-42a792e24d32' : 'photo-1590490360182-c33d57733427'}?w=400&h=300&fit=crop`} alt={config.name} className="w-full h-48 object-cover" />
      <div className="absolute top-4 right-4 bg-amber-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
        ₹{config.price.toLocaleString()} / night
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold font-display text-amber-800 mb-2">{config.name}</h3>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Available: {config.max}</span>
        <div className="quantity-control">
          <button onClick={() => onRoomChange(roomType, quantity - 1)} className="quantity-btn"><i className="fas fa-minus"></i></button>
          <input type="number" value={quantity} readOnly className="quantity-input room-quantity" />
          <button onClick={() => onRoomChange(roomType, quantity + 1)} className="quantity-btn"><i className="fas fa-plus"></i></button>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-bold text-amber-800">Total: ₹{subtotal.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

// *** THIS IS THE SECOND FIX ***
const RoomSummaryTable = ({ roomTotals, nights }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
    <h3 className="text-xl font-bold mb-4 font-display text-amber-800">Room Booking Summary</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Room Type</th>
            <th className="text-center py-2">Quantity</th>
            <th className="text-right py-2">Price/Night</th>
            <th className="text-right py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(roomTotals.details).length > 0 ? (
            Object.entries(roomTotals.details).map(([key, data]) => (
              <tr key={key}>
                <td className="py-2">{data.name}</td>
                <td className="py-2 text-center">{data.quantity}</td>
                <td className="py-2 text-right">₹{data.price.toLocaleString()}</td>
                <td className="py-2 text-right">₹{data.subtotal.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="py-4 text-center text-gray-500">No rooms selected</td></tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t font-bold">
            <td colSpan="3" className="py-2 text-right">Room Total (per night):</td>
            <td className="py-2 text-right">₹{(roomTotals.roomTotal / (nights || 1)).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);

const GuestForm = ({ guestDetails, onChange }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
    <h3 className="text-xl font-bold mb-4 font-display text-amber-800">Primary Guest Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <FormInput label="First Name" id="firstName" value={guestDetails.firstName} onChange={onChange} required />
      <FormInput label="Last Name" id="lastName" value={guestDetails.lastName} onChange={onChange} required />
      <FormInput label="Email" id="email" type="email" value={guestDetails.email} onChange={onChange} required />
      <FormInput label="Phone Number" id="phone" type="tel" value={guestDetails.phone} onChange={onChange} required />
    </div>
    <div className="mb-6">
      <FormInput label="Address" id="address" value={guestDetails.address} onChange={onChange} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <FormInput label="City" id="city" value={guestDetails.city} onChange={onChange} />
      <FormInput label="State" id="state" value={guestDetails.state} onChange={onChange} />
      <FormInput label="ZIP Code" id="zip" value={guestDetails.zip} onChange={onChange} />
    </div>
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2 text-gray-700">Special Requests</label>
      <textarea id="requests" value={guestDetails.requests} onChange={onChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-600" rows="4"></textarea>
    </div>
  </div>
);

const FormInput = ({ label, id, type = 'text', value, onChange, required = false, placeholder = '' }) => (
  <div>
    <label className="block text-sm font-semibold mb-2 text-gray-700">{label}{required && ' *'}</label>
    <input 
      type={type} 
      id={id} 
      value={value} 
      onChange={onChange} 
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-600" 
      required={required} 
      placeholder={placeholder}
    />
  </div>
);

const BookingReview = ({ dates, nights, roomTotals, finalTotals }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-bold mb-4 font-display text-amber-800">Booking Details</h3>
    <div className="mb-6">
      <h4 className="font-semibold mb-2">Stay Duration</h4>
      <p className="text-gray-600">Check-in: {dates.checkIn}</p>
      <p className="text-gray-600">Check-out: {dates.checkOut}</p>
      <p className="text-gray-600">Nights: {nights}</p>
    </div>
    <div className="mb-6">
      <h4 className="font-semibold mb-2">Rooms Selected</h4>
      {Object.entries(roomTotals.details).map(([key, data]) => (
        <div key={key} className="flex justify-between mb-1">
          <span>{data.name} x {data.quantity}</span>
          <span>₹{data.subtotal.toLocaleString()}</span>
        </div>
      ))}
    </div>
    <div className="border-t pt-4">
      <div className="flex justify-between mb-2">
        <span>Room Total:</span>
        <span>₹{finalTotals.roomTotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Tax ({(TAX_RATE * 100).toFixed(0)}%):</span>
        <span>₹{finalTotals.tax.toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Grand Total:</span>
        <span>₹{finalTotals.grandTotal.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

const PaymentForm = ({ finalTotals, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 font-display text-amber-800">Payment Information</h3>
      {/* Payment Method Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-700">Payment Method</label>
        <div className="grid grid-cols-2 gap-4">
          {['Credit Card', 'Google Pay', 'Net Banking', 'Wallet'].map(method => (
            <div
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`border-2 rounded-lg p-4 text-center cursor-pointer ${paymentMethod === method ? 'border-amber-600 bg-amber-50' : 'border-gray-300'}`}
            >
              <i className={`fas ${method === 'Credit Card' ? 'fa-credit-card' : method === 'Google Pay' ? 'fab fa-google-pay' : method === 'Net Banking' ? 'fa-university' : 'fa-wallet'} text-2xl mb-2 text-gray-600`}></i>
              <p className="text-sm">{method}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Card Details Form */}
      <FormInput label="Card Number" id="card" placeholder="1234 5678 9012 3456" />
      <div className="grid grid-cols-2 gap-4 my-4">
        <FormInput label="Expiry Date" id="expiry" placeholder="MM/YY" />
        <FormInput label="CVV" id="cvv" placeholder="123" />
      </div>
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
        <p className="text-sm text-red-800 font-semibold">
          <strong>Important:</strong> No refund will be provided for online booking.
        </p>
      </div>
      <button onClick={onConfirm} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition shadow-lg hover:shadow-xl">
        <i className="fas fa-lock mr-2"></i>Confirm & Pay ₹{finalTotals.grandTotal.toLocaleString()}
      </button>
    </div>
  );
};

export default Booking;