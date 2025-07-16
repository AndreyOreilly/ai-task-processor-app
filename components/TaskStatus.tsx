"use client";

interface TaskStatusProps {
  status: "idle" | "processing" | "completed" | "error";
  result?: any;
  onReset: () => void;
}

export default function TaskStatus({
  status,
  result,
  onReset,
}: TaskStatusProps) {
  if (status === "idle") {
    return null;
  }

  if (status === "processing") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              Обрабатываем ТЗ...
            </h3>
            <p className="text-blue-700">Анализируем задачу и генерируем код</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-red-900">
              Произошла ошибка
            </h3>
            <p className="text-red-700">
              Не удалось обработать задачу. Попробуйте еще раз.
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (status === "completed" && result) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-green-400"
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
          <div>
            <h3 className="text-lg font-medium text-green-900">
              Задача выполнена!
            </h3>
            <p className="text-green-700">
              Код сгенерирован и отправлен в GitHub
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {result.analysis && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Анализ задачи:</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {result.analysis}
                </pre>
              </div>
            </div>
          )}

          {result.generatedCode && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Сгенерированный код:
              </h4>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <pre className="text-sm text-green-400 overflow-x-auto">
                  {result.generatedCode}
                </pre>
              </div>
            </div>
          )}

          {result.pullRequest && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pull Request:</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {result.pullRequest.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {result.pullRequest.description}
                    </p>
                  </div>
                  <a
                    href={result.pullRequest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Открыть PR
                  </a>
                </div>
              </div>
            </div>
          )}

          {result.deployUrls && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <span className="text-2xl mr-2">🚀</span>
                Ваш сайт готов!
              </h4>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">
                      GitHub Pages активирован автоматически
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Сайт будет доступен через 1-2 минуты после деплоя
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <a
                    href={result.deployUrls.githubPages}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <div>
                        <div className="font-semibold">GitHub Pages</div>
                        <div className="text-sm text-gray-300">Основной деплой</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Открыть сайт</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Автоматический деплой активирован
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        GitHub Actions автоматически деплоит ваш сайт. Если сайт не открывается сразу, подождите 1-2 минуты.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onReset}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Обработать новую задачу
        </button>
      </div>
    );
  }

  return null;
}
