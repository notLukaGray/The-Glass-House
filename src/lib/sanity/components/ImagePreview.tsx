import React, { useState } from "react";
import Image from "next/image";

interface SanityImageAsset {
  asset?: { url?: string };
  url?: string;
}

interface ImagePreviewProps {
  title?: string;
  alternativeTitle?: string;
  description?: string;
  imageSource?: string;
  sanityImage?: SanityImageAsset;
  externalUrl?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  title,
  alternativeTitle,
  description,
  imageSource,
  sanityImage,
  externalUrl,
}) => {
  const [imageError, setImageError] = useState(false);

  // Use alternative title if available, otherwise fall back to title
  const displayTitle =
    alternativeTitle || title || description || "Untitled Image";

  // Determine subtitle and media based on source
  let displaySubtitle =
    imageSource === "sanity" ? "Sanity Asset" : "External URL";
  let imageUrl = null;

  if (imageSource === "sanity" && sanityImage) {
    // For Sanity images, use the asset URL
    imageUrl = sanityImage.asset?.url || sanityImage.url;
  } else if (imageSource === "url" && externalUrl) {
    // For external URLs, use the URL directly
    imageUrl = externalUrl;
    displaySubtitle = externalUrl;
  }

  const handleImageError = () => {
    setImageError(true);
  };

  if (!imageUrl) {
    return (
      <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
        Invalid image URL
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ position: "relative", width: "100%", height: "200px" }}>
        <Image
          src={imageUrl}
          alt={displayTitle}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px",
        }}
      >
        {imageUrl && !imageError ? (
          <div style={{ position: "relative", width: "40px", height: "40px" }}>
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              style={{
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
              }}
              onError={handleImageError}
            />
          </div>
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e0e0e0",
              fontSize: "12px",
              color: "#666",
            }}
          >
            {imageSource === "sanity" ? "IMG" : "URL"}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayTitle}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displaySubtitle}
          </div>
        </div>
      </div>
      {displayTitle && (
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.875rem",
            color: "#666",
            textAlign: "center",
          }}
        >
          Alt: {displayTitle}
        </div>
      )}
    </div>
  );
};
