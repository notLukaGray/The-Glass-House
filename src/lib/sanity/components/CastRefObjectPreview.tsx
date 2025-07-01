import React, { useEffect, useState } from "react";
import { Card, Flex, Text, Box, Spinner } from "@sanity/ui";
import { CogIcon } from "@sanity/icons";
import { useClient } from "sanity";
import Image from "next/image";

interface CastRefObjectPreviewProps {
  title: string;
  subtitle?: string;
  media?: unknown;
  value?: {
    ref?: { _ref: string };
    casting?: Record<string, unknown>;
  };
}

interface ElementImageDoc {
  imageSource?: string;
  imageUpload?: { asset?: { _ref?: string } };
  imageUrl?: string;
}

const CastRefObjectPreview: React.FC<CastRefObjectPreviewProps> = ({
  title,
  subtitle,
  value,
}) => {
  const [refDoc, setRefDoc] = useState<ElementImageDoc | null>(null);
  const client = useClient({ apiVersion: "2023-05-03" });

  useEffect(() => {
    let ignore = false;
    async function fetchRefDoc() {
      if (value?.ref?._ref) {
        const doc = await client.getDocument(value.ref._ref);
        if (!ignore) setRefDoc(doc as ElementImageDoc);
      }
    }
    fetchRefDoc();
    return () => {
      ignore = true;
    };
  }, [value?.ref?._ref, client]);

  let imagePreview: React.ReactNode = null;

  if (refDoc) {
    if (refDoc.imageSource === "upload" && refDoc.imageUpload?.asset?._ref) {
      // TODO: Use @sanity/image-url to build the real asset URL
      imagePreview = (
        <Box
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#222",
            borderRadius: 4,
          }}
        >
          <Spinner />
        </Box>
      );
    } else if (refDoc.imageSource === "external" && refDoc.imageUrl) {
      imagePreview = (
        <Image
          src={refDoc.imageUrl}
          alt={title}
          width={40}
          height={40}
          style={{ objectFit: "contain" }}
        />
      );
    }
  }

  // fallback: show nothing or a placeholder
  if (!imagePreview) {
    imagePreview = (
      <Box
        style={{ width: 40, height: 40, background: "#222", borderRadius: 4 }}
      />
    );
  }

  // Heuristic for gear icon color: if the card is highlighted (array item), use white; else, use gray
  // Sanity does not provide a highlight prop, so use a light color for the icon in all array items
  const gearColor = "#fff"; // white for high contrast in highlighted rows

  return (
    <Card padding={2} radius={2} shadow={1} style={{ position: "relative" }}>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={2}>
          {imagePreview}
          <Text>{title}</Text>
          {value?.casting && Object.keys(value.casting).length > 0 && (
            <Box
              marginLeft={2}
              style={{ display: "flex", alignItems: "center" }}
            >
              <CogIcon style={{ color: gearColor, opacity: 0.9 }} />
            </Box>
          )}
        </Flex>
      </Flex>
      {subtitle && (
        <Text size={1} muted>
          {subtitle}
        </Text>
      )}
    </Card>
  );
};

export default CastRefObjectPreview;
