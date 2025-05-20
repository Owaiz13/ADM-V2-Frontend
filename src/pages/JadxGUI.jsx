// --- File: JadxGUI.jsx ---
import React, { useState, useEffect } from "react";
import FileUploadBar from "../components/JadxUploadBar";
import JsonTreeView from "../components/JsonTreeView";
import JsonDetailsView from "../components/JsonDetailsView";
import SearchView from "../components/SearchView";
import "bootstrap/dist/css/bootstrap.min.css";

function JadxGUI() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apkData, setApkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [showSearchView, setShowSearchView] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState(null);
const [highlightKeyword, setHighlightKeyword] = useState('');


  useEffect(() => {
    const active = tabs.find((tab) => tab.url === activeTab);
    if (active && active.content == null && !active.loading) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.url === activeTab ? { ...tab, loading: true } : tab
        )
      );
      fetch(activeTab)
        .then((res) => res.text())
        .then((data) => {
          setTabs((prevTabs) =>
            prevTabs.map((tab) =>
              tab.url === activeTab ? { ...tab, content: data, loading: false } : tab
            )
          );
        })
        .catch((err) => {
          setTabs((prevTabs) =>
            prevTabs.map((tab) =>
              tab.url === activeTab ? { ...tab, error: err.message, loading: false } : tab
            )
          );
        });
    }
  }, [activeTab, tabs]);

  const buildTree = (files) => {
    const tree = {};
    files.forEach((file) => {
      if (!file.path || typeof file.path !== "string") return;
      const normalizedPath = file.path.replace(/\\/g, "/");
      if (normalizedPath.includes("..")) return;
      const parts = normalizedPath.split("/");
      let current = tree;
      parts.forEach((part, index) => {
        if (!part) return;
        if (!current[part]) current[part] = {};
        if (index === parts.length - 1) current[part] = { ...file };
        else current = current[part];
      });
    });
    return tree;
  };

  const handleFileUpload = () => document.getElementById("fileInput").click();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Check file type
    if (!file.name.endsWith(".apk")) {
      alert("Please upload a valid .apk file");
      return;
    }
  
    // Check file size limit (e.g. 100MB)
    const MAX_SIZE_MB = 100;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File is too large! Please upload a file smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }
  
    setSelectedFile(file);
  };
  

  const handleFileRequest = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("apkfile", selectedFile);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9000/decompile_jadx", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Decompilation failed.");
      const data = await response.json();
      const treeData = buildTree(data.files);
      setApkData(treeData);
      setExpandedNodes([]);
      setTabs([]);
      setActiveTab(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleItemSelect = (url, path = "") => {
    if (url) openTab(url, path);
  };

  const closeTab = (url) => {
    setTabs((prev) => prev.filter((tab) => tab.url !== url));
    if (activeTab === url && tabs.length > 1) {
      const nextTab = tabs.find((tab) => tab.url !== url);
      setActiveTab(nextTab?.url || null);
    } else if (activeTab === url) {
      setActiveTab(null);
    }
  };

  const activeTabData = tabs.find((tab) => tab.url === activeTab);

  return (
    <div style={{ height: "100vh", width: "100vw", backgroundColor: "#1e1e1e", color: "#fff", fontFamily: "monospace" }}>
      {showSearchView ? (
      
        <SearchView
  apkData={apkData}
  onBack={() => setShowSearchView(false)}
  onItemClick={handleItemSelect}
/>

      ) : (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="p-3 border-bottom" style={{ borderColor: "#333" }}>
            <h4 style={{ color: "#fff", marginBottom: "1rem" }}>📦 Jadx GUI</h4>
            <FileUploadBar
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
              handleFileUpload={handleFileUpload}
              handleSubmit={handleFileRequest}
            />
            <input
              id="fileInput"
              type="file"
              accept=".apk"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {apkData && (
              <button
                className="btn btn-outline-light mt-2"
                onClick={() => setShowSearchView(true)}
              >
                🔍 Search
              </button>
            )}
          </div>

          {loading ? (
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
              <div
                className="spinner-border text-light"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              />
              <div className="mt-3">Decompiling APK, please wait...</div>
            </div>
          ) : (
            apkData && (
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <div
                  style={{ width: "25%", backgroundColor: "#252526", borderRight: "1px solid #333", padding: "1rem", overflowY: "auto" }}
                >
                  <JsonTreeView
                      data={apkData}
                      tabs={tabs}
                      setTabs={setTabs}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      expandedNodes={expandedNodes}
                      setExpandedNodes={setExpandedNodes}
                  />

                </div>
                <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
                <JsonDetailsView
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    closeTab={closeTab}
                    setTabs={setTabs}
                  />
                
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default JadxGUI;
