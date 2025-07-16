#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔧 Исправление проблем с деплоем GitHub Pages...\n");

// 1. Создаем файл .nojekyll
const nojekyllPath = path.join(__dirname, ".nojekyll");
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, "");
  console.log("✅ Создан файл .nojekyll");
} else {
  console.log("ℹ️  Файл .nojekyll уже существует");
}

// 2. Создаем правильную конфигурацию workflow
const workflowsDir = path.join(__dirname, ".github", "workflows");
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

const deployYmlPath = path.join(workflowsDir, "deploy.yml");
const deployContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    concurrency:
      group: "pages"
      cancel-in-progress: false
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: '.'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4`;

fs.writeFileSync(deployYmlPath, deployContent);
console.log("✅ Обновлен workflow файл .github/workflows/deploy.yml");

// 3. Проверяем наличие index.html
const indexPath = path.join(__dirname, "index.html");
if (!fs.existsSync(indexPath)) {
  console.log("⚠️  Файл index.html не найден в корне репозитория");
  console.log("   Создайте index.html или убедитесь, что он находится в корне");
} else {
  console.log("✅ Файл index.html найден");
}

// 4. Проверяем .env.local
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  if (envContent.includes("GITHUB_TOKEN=")) {
    console.log("✅ GitHub токен настроен");
  } else {
    console.log("⚠️  GitHub токен не найден в .env.local");
  }
} else {
  console.log("⚠️  Файл .env.local не найден");
}

console.log("\n📋 Следующие шаги:");
console.log(
  "1. Убедитесь, что репозиторий публичный или у вас есть GitHub Pro"
);
console.log(
  '2. В настройках репозитория (Settings → Pages) выберите "GitHub Actions" как источник'
);
console.log("3. Проверьте, что GitHub токен имеет права repo и workflow");
console.log("4. Создайте новый коммит и push для запуска деплоя");
console.log("\n🔗 Полезные ссылки:");
console.log(
  "- Настройки Pages: https://github.com/USERNAME/REPO/settings/pages"
);
console.log("- Actions: https://github.com/USERNAME/REPO/actions");
console.log("- Документация: ./DEPLOYMENT-TROUBLESHOOTING.md");

console.log("\n🎉 Исправления применены!");
