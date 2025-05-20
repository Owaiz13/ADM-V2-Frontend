import React, { useState } from 'react';

const GlobalSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', display: 'flex' }}>
      <input
        type="text"
        placeholder="🔍 Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '4px 0 0 4px',
          border: '1px solid #444',
          backgroundColor: '#1e1e1e',
          color: '#fff',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          backgroundColor: '#007acc',
          border: 'none',
          color: '#fff',
          borderRadius: '0 4px 4px 0',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </form>
  );
};

export default GlobalSearchBar;
