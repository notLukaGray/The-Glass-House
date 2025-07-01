import React, { useState, useEffect } from "react";
import { ReferenceInputProps, PatchEvent, set, useClient } from "sanity";
import {
  Button,
  Dialog,
  Box,
  Stack,
  Text,
  Flex,
  Select,
  TextInput,
  Spinner,
  Switch,
} from "@sanity/ui";
import { elementCastingRegistry } from "../schemas/element/elementCastingRegistry";
import AlignmentGrid from "./AlignmentGrid";
import AspectRatioLock from "./AspectRatioLock";
import { CogIcon } from "@sanity/icons";
import { renderCastingCards } from "./renderCastingCards.js";

interface CastingValue {
  [key: string]: unknown;
}

interface RefValue {
  _ref: string;
  _type?: string;
}

interface SizeAndPosition {
  width?: { value: string | number; unit: string };
  height?: { value: string | number; unit: string };
  position?: {
    x: { value: string | number; unit: string };
    y: { value: string | number; unit: string };
  };
  aspectRatioLock?: boolean;
  rotation?: number;
  scale?: number;
  alignment?: string;
}

interface DisplayAndTransform {
  objectFit?: string;
  opacity?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  zIndex?: string | number;
}

// Field interface for better type safety
interface CastingField {
  name: string;
  title: string;
  type: string;
  initialValue?: unknown;
  options?: {
    list?: Array<{ value?: unknown; title?: unknown }>;
  };
  min?: number;
  max?: number;
  step?: number;
}

