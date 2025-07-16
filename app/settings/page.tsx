"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface GitHubConfig {
  token: string;
  owner: string;
  isConnected: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<GitHubConfig>({
    token: "", // убираем токен по умолчанию
    owner: "",
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    // Загружаем текущие настройки
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch("/api/settings/github");
      if (response.ok) {
        const data = await response.json();
        setConfig((prev) => ({
          ...prev,
          token: data.token || prev.token,
          owner: data.owner || prev.owner,
          isConnected: data.isConnected,
        }));
      }
    } catch (error) {
      console.error("Error loading config:", error);
    }
  };

  const testConnection = async () => {
    if (!config.token) {
      showMessage("Введите токен для тестирования", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/test-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: config.token }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(
          `✅ Подключение успешно! Подключен как: ${data.username}`,
          "success"
        );
        setConfig((prev) => ({
          ...prev,
          owner: data.username,
          isConnected: true,
        }));
      } else {
        showMessage(`❌ Ошибка подключения: ${data.error}`, "error");
      }
    } catch (error) {
      showMessage("❌ Ошибка сети при тестировании подключения", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config.token) {
      showMessage("Введите токен", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/save-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: config.token }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("✅ Настройки GitHub сохранены!", "success");
        setConfig((prev) => ({ ...prev, isConnected: true }));
      } else {
        showMessage(`❌ Ошибка сохранения: ${data.error}`, "error");
      }
    } catch (error) {
      showMessage("❌ Ошибка сети при сохранении", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const openGitHubTokens = () => {
    window.open("https://github.com/settings/tokens", "_blank");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Назад к главной
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройки</h1>
          <p className="text-gray-600">
            Настройте интеграцию с GitHub для создания реальных Pull Request'ов
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              GitHub Интеграция
            </h2>

            {config.isConnected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      GitHub подключен и готов к работе!
                    </p>
                    {config.owner && (
                      <p className="text-sm text-green-700">
                        Подключен как: {config.owner}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  messageType === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : messageType === "error"
                    ? "bg-red-50 border border-red-200 text-red-800"
                    : "bg-blue-50 border border-blue-200 text-blue-800"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* GitHub Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Personal Access Token *
              </label>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={config.token}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, token: e.target.value }))
                  }
                  placeholder="ghp_your_token_here"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={openGitHubTokens}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Получить токен
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Токен должен иметь права:{" "}
                <code className="bg-gray-100 px-1 rounded">repo</code> и{" "}
                <code className="bg-gray-100 px-1 rounded">workflow</code>
              </p>
              <p className="mt-1 text-sm text-blue-600">
                💡 Имя пользователя и название репозитория будут определены
                автоматически
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                onClick={testConnection}
                disabled={isLoading || !config.token}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Тестируем..." : "Тестировать подключение"}
              </button>

              <button
                onClick={saveConfig}
                disabled={isLoading || !config.token}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Сохраняем..." : "Сохранить настройки"}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">
              🚀 Автоматическая настройка
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs">
                  1
                </span>
                <div>
                  <strong>Введите токен:</strong> Получите GitHub Personal
                  Access Token с правами repo и workflow
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs">
                  2
                </span>
                <div>
                  <strong>Автоматическое определение:</strong> Система сама
                  определит ваше имя пользователя из токена
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs">
                  3
                </span>
                <div>
                  <strong>Умное название репозитория:</strong> При вводе ТЗ AI
                  предложит подходящее название на основе задачи
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs">
                  4
                </span>
                <div>
                  <strong>Автоматическое создание:</strong> Репозиторий
                  создастся автоматически с предложенным названием
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
