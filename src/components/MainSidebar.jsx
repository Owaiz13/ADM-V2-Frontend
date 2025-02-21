import React, { useState } from 'react';
import { CDBSidebar, CDBSidebarHeader, CDBSidebarContent, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink } from 'react-router-dom';
import './MainSidebar.css';

const MainSidebar = ({ onSidebarResize }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    onSidebarResize(collapsed ? 250 : 80); // Adjust width based on collapsed state
  };

  return (
    <CDBSidebar textColor="#fff" backgroundColor="#333" style={{ height: '100vh', position: 'fixed' }}>
      <CDBSidebarHeader prefix={<i className="fa fa-bars" />} onClick={handleCollapse}>
        <span className="sidebar-header">Menu</span>
      </CDBSidebarHeader>

      <CDBSidebarContent>
        <CDBSidebarMenu>
          <CDBSidebarMenuItem 
            icon="cogs" 
            as={NavLink} 
            to="/decompiler" 
            activeClassName="active"
            exact
          >
            Decompiler
          </CDBSidebarMenuItem>
          <CDBSidebarMenuItem 
            icon="code" 
            as={NavLink} 
            to="/jadxgui" 
            activeClassName="active"
            exact
          >
            JadxGUI
          </CDBSidebarMenuItem>
          <CDBSidebarMenuItem 
            icon="terminal" 
            as={NavLink} 
            to="/shellcode" 
            activeClassName="active"
            exact
          >
            Shellcodes
          </CDBSidebarMenuItem>
        </CDBSidebarMenu>
      </CDBSidebarContent>
    </CDBSidebar>
  );
};

export default MainSidebar;
