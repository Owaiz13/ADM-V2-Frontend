import React from 'react';

const JsonDetailsView = ({ selectedItem }) => {
  return (
    <div className="json-details-view">
      {selectedItem ? (
        <iframe
          src={selectedItem}
          width="100%"
          height="600px"
          title="File Content"
          style={{ border: '1px solid #ccc' }}
        ></iframe>
      ) : (
        <div>Select a file to view its content.</div>
      )}
    </div>
  );
};

export default JsonDetailsView;
