#!/usr/bin/env node

// Простая функция генерации названия из промпта
function generateRepoNameFromPrompt(taskDescription) {
  const text = taskDescription.toLowerCase();

  // Определяем тип проекта
  let projectType = "project";

  // Ищем ключевые слова для определения типа
  if (
    text.includes("сайт") ||
    text.includes("website") ||
    text.includes("site") ||
    text.includes("web")
  ) {
    projectType = "website";
  } else if (
    text.includes("скрипт") ||
    text.includes("script") ||
    text.includes("tool") ||
    text.includes("utility")
  ) {
    projectType = "script";
  } else if (
    text.includes("приложение") ||
    text.includes("app") ||
    text.includes("application") ||
    text.includes("dashboard")
  ) {
    projectType = "app";
  }

  // Извлекаем ключевые слова из промпта (исключаем служебные слова)
  const stopWords = ['создай', 'напиши', 'сделай', 'разработай', 'построй', 'создайте', 'напишите'];
  const words = text
    .replace(/[^а-яa-z\s]/g, " ") // убираем спецсимволы
    .split(/\s+/) // разбиваем на слова
    .filter((word) => word.length > 2 && !stopWords.includes(word)) // исключаем служебные слова
    .slice(0, 2); // берем первые 2 слова

  // Генерируем уникальный суффикс
  const suffix = Math.random().toString(36).substring(2, 6);

  // Формируем название
  if (words.length > 0) {
    return `ai-${projectType}-${words.join("-")}-${suffix}`;
  } else {
    return `ai-${projectType}-${suffix}`;
  }
}

console.log("🧪 Тестирование генерации названий репозиториев\n");

const testTasks = [
  "создай сайт про собачек",
  "создай сайт про кошек",
  "создай сайт про мышек",
  "создай сайт про птичек",
  "создай сайт про змей",
  "создай React приложение для управления задачами",
  "напиши скрипт для парсинга CSV файлов",
  "создай веб-приложение для отслеживания расходов",
  "создай сайт про путешествия",
  "напиши утилиту для конвертации изображений",
  "создай дашборд для аналитики данных",
];

console.log("📝 Примеры названий для разных задач:\n");

testTasks.forEach((task, index) => {
  const repoName = generateRepoNameFromPrompt(task);
  console.log(`${index + 1}. "${task}"`);
  console.log(`   → ${repoName}\n`);
});

console.log("✨ Теперь названия будут красивыми и понятными!");
