import React, { useState } from "react";
import FileUploadBar from "../components/FileUploadBar";
import JsonTreeView from "../components/JsonTreeView";
import JsonDetailsView from "../components/JsonDetailsView";

function JadxGUI() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apkData, setApkData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Function to build a tree structure from file paths
  const buildTree = (files) => {
    const tree = {};

    files.forEach((file) => {
      if (!file.path || typeof file.path !== "string") {
        console.error("Invalid file path:", file);
        return;
      }

      const parts = file.path.split("/");
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

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  // Trigger hidden file input
  const handleFileUpload = () => {
    document.getElementById("fileInput").click();
  };

  // Read and process the uploaded file
  const handleFileRequest = () => {
    if (!selectedFile) {
      console.warn("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);

        if (!jsonContent.files || !Array.isArray(jsonContent.files)) {
          console.error('Invalid JSON: Missing "files" array.');
          return;
        }

        const treeData = buildTree(jsonContent.files);
        setApkData(treeData);
        console.log("Processed APK Data:", treeData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(selectedFile);
  };

  // Handle item selection from JSON tree
  const handleItemSelect = (url) => {
    console.log("Selected URL:", url);
    setSelectedItem(url);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Jadx GUI</h1>

      {/* File Upload Bar */}
      <FileUploadBar
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        handleFileUpload={handleFileUpload}
        handleSubmit={handleFileRequest}
      />

      {/* Hidden File Input */}
      <input
        id="fileInput"
        type="file"
        accept=".apk"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* JSON Tree and Details View */}
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
