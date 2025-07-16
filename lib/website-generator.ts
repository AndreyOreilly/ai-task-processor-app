export interface WebsiteFile {
  name: string;
  content: string;
  path: string;
}

export interface WebsiteProject {
  files: WebsiteFile[];
  deployUrl?: string;
  repoUrl?: string;
}

export class WebsiteGenerator {
  static parseGeneratedCode(generatedCode: string): WebsiteProject {
    const files: WebsiteFile[] = [];

    // Извлекаем только HTML-код из ответа AI
    let htmlMatch = generatedCode.match(/```html([\s\S]*?)```/i);
    let cleanCode = "";

    if (htmlMatch && htmlMatch[1]) {
      cleanCode = htmlMatch[1].trim();
    } else {
      // Если нет блока ```html ... ```, ищем <html>...</html>
      let tagMatch = generatedCode.match(/(<html[\s\S]*<\/html>)/i);
      if (tagMatch && tagMatch[1]) {
        cleanCode = tagMatch[1].trim();
      } else {
        // Fallback: всё содержимое, как сейчас
        cleanCode = generatedCode.trim();
      }
    }

    files.push({
      name: "index.html",
      content: cleanCode,
      path: "index.html",
    });

    // Добавляем README
    files.push({
      name: "README.md",
      content: this.createReadme(),
      path: "README.md",
    });

    // Добавляем .nojekyll для GitHub Pages
    files.push({
      name: ".nojekyll",
      content: "",
      path: ".nojekyll",
    });

    return { files };
  }

  private static createBasicHTML(content: string): string {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .content {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 2rem;
        }
        
        .content h2 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .content p {
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .footer {
            text-align: center;
            color: white;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 AI Generated Website</h1>
            <p>Создано с помощью AI Task Processor</p>
        </div>
        
        <div class="content">
            <h2>Содержимое сайта:</h2>
            <div id="content">
                ${content.replace(/```[\s\S]*?```/g, "").slice(0, 1000)}
            </div>
        </div>
        
        <div class="footer">
            <p>✨ Сайт готов к использованию!</p>
        </div>
    </div>
    
    <script>
        // Простая анимация появления
        document.addEventListener('DOMContentLoaded', function() {
            const content = document.querySelector('.content');
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            content.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
        });
    </script>
</body>
</html>`;
  }

  private static createReadme(): string {
    return `# AI Generated Website

## 🚀 О проекте

Этот сайт был автоматически создан с помощью AI Task Processor.

## 📁 Структура

- \`index.html\` - основная HTML страница со встроенными стилями и скриптами

## �� Деплой

### GitHub Pages (рекомендуется)
1. Перейдите в **Settings → Pages**
2. В разделе "Source" выберите **"GitHub Actions"**
3. Сохраните настройки
4. Пайплайн автоматически задеплоит сайт

### Альтернативные платформы:
- Vercel
- Netlify
- Любой статический хостинг

## ✨ Особенности

- Адаптивный дизайн
- Современный UI
- Встроенные стили и скрипты
- Готовность к продакшену

---
*Создано с помощью AI Task Processor и GigaChat API*`;
  }

  static createNojekyllFile(): WebsiteFile {
    return {
      name: ".nojekyll",
      content: "",
      path: ".nojekyll",
    };
  }

  static createSimpleGitHubPagesConfig(): WebsiteFile {
    return {
      name: ".github/workflows/deploy.yml",
      content: `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, feature/* ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
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
      uses: actions/deploy-pages@v4`,
      path: ".github/workflows/deploy.yml",
    };
  }

  static createVercelConfig(): WebsiteFile {
    return {
      name: "vercel.json",
      content: `{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}`,
      path: "vercel.json",
    };
  }
}
