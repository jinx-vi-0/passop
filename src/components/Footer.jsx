import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto flex flex-col items-center justify-between text-center">
        {/* Logo and Brief Info */}
        <div className="logo font-bold text-white text-2xl mb-3 flex items-center justify-center">
          <span className="text-green-500">&lt;</span>
          <span className="tracking-wide">Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </div>

        <p className="text-gray-400 text-sm mb-4 max-w-xl">
          PassOP is your trusted password manager, providing secure and easy access to manage your passwords.
          Keep your data safe and never lose track of your credentials again.
        </p>

        {/* Social Media Links */}
        <div className="flex space-x-6 mb-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} className="text-2xl hover:text-green-400 transition duration-300" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} className="text-2xl hover:text-green-400 transition duration-300" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FontAwesomeIcon icon={faTwitter} className="text-2xl hover:text-green-400 transition duration-300" />
          </a>
        </div>

        {/* Footer Bottom Info */}
        <div className="text-center text-gray-500 text-sm mt-4">
          <p>© 2024 PassOP. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-green-400">Privacy Policy</a> | <a href="#" className="hover:text-green-400">Terms of Service</a> | <a href="#" className="hover:text-green-400">Contact Us</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
