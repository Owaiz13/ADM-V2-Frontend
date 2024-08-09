import React, { useState } from 'react';

const JsonTreeView = ({ data, onItemSelect }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);

  const handleToggle = (node) => {
    if (expandedNodes.includes(node)) {
      setExpandedNodes(expandedNodes.filter(item => item !== node));
    } else {
      setExpandedNodes([...expandedNodes, node]);
    }
  };

  const renderTree = (data, parentKey = '') => {
    return Object.keys(data).map((key) => {
      const nodePath = `${parentKey}/${key}`;
      const nodeData = data[key];
      const isLeaf = nodeData && typeof nodeData === 'object' && nodeData.url;
      const isExpanded = expandedNodes.includes(nodePath);

      return (
        <li key={nodePath}>
          <span onClick={() => isLeaf ? onItemSelect(nodeData.url) : handleToggle(nodePath)}>
            {isLeaf ? key : (isExpanded ? '-' : '+') + ' ' + key}
          </span>
          {!isLeaf && isExpanded && (
            <ul>
              {renderTree(nodeData, nodePath)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className="json-tree-view">
      <ul>
        {renderTree(data)}
      </ul>
    </div>
  );
};

export default JsonTreeView;
