// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
                JH
              </div>
              <span className="text-2xl font-bold font-display">Jhankar Hotel</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Experience world-class hospitality at Jhankar Hotel. Where luxury meets comfort and every stay becomes a cherished memory.
            </p>
            <div className="text-gray-400">
              <p className="mb-2"><i className="fas fa-map-marker-alt mr-2 text-amber-600"></i>Riico industrial area (Reengus)</p>
              <p className="mb-2 ml-6">Rajasthan,Sikar(Reengus)</p>
              <p className="mb-2 ml-6">India</p>
            </div>
          </div>
          
          {/* Middle Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-display">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+911112345678" className="text-gray-400 hover:text-amber-600 transition flex items-center">
                  <i className="fas fa-phone mr-3 text-amber-600"></i>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>+91 11 1234 5678</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@Jhankar@gmail.com" className="text-gray-400 hover:text-amber-600 transition flex items-center">
                  <i className="fas fa-envelope mr-3 text-amber-600"></i>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>info@Jhankar@gmail.com</p>
                  </div>
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-amber-600 rounded-full flex items-center justify-center transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-amber-600 rounded-full flex items-center justify-center transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-amber-600 rounded-full flex items-center justify-center transition">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-display">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/#home" className="text-gray-400 hover:text-amber-600 transition flex items-center">
                  <i className="fas fa-chevron-right mr-2 text-amber-600 text-xs"></i> Home
                </a>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-amber-600 transition flex items-center">
                  <i className="fas fa-chevron-right mr-2 text-amber-600 text-xs"></i> Book Room
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-gray-400 hover:text-amber-600 transition flex items-center">
                  <i className="fas fa-chevron-right mr-2 text-amber-600 text-xs"></i> Order Food
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Jhankar Hotel. All rights reserved. Crafted with 
            <i className="fas fa-heart text-red-500 mx-1"></i>.
            <Link to="/admin" className="text-blue-500 hover:underline ml-2 px-2 py-1 border border-blue-500 rounded">
              Admin Panel
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;