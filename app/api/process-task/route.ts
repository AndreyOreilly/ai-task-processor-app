import { NextRequest, NextResponse } from "next/server";
import { GigaChatService } from "@/lib/gigachat";
import { MCPGitHubService } from "@/lib/mcp-github-simple";
import { Octokit } from "@octokit/rest";
import { v4 as uuidv4 } from "uuid";

// Используем реальный GigaChat API и MCP GitHub сервис
const gigaChatService = new GigaChatService();
const githubService = new MCPGitHubService();

// --- Локальная функция генерации имени репозитория ---
function translit(str: string): string {
  const ru = [
    "а",
    "б",
    "в",
    "г",
    "д",
    "е",
    "ё",
    "ж",
    "з",
    "и",
    "й",
    "к",
    "л",
    "м",
    "н",
    "о",
    "п",
    "р",
    "с",
    "т",
    "у",
    "ф",
    "х",
    "ц",
    "ч",
    "ш",
    "щ",
    "ъ",
    "ы",
    "ь",
    "э",
    "ю",
    "я",
    "А",
    "Б",
    "В",
    "Г",
    "Д",
    "Е",
    "Ё",
    "Ж",
    "З",
    "И",
    "Й",
    "К",
    "Л",
    "М",
    "Н",
    "О",
    "П",
    "Р",
    "С",
    "Т",
    "У",
    "Ф",
    "Х",
    "Ц",
    "Ч",
    "Ш",
    "Щ",
    "Ъ",
    "Ы",
    "Ь",
    "Э",
    "Ю",
    "Я",
  ];
  const en = [
    "a",
    "b",
    "v",
    "g",
    "d",
    "e",
    "e",
    "zh",
    "z",
    "i",
    "y",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "r",
    "s",
    "t",
    "u",
    "f",
    "h",
    "ts",
    "ch",
    "sh",
    "sch",
    "",
    "y",
    "",
    "e",
    "yu",
    "ya",
    "A",
    "B",
    "V",
    "G",
    "D",
    "E",
    "E",
    "Zh",
    "Z",
    "I",
    "Y",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "R",
    "S",
    "T",
    "U",
    "F",
    "H",
    "Ts",
    "Ch",
    "Sh",
    "Sch",
    "",
    "Y",
    "",
    "E",
    "Yu",
    "Ya",
  ];
  let res = "";
  for (let i = 0; i < str.length; i++) {
    const s = str.charAt(i);
    const idx = ru.indexOf(s);
    res += idx >= 0 ? en[idx] : s;
  }
  return res;
}

function generateRepoNameFromText(
  analysis: string,
  taskDescription: string
): string {
  const textToAnalyze = analysis || taskDescription || "ai-project";
  if (!textToAnalyze || typeof textToAnalyze !== "string") {
    return `ai-project-${Math.random().toString(36).substring(2, 6)}`;
  }
  let text = textToAnalyze.trim().toLowerCase();
  const stopWords = [
    "сайт",
    "про",
    "для",
    "создать",
    "создай",
    "приложение",
    "скрипт",
    "анализ",
    "задачи",
    "создание",
    "информации",
    "and",
    "the",
    "for",
    "about",
    "app",
    "website",
    "site",
    "with",
    "that",
    "this",
    "will",
    "can",
    "should",
    "would",
  ];
  let words = text
    .replace(/[^а-яa-z0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.includes(w.toLowerCase()))
    .filter((w) => w.length < 15);
  if (/[а-я]/.test(text)) {
    words = words.map(translit);
  }
  const base = words.slice(0, Math.min(3, words.length)).join("-");
  let prefix = "ai-project";
  if (text.includes("app") || text.includes("приложение")) prefix = "ai-app";
  else if (text.includes("скрипт") || text.includes("script"))
    prefix = "ai-script";
  else if (
    text.includes("сайт") ||
    text.includes("website") ||
    text.includes("site") ||
    text.includes("луну") ||
    text.includes("moon")
  )
    prefix = "ai-website";
  else if (text.includes("игра") || text.includes("game")) prefix = "ai-game";
  else if (text.includes("калькулятор") || text.includes("calculator"))
    prefix = "ai-calc";
  else if (text.includes("календарь") || text.includes("calendar"))
    prefix = "ai-calendar";
  const suffix = Math.random().toString(36).substring(2, 6);
  const repoName = `${prefix}-${base ? base + "-" : ""}${suffix}`;
  return repoName || `ai-project-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const { taskDescription } = await request.json();

    if (!taskDescription) {
      return NextResponse.json(
        { error: "Task description is required" },
        { status: 400 }
      );
    }

    // Получаем GitHub токен из переменных окружения
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        {
          error:
            "GitHub token not configured. Please configure GitHub integration first.",
        },
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: githubToken });

    // Получаем информацию о пользователе
    const { data: user } = await octokit.users.getAuthenticated();
    const owner = user.login;

    // Шаг 1: Анализ ТЗ с помощью GigaChat
    console.log("Анализируем ТЗ:", taskDescription);
    const analysis = await gigaChatService.analyzeTask(taskDescription);

    // Шаг 2: Генерируем название репозитория локально
    console.log("Генерируем название репозитория...");
    let repoName = generateRepoNameFromText(analysis, taskDescription);
    console.log("Предлагаемое название репозитория:", repoName);
    if (!repoName) {
      const fallbackName = `ai-project-${Math.random()
        .toString(36)
        .substring(2, 6)}`;
      console.log("Используем fallback название:", fallbackName);
      repoName = fallbackName;
    }

    // Шаг 3: Создаем репозиторий (если не существует)
    let repoExists = false;
    try {
      await octokit.repos.get({ owner, repo: repoName });
      repoExists = true;
      console.log("Репозиторий уже существует:", repoName);
    } catch (error: any) {
      if (error.status === 404) {
        console.log("Создаем новый репозиторий:", repoName);
        await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          private: false,
          auto_init: true,
          description: `AI-generated code for: ${taskDescription.slice(
            0,
            100
          )}...`,
        });

        // Ждем немного для инициализации репозитория
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Активируем GitHub Pages
        try {
          await octokit.repos.createPagesSite({
            owner: user.login,
            repo: repoName,
            source: {
              branch: 'main',
              path: '/'
            }
          });
          console.log('✅ GitHub Pages активирован для', repoName);
        } catch (pagesError: any) {
          console.log('⚠️ Не удалось активировать Pages:', pagesError?.message || 'Unknown error');
        }
      } else {
        throw error;
      }
    }

    // Шаг 4: Генерация кода
    console.log("Генерируем код...");
    const generatedCode = await gigaChatService.generateCode(
      taskDescription,
      analysis
    );

    // Шаг 5: Создание файла и коммита в GitHub
    console.log("Создаем Pull Request...");
    const pullRequest = await githubService.createPullRequest({
      taskDescription,
      analysis,
      generatedCode,
      fileName: `task_${uuidv4().slice(0, 8)}.py`,
      repoName, // передаем название репозитория
      owner, // передаем владельца
    });

    return NextResponse.json({
      analysis,
      generatedCode,
      pullRequest,
      repoName,
      repoUrl: `https://github.com/${owner}/${repoName}`,
      repoExists,
      deployUrls: {
        githubPages: `https://${owner}.github.io/${repoName}`,
        vercel: `https://${repoName}-${owner}.vercel.app`,
        netlify: `https://${repoName}.netlify.app`,
      },
    });
  } catch (error) {
    console.error("Error processing task:", error);
    return NextResponse.json(
      { error: "Failed to process task" },
      { status: 500 }
    );
  }
}
