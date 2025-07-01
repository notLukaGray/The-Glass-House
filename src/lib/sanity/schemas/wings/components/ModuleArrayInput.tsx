import React, { useState, useCallback, useEffect } from "react";
import {
  ArrayOfObjectsInputProps,
  useClient,
  PatchEvent,
  set,
  insert,
} from "sanity";
import {
  Card,
  Stack,
  Text,
  Button,
  Flex,
  Box,
  Select,
  TextInput,
  Dialog,
  Spinner,
} from "@sanity/ui";
import { modules } from "../../modules";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ModuleDocument {
  _id: string;
  _type: string;
  title?: string;
  description?: string;
}

interface LayoutField {
  name: string;
  title: string;
  type: string;
  options?: {
    list: Array<{ title: string; value: string }>;
  };
}

export interface ModuleArrayItem {
  _key: string;
  module: { _type: string; _ref: string };
  layout: Record<string, unknown>;
  title?: string;
  description?: string;
}

// Allowed layout fields for moduleHeroImage
const allowedLayoutFields: LayoutField[] = [
  {
    name: "alignment",
    title: "Alignment",
    type: "string",
    options: {
      list: [
        { title: "Left", value: "left" },
        { title: "Center", value: "center" },
        { title: "Right", value: "right" },
        { title: "Justify", value: "justify" },
      ],
    },
  },
  {
    name: "width",
    title: "Width",
    type: "string",
    options: {
      list: [
        { title: "Full Width", value: "full" },
        { title: "Container", value: "container" },
        { title: "Narrow", value: "narrow" },
        { title: "Auto", value: "auto" },
      ],
    },
  },
  {
    name: "height",
    title: "Height",
    type: "string",
    options: {
      list: [
        { title: "Auto", value: "auto" },
        { title: "Full Height", value: "full" },
        { title: "Large", value: "large" },
        { title: "Medium", value: "medium" },
        { title: "Small", value: "small" },
      ],
    },
  },
  {
    name: "margin",
    title: "Margin",
    type: "string",
    options: {
      list: [
        { title: "None", value: "none" },
        { title: "Small", value: "small" },
        { title: "Medium", value: "medium" },
        { title: "Large", value: "large" },
        { title: "Auto", value: "auto" },
      ],
    },
  },
  {
    name: "padding",
    title: "Padding",
    type: "string",
    options: {
      list: [
        { title: "None", value: "none" },
        { title: "Small", value: "small" },
        { title: "Medium", value: "medium" },
        { title: "Large", value: "large" },
      ],
    },
  },
  {
    name: "zIndex",
    title: "Z-Index",
    type: "number",
  },
];

function ModulePreview({ value }: { value: ModuleArrayItem }) {
  const client = useClient({ apiVersion: "2025-02-10" });
  const [doc, setDoc] = useState<ModuleDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchDoc() {
      if (value && value.module && value.module._ref) {
        setLoading(true);
        setError(null);
        try {
          const d = await client.getDocument(value.module._ref);
          if (!ignore && d) setDoc(d as ModuleDocument);
        } catch (err) {
          if (!ignore) {
            console.error("Error fetching module document:", err);
            setError("Failed to load module");
          }
        } finally {
          if (!ignore) setLoading(false);
        }
      }
    }
    fetchDoc();
    return () => {
      ignore = true;
    };
  }, [value, client]);

  if (loading)
    return (
      <Flex align="center">
        <Spinner size={1} />
        <Text size={1} style={{ marginLeft: 8 }}>
          Loading…
        </Text>
      </Flex>
    );
  if (error)
    return (
      <Text size={1} style={{ color: "red" }}>
        {error}
      </Text>
    );
  if (doc) {
    return (
      <Box>
        <Text size={2} weight="semibold">
          {doc.title || "Untitled"}
        </Text>
        <Text size={1} muted>
          {doc.description || ""}
        </Text>
      </Box>
    );
  }
  return (
    <Box>
      <Text size={2} weight="semibold">
        {value?.title || "Untitled"}
      </Text>
      <Text size={1} muted>
        {value?.description || ""}
      </Text>
    </Box>
  );
}

