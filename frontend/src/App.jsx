import React, { useState, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import WalletConnect from './components/WalletConnect';
import WalletProfile from './components/WalletProfile';
import BlogList from './components/blog/BlogList';
import BlogCreate from './components/blog/BlogCreate';
import BlogDetail from './components/blog/BlogDetail';
import SimpleGame from './components/games/SimpleGame';
import Footer from './components/Footer';
import './App.css';
import { WalletContext } from './context/WalletContext';

function App() {
  const { isConnected } = useContext(WalletContext);

  return (
    <div className="app-container">
      <Header />
      <WalletConnect />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/create" element={<BlogCreate />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/games" element={<SimpleGame />} />
          <Route path="/profile" element={isConnected ? <WalletProfile /> : <div className="text-center p-8">Please connect your wallet to see your profile</div>} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
