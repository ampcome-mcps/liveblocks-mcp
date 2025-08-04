#!/usr/bin/env node
import dotenv from "dotenv";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
function validateEnvironment() {
  const requiredVars = ["LIVEBLOCKS_SECRET_KEY"];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach(varName => {
      console.error(`  - ${varName}`);
    });
    console.error("\nPlease check your .env file or set these environment variables.");
    console.error("You can copy .env.example to .env and fill in your values.");
    process.exit(1);
  }
  
  // Optional: Log configuration (but don't expose secrets)
  if (process.env.DEBUG === "true") {
    console.error("🔧 Environment configuration loaded:");
    console.error(`  - LIVEBLOCKS_SECRET_KEY: ${process.env.LIVEBLOCKS_SECRET_KEY ? "✅ Set" : "❌ Missing"}`);
    console.error(`  - LOG_LEVEL: ${process.env.LOG_LEVEL || "info"}`);
  }
}

async function main() {
  try {
    // Validate environment before starting
    validateEnvironment();
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("✅ Liveblocks MCP Server running on stdio");
  } catch (error) {
    console.error("❌ Failed to start Liveblocks MCP Server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("💥 Fatal error in main():", error);
  process.exit(1);
});
