import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} Ali Mirash. All rights reserved.</p>
          </div>
          <div className="mt-4 flex space-x-6">
            <a href="https://github.com/alimirash" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              GitHub
            </a>
            <a href="https://twitter.com/alimirash" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Twitter
            </a>
            <a href="https://linkedin.com/in/alimirash" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
