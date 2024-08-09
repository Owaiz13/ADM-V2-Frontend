import React from 'react';

const JsonDetailsView = ({ selectedItem }) => {
  return (
    <div className="json-details-view">
      {selectedItem ? (
        <div>
          <h3>File Content</h3>
          <iframe src={selectedItem} width="100%" height="600px" title="File Content" />
        </div>
      ) : (
        <div>Select a file to view its content.</div>
      )}
    </div>
  );
};

export default JsonDetailsView;