function SortableItem({
  id,
  value,
  onEditLayout,
  onRemove,
}: {
  id: string;
  value: ModuleArrayItem;
  onEditLayout: (key: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
  };

  const handleOpenModule = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value && value.module && value.module._ref) {
      console.log("Module reference:", value.module);

      // Get the module type from the reference or use the correct type
      const moduleType = "heroImageModule"; // Based on the URL you showed
      const moduleUrl = `/structure/modules;${moduleType};${value.module._ref}`;
      console.log("Opening module URL:", moduleUrl);
      window.location.href = moduleUrl;
    }
  };

  const handleEditLayout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value && value._key) {
      onEditLayout(value._key);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card padding={2} radius={2} shadow={1} tone="primary">
        <Flex align="center" justify="space-between">
          <div
            {...attributes}
            {...listeners}
            style={{
              cursor: "grab",
              marginRight: 12,
              width: 16,
              height: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="4" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="12" r="1.5" />
            </svg>
          </div>
          <div
            style={{ flex: 1, cursor: "pointer" }}
            onClick={handleOpenModule}
          >
            <ModulePreview value={value} />
          </div>
          <Button text="Layout" size={1} onClick={handleEditLayout} />
          <Button text="Remove" tone="critical" size={1} onClick={onRemove} />
        </Flex>
      </Card>
    </div>
  );
}

// This is the main component that wraps Sanity's array input
const ModuleArrayInput: React.FC<ArrayOfObjectsInputProps> = (props) => {
  const { value, onChange } = props;
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const [selectedModuleType, setSelectedModuleType] = useState<string>("");
  const [editingLayoutKey, setEditingLayoutKey] = useState<string | null>(null);
  const [layoutVariables, setLayoutVariables] = useState<
    Record<string, Record<string, unknown>>
  >({});
  const client = useClient({ apiVersion: "2025-02-10" });
  const sensors = useSensors(useSensor(PointerSensor));

  // Get module type options from the imported modules array
  const moduleTypeOptions = React.useMemo(() => {
    console.log("Modules import:", modules);
    if (!modules || !Array.isArray(modules)) {
      console.log("Modules is not an array or is undefined");
      return [];
    }
    return modules.map((module) => {
      console.log("Processing module:", module);
      return {
        type: module.name,
        title:
          module.title ||
          module.name
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str: string) => str.toUpperCase()),
      };
    });
  }, []);

  // Create a new module and add it to the array
  const createModule = useCallback(async () => {
    if (!selectedModuleType) return;
    try {
      const newModule = {
        _type: selectedModuleType,
        title: `New ${selectedModuleType
          .replace("module", "")
          .replace(/([A-Z])/g, " $1")
          .trim()}`,
        description: `Description for the new ${selectedModuleType
          .replace("module", "")
          .replace(/([A-Z])/g, " $1")
          .trim()}`,
        moduleType: selectedModuleType,
      };
      const createdModule = await client.create(newModule);
      const newModuleObj: ModuleArrayItem = {
        _key: `module-${Date.now()}`,
        module: {
          _type: "reference",
          _ref: createdModule._id,
        },
        layout: {},
      };
      onChange(PatchEvent.from(insert([newModuleObj], "after", [-1])));
      setShowModuleSelector(false);
      setSelectedModuleType("");
    } catch (error) {
      console.error("Error creating module:", error);
    }
  }, [selectedModuleType, client, onChange]);

  // Remove a module from the array
  const removeModule = useCallback(
    (index: number) => {
      const newValue = [...(value || [])];
      newValue.splice(index, 1);
      onChange(PatchEvent.from(set(newValue)));
    },
    [onChange, value],
  );

  // Update layout variables for a specific module
  const updateLayoutVariable = useCallback(
    (moduleKey: string, key: string, value: unknown) => {
      setLayoutVariables((prev) => ({
        ...prev,
        [moduleKey]: {
          ...prev[moduleKey],
          [key]: value,
        },
      }));
    },
    [],
  );

  // Save layout variables (in a real implementation, you'd save this to a sibling field)
  const saveLayoutVariables = useCallback(() => {
    if (!editingLayoutKey) return;
    const valueArray = (Array.isArray(value) ? value : []) as ModuleArrayItem[];
    const filteredArray = valueArray.filter(
      (item): item is ModuleArrayItem =>
        item && item.module && typeof item.layout === "object",
    );
    const idx = filteredArray.findIndex(
      (item) => item._key === editingLayoutKey,
    );
    if (idx === -1) return;
    const newValue: ModuleArrayItem[] = [...filteredArray];
    newValue[idx] = {
      ...newValue[idx],
      layout: layoutVariables[editingLayoutKey] || {},
    };
    onChange(PatchEvent.from(set(newValue)));
    setEditingLayoutKey(null);
  }, [editingLayoutKey, layoutVariables, value, onChange]);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const valueArray = (
        Array.isArray(value) ? value : []
      ) as ModuleArrayItem[];
      if (!valueArray.length) return;
      if (over && active.id !== over.id) {
        const oldIndex = valueArray.findIndex(
          (item: ModuleArrayItem) => item._key === active.id,
        );
        const newIndex = valueArray.findIndex(
          (item: ModuleArrayItem) => item._key === over.id,
        );
        const newValue = arrayMove(valueArray, oldIndex, newIndex);
        onChange(PatchEvent.from(set(newValue)));
      }
    },
    [value, onChange],
  );

  // Render layout variables editor dialog
  const renderLayoutDialog = () => {
    if (!editingLayoutKey) return null;

    // Find the layout object for this module by _key
    const layout = layoutVariables[editingLayoutKey] || {};

    return (
      <Dialog
        id="layout-dialog"
        onClose={() => setEditingLayoutKey(null)}
        width={1}
      >
        <Box padding={4}>
          <Stack space={4}>
            <Text size={2} weight="semibold">
              Layout
            </Text>
            <Text size={1} muted>
              Layout variables for module: {editingLayoutKey}
            </Text>
            <Stack space={3}>
              {allowedLayoutFields.map((field) => (
                <Flex gap={2} align="center" key={field.name}>
                  <Text size={1} style={{ width: "100px" }}>
                    {field.title}:
                  </Text>
                  <Box flex={1}>
                    {field.type === "string" && field.options ? (
                      <Select
                        value={(layout[field.name] as string) || ""}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          updateLayoutVariable(
                            editingLayoutKey,
                            field.name,
                            e.currentTarget.value,
                          )
                        }
                      >
                        <option value="">Select...</option>
                        {field.options.list.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.title}
                          </option>
                        ))}
                      </Select>
                    ) : field.type === "number" ? (
                      <TextInput
                        type="number"
                        value={(layout[field.name] as string) || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateLayoutVariable(
                            editingLayoutKey,
                            field.name,
                            e.currentTarget.value,
                          )
                        }
                        placeholder={field.title}
                      />
                    ) : null}
                  </Box>
                </Flex>
              ))}
            </Stack>
            <Flex gap={2} justify="flex-end">
              <Button
                mode="ghost"
                text="Cancel"
                onClick={() => setEditingLayoutKey(null)}
              />
              <Button
                mode="default"
                text="Save"
                onClick={saveLayoutVariables}
              />
            </Flex>
          </Stack>
        </Box>
      </Dialog>
    );
  };

  // Render module selector dialog
  const renderModuleSelector = () => {
    if (!showModuleSelector) return null;

    return (
      <Dialog
        id="module-selector"
        onClose={() => setShowModuleSelector(false)}
        width={1}
      >
        <Box padding={4}>
          <Stack space={4}>
            <Text size={2} weight="semibold">
              Choose Module Type
            </Text>
            <Select
              value={selectedModuleType}
              onChange={(event) =>
                setSelectedModuleType(event.currentTarget.value)
              }
            >
              <option value="">Select a module type...</option>
              {moduleTypeOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.title}
                </option>
              ))}
            </Select>
            <Flex gap={2} justify="flex-end">
              <Button
                mode="ghost"
                text="Cancel"
                onClick={() => setShowModuleSelector(false)}
              />
              <Button
                mode="default"
                text="Create Module"
                onClick={createModule}
                disabled={!selectedModuleType}
              />
            </Flex>
          </Stack>
        </Box>
      </Dialog>
    );
  };

  return (
    <Box>
      <Stack space={3}>
        <Flex justify="space-between" align="center">
          <Text size={2} weight="semibold">
            Modules
          </Text>
          <Button
            text="Add Module"
            size={1}
            onClick={() => setShowModuleSelector(true)}
          />
        </Flex>
        <Text size={1} muted>
          Modules placed in this wing
        </Text>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={(
              (Array.isArray(value) ? value : []) as ModuleArrayItem[]
            ).map((item) => item._key)}
            strategy={verticalListSortingStrategy}
          >
            {((Array.isArray(value) ? value : []) as ModuleArrayItem[]).map(
              (item, idx) => (
                <SortableItem
                  key={item._key}
                  id={item._key}
                  value={item}
                  onEditLayout={setEditingLayoutKey}
                  onRemove={() => removeModule(idx)}
                />
              ),
            )}
          </SortableContext>
        </DndContext>
        {renderLayoutDialog()}
        {renderModuleSelector()}
      </Stack>
    </Box>
  );
};

export default ModuleArrayInput;
