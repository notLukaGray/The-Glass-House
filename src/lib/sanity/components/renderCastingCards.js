import React from "react";
import { Card, Flex, Text, Box, Stack } from "@sanity/ui";

export function renderCastingCards(
  castingFields,
  renderField,
  expandedSegments,
  toggleSegment,
) {
  return castingFields.map((segment) => {
    const renderedFields = ["sizeAndPosition", "displayAndTransform"].includes(
      segment.name,
    )
      ? renderField(segment.name, null)
      : segment.fields.map((field) => renderField(segment.name, field));

    return (
      <Card key={String(segment.name)} padding={3} radius={2} shadow={1}>
        <Flex
          align="center"
          justify="space-between"
          style={{ cursor: "pointer" }}
          onClick={() => toggleSegment(segment.name)}
        >
          <Text size={1} weight="semibold">
            {segment.title}
          </Text>
          <Text size={1}>{expandedSegments.has(segment.name) ? "−" : "+"}</Text>
        </Flex>
        {expandedSegments.has(segment.name) && (
          <Box style={{ marginTop: 12 }}>
            <Stack space={3}>{renderedFields}</Stack>
          </Box>
        )}
      </Card>
    );
  });
}
