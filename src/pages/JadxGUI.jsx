import React, { useState } from 'react';
import FileUploadBar from '../components/FileUploadBar';
import JsonTreeView from '../components/JsonTreeView';
import JsonDetailsView from '../components/JsonDetailsView';

function JadxGUI() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apkData, setApkData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Helper function to build tree structure from file paths
  const buildTree = (files) => {
    const tree = {};

    files.forEach((file) => {
      const path = file.path;
      if (typeof path !== 'string') {
        console.error('Invalid path:', path);
        return;
      }

      const parts = path.split('/');
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? file : {};
        }
        current = current[part];
      });
    });

    return tree;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log('Selected file:', file);
  };

  const handleFileRequest = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);

          // Check if 'files' exists and is an array
          if (jsonContent.files && Array.isArray(jsonContent.files)) {
            const treeData = buildTree(jsonContent.files);
            setApkData(treeData);
            console.log('APK JSON Data:', treeData);
          } else {
            console.error('Invalid JSON structure: "files" key is missing or not an array');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      console.log('No file selected.');
    }
  };

  const handleFileUpload = () => {
    document.getElementById('fileInput').click();
  };

  // Debugging function call
  const handleItemSelect = (url) => {
    console.log('Selected URL:', url); // Debugging line
    setSelectedItem(url);
  };

  return (
    <div className="container">
      <h1>Jadx GUI</h1>
      <FileUploadBar
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        handleFileUpload={handleFileUpload}
        handleSubmit={handleFileRequest}
      />
      {apkData && (
        <div className="row mt-4">
          <div className="col-md-4">
            <JsonTreeView data={apkData} onItemSelect={handleItemSelect} />
          </div>
          <div className="col-md-8">
            <JsonDetailsView selectedItem={selectedItem} />
          </div>
        </div>
      )}
    </div>
  );
}

export default JadxGUI;
