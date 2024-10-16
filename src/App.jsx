// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Manager from './components/Manager';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SocialSidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <Routes>
          <Route path="/" element={<Manager />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          {/* Redirect to Manager if no match */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
      <SocialSidebar /> {/* Add the sidebar here */}
    </Router>
  );
}

export default App;
