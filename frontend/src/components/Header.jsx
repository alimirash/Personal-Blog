import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { WalletContext } from '../context/WalletContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { isConnected, account } = useContext(WalletContext);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-purple-600 dark:text-purple-400">
            Ali Mirash Blog
          </Link>
          
          <nav className="ml-10 space-x-4">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link to="/blog" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Blog
            </Link>
            <Link to="/games" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Games
            </Link>
            {isConnected && (
              <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                My Profile
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-300"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          {isConnected && (
            <Link to="/profile" className="text-sm text-gray-700 dark:text-gray-300">
              {`${account.slice(0, 6)}...${account.slice(-4)}`}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
