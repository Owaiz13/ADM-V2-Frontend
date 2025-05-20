import React, { useState } from 'react';
import './JsonTreeView.css'; // <- External CSS file

const JsonTreeView = ({ data, tabs, setTabs, activeTab, setActiveTab, expandedNodes, setExpandedNodes }) => {
  const [selectedPath, setSelectedPath] = useState(null);

  const handleToggle = (path) => {
    setExpandedNodes((prev) =>
      prev.includes(path) ? prev.filter((n) => n !== path) : [...prev, path]
    );
  };

  const handleSelect = (node, currentPath) => {
    if (!node.url) return;

    const url = node.url;
    const name = node.name || url.split('/').pop();

    const alreadyOpen = tabs.find((tab) => tab.url === url);
    if (!alreadyOpen) setTabs((prevTabs) => [...prevTabs, { url, name }]);

    setActiveTab(url);
    setSelectedPath(currentPath);
  };

  const renderTree = (node, parentPath = '') => {
    return Object.keys(node).map((key) => {
      const currentPath = `${parentPath}/${key}`;
      const value = node[key];
      const isLeaf = !!value.url;
      const isExpanded = expandedNodes.includes(currentPath);
      const isSelected = selectedPath === currentPath;

      return (
        <li key={currentPath} className={`tree-node ${isSelected ? 'selected' : ''}`}>
          <div
            className="tree-label"
            onClick={() => (isLeaf ? handleSelect(value, currentPath) : handleToggle(currentPath))}
          >
            {isLeaf ? '📄 ' : isExpanded ? '📂 ' : '📁 '}
            {key}
          </div>
          {!isLeaf && isExpanded && (
            <ul className="tree-children">
              {renderTree(value, currentPath)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className="tree-container">
      <ul className="tree-root">{renderTree(data)}</ul>
    </div>
  );
};

export default JsonTreeView;
