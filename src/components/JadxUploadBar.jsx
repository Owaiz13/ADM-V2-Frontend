import React from "react";

function FileUploadBar({ selectedFile, handleFileChange, handleFileUpload, handleSubmit }) {
  return (
    <div
      style={{
        backgroundColor: "#2d2d2d",
        color: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: "1rem",
        border: "1px solid #444",
      }}
    >
      <div style={{ flex: 1 }}>
        <strong>APK File:</strong>{" "}
        {selectedFile ? (
          <span style={{ color: "#90ee90" }}>{selectedFile.name}</span>
        ) : (
          <span style={{ color: "#ccc" }}>No file selected</span>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={handleFileUpload}
        >
          Select File
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={handleSubmit}
          disabled={!selectedFile}
        >
          Upload & Decompile
        </button>
      </div>
    </div>
  );
}

export default FileUploadBar;
