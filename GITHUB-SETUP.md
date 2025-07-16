# 🔧 Настройка GitHub для AI Task Processor

## 🎯 Что это дает?

После настройки GitHub интеграции AI агент сможет:

- ✅ Создавать реальные файлы в вашем репозитории
- ✅ Автоматически создавать Pull Request'ы
- ✅ Добавлять документацию к коду
- ✅ Работать через MCP (Model Context Protocol)

## 🚀 Быстрая настройка

### Вариант 1: Автоматическая настройка (рекомендуется)

```bash
node setup-github.js
```

Скрипт проведет вас через весь процесс настройки!

### Вариант 2: Ручная настройка

## 📋 Пошаговая инструкция

### Шаг 1: Получение GitHub Token

1. **Откройте** [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. **Нажмите** "Generate new token (classic)"
3. **Заполните форму**:
   - **Note**: `AI Task Processor`
   - **Expiration**: 90 days (или больше)
   - **Scopes**: ✅ `repo`, ✅ `workflow`
4. **Нажмите** "Generate token"
5. **Скопируйте токен** (показывается только один раз!)

### Шаг 2: Создание репозитория

1. **Перейдите** на [GitHub](https://github.com)
2. **Нажмите** "+" → "New repository"
3. **Заполните**:
   - **Repository name**: `ai-generated-code`
   - **Description**: `AI generated code repository`
   - **Visibility**: Public или Private
   - **НЕ** добавляйте README, .gitignore, license
4. **Нажмите** "Create repository"

### Шаг 3: Настройка переменных

Создайте или обновите файл `.env.local`:

```env
# GigaChat API Configuration
GIGACHAT_AUTH_KEY=NjE2NDcyNDUtZTAzYy00NjhlLWFkM2MtOWY5YTk4MTQzMzY5OmM5MTAxOTM3LWJiOTItNGNmMS05Y2JjLWZiMjE1Nzc1NTQ1MQ==

# GitHub Configuration
GITHUB_TOKEN=ghp_your_actual_token_here
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=ai-generated-code

# MCP Configuration
MCP_ENABLED=true
```

**Замените**:

- `ghp_your_actual_token_here` на ваш реальный токен
- `your_github_username` на ваше имя пользователя GitHub
- `ai-generated-code` на название вашего репозитория

## 🧪 Тестирование

### 1. Запустите приложение

```bash
npm run dev
```

### 2. Откройте браузер

Перейдите на http://localhost:3000

### 3. Протестируйте создание PR

Введите ТЗ, например:

```
Нужен скрипт для парсинга CSV файлов и загрузки в базу данных
```

### 4. Проверьте результат

- В интерфейсе появится ссылка на Pull Request
- Перейдите по ссылке и проверьте созданный PR
- В репозитории должны появиться файлы в папке `generated/`

## 🔍 Проверка настройки

### Проверка токена

```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

### Проверка репозитория

```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO
```

## 🚨 Устранение проблем

### Ошибка "Bad credentials"

- Проверьте правильность токена
- Убедитесь, что токен не истек
- Проверьте права доступа (repo, workflow)

### Ошибка "Repository not found"

- Проверьте правильность имени пользователя и репозитория
- Убедитесь, что репозиторий существует
- Проверьте права доступа к репозиторию

### Ошибка "Branch not found"

- Убедитесь, что в репозитории есть ветка `main`
- Если ветка называется `master`, измените в коде

## 📊 Что происходит после настройки

1. **AI анализирует ТЗ** через GigaChat
2. **Генерирует код** на Python
3. **Создает файл** в вашем репозитории
4. **Добавляет README** с документацией
5. **Создает Pull Request** с описанием
6. **Показывает ссылку** на PR в интерфейсе

## 🎉 Готово!

После настройки вы получите:

- ✅ Полностью автоматизированный процесс создания PR
- ✅ AI агент, работающий с вашим GitHub
- ✅ MCP интеграцию для прямого взаимодействия
- ✅ Красивый веб-интерфейс для управления

**Теперь AI Task Processor — это настоящий AI агент, создающий реальные Pull Request'ы в вашем GitHub репозитории!** 🚀
