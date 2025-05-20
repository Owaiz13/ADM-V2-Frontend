import React, { useEffect, useCallback, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Helper to infer language based on file extension
const getLanguage = (url) => {
  if (!url) return "text";
  const extension = url.split(".").pop().toLowerCase();
  const map = {
    xml: "xml",
    smali: "java",
    java: "java",
    kt: "java",
    json: "json",
    html: "html",
    js: "javascript",
    css: "css",
    txt: "text",
  };
  return map[extension] || "text";
};

function JsonDetailsView({
  tabs = [],
  activeTab,
  setActiveTab = () => {},
  closeTab = () => {},
  setTabs = () => {},
  searchKeyword = "",
}) {
  const [highlightedContent, setHighlightedContent] = useState("");

  const highlightKeyword = useCallback((content) => {
    if (!searchKeyword || typeof content !== "string") return content;
    const escapedKeyword = searchKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(escapedKeyword, "gi");
    return content.replace(regex, (match) => `<mark style="background: yellow; color: black;">${match}</mark>`);
  }, [searchKeyword]);

  // Fetch content for each tab if not already fetched
  useEffect(() => {
    tabs.forEach((tab, index) => {
      if (!tab.content && !tab.loading && !tab.error && tab.url) {
        setTabs((prevTabs) => {
          const updated = [...prevTabs];
          updated[index] = { ...tab, loading: true };
          return updated;
        });

        fetch(tab.url)
          .then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
            return res.text();
          })
          .then((text) => {
            setTabs((prevTabs) => {
              const updated = [...prevTabs];
              updated[index] = {
                ...updated[index],
                content: text,
                loading: false,
                error: null,
              };
              return updated;
            });
          })
          .catch((err) => {
            setTabs((prevTabs) => {
              const updated = [...prevTabs];
              updated[index] = {
                ...updated[index],
                error: err.message || "Error loading content",
                loading: false,
              };
              return updated;
            });
          });
      }
    });
  }, [tabs, setTabs]);

  const active = tabs.find((tab) => tab.url === activeTab);

  // Highlight keyword in content
  useEffect(() => {
    if (active?.content) {
      const html = highlightKeyword(active.content);
      setHighlightedContent(html);
    }
  }, [active, highlightKeyword]);

  return (
    <div
      style={{
        height: "70vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#1e1e1e",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Fira Code', 'Consolas', monospace",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#252526",
          borderBottom: "1px solid #333",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.url}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 12px",
              cursor: "pointer",
              backgroundColor: tab.url === activeTab ? "#1e1e1e" : "transparent",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              borderBottom: tab.url === activeTab ? "2px solid #007acc" : "none",
              color: "#ccc",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              marginRight: "4px",
            }}
            onClick={() => setActiveTab(tab.url)}
          >
            📄 {tab.name || tab.url.split("/").pop()}
            <span
              style={{
                marginLeft: "8px",
                color: "#888",
                fontWeight: "bold",
              }}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.url);
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      {/* Content Viewer */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", color: "#ccc" }}>
        {!active ? (
          <div>📁 Select a file to view its content.</div>
        ) : active.loading ? (
          <div>🔄 Loading file...</div>
        ) : active.error ? (
          <div style={{ color: "red" }}>⚠️ Error: {active.error}</div>
        ) : (
          <>
            {!searchKeyword ? (
              <SyntaxHighlighter
                language={getLanguage(active.url)}
                style={vscDarkPlus}
                wrapLines
                wrapLongLines
                customStyle={{
                  background: "transparent",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
                showLineNumbers
                useInlineStyles
              >
                {active.content}
              </SyntaxHighlighter>
            ) : (
              <pre
                style={{
                  marginTop: "-1rem",
                  background: "transparent",
                  color: "#ccc",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  fontFamily: "'Fira Code', monospace",
                  whiteSpace: "pre-wrap",
                }}
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default JsonDetailsView;
