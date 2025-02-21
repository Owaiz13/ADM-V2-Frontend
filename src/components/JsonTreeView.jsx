import React, { useState } from 'react';

const JsonTreeView = ({ data, onItemSelect }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);

  const handleToggle = (node) => {
    if (expandedNodes.includes(node)) {
      setExpandedNodes(expandedNodes.filter((item) => item !== node));
    } else {
      setExpandedNodes([...expandedNodes, node]);
    }
  };

  const renderTree = (data, parentKey = '') => {
    return Object.keys(data).map((key) => {
      const nodePath = `${parentKey}/${key}`;
      const isLeaf = typeof data[key] === 'object' && data[key].url; // Check if it's a leaf with a URL
      const isExpanded = expandedNodes.includes(nodePath);

      return (
        <li key={nodePath}>
          <span
            style={{ cursor: 'pointer', color: isLeaf ? 'blue' : 'black' }}
            onClick={() => (isLeaf ? onItemSelect(data[key].url) : handleToggle(nodePath))}
          >
            {isLeaf ? key : (isExpanded ? '-' : '+') + ' ' + key}
          </span>
          {!isLeaf && isExpanded && <ul>{renderTree(data[key], nodePath)}</ul>}
        </li>
      );
    });
  };

  return (
    <div className="json-tree-view">
      <ul>{renderTree(data)}</ul>
    </div>
  );
};

export default JsonTreeView;
