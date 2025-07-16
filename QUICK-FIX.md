# 🚀 Быстрое исправление деплоя GitHub Pages

## 🔍 Проблема

Ошибка 403: `Write access to repository not granted` - GitHub Actions не может записать в репозиторий.

## ✅ Решение за 3 шага

### Шаг 1: Настройте GitHub Pages

1. Перейдите в **Settings → Pages**
2. Выберите **"GitHub Actions"** как источник
3. Нажмите **"Configure"** и выберите **"Static HTML"**

### Шаг 2: Запустите скрипт исправления

```bash
npm run fix-deployment
```

### Шаг 3: Обновите PR

```bash
git add .
git commit -m "Fix GitHub Pages deployment with proper permissions"
git push
```

## 🔧 Что исправляет скрипт

1. **Добавляет файл `.nojekyll`** - отключает Jekyll обработку
2. **Обновляет workflow** с правильными permissions:
   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```
3. **Использует современные GitHub Actions** вместо устаревших

## 🎯 Результат

После исправления:

- ✅ GitHub Pages будет работать
- ✅ Сайты будут автоматически деплоиться
- ✅ Ошибка 403 исчезнет

## 📞 Если не помогло

См. подробную документацию: [DEPLOYMENT-TROUBLESHOOTING.md](./DEPLOYMENT-TROUBLESHOOTING.md)
