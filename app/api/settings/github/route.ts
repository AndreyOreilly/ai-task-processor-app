import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");

    if (!fs.existsSync(envPath)) {
      return NextResponse.json({
        token: "",
        owner: "",
        repo: "",
        isConnected: false,
      });
    }

    const envContent = fs.readFileSync(envPath, "utf8");

    // Парсим переменные из .env.local
    const tokenMatch = envContent.match(/GITHUB_TOKEN=(.+)/);
    const ownerMatch = envContent.match(/GITHUB_REPO_OWNER=(.+)/);
    const repoMatch = envContent.match(/GITHUB_REPO_NAME=(.+)/);

    const token = tokenMatch ? tokenMatch[1].trim() : "";
    const owner = ownerMatch ? ownerMatch[1].trim() : "";
    const repo = repoMatch ? repoMatch[1].trim() : "";

    return NextResponse.json({
      token: token.startsWith("ghp_") ? token : "",
      owner,
      repo,
      isConnected: !!(token && owner && repo),
    });
  } catch (error) {
    console.error("Error reading GitHub config:", error);
    return NextResponse.json(
      { error: "Failed to read GitHub configuration" },
      { status: 500 }
    );
  }
}
