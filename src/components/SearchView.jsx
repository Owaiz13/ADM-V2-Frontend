import React, { useEffect, useState } from "react";
import JadxSearchBar from "./JadxSearchBar";
import SearchResults from "./SearchResults";
import JsonDetailsView from "./JsonDetailsView";

function SearchView({ apkData, onBack }) {
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [tabs, setTabs] = useState([]);

  const handleSearch = async (term) => {
    if (!apkData || !term) return;

    const results = [];

    const searchTree = async (node, path = "") => {
      for (const key in node) {
        const value = node[key];
        const currentPath = `${path}/${key}`;

        if (value && typeof value === "object") {
          if (value.url) {
            try {
              const res = await fetch(value.url);
              const content = await res.text();
              const lines = content.split("\n");

              lines.forEach((line, i) => {
                if (line.toLowerCase().includes(term.toLowerCase())) {
                  results.push({
                    path: currentPath,
                    url: value.url,
                    line: `${i + 1}: ${line.trim()}`,
                    keyword: term,
                  });
                }
              });
            } catch (err) {
              console.error("Error fetching content for", key, err);
            }
          } else {
            await searchTree(value, currentPath);
          }
        }
      }
    };

    await searchTree(apkData);
    setSearchResults(results);
  };

  const openTab = (url, path, keyword) => {
    const exists = tabs.find((tab) => tab.url === url);
    if (!exists) {
      setTabs((prev) => [...prev, { url, path, keyword }]);
    }
    setActiveTab(url);
  };

  const closeTab = (url) => {
    setTabs((prev) => prev.filter((tab) => tab.url !== url));
    if (activeTab === url) {
      const next = tabs.find((tab) => tab.url !== url);
      setActiveTab(next?.url || null);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        fontFamily: "monospace",
      }}
    >
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: "#333" }}>
        <h5 style={{ margin: 0 }}>🔍 Search APK Content</h5>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          ⬅ Back
        </button>
      </div>

      <div style={{ padding: "1rem", borderBottom: "1px solid #333" }}>
        <JadxSearchBar onSearch={handleSearch} />
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div
          style={{
            width: "30%",
            backgroundColor: "#252526",
            borderRight: "1px solid #333",
            overflowY: "auto",
            padding: "1rem",
          }}
        >
          <SearchResults
            results={searchResults}
            onItemClick={(url, path, keyword) => openTab(url, path, keyword)}
          />
        </div>
        <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
          <JsonDetailsView
            tabs={tabs}
            setTabs={setTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            closeTab={closeTab}
            highlightTerm={tabs.find((t) => t.url === activeTab)?.keyword}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchView;
