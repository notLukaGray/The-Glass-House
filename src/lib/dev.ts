#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../..");

console.log("🚀 Starting development servers...\n");

// Start Prisma Studio
console.log("📊 Starting Prisma Studio...");
const prismaStudio = spawn("npx", ["prisma", "studio"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
});

// Start Next.js dev server
console.log("⚡ Starting Next.js development server...");
const nextDev = spawn("npx", ["next", "dev"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
});

// Handle process termination
const cleanup = () => {
  console.log("\n🛑 Shutting down development servers...");
  prismaStudio.kill();
  nextDev.kill();
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Handle process errors
prismaStudio.on("error", (error) => {
  console.error("❌ Prisma Studio error:", error);
});

nextDev.on("error", (error) => {
  console.error("❌ Next.js error:", error);
});

console.log("✅ Development servers started!");
console.log("📊 Prisma Studio: http://localhost:5555");
console.log("⚡ Next.js: http://localhost:3000");
console.log("\nPress Ctrl+C to stop all servers");
