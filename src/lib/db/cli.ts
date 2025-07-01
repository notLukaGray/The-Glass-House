#!/usr/bin/env node

import { createUser, isSetupComplete, validatePassword } from "./index";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

function question(promptText: string, hideInput = false): string {
  return prompt(promptText, { echo: hideInput ? "*" : undefined });
}

async function setupAdmin() {
  // The Glass House Setup
  // ===================

  // Check if setup is already complete
  const setupComplete = await isSetupComplete();

  if (setupComplete) {
    // Setup already completed. Admin user already exists.
    // If you need to reset, you can manually delete users from the database.
    process.exit(1);
  }

  // Creating your first admin user...

  // Password requirements:
  // - At least 8 characters long
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one number

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
      // Password error logged
      // Please try again.
    }
  }

  if (!email || !username || !name || !password) {
    // All fields are required.
    process.exit(1);
  }

  try {
    await createUser({
      email,
      username,
      name,
      password,
      role: "admin",
    });

    // Admin user created successfully!
    // Username: {admin.username}
    // Email: {admin.email}
    // Role: {admin.role}

    // You can now login at /login
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
      // Available commands:
      //   setup-admin     - Create first admin user
      break;
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
