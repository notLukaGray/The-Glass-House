#!/usr/bin/env node

/**
 * Migration script to convert legacy localeString/localeText fields
 * to glassLocaleString/glassLocaleText shape for all documents.
 *
 * Usage: node scripts/migrate-localeString-to-glassLocaleString.js
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Requires write access
});

const legacyFieldTypes = ["localeString", "localeText"];
const newFieldTypes = {
  localeString: "glassLocaleString",
  localeText: "glassLocaleText",
};

async function migrate() {
  for (const legacyType of legacyFieldTypes) {
    const docs = await client.fetch(`*[_type == $type]`, { type: legacyType });
    for (const doc of docs) {
      const newType = newFieldTypes[legacyType];
      const migratedDoc = {
        ...doc,
        _type: newType,
      };
      try {
        await client.createOrReplace(migratedDoc);
        console.log(`Migrated ${doc._id} from ${legacyType} to ${newType}`);
      } catch (err) {
        console.error(`Failed to migrate ${doc._id}:`, err);
      }
    }
  }
  console.log("Migration complete.");
}

migrate();
