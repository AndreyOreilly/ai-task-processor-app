# AI Task Processor

🤖 Веб-приложение, которое превращает текстовые технические задания в готовый код с автоматическим созданием Pull Request в GitHub.

## 🚀 Возможности

- **Анализ ТЗ**: GigaChat анализирует техническое задание и разбивает его на пошаговый план
- **Генерация кода**: AI создает рабочий Python-код на основе анализа
- **Умные названия**: Автоматическая генерация красивых и понятных названий репозиториев
- **Автоматический PR**: Создание коммита и Pull Request в GitHub репозитории
- **Автоматический деплой**: Настройка GitHub Pages для автоматического деплоя сайтов
- **Современный UI**: Красивый и удобный интерфейс на Next.js + Tailwind CSS

## 🛠 Технологии

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: GigaChat API (Сбер)
- **Git**: GitHub API, Octokit
- **MCP**: Model Context Protocol для AI-GitHub интеграции
- **Стили**: Tailwind CSS

## 📋 Требования

- Node.js 18+
- npm или yarn
- Аккаунт в GigaChat Studio
- GitHub Personal Access Token
- GitHub репозиторий

## ⚙️ Установка и настройка

### 1. Клонирование и установка зависимостей

```bash
git clone <your-repo-url>
cd ai-task-processor
npm install
```

### 2. Быстрый запуск (демо режим)

Для быстрого тестирования с мок-данными:

```bash
# Установка зависимостей
npm install

# Запуск в демо режиме
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### 3. Настройка с реальным GigaChat API

1. Зарегистрируйтесь в [GigaChat Studio](https://studio.sber.ru/)
2. Создайте проект GigaChat API
3. Получите ключ авторизации (Authorization Key)
4. Запустите скрипт настройки:

```bash
node setup-env.js
```

Это создаст файл `.env.local` с вашим ключом GigaChat.

### 3. Настройка GitHub и MCP

1. Создайте Personal Access Token в GitHub:
   - Перейдите в Settings → Developer settings → Personal access tokens
   - Создайте новый token с правами: `repo`, `workflow`
2. Создайте репозиторий для хранения сгенерированного кода
3. Настройте MCP GitHub сервер:

```bash
node setup-mcp.js
```

### 4. Настройка переменных окружения

Создайте файл `.env.local` на основе `env.example`:

```bash
cp env.example .env.local
```

Заполните переменные:

```env
# GigaChat API Configuration
GIGACHAT_AUTH_KEY=your_base64_encoded_authorization_key

# GitHub Configuration
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=your_repository_name

# MCP Configuration
MCP_ENABLED=true
```

### 5. Запуск приложения

```bash
# Режим разработки
npm run dev

# Продакшн сборка
npm run build
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## 🔗 MCP (Model Context Protocol) Интеграция

AI Task Processor использует MCP для прямого взаимодействия с GitHub:

### Преимущества MCP

- **Прямая интеграция**: AI агент напрямую работает с GitHub
- **Автоматизация**: Полностью автоматизированный процесс создания PR
- **Стандартизация**: Единый протокол для AI-GitHub взаимодействия
- **Трассируемость**: Полный аудит решений AI

### MCP Workflow

1. **Анализ ТЗ**: GigaChat анализирует задачу
2. **Генерация кода**: AI создает рабочий код
3. **MCP интеграция**: Прямое создание файлов и PR в GitHub
4. **Результат**: Готовый Pull Request с кодом

### Настройка MCP

```bash
# Установка MCP GitHub сервера
node setup-mcp.js

# Проверка конфигурации
cat mcp-config.json
```

## 🎯 Использование

### 1. Ввод технического задания

Откройте приложение и введите описание задачи в текстовое поле. Например:

```
Нужен скрипт, который считывает Excel-файл и считает среднее значение по указанной колонке
```

### 2. Обработка задачи

Нажмите "Обработать ТЗ" и дождитесь завершения процесса:

1. **Анализ**: GigaChat разбирает задачу на компоненты
2. **Генерация**: Создается рабочий Python-код
3. **PR**: Автоматически создается Pull Request в GitHub

### 3. Результат

После завершения вы увидите:

- Анализ задачи
- Сгенерированный код
- Ссылку на созданный Pull Request

## 📁 Структура проекта

```
ai-task-processor/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── TaskForm.tsx       # Форма ввода ТЗ
│   └── TaskStatus.tsx     # Статус обработки
├── lib/                   # Сервисы
│   ├── gigachat.ts        # GigaChat API сервис
│   └── github.ts          # GitHub API сервис
├── env.example            # Пример переменных окружения
└── README.md              # Документация
```

## 🔧 API Endpoints

### POST /api/process-task

Обрабатывает техническое задание и создает Pull Request.

**Request Body:**

```json
{
  "taskDescription": "Описание задачи"
}
```

**Response:**

```json
{
  "analysis": "Анализ задачи от GigaChat",
  "generatedCode": "Сгенерированный Python код",
  "pullRequest": {
    "title": "Заголовок PR",
    "description": "Описание PR",
    "url": "Ссылка на PR",
    "branch": "Название ветки",
    "number": "Номер PR"
  }
}
```

## 🎨 Примеры использования

### Пример 1: Excel обработка

```
ТЗ: Нужен скрипт, который считывает Excel-файл и считает среднее значение по указанной колонке
```

### Пример 2: API endpoint

```
ТЗ: Создать API endpoint для регистрации пользователей с валидацией email
```

### Пример 3: Парсинг данных

```
ТЗ: Написать скрипт для парсинга CSV файлов и загрузки данных в PostgreSQL
```

## 🚨 Устранение неполадок

### Ошибка авторизации GigaChat

- Проверьте правильность ключа авторизации
- Убедитесь, что ключ закодирован в Base64
- Проверьте лимиты API в личном кабинете

### Ошибка SSL сертификата

Если получаете ошибку `self-signed certificate in certificate chain`:

- Это нормально для GigaChat API (они используют самоподписанные сертификаты)
- В коде уже настроено игнорирование проверки SSL для API Сбера
- Если проблема остается, проверьте настройки прокси или файрвола

### Ошибка GitHub API

- Проверьте правильность токена
- Убедитесь, что токен имеет необходимые права
- Проверьте правильность названия репозитория

### Ошибки сборки

- Убедитесь, что установлен Node.js 18+
- Очистите кэш: `npm run clean`
- Переустановите зависимости: `rm -rf node_modules && npm install`

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License

## 🆘 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте раздел "Устранение неполадок"
2. Создайте Issue в репозитории
3. Обратитесь к документации GigaChat и GitHub API

## 🌐 Автоматический деплой

AI Task Processor автоматически настраивает деплой для созданных сайтов:

### GitHub Pages

- Автоматическая настройка workflow
- Деплой при каждом PR и push в main
- Поддержка статических сайтов

### Альтернативные платформы

- Vercel (рекомендуется для Next.js)
- Netlify
- Surge.sh

### Устранение проблем с деплоем

Если у вас возникают проблемы с деплоем, см. [DEPLOYMENT-TROUBLESHOOTING.md](./DEPLOYMENT-TROUBLESHOOTING.md)

---

**Примечание**: Это MVP версия. В будущем планируется интеграция с MCP (Model Context Protocol) для более глубокой интеграции с GitHub.
