import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainNavbar from './components/MainNavbar';
import MainSidebar from './components/MainSidebar';
import Decompiler from './pages/Decompiler';
import JadxGUI from './pages/JadxGUI';
import Shellcode from './pages/Shellcode';
import './App.css';

function App() {
  // State to manage the dynamic sidebar width
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default sidebar width

  const handleSidebarResize = (width) => {
    setSidebarWidth(width); // Update sidebar width state
  };

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Pass handleSidebarResize to MainSidebar */}
        <MainSidebar onSidebarResize={handleSidebarResize} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarWidth }}>
          {/* Navbar component */}
          <MainNavbar />
          
          {/* Main content area */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {/* Routes for different pages */}
            <Routes>
              <Route path="/decompiler" element={<Decompiler />} />
              <Route path="/jadxgui" element={<JadxGUI />} />
              <Route path="/shellcode" element={<Shellcode />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
