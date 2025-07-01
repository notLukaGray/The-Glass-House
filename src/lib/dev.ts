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

// Start the development server
const server = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

server.on("error", (error) => {
  console.error("Failed to start development server:", error);
});

// Handle process termination
const cleanup = () => {
  server.kill();
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
