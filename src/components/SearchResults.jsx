import React from "react";

const highlightMatch = (text, term) => {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ backgroundColor: "#ffeb3b", color: "#000" }}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

function SearchResults({ results, onItemClick, searchTerm }) {
  return (
    <div style={{ marginTop: "1rem", backgroundColor: "#1e1e1e" }}>
      <h5 style={{ color: "#fff" }}>Search Results</h5>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {results.map((result, index) => (
          <li
            key={index}
            onClick={() => onItemClick(result.url, result.path)}
            style={{
              padding: "8px",
              borderBottom: "1px solid #333",
              cursor: "pointer",
              color: "#ccc",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#79c0ff" }}>
              {result.path}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
              {highlightMatch(result.line, searchTerm)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
