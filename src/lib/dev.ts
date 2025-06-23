#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../..");

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = join(projectRoot, ".env.local");
    const envContent = readFileSync(envPath, "utf8");

    envContent.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").replace(/^["']|["']$/g, "");
          process.env[key] = value;
        }
      }
    });
  } catch {
    // Silently fail if .env.local doesn't exist
  }
}

// Load environment variables
loadEnvFile();

// Start Prisma Studio
const prismaStudio = spawn("npx", ["prisma", "studio"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
  env: { ...process.env },
});

// Start Next.js dev server
const nextDev = spawn("npx", ["next", "dev"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
  env: { ...process.env },
});

// Handle process termination
const cleanup = () => {
  prismaStudio.kill();
  nextDev.kill();
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

console.log("✅ Development servers started!");
