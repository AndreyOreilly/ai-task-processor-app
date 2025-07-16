#!/usr/bin/env node

const { Octokit } = require("@octokit/rest");
const fs = require('fs');

// Загружаем переменные окружения из .env.local
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    return envVars;
  } catch (error) {
    console.error("❌ Не удалось загрузить .env.local");
    return {};
  }
}

const env = loadEnv();

async function enablePages() {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    console.error("❌ GITHUB_TOKEN не найден в .env.local");
    return;
  }

  const octokit = new Octokit({ auth: token });

  try {
    // Получаем информацию о пользователе
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`👤 Пользователь: ${user.login}`);

    // Получаем список репозиториев
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      type: "owner",
      sort: "updated",
      per_page: 10,
    });

    console.log("\n📋 Последние репозитории:");
    repos.forEach((repo, index) => {
      console.log(
        `${index + 1}. ${repo.full_name} (${
          repo.private ? "private" : "public"
        })`
      );
    });

    // Пытаемся включить Pages для каждого репозитория
    for (const repo of repos) {
      try {
        console.log(`\n🔧 Включаем Pages для ${repo.full_name}...`);

        // Проверяем текущие настройки Pages
        try {
          const { data: pages } = await octokit.repos.getPages({
            owner: repo.owner.login,
            repo: repo.name,
          });
          console.log(`   ✅ Pages уже включены: ${pages.url}`);
        } catch (error) {
          if (error.status === 404) {
            // Pages не включены, включаем
            await octokit.repos.createPagesSite({
              owner: repo.owner.login,
              repo: repo.name,
              source: {
                branch: "main",
                path: "/",
              },
            });
            console.log(`   ✅ Pages включены для ${repo.full_name}`);
          } else {
            console.log(`   ⚠️  Ошибка при проверке Pages: ${error.message}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Ошибка для ${repo.full_name}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

enablePages();
