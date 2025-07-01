import React, { useCallback, useState } from "react";
import { set, unset, insert, ArrayOfObjectsInputProps } from "sanity";
import {
  Card,
  Stack,
  Text,
  Button,
  Flex,
  Box,
  Inline,
  Badge,
  Dialog,
} from "@sanity/ui";
import { AddIcon, TrashIcon, CogIcon } from "@sanity/icons";

interface CastRefArrayItem {
  _key: string;
  ref?: { _ref: string; _type: string };
  casting?: Record<string, unknown>;
}

export const CastRefArrayInput: React.FC<
  ArrayOfObjectsInputProps<CastRefArrayItem>
> = (props) => {
  const { value = [], onChange, renderDefault } = props;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCasting, setEditingCasting] = useState<Record<
    string,
    unknown
  > | null>(null);

  // Add new item
  const handleAdd = useCallback(() => {
    const newItem: CastRefArrayItem = {
      _key: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ref: undefined,
      casting: {},
    };
    onChange(insert([newItem], "after", [-1]));
  }, [onChange]);

  // Remove item
  const handleRemove = useCallback(
    (index: number) => {
      onChange(unset([index]));
    },
    [onChange],
  );

  // Update casting for an item
  const handleUpdateCasting = useCallback(
    (index: number, casting: Record<string, unknown>) => {
      const currentItem = value[index];
      if (currentItem) {
        const updatedItem = { ...currentItem, casting };
        onChange(set(updatedItem, [index]));
      }
    },
    [onChange, value],
  );

  // Open casting dialog
  const handleEditCasting = (index: number) => {
    setEditingIndex(index);
    setEditingCasting(value[index]?.casting || {});
  };

  // Save casting dialog
  const handleSaveCasting = () => {
    if (editingIndex !== null && editingCasting !== null) {
      handleUpdateCasting(editingIndex, editingCasting);
    }
    setEditingIndex(null);
    setEditingCasting(null);
  };

  // Cancel casting dialog
  const handleCancelCasting = () => {
    setEditingIndex(null);
    setEditingCasting(null);
  };

  // Simple casting editor (for demo: just JSON)
  const renderCastingDialog = () => {
    if (editingIndex === null) return null;
    return (
      <Dialog
        id="casting-dialog"
        header="Edit Variables"
        onClose={handleCancelCasting}
        width={1}
      >
        <Box padding={4}>
          <Stack space={4}>
            <Text size={2} weight="semibold">
              Edit Variables for Element
            </Text>
            <Text size={1} muted>
              (For demo: edit as JSON)
            </Text>
            <textarea
              style={{ width: "100%", minHeight: 120, fontFamily: "monospace" }}
              value={JSON.stringify(editingCasting, null, 2)}
              onChange={(e) => {
                try {
                  setEditingCasting(JSON.parse(e.target.value));
                } catch {
                  // ignore parse errors for now
                }
              }}
            />
            <Flex gap={2} justify="flex-end">
              <Button
                text="Cancel"
                mode="ghost"
                onClick={handleCancelCasting}
              />
              <Button text="Save" mode="default" onClick={handleSaveCasting} />
            </Flex>
          </Stack>
        </Box>
      </Dialog>
    );
  };

  // Custom item preview with Variables button
  const renderItem = (item: CastRefArrayItem, index: number) => {
    return (
      <Card key={item._key || index} padding={3} border radius={2}>
        <Stack space={3}>
          <Flex align="center" justify="space-between">
            <Inline space={2}>
              <Text size={1} weight="semibold">
                {item.ref?._ref ? item.ref._ref : "No reference selected"}
              </Text>
              {item.casting && Object.keys(item.casting).length > 0 && (
                <Badge tone="primary" mode="outline" fontSize={0}>
                  <CogIcon />
                </Badge>
              )}
            </Inline>
            <Button
              mode="bleed"
              tone="critical"
              icon={TrashIcon}
              onClick={() => handleRemove(index)}
              text="Remove"
            />
          </Flex>

          {}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Box>{renderDefault({ ...props, value: item } as any)}</Box>

          {}
          <Button
            mode="ghost"
            icon={CogIcon}
            text="Variables"
            onClick={() => handleEditCasting(index)}
            disabled={!item.ref?._ref}
          />
        </Stack>
      </Card>
    );
  };

  return (
    <Stack space={3}>
      <Text size={1} weight="semibold">
        Content Elements
      </Text>
      {value.length === 0 ? (
        <Card padding={3} border radius={2} tone="caution">
          <Text size={1} muted>
            No elements added yet
          </Text>
        </Card>
      ) : (
        <Stack space={2}>
          {value.map((item, index) => renderItem(item, index))}
        </Stack>
      )}
      <Button
        mode="ghost"
        icon={AddIcon}
        onClick={handleAdd}
        text="Add Element"
      />
      {renderCastingDialog()}
    </Stack>
  );
};
