#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Настройка MCP GitHub сервера...");

try {
  // Устанавливаем MCP GitHub сервер
  console.log("📦 Устанавливаем MCP GitHub сервер...");
  execSync("npm install -g @modelcontextprotocol/server-github", {
    stdio: "inherit",
  });

  console.log("✅ MCP GitHub сервер установлен");

  // Проверяем переменные окружения
  const envPath = path.join(__dirname, ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");

    if (
      envContent.includes("GITHUB_TOKEN=") &&
      envContent.includes("GITHUB_REPO_OWNER=") &&
      envContent.includes("GITHUB_REPO_NAME=")
    ) {
      console.log("✅ GitHub переменные окружения настроены");
    } else {
      console.log("⚠️  GitHub переменные окружения не настроены");
      console.log("📝 Добавьте в .env.local:");
      console.log("   GITHUB_TOKEN=your_github_token");
      console.log("   GITHUB_REPO_OWNER=your_username");
      console.log("   GITHUB_REPO_NAME=your_repo");
    }
  } else {
    console.log("⚠️  Файл .env.local не найден");
    console.log("📝 Создайте .env.local с GitHub переменными");
  }

  console.log("\n🎉 MCP GitHub сервер готов к использованию!");
  console.log("\n📋 Следующие шаги:");
  console.log("1. Настройте GitHub переменные в .env.local");
  console.log("2. Создайте репозиторий на GitHub");
  console.log("3. Запустите приложение: npm run dev");
  console.log("4. Протестируйте создание Pull Request");
} catch (error) {
  console.error("❌ Ошибка при настройке MCP:", error.message);
  console.log("\n🔧 Альтернативная настройка:");
  console.log("1. Установите MCP GitHub сервер вручную:");
  console.log("   npm install -g @modelcontextprotocol/server-github");
  console.log("2. Настройте переменные окружения");
  console.log("3. Перезапустите приложение");
}
