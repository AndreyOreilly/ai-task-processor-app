"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import TaskStatus from "@/components/TaskStatus";

export default function Home() {
  const router = useRouter();
  const [taskStatus, setTaskStatus] = useState<
    "idle" | "processing" | "completed" | "error"
  >("idle");
  const [result, setResult] = useState<any>(null);

  const handleTaskSubmit = async (taskDescription: string) => {
    setTaskStatus("processing");

    try {
      const response = await fetch("/api/process-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to process task");
      }

      const data = await response.json();
      setResult(data);
      setTaskStatus("completed");
    } catch (error) {
      console.error("Error processing task:", error);
      setTaskStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <button
              onClick={() => router.push("/settings")}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Настройки GitHub</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Task Processor
          </h1>
          <p className="text-xl text-gray-600">
            Превращаем технические задания в готовый код с автоматическим
            созданием Pull Request
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <TaskForm
            onSubmit={handleTaskSubmit}
            disabled={taskStatus === "processing"}
          />

          <div className="mt-8">
            <TaskStatus
              status={taskStatus}
              result={result}
              onReset={() => {
                setTaskStatus("idle");
                setResult(null);
              }}
            />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Анализ ТЗ</h3>
              <p className="text-gray-600 text-sm">
                GigaChat анализирует техническое задание и разбивает его на
                пошаговый план
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Генерация кода
              </h3>
              <p className="text-gray-600 text-sm">
                AI создает рабочий код на основе анализа и сохраняет его
                локально
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pull Request</h3>
              <p className="text-gray-600 text-sm">
                Автоматическое создание коммита и Pull Request в GitHub
                репозитории
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
