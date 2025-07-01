#!/usr/bin/env node

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

async function getEnabledLanguages() {
  const foundation = await client.fetch(`
    *[_type == "foundationLocalization"][0] {
      additionalLanguages[] {
        code,
        enabled
      }
    }
  `);

  if (!foundation?.additionalLanguages) {
    return ["en"];
  }

  return foundation.additionalLanguages
    .filter((lang) => lang.enabled)
    .map((lang) => lang.code);
}

async function findOrphanedFields() {
  const enabledLanguages = await getEnabledLanguages();
  console.log(`Enabled languages: ${enabledLanguages.join(", ")}`);

  const documents = await client.fetch(`
    *[_type in ["elementTextSingleLine", "elementImage", "elementRichText", "elementButton", "moduleHeroImage"]] {
      _id,
      _type,
      title,
      description,
      alternativeTitle,
      caption,
      altText,
      ariaLabel
    }
  `);

  const orphanedFields = [];

  for (const doc of documents) {
    const fieldsToCheck = [
      "title",
      "description",
      "alternativeTitle",
      "caption",
      "altText",
      "ariaLabel",
    ];

    for (const fieldName of fieldsToCheck) {
      const fieldValue = doc[fieldName];
      if (fieldValue && typeof fieldValue === "object") {
        const fieldLanguages = Object.keys(fieldValue);
        const orphanedLanguages = fieldLanguages.filter(
          (lang) => !enabledLanguages.includes(lang),
        );

        if (orphanedLanguages.length > 0) {
          orphanedFields.push({
            documentId: doc._id,
            documentType: doc._type,
            fieldName,
            orphanedLanguages,
            currentValue: fieldValue,
          });
        }
      }
    }
  }

  return orphanedFields;
}

async function cleanOrphanedFields(orphanedFields) {
  console.log(
    `\nFound ${orphanedFields.length} fields with orphaned languages`,
  );

  for (const field of orphanedFields) {
    console.log(`\nCleaning ${field.documentType} (${field.documentId})`);
    console.log(`  Field: ${field.fieldName}`);
    console.log(`  Orphaned languages: ${field.orphanedLanguages.join(", ")}`);

    const enabledLanguages = await getEnabledLanguages();
    const cleanedValue = {};

    for (const lang of enabledLanguages) {
      if (field.currentValue[lang]) {
        cleanedValue[lang] = field.currentValue[lang];
      }
    }

    try {
      await client
        .patch(field.documentId)
        .set({ [field.fieldName]: cleanedValue })
        .commit();

      console.log(`  ✅ Cleaned successfully`);
    } catch (error) {
      console.error(`  ❌ Error cleaning field:`, error.message);
    }
  }
}

async function main() {
  try {
    console.log("🔍 Finding orphaned language fields...");
    const orphanedFields = await findOrphanedFields();

    if (orphanedFields.length === 0) {
      console.log("✅ No orphaned fields found!");
      return;
    }

    console.log(`\n📋 Summary:`);
    console.log(
      `  Total documents with orphaned fields: ${new Set(orphanedFields.map((f) => f.documentId)).size}`,
    );
    console.log(`  Total fields to clean: ${orphanedFields.length}`);

    const proceed =
      process.argv.includes("--force") ||
      (await new Promise((resolve) => {
        process.stdout.write("\nProceed with cleaning? (y/N): ");
        process.stdin.once("data", (data) => {
          resolve(data.toString().trim().toLowerCase() === "y");
        });
      }));

    if (proceed) {
      await cleanOrphanedFields(orphanedFields);
      console.log("\n🎉 Migration completed!");
    } else {
      console.log("\n❌ Migration cancelled");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