const CastRefInput: React.FC<ReferenceInputProps> = (props) => {
  const { value = {}, onChange } = props;
  const [showCasting, setShowCasting] = useState(false);
  const [refDocType, setRefDocType] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(
    new Set(["sizeAndPosition"]),
  );
  const client = useClient({ apiVersion: "2023-05-03" });
  const refValue =
    value && typeof value === "object" && "ref" in value
      ? value.ref
      : undefined;
  const casting: CastingValue =
    value && typeof value === "object" && "casting" in value && value.casting
      ? (value.casting as CastingValue)
      : {};

  useEffect(() => {
    let ignore = false;
    async function fetchType() {
      if (
        refValue &&
        typeof refValue === "object" &&
        (refValue as RefValue)._ref
      ) {
        setLoading(true);
        try {
          const doc = await client.getDocument((refValue as RefValue)._ref);
          if (!ignore) {
            setRefDocType(doc?._type);
          }
        } catch {
          if (!ignore) setRefDocType(undefined);
        } finally {
          if (!ignore) setLoading(false);
        }
      } else {
        setRefDocType(undefined);
      }
    }
    fetchType();
    return () => {
      ignore = true;
    };
  }, [refValue, client]);

  // Use the registry to get casting fields
  const castingFields =
    refDocType && elementCastingRegistry[refDocType]
      ? elementCastingRegistry[refDocType]
      : [];

  // Handle reference change (PatchEvent)
  const handleRefChange = (patchEvent: PatchEvent) => {
    let newRef = undefined;
    for (const patch of patchEvent.patches) {
      if (patch.type === "set") {
        newRef = patch.value;
        break;
      }
    }
    onChange(PatchEvent.from([set({ ...value, ref: newRef })]));
  };

  // Handle casting field change
  const handleCastingChange = (
    segmentName: string,
    fieldName: string,
    fieldValue: unknown,
  ) => {
    const currentSegment = (casting[segmentName] as CastingValue) || {};
    onChange(
      PatchEvent.from([
        set({
          ...value,
          casting: {
            ...casting,
            [segmentName]: {
              ...currentSegment,
              [fieldName]: fieldValue,
            },
          },
        }),
      ]),
    );
  };

  // Handle nested field change (for width/height objects)
  const handleNestedCastingChange = (
    segmentName: string,
    fieldName: string,
    nestedField: string,
    fieldValue: unknown,
  ) => {
    const currentSegment = (casting[segmentName] as CastingValue) || {};
    const currentField = (currentSegment[fieldName] as CastingValue) || {};
    onChange(
      PatchEvent.from([
        set({
          ...value,
          casting: {
            ...casting,
            [segmentName]: {
              ...currentSegment,
              [fieldName]: {
                ...currentField,
                [nestedField]: fieldValue,
              },
            },
          },
        }),
      ]),
    );
  };

  // Toggle segment expansion
  const toggleSegment = (segmentName: string) => {
    const newExpanded = new Set(expandedSegments);
    if (newExpanded.has(segmentName)) {
      newExpanded.delete(segmentName);
    } else {
      newExpanded.add(segmentName);
    }
    setExpandedSegments(newExpanded);
  };

  // Use type guards for safe property access on casting
  function getSegment<T = Record<string, unknown>>(
    segment: unknown,
  ): T | undefined {
    return typeof segment === "object" && segment !== null
      ? (segment as T)
      : undefined;
  }

  // Helper for safe string/number rendering
  function safeString(val: unknown): string {
    if (typeof val === "string" || typeof val === "number") return String(val);
    return "";
  }

  // Helper for safe boolean conversion
  function safeBoolean(val: unknown): boolean {
    return Boolean(val);
  }

  // Helper to safely get field value
  function getFieldValue(
    casting: CastingValue,
    segmentName: string,
    fieldName: string,
  ): unknown {
    const segment = getSegment<CastingValue>(casting[segmentName]);
    return segment?.[fieldName];
  }

  // Render a field based on its type
  const renderField = (segmentName: string, field: CastingField | null) => {
    if (segmentName === "sizeAndPosition") {
      const sizeAndPosition = getSegment<SizeAndPosition>(
        (casting as Record<string, unknown>)["sizeAndPosition"],
      );
      const width = sizeAndPosition?.width || { value: "", unit: "px" };
      const height = sizeAndPosition?.height || { value: "", unit: "px" };
      const position = sizeAndPosition?.position || {
        x: { value: "", unit: "px" },
        y: { value: "", unit: "px" },
      };
      const aspectRatioLock = sizeAndPosition?.aspectRatioLock ?? false;
      const rotation = sizeAndPosition?.rotation || 0;
      const scale = sizeAndPosition?.scale || 1.0;
      const alignment = sizeAndPosition?.alignment || "center";

      return (
        <Flex
          style={{
            width: "100%",
            padding: 18,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10,
            border: "1.5px solid rgba(255,255,255,0.08)",
            alignItems: "center",
          }}
        >
          {}
          <Box
            flex={13}
            style={{
              minWidth: 0,
              paddingRight: 20,
              borderRight: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {}
            <Box marginBottom={3}>
              <Text size={0} weight="medium" muted style={{ marginBottom: 4 }}>
                Width / Height
              </Text>
              <Flex gap={2} align="center" marginTop={1}>
                {}
                <Box
                  flex={1}
                  style={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <TextInput
                    type="number"
                    value={safeString(width.value)}
                    onChange={(e) =>
                      handleNestedCastingChange(
                        segmentName,
                        "width",
                        "value",
                        Number(e.currentTarget.value),
                      )
                    }
                    placeholder="Width"
                    style={{
                      minWidth: 0,
                      width: "100%",
                      fontSize: 13,
                      background: "rgba(255,255,255,0.06)",
                      border: "none",
                      padding: "2px 6px",
                      height: 32,
                    }}
                  />
                  <Button
                    mode={width.unit === "px" ? "default" : "ghost"}
                    padding={1}
                    text="px"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 12,
                      minWidth: 28,
                      height: 32,
                    }}
                    onClick={() =>
                      handleNestedCastingChange(
                        segmentName,
                        "width",
                        "unit",
                        "px",
                      )
                    }
                  />
                  <Button
                    mode={width.unit === "%" ? "default" : "ghost"}
                    padding={1}
                    text="%"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 12,
                      minWidth: 28,
                      height: 32,
                    }}
                    onClick={() =>
                      handleNestedCastingChange(
                        segmentName,
                        "width",
                        "unit",
                        "%",
                      )
                    }
                  />
                </Box>
                {}
                <Box
                  flex={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginLeft: 8,
                  }}
                >
                  <TextInput
                    type="number"
                    value={safeString(height.value)}
                    onChange={(e) =>
                      handleNestedCastingChange(
                        segmentName,
                        "height",
                        "value",
                        Number(e.currentTarget.value),
                      )
                    }
                    placeholder="Height"
                    style={{
                      minWidth: 0,
                      width: "100%",
                      fontSize: 13,
                      background: "rgba(255,255,255,0.06)",
                      border: "none",
                      padding: "2px 6px",
                      height: 32,
                    }}
                  />
                  <Button
                    mode={height.unit === "px" ? "default" : "ghost"}
                    padding={1}
                    text="px"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 12,
                      minWidth: 28,
                      height: 32,
                    }}
                    onClick={() =>
                      handleNestedCastingChange(
                        segmentName,
                        "height",
                        "unit",
                        "px",
                      )
                    }
                  />
                  <Button
                    mode={height.unit === "%" ? "default" : "ghost"}
                    padding={1}
                    text="%"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 12,
                      minWidth: 28,
                      height: 32,
                    }}
                    onClick={() =>
                      handleNestedCastingChange(
                        segmentName,
                        "height",
                        "unit",
                        "%",
                      )
                    }
                  />
                </Box>
              </Flex>
            </Box>
            {}
            <Box marginBottom={3}>
              <Text size={0} weight="medium" muted style={{ marginBottom: 4 }}>
                X / Y Position
              </Text>
              <Flex gap={2} align="center" marginTop={1}>
                {}
                <Box
                  flex={1}
                  style={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <TextInput
                    type="number"
                    value={safeString(position.x.value)}
                    onChange={(e) =>
                      handleNestedCastingChange(segmentName, "position", "x", {
                        ...position.x,
                        value: Number(e.currentTarget.value),
                      })
                    }
                    placeholder="X"
                    style={{
                      minWidth: 0,
                      width: "100%",
                      fontSize: 13,
                      background: "rgba(255,255,255,0.06)",
                      border: "none",
                      padding: "2px 6px",
                      height: 32,
                    }}
                  />
                  <Button
                    mode={position.x.unit === "px" ? "default" : "ghost"}
                    padding={1}
                    text="px"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 12,
                      minWidth: 28,
                      height: 32,
                    }}
                    onClick={() =>
                      handleNestedCastingChange(segmentName, "position", "x", {
                        ...position.x,
                        unit: "px",
                      })
                    }
                  />
                  <Button
                    mode={position.x.unit === "%" ? "default" : "ghost"}
                    padding={1}
                    text="%"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 12,
                      minWidth: 28,
                      height: 32,
                    }}
                    onClick={() =>
                      handleNestedCastingChange(segmentName, "position", "x", {
                        ...position.x,
                        unit: "%",
                      })
                    }
                  />
                </Box>
                {}
                <Box
                  flex={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginLeft: 8,
                  }}
                >
                  <TextInput
                    type="number"
                    value={safeString(position.y.value)}
                    onChange={(e) =>
                      handleNestedCastingChange(segmentName, "position", "y", {
                        ...position.y,
                        value: Number(e.currentTarget.value),
                      })
                    }
                    placeholder="Y"
                    style={{
                      minWidth: 0,
                      width: "100%",
                      fontSize: 13,
                      background: "rgba(255,255,255,0.06)",
                      border: "none",
                      padding: "2px 6px",
                      height: 32,
                    }}
                  />
                  <Button
                    mode={position.y.unit === "px" ? "default" : "ghost"}
                    padding={1}
                    text="px"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 12,
                      minWidth: 28,
                      height: 32,
                    }}
                    onClick={() =>
                      handleNestedCastingChange(segmentName, "position", "y", {
                        ...position.y,
                        unit: "px",
                      })
                    }
                  />
                  <Button
                    mode={position.y.unit === "%" ? "default" : "ghost"}
                    padding={1}
                    text="%"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 12,
                      minWidth: 28,
                      height: 32,
                    }}
                    onClick={() =>
                      handleNestedCastingChange(segmentName, "position", "y", {
                        ...position.y,
                        unit: "%",
                      })
                    }
                  />
                </Box>
              </Flex>
            </Box>
            {}
            <Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Box
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text size={0} weight="semibold" muted>
                    Aspect Ratio
                  </Text>
                  <Box
                    marginTop={1}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: 32,
                    }}
                  >
                    <AspectRatioLock
                      value={aspectRatioLock}
                      onChange={(val) =>
                        handleCastingChange(segmentName, "aspectRatioLock", val)
                      }
                    />
                  </Box>
                </Box>
                <Box
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    marginLeft: 8,
                  }}
                >
                  <Text size={0} weight="semibold" muted>
                    Rotation
                  </Text>
                  <Flex
                    align="center"
                    gap={1}
                    marginTop={1}
                    style={{ height: 32 }}
                  >
                    <TextInput
                      type="number"
                      value={safeString(rotation)}
                      onChange={(e) =>
                        handleCastingChange(
                          segmentName,
                          "rotation",
                          Number(e.currentTarget.value),
                        )
                      }
                      placeholder="0"
                      style={{
                        width: 48,
                        textAlign: "right",
                        fontSize: 13,
                        padding: "2px 6px",
                        background: "rgba(255,255,255,0.06)",
                        border: "none",
                        height: 32,
                      }}
                    />
                    <Text size={1} muted>
                      °
                    </Text>
                  </Flex>
                </Box>
                <Box
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    marginLeft: 8,
                  }}
                >
                  <Text size={0} weight="semibold" muted>
                    Scale
                  </Text>
                  <Flex
                    align="center"
                    gap={1}
                    marginTop={1}
                    style={{ height: 32 }}
                  >
                    <TextInput
                      type="number"
                      value={safeString(scale)}
                      onChange={(e) =>
                        handleCastingChange(
                          segmentName,
                          "scale",
                          Number(e.currentTarget.value),
                        )
                      }
                      placeholder="1.0"
                      style={{
                        width: 48,
                        textAlign: "right",
                        fontSize: 13,
                        padding: "2px 6px",
                        background: "rgba(255,255,255,0.06)",
                        border: "none",
                        height: 32,
                      }}
                    />
                    <Text size={1} muted>
                      x
                    </Text>
                  </Flex>
                </Box>
              </Box>
            </Box>
          </Box>
          {}
          <Box
            flex={7}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minWidth: 0,
              paddingLeft: 12,
            }}
          >
            <Text size={0} weight="medium" muted style={{ marginBottom: 6 }}>
              Alignment
            </Text>
            <AlignmentGrid
              value={alignment}
              onChange={(val) =>
                handleCastingChange(segmentName, "alignment", val)
              }
              size={100}
            />
          </Box>
        </Flex>
      );
    }
    if (segmentName === "displayAndTransform") {
      const displayAndTransform = getSegment<DisplayAndTransform>(
        (casting as Record<string, unknown>)["displayAndTransform"],
      );
      const objectFit = displayAndTransform?.objectFit || "";
      const opacity = displayAndTransform?.opacity || 100;
      const flipHorizontal = displayAndTransform?.flipHorizontal || false;
      const flipVertical = displayAndTransform?.flipVertical || false;
      const zIndex = displayAndTransform?.zIndex || "";

      return (
        <Box
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12,
            border: "1.5px solid rgba(255,255,255,0.08)",
            padding: 18,
            marginTop: 16,
          }}
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              alignItems: "center",
            }}
          >
            {}
            <Box>
              <Text size={0} weight="medium" muted style={{ marginBottom: 4 }}>
                Object Fit
              </Text>
              <Select
                value={objectFit}
                onChange={(e) =>
                  handleCastingChange(
                    segmentName,
                    "objectFit",
                    e.currentTarget.value,
                  )
                }
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  marginBottom: 10,
                  fontSize: 13,
                }}
              >
                <option value="">Select...</option>
                <option value="fill">Fill</option>
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="scale-down">Scale Down</option>
                <option value="none">None</option>
              </Select>
              <Text size={0} weight="medium" muted style={{ marginBottom: 4 }}>
                Opacity
              </Text>
              <TextInput
                type="number"
                value={safeString(opacity)}
                onChange={(e) =>
                  handleCastingChange(
                    segmentName,
                    "opacity",
                    Number(e.currentTarget.value),
                  )
                }
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  width: "100%",
                  fontSize: 13,
                }}
              />
            </Box>
            {}
            <Box>
              <Text size={0} weight="medium" muted style={{ marginBottom: 4 }}>
                Z-Index
              </Text>
              <TextInput
                type="number"
                value={safeString(zIndex)}
                onChange={(e) =>
                  handleCastingChange(
                    segmentName,
                    "zIndex",
                    Number(e.currentTarget.value),
                  )
                }
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  width: "100%",
                  fontSize: 13,
                }}
              />
              <Flex gap={3} align="center" style={{ marginTop: 8 }}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text
                    size={0}
                    weight="medium"
                    muted
                    style={{ marginBottom: 4 }}
                  >
                    Flip Horizontal
                  </Text>
                  <Switch
                    checked={flipHorizontal}
                    onChange={(e) =>
                      handleCastingChange(
                        segmentName,
                        "flipHorizontal",
                        e.currentTarget.checked,
                      )
                    }
                    style={{ height: 32 }}
                  />
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text
                    size={0}
                    weight="medium"
                    muted
                    style={{ marginBottom: 4 }}
                  >
                    Flip Vertical
                  </Text>
                  <Switch
                    checked={flipVertical}
                    onChange={(e) =>
                      handleCastingChange(
                        segmentName,
                        "flipVertical",
                        e.currentTarget.checked,
                      )
                    }
                    style={{ height: 32 }}
                  />
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      );
    }
    if (!field) return null;

    const fieldValue = getFieldValue(casting, segmentName, field.name);
    const fieldTitle =
      typeof field.title === "string" ? field.title : String(field.name);
    const fieldName = typeof field.name === "string" ? field.name : "";

    const optionsList =
      field.options &&
      typeof field.options === "object" &&
      "list" in field.options &&
      Array.isArray((field.options as { list?: unknown[] }).list)
        ? (field.options as { list: unknown[] }).list
        : [];

    const safeFieldValue = safeString(fieldValue);

    return (
      <Flex gap={2} align="center" key={fieldName}>
        <Text size={1} style={{ width: "120px" }}>
          {fieldTitle}:
        </Text>
        <Box flex={1}>
          {field.type === "string" && field.options ? (
            fieldName === "alignment" ? (
              <AlignmentGrid
                value={
                  safeString(fieldValue) ||
                  safeString(field.initialValue) ||
                  "center"
                }
                onChange={(value) =>
                  handleCastingChange(segmentName, fieldName, value)
                }
              />
            ) : (
              <Select
                value={safeFieldValue}
                onChange={(e) =>
                  handleCastingChange(
                    segmentName,
                    fieldName,
                    e.currentTarget.value,
                  )
                }
              >
                {Array.isArray(optionsList)
                  ? optionsList.map((optRaw) => {
                      const opt = optRaw as {
                        value?: unknown;
                        title?: unknown;
                      };
                      return (
                        <option
                          key={safeString(opt.value)}
                          value={safeString(opt.value)}
                        >
                          {safeString(opt.title)}
                        </option>
                      );
                    })
                  : null}
              </Select>
            )
          ) : field.type === "number" ? (
            <TextInput
              type="number"
              value={
                safeString(fieldValue) || safeString(field.initialValue) || ""
              }
              onChange={(e) =>
                handleCastingChange(
                  segmentName,
                  fieldName,
                  Number(e.currentTarget.value),
                )
              }
              placeholder={fieldTitle}
              min={typeof field.min === "number" ? field.min : undefined}
              max={typeof field.max === "number" ? field.max : undefined}
              step={typeof field.step === "number" ? field.step : undefined}
            />
          ) : field.type === "boolean" ? (
            fieldName === "aspectRatioLock" ? (
              <AspectRatioLock
                value={
                  safeBoolean(fieldValue) ||
                  safeBoolean(field.initialValue) ||
                  false
                }
                onChange={(value) =>
                  handleCastingChange(segmentName, fieldName, value)
                }
              />
            ) : (
              <Switch
                checked={
                  safeBoolean(fieldValue) ||
                  safeBoolean(field.initialValue) ||
                  false
                }
                onChange={(e) =>
                  handleCastingChange(
                    segmentName,
                    fieldName,
                    e.currentTarget.checked,
                  )
                }
              />
            )
          ) : null}
        </Box>
      </Flex>
    );
  };

  const renderedCastingCards = renderCastingCards(
    castingFields,
    renderField,
    expandedSegments,
    toggleSegment,
  );

  const ReferenceInput = props.renderDefault || (() => null);

  return (
    <Box style={{ position: "relative" }}>
      {}
      <ReferenceInput
        {...props}
        value={refValue as Record<string, unknown>}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={handleRefChange as any}
      />
      {}
      {refDocType && !loading && (
        <Button
          icon={CogIcon}
          mode="bleed"
          padding={2}
          aria-label="Edit Variables"
          onClick={() => setShowCasting(true)}
          style={{
            position: "absolute",
            right: 60,
            bottom: 16,
            zIndex: 10,
            minWidth: 0,
            background: "transparent",
          }}
        />
      )}
      {showCasting && (
        <Dialog
          id="casting-dialog"
          header="Edit Variables"
          width={1}
          onClose={() => setShowCasting(false)}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={2} weight="semibold">
                Variables
              </Text>
              {loading ? (
                <Flex align="center" justify="center" style={{ minHeight: 80 }}>
                  <Spinner size={2} />
                  <Text size={1} style={{ marginLeft: 8 }}>
                    Loading…
                  </Text>
                </Flex>
              ) : castingFields.length === 0 ? (
                <Text size={1} muted>
                  {refDocType
                    ? `No casting fields defined for ${refDocType}`
                    : "Select a reference to edit variables."}
                </Text>
              ) : (
                <Stack space={3}>{renderedCastingCards}</Stack>
              )}
              <Flex gap={2} justify="flex-end">
                <Button
                  mode="ghost"
                  text="Close"
                  onClick={() => setShowCasting(false)}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default CastRefInput;
