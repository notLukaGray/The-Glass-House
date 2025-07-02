import React from "react";

interface DisplayOnlyFieldProps {
  value: Record<string, unknown>;
  title: string;
}

export const DisplayOnlyField: React.FC<DisplayOnlyFieldProps> = ({
  value,
  title,
}) => {
  if (!value) {
    return <div>No {title.toLowerCase()} generated yet</div>;
  }

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
        Generated {title}:
      </div>
      {Object.entries(value).map(([lang, text]: [string, unknown]) => {
        if (lang === "_type") return null;
        return (
          <div key={lang} style={{ marginBottom: "5px" }}>
            <span
              style={{
                textTransform: "uppercase",
                fontSize: "12px",
                color: "#666",
              }}
            >
              {lang}:
            </span>
            <span style={{ marginLeft: "8px" }}>{String(text)}</span>
          </div>
        );
      })}
    </div>
  );
};
