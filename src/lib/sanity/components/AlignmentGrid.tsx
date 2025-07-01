import React from "react";
import { Box, Button } from "@sanity/ui";

interface AlignmentGridProps {
  value: string;
  onChange: (value: string) => void;
  size?: number; // grid size in px
}

const alignmentOptions = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "center-left", label: "Center Left" },
  { value: "center", label: "Center" },
  { value: "center-right", label: "Center Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

const AlignmentGrid: React.FC<AlignmentGridProps> = ({
  value,
  onChange,
  size = 100,
}) => {
  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "6px",
        width: size,
        height: size,
        border: "1.5px solid rgba(255,255,255,0.12)",
        borderRadius: "10px",
        padding: "10px",
        background: "rgba(255,255,255,0.02)",
        boxSizing: "border-box",
        alignItems: "center",
        justifyItems: "center",
      }}
    >
      {alignmentOptions.map((option) => (
        <Button
          key={option.value}
          mode="bleed"
          padding={0}
          style={{
            minHeight: "20px",
            minWidth: "20px",
            height: "20px",
            width: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            border:
              value === option.value
                ? "1.5px solid #fff"
                : "1.5px solid rgba(255,255,255,0.10)",
            background:
              value === option.value
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.04)",
            boxShadow:
              value === option.value
                ? "0 0 0 2px rgba(255,255,255,0.18)"
                : "none",
            transition: "background 0.15s, border 0.15s",
          }}
          onClick={() => onChange(option.value)}
          title={option.label}
        >
          <Box
            style={{
              width: "12px",
              height: "12px",
              backgroundColor:
                value === option.value ? "#fff" : "rgba(255,255,255,0.18)",
              borderRadius: "50%",
              margin: "auto",
              transition: "background 0.15s",
            }}
          />
        </Button>
      ))}
    </Box>
  );
};

export default AlignmentGrid;
