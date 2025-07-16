"use client";

import { useState } from "react";

interface TaskFormProps {
  onSubmit: (taskDescription: string) => void;
  disabled?: boolean;
}

export default function TaskForm({
  onSubmit,
  disabled = false,
}: TaskFormProps) {
  const [taskDescription, setTaskDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskDescription.trim()) {
      onSubmit(taskDescription.trim());
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Введите техническое задание
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="taskDescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Описание задачи
          </label>
          <textarea
            id="taskDescription"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Например: Нужен скрипт, который считывает Excel-файл и считает среднее значение по указанной колонке"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            disabled={disabled}
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Примеры ТЗ:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• "Создать API endpoint для регистрации пользователей"</li>
            <li>
              • "Нужен скрипт для парсинга CSV файлов и загрузки в базу данных"
            </li>
            <li>
              • "Сделать компонент React для отображения таблицы с сортировкой"
            </li>
            <li>• "Написать функцию для валидации email адресов"</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={disabled || !taskDescription.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {disabled ? "Обрабатываем..." : "Обработать ТЗ"}
        </button>
      </form>
    </div>
  );
}
