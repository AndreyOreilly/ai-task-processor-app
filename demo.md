# 🎯 Демонстрация AI Task Processor

## 🚀 Запуск приложения

Приложение уже запущено и доступно по адресу: **http://localhost:3000**

## 📋 Что можно протестировать

### 1. Базовый функционал

- ✅ Современный UI с Tailwind CSS
- ✅ Форма ввода технического задания
- ✅ Обработка задачи через API
- ✅ Отображение результатов

### 2. Примеры ТЗ для тестирования

#### Пример 1: Excel обработка

```
Нужен скрипт, который считывает Excel-файл и считает среднее значение по указанной колонке
```

#### Пример 2: API endpoint

```
Создать API endpoint для регистрации пользователей с валидацией email и пароля
```

#### Пример 3: Парсинг данных

```
Написать скрипт для парсинга CSV файлов и загрузки данных в PostgreSQL базу данных
```

#### Пример 4: Валидация данных

```
Создать функцию для валидации российских телефонных номеров в формате +7XXXXXXXXXX
```

## 🔧 Текущая конфигурация

- **GigaChat API**: ✅ Настроен (реальный API)
- **GitHub API**: 🔄 Мок-сервис (для демонстрации)
- **Frontend**: ✅ Next.js + React + TypeScript
- **Стили**: ✅ Tailwind CSS

## 📊 Что происходит при обработке ТЗ

1. **Анализ** (2-3 секунды): GigaChat разбирает задачу на компоненты
2. **Генерация кода** (3-4 секунды): AI создает рабочий Python-скрипт
3. **Создание PR** (1-2 секунды): Мок-создание Pull Request

## 🎨 Особенности интерфейса

- **Адаптивный дизайн**: Работает на всех устройствах
- **Анимации**: Плавные переходы и индикаторы загрузки
- **Обратная связь**: Четкие статусы и сообщения об ошибках
- **Примеры**: Встроенные примеры ТЗ для быстрого старта

## 🔄 Переключение между режимами

### Демо режим (текущий)

```typescript
// app/api/process-task/route.ts
import { GigaChatService } from "@/lib/gigachat";
import { MockGitHubService } from "@/lib/mock-services";

const gigaChatService = new GigaChatService(); // Реальный GigaChat
const githubService = new MockGitHubService(); // Мок GitHub
```

### Полный режим (с GitHub)

1. Получите GitHub Personal Access Token
2. Обновите `.env.local`:

```env
GITHUB_TOKEN=your_token_here
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=your_repo
```

3. Замените `MockGitHubService` на `GitHubService` в `route.ts`

## 🧪 Тестирование API

Запустите тест API:

```bash
node test-api.js
```

## 📁 Структура проекта

```
ai-task-processor/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   └── process-task/  # Основной API
│   ├── globals.css        # Стили
│   ├── layout.tsx         # Layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── TaskForm.tsx       # Форма ввода
│   └── TaskStatus.tsx     # Статус обработки
├── lib/                   # Сервисы
│   ├── gigachat.ts        # GigaChat API
│   ├── github.ts          # GitHub API
│   └── mock-services.ts   # Мок-сервисы
├── setup-env.js           # Настройка окружения
├── test-api.js            # Тест API
└── README.md              # Документация
```

## 🎉 Готово к использованию!

Приложение полностью функционально и готово к демонстрации. Вы можете:

1. Открыть http://localhost:3000
2. Ввести любое техническое задание
3. Нажать "Обработать ТЗ"
4. Увидеть результат через 6-8 секунд

**Примечание**: GitHub интеграция работает в демо-режиме. Для реального создания Pull Request'ов настройте GitHub токен.
