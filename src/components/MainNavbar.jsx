import React, { useState, useEffect } from 'react';
import { CDBNavbar, CDBNavItem, CDBNavLink, CDBBtn } from 'cdbreact';  // CDBReact components
import { useLocation } from 'react-router-dom';

const MainNavbar = ({ sidebarWidth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Toggle function for navbar collapse in mobile view
  const toggleNavbar = () => setIsOpen(!isOpen);

  // Adjust navbar layout when the location changes (for responsiveness)
  useEffect(() => {
    setIsOpen(false);  // Close the navbar on route change (for mobile)
  }, [location]);

  return (
    <CDBNavbar
      className="navbar-dark d-flex justify-content-between"
      expand="md"
      style={{
        marginLeft: sidebarWidth,  // Dynamically adjust navbar based on sidebar width
        backgroundColor: '#333',   // Set navbar background to match sidebar
      }}
    >
      <CDBNavLink to="/" className="text-white navbar-brand" aria-label="Go to home">
   
      </CDBNavLink>

      {/* Navbar Toggler for mobile view */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNavbar}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Collapsible Navbar Menu */}
      <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
        <div className="d-flex ml-auto">
        
        </div>
      </div>
    </CDBNavbar>
  );
};

export default MainNavbar;
