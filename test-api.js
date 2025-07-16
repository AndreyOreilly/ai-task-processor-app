#!/usr/bin/env node

const axios = require("axios");

async function testAPI() {
  try {
    console.log("🧪 Тестируем API endpoint...");

    const response = await axios.post(
      "http://localhost:3000/api/process-task",
      {
        taskDescription:
          "Нужен скрипт, который считывает Excel-файл и считает среднее значение по указанной колонке",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ API работает!");
    console.log("\n📊 Результат:");
    console.log(
      "Анализ:",
      response.data.analysis ? "✅ Получен" : "❌ Отсутствует"
    );
    console.log(
      "Код:",
      response.data.generatedCode ? "✅ Сгенерирован" : "❌ Отсутствует"
    );
    console.log(
      "Pull Request:",
      response.data.pullRequest ? "✅ Создан" : "❌ Отсутствует"
    );

    if (response.data.pullRequest) {
      console.log("\n🔗 Pull Request URL:", response.data.pullRequest.url);
    }
  } catch (error) {
    console.error("❌ Ошибка при тестировании API:", error.message);
    if (error.response) {
      console.error("Статус:", error.response.status);
      console.error("Данные:", error.response.data);
    }
  }
}

testAPI();
