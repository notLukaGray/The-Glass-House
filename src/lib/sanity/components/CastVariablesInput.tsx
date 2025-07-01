import { CogIcon } from "@sanity/icons";
import { Box, Button, Dialog, Stack, Text } from "@sanity/ui";
import React, { useState } from "react";

interface CastVariablesInputProps {
  value?: Record<string, unknown>;
  onChange: (patch: { type: string; value: Record<string, unknown> }) => void;
  components?: {
    input?: React.ComponentType<unknown>;
  };
  type?: {
    components?: {
      input?: React.ComponentType<unknown>;
    };
  };
}

const CastVariablesInput = React.forwardRef<
  HTMLDivElement,
  CastVariablesInputProps
>(function CastVariablesInput(props) {
  const { value, onChange } = props;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(value || {});

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(value || {});
    setOpen(true);
  };

  const handleSave = () => {
    onChange({ type: "set", value: editing });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box style={{ position: "relative", width: "100%" }}>
        <Button
          icon={CogIcon}
          mode="bleed"
          style={{ position: "absolute", right: 0, top: 0, zIndex: 2 }}
          onClick={handleOpen}
          aria-label="Edit Variables"
        />
        {/* Optionally, show a summary or badge here */}
        <Box paddingTop={4}>
          {/* Render children or a summary of variables here if needed */}
        </Box>
      </Box>

      {open && (
        <Dialog
          id="cast-variables-dialog"
          header="Edit Variables"
          onClose={handleClose}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={2} weight="semibold">
                Edit Variables
              </Text>
              {/* Replace this with your custom UI for editing casting variables */}
              <textarea
                style={{
                  width: "100%",
                  minHeight: 120,
                  fontFamily: "monospace",
                }}
                value={JSON.stringify(editing, null, 2)}
                onChange={(e) => {
                  try {
                    setEditing(JSON.parse(e.target.value));
                  } catch {
                    // ignore parse errors for now
                  }
                }}
              />
              <Button text="Save" mode="default" onClick={handleSave} />
            </Stack>
          </Box>
        </Dialog>
      )}
    </>
  );
});

export default CastVariablesInput;
