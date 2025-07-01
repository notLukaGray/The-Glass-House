import React from "react";
import type { ModuleArrayItem } from "./ModuleArrayInput";

interface ModuleReferencePreviewProps {
  value: ModuleArrayItem;
  renderDefault: (props: ModuleReferencePreviewProps) => React.ReactNode;
}

interface WindowWithOpenLayoutDialog extends Window {
  openLayoutDialog?: (key: string) => void;
}

export default function ModuleReferencePreview(
  props: ModuleReferencePreviewProps,
) {
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div style={{ flex: 1 }}>{props.renderDefault(props)}</div>
      <button
        style={{ marginLeft: 8 }}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if ((window as WindowWithOpenLayoutDialog).openLayoutDialog) {
            (window as WindowWithOpenLayoutDialog).openLayoutDialog?.(
              props.value._key,
            );
          }
        }}
      >
        Layout
      </button>
    </div>
  );
}
