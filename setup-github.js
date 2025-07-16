#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🔧 Настройка GitHub интеграции для AI Task Processor\n");

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGitHub() {
  try {
    console.log("📋 Для настройки GitHub интеграции вам понадобится:");
    console.log("1. GitHub Personal Access Token");
    console.log("2. Имя вашего GitHub аккаунта");
    console.log("3. Название репозитория\n");

    console.log("🔗 Как получить GitHub Token:");
    console.log("1. Откройте https://github.com/settings/tokens");
    console.log('2. Нажмите "Generate new token (classic)"');
    console.log("3. Выберите scopes: repo, workflow");
    console.log("4. Скопируйте токен\n");

    const githubToken = await question(
      "🔑 Введите ваш GitHub Personal Access Token: "
    );
    let githubOwner = await question(
      "👤 Введите ваше имя пользователя GitHub: "
    );
    const githubRepo = await question("📁 Введите название репозитория: ");

    // Проверяем токен
    console.log("\n🔍 Проверяем токен...");
    const https = require("https");

    const checkToken = () => {
      return new Promise((resolve, reject) => {
        const req = https.request(
          {
            hostname: "api.github.com",
            path: "/user",
            method: "GET",
            headers: {
              Authorization: `token ${githubToken}`,
              "User-Agent": "AI-Task-Processor",
            },
          },
          (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              if (res.statusCode === 200) {
                const user = JSON.parse(data);
                resolve(user.login);
              } else {
                reject(new Error(`Token check failed: ${res.statusCode}`));
              }
            });
          }
        );

        req.on("error", reject);
        req.end();
      });
    };

    try {
      const username = await checkToken();
      console.log(`✅ Токен валиден! Подключен как: ${username}`);

      if (username !== githubOwner) {
        console.log(
          `⚠️  Внимание: указанное имя пользователя (${githubOwner}) отличается от токена (${username})`
        );
        const useTokenUsername = await question(
          "Использовать имя пользователя из токена? (y/n): "
        );
        if (useTokenUsername.toLowerCase() === "y") {
          githubOwner = username;
        }
      }
    } catch (error) {
      console.log(`❌ Ошибка проверки токена: ${error.message}`);
      console.log("Проверьте правильность токена и попробуйте снова");
      rl.close();
      return;
    }

    // Создаем обновленный .env.local
    const envContent = `# GigaChat API Configuration
GIGACHAT_AUTH_KEY=NjE2NDcyNDUtZTAzYy00NjhlLWFkM2MtOWY5YTk4MTQzMzY5OmM5MTAxOTM3LWJiOTItNGNmMS05Y2JjLWZiMjE1Nzc1NTQ1MQ==

# GitHub Configuration
GITHUB_TOKEN=${githubToken}
GITHUB_REPO_OWNER=${githubOwner}
GITHUB_REPO_NAME=${githubRepo}

# MCP Configuration
MCP_ENABLED=true
`;

    const envPath = path.join(__dirname, ".env.local");
    fs.writeFileSync(envPath, envContent);

    console.log("\n✅ GitHub переменные настроены!");
    console.log(`📁 Репозиторий: ${githubOwner}/${githubRepo}`);
    console.log(
      `🔑 Токен: ${githubToken.slice(0, 8)}...${githubToken.slice(-4)}`
    );

    console.log("\n📋 Следующие шаги:");
    console.log("1. Убедитесь, что репозиторий существует на GitHub");
    console.log("2. Запустите приложение: npm run dev");
    console.log("3. Протестируйте создание Pull Request");

    console.log(
      "\n🚀 Готово! Теперь AI агент сможет создавать реальные PR в вашем репозитории!"
    );
  } catch (error) {
    console.error("❌ Ошибка настройки:", error.message);
  } finally {
    rl.close();
  }
}

setupGitHub();
