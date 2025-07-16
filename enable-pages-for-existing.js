const { Octokit } = require("@octokit/rest");
require("dotenv").config({ path: ".env.local" });

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = "AndreyOreilly"; // Используем правильный аккаунт

async function enablePagesForRepo(repoName) {
  try {
    console.log(`🔧 Активируем GitHub Pages для ${owner}/${repoName}...`);

    // Активируем GitHub Pages
    await octokit.repos.createPagesSite({
      owner,
      repo: repoName,
      source: {
        branch: "main",
        path: "/",
      },
    });

    console.log(`✅ GitHub Pages активирован для ${owner}/${repoName}`);
    console.log(
      `🌐 Сайт будет доступен по адресу: https://${owner}.github.io/${repoName}`
    );
  } catch (error) {
    if (error.status === 409) {
      console.log(`ℹ️  GitHub Pages уже активирован для ${owner}/${repoName}`);
    } else {
      console.error(
        `❌ Ошибка при активации GitHub Pages для ${owner}/${repoName}:`,
        error.message
      );
    }
  }
}

async function main() {
  const repos = [
    "ai-script-neobhodimo-prostuyu-veb-gy7n",
    "ai-script-posvyaschennyy-solntsu-resurs-4vla",
  ];

  console.log(
    "🚀 Активируем GitHub Pages для всех созданных репозиториев...\n"
  );

  for (const repo of repos) {
    await enablePagesForRepo(repo);
    console.log(""); // пустая строка для разделения
  }

  console.log("✨ Готово! Все репозитории обработаны.");
}

main().catch(console.error);
