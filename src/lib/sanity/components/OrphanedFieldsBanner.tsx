import React, { useEffect, useState } from "react";
import { useClient } from "sanity";

interface OrphanedFieldsBannerProps {
  documentId?: string;
}

export const OrphanedFieldsBanner: React.FC<OrphanedFieldsBannerProps> = ({
  documentId,
}) => {
  const client = useClient();
  const [hasOrphanedFields, setHasOrphanedFields] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkForOrphanedFields = async () => {
      try {
        setIsChecking(true);

        // Get enabled languages from foundation
        const foundation = await client.fetch(`
          *[_type == "foundationLocalization"][0] {
            additionalLanguages[] {
              code,
              enabled
            }
          }
        `);

        if (!foundation?.additionalLanguages) {
          setHasOrphanedFields(false);
          return;
        }

        const enabledLanguages = foundation.additionalLanguages
          .filter((lang: { code: string; enabled: boolean }) => lang.enabled)
          .map((lang: { code: string; enabled: boolean }) => lang.code);

        // Check current document for orphaned fields
        if (documentId) {
          const doc = await client.fetch(
            `
            *[_id == $documentId][0] {
              title,
              description,
              alternativeTitle,
              caption,
              altText,
              ariaLabel
            }
          `,
            { documentId },
          );

          const fieldsToCheck = [
            "title",
            "description",
            "alternativeTitle",
            "caption",
            "altText",
            "ariaLabel",
          ];
          let foundOrphaned = false;

          for (const fieldName of fieldsToCheck) {
            const fieldValue = doc[fieldName];
            if (fieldValue && typeof fieldValue === "object") {
              const fieldLanguages = Object.keys(fieldValue);
              const orphanedLanguages = fieldLanguages.filter(
                (lang) => !enabledLanguages.includes(lang),
              );

              if (orphanedLanguages.length > 0) {
                foundOrphaned = true;
                break;
              }
            }
          }

          setHasOrphanedFields(foundOrphaned);
        } else {
          // Check globally for orphaned fields
          const orphanedCount = await client.fetch(
            `
            count(*[_type in ["elementTextSingleLine", "elementImage", "elementRichText", "elementButton", "moduleHeroImage"] && (
              count(title) > 0 && count(title) != count(title[enabledLanguages[] match $enabledLanguages])
            )])
          `,
            { enabledLanguages },
          );

          setHasOrphanedFields(orphanedCount > 0);
        }
      } catch {
        setHasOrphanedFields(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkForOrphanedFields();
  }, [client, documentId]);

  if (isChecking) {
    return null;
  }

  if (!hasOrphanedFields) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeaa7",
        borderRadius: "4px",
        padding: "12px 16px",
        marginBottom: "16px",
        color: "#856404",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "16px" }}>⚠️</span>
        <div>
          <strong>Orphaned Language Fields Detected</strong>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
            Some documents contain language fields that are no longer enabled in
            Foundation settings. Run the migration script to clean up these
            fields.
          </p>
          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() => {
                // Open migration script instructions
                window.open("/docs/migration", "_blank");
              }}
              style={{
                backgroundColor: "#856404",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              View Migration Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
