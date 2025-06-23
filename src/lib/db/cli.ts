#!/usr/bin/env node

import {
  createUser,
  isSetupComplete,
  getAllUsers,
  deleteAllUsers,
  getUsersCount,
  validatePassword,
} from "./index";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAdmin() {
  console.log("Portfolio CMS Setup");
  console.log("==================\n");

  // Check if setup is already complete
  const setupComplete = await isSetupComplete();

  if (setupComplete) {
    console.log("Setup already completed. Admin user already exists.");
    console.log("If you need to reset, use: npm run db:delete-all-users");
    process.exit(1);
  }

  console.log("Creating your first admin user...\n");
  console.log("Password requirements:");
  console.log("- At least 8 characters long");
  console.log("- At least one uppercase letter");
  console.log("- At least one lowercase letter");
  console.log("- At least one number\n");

  // Get admin details
  const email = await question("Admin email: ");
  const username = await question("Admin username: ");
  const name = await question("Admin full name: ");

  let password = "";
  let passwordValid = false;

  while (!passwordValid) {
    password = await question("Admin password: ");
    const validation = validatePassword(password);

    if (validation.isValid) {
      passwordValid = true;
    } else {
      console.log(`Password error: ${validation.error}`);
      console.log("Please try again.\n");
    }
  }

  if (!email || !username || !name || !password) {
    console.log("All fields are required.");
    process.exit(1);
  }

  try {
    const admin = await createUser({
      email,
      username,
      name,
      password,
      role: "admin",
    });

    console.log("\nAdmin user created successfully!");
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("\nYou can now login at /login");
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "setup-admin":
      await setupAdmin();
      break;
    case "count-users":
      const count = await getUsersCount();
      console.log(`Total users: ${count}`);
      break;
    case "delete-all-users":
      const confirm = await question(
        "Are you sure you want to delete ALL users? (yes/no): ",
      );
      if (confirm.toLowerCase() === "yes") {
        await deleteAllUsers();
        console.log("All users deleted.");
      } else {
        console.log("Operation cancelled.");
      }
      break;
    case "list-users":
      const users = await getAllUsers();
      console.log("Users:");
      users.forEach((user) => {
        console.log(`- ${user.username} (${user.email}) - ${user.role}`);
      });
      break;
    default:
      console.log("Available commands:");
      console.log("  setup-admin     - Create first admin user");
      console.log("  count-users     - Show total user count");
      console.log("  delete-all-users - Delete all users (dangerous!)");
      console.log("  list-users      - List all users");
      break;
  }

  rl.close();
  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  rl.close();
  process.exit(1);
});
