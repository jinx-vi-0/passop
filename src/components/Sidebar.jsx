// src/components/SocialSidebar.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const SocialSidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar's visibility
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-white shadow-lg p-4 z-50">
          <button 
            onClick={toggleSidebar} 
            className="absolute top-[-10px] right-[-8px] bg-green-500 rounded-full w-5 h-5 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
          <div className="flex flex-col items-center space-y-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-700 transition-colors duration-300">
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-700 transition-colors duration-300">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-700 transition-colors duration-300">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-700 transition-colors duration-300">
              <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
            </a>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-white shadow-lg p-2 z-50"
        >
          <FontAwesomeIcon icon={faArrowRight} size="lg" />
        </button>
      )}
    </>
  );
};

export default SocialSidebar;
