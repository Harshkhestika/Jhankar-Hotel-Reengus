// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-all duration-300 ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-lg sm:text-xl">
            JH
          </div>
          <span className="text-xl sm:text-2xl font-bold font-display text-amber-800">
            Jhankar Hotel
          </span>
        </Link>

        <ul className="hidden lg:flex items-center space-x-8">
          <li><a href="/#home" className="hover:text-amber-600 transition font-medium">Home</a></li>
          <li><a href="/#about" className="hover:text-amber-600 transition font-medium">About Us</a></li>
          <li><a href="/#rooms" className="hover:text-amber-600 transition font-medium">Rooms</a></li>
          <li><a href="/#gallery" className="hover:text-amber-600 transition font-medium">Gallery</a></li>
        </ul>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/booking" onClick={closeMenu} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold text-sm sm:text-base transition shadow-md hover:shadow-lg">
            Book Room
          </Link>
          <Link to="/order" onClick={closeMenu} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold text-sm sm:text-base transition shadow-md hover:shadow-lg">
            Order Food
          </Link>
          <button
            id="mobileMenuBtn"
            className="lg:hidden text-2xl text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </nav>

      <div id="mobileMenu" className={`lg:hidden bg-white border-t ${isMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="container mx-auto px-4 py-3 space-y-2 text-gray-700">
          <li><a href="/#home" onClick={closeMenu} className="block hover:text-amber-600 transition font-medium">Home</a></li>
          <li><a href="/#about" onClick={closeMenu} className="block hover:text-amber-600 transition font-medium">About Us</a></li>
          <li><a href="/#rooms" onClick={closeMenu} className="block hover:text-amber-600 transition font-medium">Rooms</a></li>
          <li><a href="/#gallery" onClick={closeMenu} className="block hover:text-amber-600 transition font-medium">Gallery</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;