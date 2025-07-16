#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const envContent = `# GigaChat API Configuration
GIGACHAT_AUTH_KEY=NjE2NDcyNDUtZTAzYy00NjhlLWFkM2MtOWY5YTk4MTQzMzY5OmM5MTAxOTM3LWJiOTItNGNmMS05Y2JjLWZiMjE1Nzc1NTQ1MQ==

# GitHub Configuration (заполните своими данными)
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=your_repository_name
`;

const envPath = path.join(__dirname, ".env.local");

try {
  fs.writeFileSync(envPath, envContent);
  console.log("✅ Файл .env.local создан успешно!");
  console.log(
    "📝 Не забудьте заполнить GitHub переменные для полной функциональности"
  );
} catch (error) {
  console.error("❌ Ошибка при создании .env.local:", error.message);
}
