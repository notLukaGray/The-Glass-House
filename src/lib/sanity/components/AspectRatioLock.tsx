import React from "react";
import { Box, Button, Flex } from "@sanity/ui";

interface AspectRatioLockProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const AspectRatioLock: React.FC<AspectRatioLockProps> = ({
  value,
  onChange,
}) => {
  return (
    <Flex gap={2} align="center">
      <Button
        mode={value ? "default" : "ghost"}
        size={0}
        onClick={() => onChange(!value)}
        title={value ? "Aspect ratio locked" : "Aspect ratio unlocked"}
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          style={{
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            // Locked icon
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M9.5 5.5h-.5V4c0-1.38-1.12-2.5-2.5-2.5S4 2.62 4 4v1.5h-.5C3.22 5.5 3 5.72 3 6v4.5c0 .28.22.5.5.5h6c.28 0 .5-.22.5-.5V6c0-.28-.22-.5-.5-.5zM5 4c0-.83.67-1.5 1.5-1.5S8 3.17 8 4v1.5H5V4z" />
            </svg>
          ) : (
            // Unlocked icon
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M9.5 5.5h-.5V4c0-1.38-1.12-2.5-2.5-2.5S4 2.62 4 4v1.5h-.5C3.22 5.5 3 5.72 3 6v4.5c0 .28.22.5.5.5h6c.28 0 .5-.22.5-.5V6c0-.28-.22-.5-.5-.5zM5 4c0-.83.67-1.5 1.5-1.5S8 3.17 8 4v1.5H5V4z" />
              <path
                d="M4.5 2.5L4 3l.5.5L5 3l-.5-.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </svg>
          )}
        </Box>
      </Button>
    </Flex>
  );
};

export default AspectRatioLock;
