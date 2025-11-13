import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

// --- Main Component ---
const UpdateMenuPanel = () => {
  const { foodMenu, addFoodItem, editFoodItem, deleteFoodItem, addRoom } = useData();
  const { showNotification } = useNotification();
  
  const [editingItem, setEditingItem] = useState(null); // { categoryKey, item }
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (categoryKey, item) => {
    setEditingItem({ categoryKey, item });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (categoryKey, itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteFoodItem(categoryKey, itemId);
      showNotification('Food item deleted!', 'success');
    }
  };

  const handleAddNewClick = (categoryKey) => {
    setEditingItem({ categoryKey, item: null }); // 'item: null' signifies a new item
    setIsModalOpen(true);
  };

  const handleModalSave = (categoryKey, itemDetails) => {
    // itemDetails now contains the Base64 string for the image
    if (editingItem.item) {
      // Edit existing item
      editFoodItem(categoryKey, editingItem.item.id, itemDetails);
      showNotification('Food item updated!', 'success');
    } else {
      // Add new item
      addFoodItem(categoryKey, itemDetails);
      showNotification('Food item added!', 'success');
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div id="update-menu-panel">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Website Content</h2>

      {/* --- Section: Manage Food Menu --- */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Manage Food Menu</h3>
          <p className="text-sm text-gray-500 mt-1">Add, edit, or delete items from the customer-facing order page.</p>
        </div>
        
        <div className="p-6 space-y-6">
          {Object.entries(foodMenu).map(([categoryKey, category]) => (
            <div key={categoryKey} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 p-4 flex justify-between items-center rounded-t-lg">
                <h4 className="text-lg font-semibold text-gray-700">{category.name} <span className="text-sm text-gray-500">({category.time})</span></h4>
                <button 
                  onClick={() => handleAddNewClick(categoryKey)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-medium text-sm"
                >
                  <i className="fas fa-plus mr-1"></i> Add Item
                </button>
              </div>
              <ul className="divide-y divide-gray-200">
                {category.items.map(item => (
                  <li key={item.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {/* Image Preview for the list */}
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg bg-gray-100" 
                        onError={(e) => e.target.src = 'https://placehold.co/80x80/f3f4f6/9ca3af?text=Img'}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                        <p className="text-sm font-medium text-amber-700">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button onClick={() => handleEditClick(categoryKey, item)} className="text-amber-600 hover:text-amber-800"><i className="fas fa-edit"></i></button>
                      <button onClick={() => handleDeleteClick(categoryKey, item.id)} className="text-red-600 hover:text-red-800"><i className="fas fa-trash"></i></button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* --- Section: Manage Rooms --- */}
      <AddRoomForm onAddRoom={addRoom} showNotification={showNotification} />

      {/* Modal for Adding/Editing Food */}
      {isModalOpen && (
        <FoodItemModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
          categoryKey={editingItem.categoryKey}
          item={editingItem.item}
          showNotification={showNotification} // Pass showNotification
        />
      )}
    </div>
  );
};

// --- Sub-Component: Add Room Form ---
const AddRoomForm = ({ onAddRoom, showNotification }) => {
  const [roomDetails, setRoomDetails] = useState({
    roomNo: '',
    type: 'Single',
    price: '',
    image: '', // This will hold the Base64 string
    availability: 'Available',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setRoomDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview for the UI
      setImagePreview(URL.createObjectURL(file));

      // Convert the file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setRoomDetails(prev => ({ ...prev, image: reader.result }));
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        showNotification('Failed to read image file.', 'error');
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomDetails.roomNo || !roomDetails.type || !roomDetails.price || !roomDetails.image) {
      showNotification('Please fill out all fields and upload an image.', 'error');
      return;
    }
    onAddRoom(roomDetails);
    showNotification(`Room ${roomDetails.roomNo} added successfully! (Will vanish on refresh)`, 'success');
    // Reset form
    setRoomDetails({
      roomNo: '', type: 'Single', price: '', image: '', availability: 'Available',
    });
    setImagePreview(null);
    e.target.reset(); // Clear the file input
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold text-gray-800">Manage Rooms</h3>
        <p className="text-sm text-gray-500 mt-1">Add a new room to the hotel roster. (Note: Demo only, will reset on refresh).</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Room Number" id="roomNo" value={roomDetails.roomNo} onChange={handleChange} placeholder="e.g., 401" required />
          <FormInput label="Room Price (per night)" id="price" value={roomDetails.price} onChange={handleChange} type="number" placeholder="e.g., 2500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select id="type" value={roomDetails.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Triple">Triple</option>
            <option value="Dormitory">Dormitory</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Image</label>
          <input 
            type="file" 
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            required
          />
        </div>
        {imagePreview && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
            <img src={imagePreview} alt="Room preview" className="w-48 h-32 object-cover rounded-lg border" />
          </div>
        )}
        <div className="flex justify-end">
          {/* --- BUTTON COLOR CHANGED --- */}
          <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium">
            <i className="fas fa-plus mr-2"></i>Add Room
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Sub-Component: Food Item Modal ---
const FoodItemModal = ({ isOpen, onClose, onSave, categoryKey, item, showNotification }) => {
  // --- UPDATED to handle file upload ---
  const [details, setDetails] = useState({
    name: item?.name || '',
    desc: item?.desc || '',
    price: item?.price || '',
    img: item?.img || '', // This will hold the Base64 string or existing URL
  });
  const [imagePreview, setImagePreview] = useState(item?.img || null);

  const handleChange = (e) => {
    setDetails(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // --- NEW: Handle Image Upload for Food ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Set preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setDetails(prev => ({ ...prev, img: reader.result })); // Set Base64 string
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        showNotification('Failed to read image file.', 'error');
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.name || !details.desc || !details.price || !details.img) {
      showNotification('Please fill out all fields and upload an image.', 'error');
      return;
    }
    onSave(categoryKey, details);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{item ? 'Edit' : 'Add'} Food Item</h3>
          <div className="space-y-4">
            <FormInput label="Item Name" id="name" value={details.name} onChange={handleChange} required />
            <FormInput label="Description" id="desc" value={details.desc} onChange={handleChange} required />
            <FormInput label="Price (₹)" id="price" value={details.price} onChange={handleChange} type="number" required />
            
            {/* --- UPDATED: Image Input --- */}
            <div>
              {/* --- THIS IS THE FIX --- */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
              <input 
                type="file" 
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                // Not 'required' if editing, as image might already exist
              />
            </div>
            {imagePreview && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
                <img src={imagePreview} alt="Food preview" className="w-48 h-32 object-cover rounded-lg border" />
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            {/* --- BUTTON COLOR CHANGED --- */}
            <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper component
const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={id}
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
    />
  </div>
);

export default UpdateMenuPanel;