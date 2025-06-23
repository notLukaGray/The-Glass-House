#!/usr/bin/env node

import { config } from "dotenv";
import { resolve } from "path";
import {
  deleteAllUsers,
  ensureDefaultAdmin,
  getUsersCount,
  disconnect,
} from "./index";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case "setup-admin":
        await ensureDefaultAdmin();
        break;

        console.log("Setting up default admin user...");
        const result = await ensureDefaultAdmin();
        console.log(result.message);
        if (result.created) {
          console.log(`\nUser created:`, {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
          });
        }
        break;

      case "delete-all-users":
        console.log("Deleting all users...");
        await deleteAllUsers();
        console.log("All users deleted successfully.");
        break;

      case "count-users":
        const count = await getUsersCount();
        console.log(`Total users in database: ${count}`);
        break;

      default:
        console.log(`
Database Management CLI

Usage: npx tsx src/lib/db/cli.ts <command>

Commands:
  setup-admin      - Create default admin user if none exists
  delete-all-users - Delete all users from database
  count-users      - Show total number of users

Examples:
  npx tsx src/lib/db/cli.ts setup-admin
  npx tsx src/lib/db/cli.ts delete-all-users
  npx tsx src/lib/db/cli.ts count-users
        `);
        break;
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await disconnect();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
