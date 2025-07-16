import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing required field: token" },
        { status: 400 }
      );
    }

    // Проверяем формат токена
    if (!token.startsWith("ghp_")) {
      return NextResponse.json(
        { error: "Неверный формат токена. Токен должен начинаться с ghp_" },
        { status: 400 }
      );
    }

    const envPath = path.join(process.cwd(), ".env.local");

    // Читаем существующий .env.local или создаем новый
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    // Обновляем или добавляем GitHub переменные
    const lines = envContent.split("\n");
    const newLines = [];
    let hasGigachat = false;
    let hasGithubToken = false;
    let hasMCP = false;

    for (const line of lines) {
      if (line.startsWith("GIGACHAT_AUTH_KEY=")) {
        newLines.push(line);
        hasGigachat = true;
      } else if (line.startsWith("GITHUB_TOKEN=")) {
        newLines.push(`GITHUB_TOKEN=${token}`);
        hasGithubToken = true;
      } else if (line.startsWith("MCP_ENABLED=")) {
        newLines.push("MCP_ENABLED=true");
        hasMCP = true;
      } else if (line.trim() && !line.startsWith("#")) {
        newLines.push(line);
      }
    }

    // Добавляем недостающие переменные
    if (!hasGigachat) {
      newLines.unshift(
        "GIGACHAT_AUTH_KEY=NjE2NDcyNDUtZTAzYy00NjhlLWFkM2MtOWY5YTk4MTQzMzY5OmM5MTAxOTM3LWJiOTItNGNmMS05Y2JjLWZiMjE1Nzc1NTQ1MQ=="
      );
    }
    if (!hasGithubToken) {
      newLines.push(`GITHUB_TOKEN=${token}`);
    }
    if (!hasMCP) {
      newLines.push("MCP_ENABLED=true");
    }

    // Добавляем комментарии
    const finalContent = `# GigaChat API Configuration
${newLines.filter((line) => line.startsWith("GIGACHAT_AUTH_KEY=")).join("\n")}

# GitHub Configuration
${newLines.filter((line) => line.startsWith("GITHUB_")).join("\n")}

# MCP Configuration
${newLines.filter((line) => line.startsWith("MCP_")).join("\n")}
`;

    // Сохраняем файл
    fs.writeFileSync(envPath, finalContent);

    return NextResponse.json({
      success: true,
      message: "GitHub настройки успешно сохранены",
    });
  } catch (error) {
    console.error("Error saving GitHub config:", error);
    return NextResponse.json(
      { error: "Failed to save GitHub configuration" },
      { status: 500 }
    );
  }
}
