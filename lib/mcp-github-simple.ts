import { Octokit } from "@octokit/rest";

export class MCPGitHubService {
  private octokit: Octokit;
  private isConnected = false;

  constructor() {
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      console.warn("⚠️ GitHub token not found. Using mock mode.");
      this.octokit = null as any;
      return;
    }

    this.octokit = new Octokit({
      auth: githubToken,
    });
  }

  async connect() {
    if (this.isConnected) return;

    try {
      if (!this.octokit) {
        throw new Error("GitHub credentials not configured");
      }

      // Проверяем подключение к GitHub
      const { data: user } = await this.octokit.users.getAuthenticated();
      console.log(`✅ MCP GitHub подключен как: ${user.login}`);
      this.isConnected = true;
    } catch (error) {
      console.error("❌ Ошибка подключения к GitHub:", error);
      throw new Error("Failed to connect to GitHub");
    }
  }

  async createPullRequest(data: {
    taskDescription: string;
    analysis: string;
    generatedCode: string;
    fileName: string;
    repoName?: string;
    owner?: string;
  }) {
    const { taskDescription, analysis, generatedCode, fileName } = data;

    try {
      if (!this.octokit) {
        throw new Error("GitHub not configured");
      }

      await this.connect();

      const repoOwner = data.owner || process.env.GITHUB_REPO_OWNER!;
      const repoName = data.repoName || process.env.GITHUB_REPO_NAME!;
      // 1. Получаем текущий main
      const baseRef = await this.octokit.git.getRef({
        owner: repoOwner,
        repo: repoName,
        ref: `heads/main`,
      });

      // 2. Создаем файлы веб-сайта
      const { WebsiteGenerator } = await import("./website-generator");
      const websiteProject = WebsiteGenerator.parseGeneratedCode(generatedCode);

            // Добавляем .nojekyll файл для GitHub Pages
      websiteProject.files.push(WebsiteGenerator.createNojekyllFile());
      
      // Добавляем GitHub Actions workflow
      const workflowFile = WebsiteGenerator.createSimpleGitHubPagesConfig();
      websiteProject.files.push(workflowFile);
      
      console.log(`🔧 Добавлен workflow файл: ${workflowFile.path}`);
      console.log(`📄 Всего файлов для пуша: ${websiteProject.files.length}`);

      // Создаем один коммит со всеми файлами (вместо множественных коммитов)
      const treeItems = websiteProject.files.map((file) => ({
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        content: file.content,
      }));

      console.log(`📁 Создаём дерево файлов для ${repoOwner}/${repoName}`);
      console.log(`📄 Файлы для пуша:`, treeItems.map(item => item.path));
      
      // Создаем дерево файлов
      const tree = await this.octokit.git.createTree({
        owner: repoOwner,
        repo: repoName,
        tree: treeItems,
        base_tree: baseRef.data.object.sha,
      });
      
      console.log(`✅ Дерево файлов создано: ${tree.data.sha}`);

      // Создаем коммит
      const commit = await this.octokit.git.createCommit({
        owner: repoOwner,
        repo: repoName,
        message: `feat: AI-generated website - ${taskDescription.slice(
          0,
          50
        )}...`,
        tree: tree.data.sha,
        parents: [baseRef.data.object.sha],
      });

      console.log(`🔄 Обновляем main ветку...`);
      
      // Обновляем main ветку
      await this.octokit.git.updateRef({
        owner: repoOwner,
        repo: repoName,
        ref: `heads/main`,
        sha: commit.data.sha,
      });

      console.log(`✅ Файлы запушены в main: ${repoOwner}/${repoName}`);
      console.log(`🔗 Репозиторий: https://github.com/${repoOwner}/${repoName}`);
      console.log(`🔗 Actions: https://github.com/${repoOwner}/${repoName}/actions`);

      return {
        title: `🤖 AI Generated Website: ${taskDescription.slice(0, 60)}...`,
        description: `AI generated website for: ${taskDescription}`,
        url: `https://github.com/${repoOwner}/${repoName}`,
        branch: "main",
        number: 0,
      };
    } catch (error) {
      console.error("❌ Ошибка создания PR через MCP:", error);

      // Fallback к мок-сервису
      return {
        title: `🤖 AI Generated Website (Fallback): ${taskDescription.slice(
          0,
          60
        )}...`,
        description: `AI generated website for: ${taskDescription}\n\n*Note: Using fallback mode due to GitHub connection issues*`,
        url: `https://github.com/example/repo`,
        branch: "main",
        number: 0,
      };
    }
  }

  private createFileContent(
    taskDescription: string,
    analysis: string,
    generatedCode: string
  ): string {
    return `"""
AI Generated Code (via MCP)
==========================

Task Description: ${taskDescription}

Analysis:
${analysis}

Generated on: ${new Date().toISOString()}
Created via: Model Context Protocol (MCP)
"""

${generatedCode}
`;
  }

  private createReadmeContent(
    taskDescription: string,
    analysis: string,
    fileName: string
  ): string {
    return `# AI Generated Code: ${fileName}

## Task Description
${taskDescription}

## Analysis
${analysis}

## Generated Code
The generated code is available in \`${fileName}\`.

## Usage
\`\`\`bash
python ${fileName}
\`\`\`

## Dependencies
Check the comments at the top of the file for required dependencies.

## MCP Integration
This code was generated using Model Context Protocol (MCP) for seamless AI-GitHub integration.

---
*This code was automatically generated by AI Task Processor using GigaChat API and MCP.*
`;
  }

  private createPullRequestBody(
    taskDescription: string,
    analysis: string,
    fileName: string
  ): string {
    return `## 🤖 AI Generated Pull Request (via MCP)

### Task Description
${taskDescription}

### Analysis
${analysis}

### Generated Files
- \`generated/${fileName}\` - Main implementation
- \`generated/${fileName.replace(".py", ".md")}\` - Documentation

### What was done
- ✅ Analyzed the technical requirement using GigaChat
- ✅ Generated working Python code
- ✅ Added error handling and documentation
- ✅ Created comprehensive README
- ✅ Created Pull Request via MCP (Model Context Protocol)

### MCP Benefits
- **Seamless Integration**: Direct AI-to-GitHub communication
- **Automated Workflow**: No manual intervention required
- **Standardized Process**: Consistent PR creation
- **Traceability**: Full audit trail of AI decisions

### Next Steps
- [ ] Review the generated code
- [ ] Test the implementation
- [ ] Add any necessary modifications
- [ ] Merge if approved

---
*This PR was automatically created by AI Task Processor using MCP (Model Context Protocol).*
`;
  }

  async disconnect() {
    if (this.isConnected) {
      this.isConnected = false;
      console.log("🔌 MCP GitHub отключен");
    }
  }
}
