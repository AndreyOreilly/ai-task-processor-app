const { Octokit } = require("@octokit/rest");
require("dotenv").config({ path: ".env.local" });

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = "AndreyOreilly";

async function updateWorkflowFile(repoName) {
  try {
    console.log(`🔧 Обновляем workflow для ${owner}/${repoName}...`);

    const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, feature/* ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

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
      with:
        enablement: true
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: '.'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4`;

    // Обновляем workflow файл
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: ".github/workflows/deploy.yml",
      message: "Fix: Enable GitHub Pages automatically",
      content: Buffer.from(workflowContent).toString("base64"),
      branch: "main",
    });

    console.log(`✅ Workflow обновлен для ${owner}/${repoName}`);
  } catch (error) {
    console.error(
      `❌ Ошибка при обновлении workflow для ${owner}/${repoName}:`,
      error.message
    );
  }
}

async function main() {
  const repos = [
    "ai-script-neobhodimo-prostuyu-veb-gy7n",
    "ai-script-posvyaschennyy-solntsu-resurs-4vla",
  ];

  console.log(
    "🚀 Обновляем workflow файлы для автоматической активации GitHub Pages...\n"
  );

  for (const repo of repos) {
    await updateWorkflowFile(repo);
    console.log(""); // пустая строка для разделения
  }

  console.log("✨ Готово! Все workflow файлы обновлены.");
  console.log(
    "📝 Теперь при следующем push в репозиторий GitHub Pages будет активирован автоматически."
  );
}

main().catch(console.error);
