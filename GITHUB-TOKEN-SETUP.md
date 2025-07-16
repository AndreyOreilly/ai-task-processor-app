# Настройка GitHub токена с максимальными правами

## 🔑 Создание нового токена

1. **Перейдите в GitHub Settings:**

   - https://github.com/settings/tokens

2. **Нажмите "Generate new token (classic)"**

3. **Выберите ВСЕ права:**

   - ✅ `repo` (полный доступ к репозиториям)
   - ✅ `workflow` (управление GitHub Actions)
   - ✅ `admin:org` (управление организациями)
   - ✅ `admin:public_key` (управление SSH ключами)
   - ✅ `admin:repo_hook` (управление webhooks)
   - ✅ `admin:org_hook` (управление org webhooks)
   - ✅ `gist` (создание gist)
   - ✅ `notifications` (уведомления)
   - ✅ `user` (профиль пользователя)
   - ✅ `delete_repo` (удаление репозиториев)
   - ✅ `write:packages` (загрузка пакетов)
   - ✅ `read:packages` (чтение пакетов)
   - ✅ `delete:packages` (удаление пакетов)
   - ✅ `admin:gpg_key` (управление GPG ключами)
   - ✅ `admin:ssh_signing_key` (управление SSH signing ключами)

4. **Скопируйте токен** (он показывается только один раз!)

## 📝 Настройка в проекте

1. **Создайте файл `.env.local`** в корне проекта:

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_your_new_token_here

# GigaChat Configuration
GIGACHAT_AUTH_KEY=your_gigachat_auth_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

2. **Перезапустите сервер:**

```bash
npm run dev
```

## 🚀 Результат

После этого токен будет иметь все необходимые права для:

- ✅ Создания репозиториев
- ✅ Управления Pages
- ✅ Запуска Actions
- ✅ Управления настройками репозиториев

## ⚠️ Безопасность

- **НЕ коммитьте** `.env.local` в git
- **НЕ делитесь** токеном
- **Регулярно обновляйте** токен
- **Используйте** минимально необходимые права в продакшене
