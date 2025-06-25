#!/usr/bin/env node

import { createUser, isSetupComplete, validatePassword } from "./index";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

function question(promptText: string, hideInput = false): string {
  return prompt(promptText, { echo: hideInput ? "*" : undefined });
}

async function setupAdmin() {
  console.log("The Glass House Setup");
  console.log("==================\n");

  // Check if setup is already complete
  const setupComplete = await isSetupComplete();

  if (setupComplete) {
    console.log("Setup already completed. Admin user already exists.");
    console.log(
      "If you need to reset, you can manually delete users from the database.",
    );
    process.exit(1);
  }

  console.log("Creating your first admin user...\n");
  console.log("Password requirements:");
  console.log("- At least 8 characters long");
  console.log("- At least one uppercase letter");
  console.log("- At least one lowercase letter");
  console.log("- At least one number\n");

  // Get admin details
  const email = question("Admin email: ");
  const username = question("Admin username: ");
  const name = question("Admin full name: ");

  let password = "";
  let passwordValid = false;

  while (!passwordValid) {
    password = question("Admin password: ", true); // Hide password input
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
    default:
      console.log("Available commands:");
      console.log("  setup-admin     - Create first admin user");
      break;
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
