#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../..");

// Start Prisma Studio
const prismaStudio = spawn("npx", ["prisma", "studio"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
});

// Start Next.js dev server
const nextDev = spawn("npx", ["next", "dev"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
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
