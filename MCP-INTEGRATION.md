# 🔗 MCP (Model Context Protocol) Интеграция

## Что такое MCP?

**Model Context Protocol (MCP)** — это стандартизированный протокол для взаимодействия AI моделей с внешними системами и API. В нашем случае MCP используется для прямого взаимодействия AI агента с GitHub.

## 🎯 Преимущества MCP в AI Task Processor

### 1. Прямая AI-GitHub Интеграция

- AI агент напрямую создает файлы в репозитории
- Автоматическое создание Pull Request'ов
- Нет необходимости в промежуточных API

### 2. Стандартизированный Процесс

- Единый протокол для всех AI-GitHub операций
- Консистентное создание PR'ов
- Предсказуемый результат

### 3. Трассируемость

- Полный аудит решений AI
- История всех созданных PR'ов
- Отслеживание изменений

### 4. Автоматизация

- Полностью автоматизированный workflow
- Минимум ручного вмешательства
- Быстрое развертывание кода

## 🏗️ Архитектура MCP в проекте

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GigaChat API  │    │   MCP Service   │    │   GitHub API    │
│                 │    │                 │    │                 │
│ • Анализ ТЗ     │───▶│ • Создание файлов│───▶│ • Репозиторий   │
│ • Генерация кода│    │ • Создание PR   │    │ • Pull Request  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Файлы MCP интеграции

### 1. `lib/mcp-github-simple.ts`

Основной MCP сервис для работы с GitHub:

- Подключение к GitHub API
- Создание файлов и веток
- Создание Pull Request'ов
- Fallback механизм

### 2. `mcp-config.json`

Конфигурация MCP сервера:

- Настройки GitHub сервера
- Определение инструментов
- Схемы данных

### 3. `setup-mcp.js`

Скрипт настройки MCP:

- Установка MCP GitHub сервера
- Проверка переменных окружения
- Настройка конфигурации

## 🔧 Настройка MCP

### 1. Установка MCP GitHub сервера

```bash
# Автоматическая настройка
node setup-mcp.js

# Или вручную
npm install -g @modelcontextprotocol/server-github
```

### 2. Настройка переменных окружения

```env
# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=your_repository_name

# MCP Configuration
MCP_ENABLED=true
```

### 3. Создание репозитория

1. Создайте новый репозиторий на GitHub
2. Убедитесь, что токен имеет права на запись
3. Проверьте подключение

## 🚀 MCP Workflow

### Шаг 1: Анализ ТЗ

```typescript
// GigaChat анализирует задачу
const analysis = await gigaChatService.analyzeTask(taskDescription);
```

### Шаг 2: Генерация кода

```typescript
// AI создает рабочий код
const generatedCode = await gigaChatService.generateCode(
  taskDescription,
  analysis
);
```

### Шаг 3: MCP интеграция

```typescript
// MCP создает файлы и PR в GitHub
const pullRequest = await mcpGitHubService.createPullRequest({
  taskDescription,
  analysis,
  generatedCode,
  fileName: `task_${uuidv4().slice(0, 8)}.py`,
});
```

### Шаг 4: Результат

- Файл с кодом создан в репозитории
- README с документацией добавлен
- Pull Request создан и готов к ревью

## 🛠️ MCP Инструменты

### `github_create_file`

Создает новый файл в GitHub репозитории:

```typescript
await client.callTool({
  name: "github_create_file",
  arguments: {
    owner: "username",
    repo: "repository",
    path: "generated/file.py",
    message: "feat: AI-generated code",
    content: "base64_encoded_content",
    branch: "main",
  },
});
```

### `github_create_pull_request`

Создает Pull Request:

```typescript
await client.callTool({
  name: "github_create_pull_request",
  arguments: {
    owner: "username",
    repo: "repository",
    title: "AI Generated PR",
    body: "PR description",
    head: "feature-branch",
    base: "main",
  },
});
```

## 🔄 Fallback Механизм

Если MCP GitHub сервер недоступен или произошла ошибка:

1. **Логирование ошибки**: Ошибка записывается в лог
2. **Fallback к мок-сервису**: Возвращается демо-результат
3. **Уведомление пользователя**: Показывается предупреждение
4. **Возможность повтора**: Пользователь может попробовать снова

## 📊 Мониторинг MCP

### Логи

```bash
# Просмотр логов MCP
tail -f logs/mcp.log

# Проверка подключения
curl -X POST http://localhost:3000/api/process-task \
  -H "Content-Type: application/json" \
  -d '{"taskDescription": "test"}'
```

### Метрики

- Количество успешных PR'ов
- Время создания PR
- Частота ошибок
- Использование fallback

## 🚨 Устранение неполадок MCP

### Ошибка подключения к GitHub

```bash
# Проверка токена
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user

# Проверка прав доступа
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/OWNER/REPO
```

### Ошибка MCP сервера

```bash
# Переустановка MCP сервера
npm uninstall -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-github

# Проверка конфигурации
cat mcp-config.json
```

### Проблемы с переменными окружения

```bash
# Проверка переменных
node -e "console.log(process.env.GITHUB_TOKEN ? 'OK' : 'MISSING')"

# Обновление .env.local
cp env.example .env.local
# Заполните переменные вручную
```

## 🔮 Будущие улучшения MCP

### 1. Расширенные инструменты

- Создание Issues
- Управление ветками
- Code review комментарии
- Автоматическое мержинг

### 2. Интеграция с другими сервисами

- GitLab
- Bitbucket
- Azure DevOps
- GitLab CI/CD

### 3. Улучшенная аналитика

- Детальная статистика
- Графики производительности
- Отчеты по PR'ам
- Метрики качества кода

## 📚 Полезные ссылки

- [MCP Документация](https://modelcontextprotocol.io/)
- [GitHub MCP Сервер](https://github.com/modelcontextprotocol/server-github)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Примеры MCP](https://github.com/modelcontextprotocol/examples)

---

**MCP интеграция делает AI Task Processor настоящим AI агентом, способным напрямую взаимодействовать с GitHub и автоматически создавать Pull Request'ы!** 🚀
