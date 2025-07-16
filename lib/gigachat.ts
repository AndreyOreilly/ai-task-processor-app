import axios from "axios";

export class GigaChatService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    // Получаем ключ авторизации из переменных окружения
    const authKey = process.env.GIGACHAT_AUTH_KEY;
    if (!authKey) {
      throw new Error("GIGACHAT_AUTH_KEY environment variable is required");
    }
  }

  private async getAccessToken(): Promise<string> {
    // Проверяем, не истек ли текущий токен
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const authKey = process.env.GIGACHAT_AUTH_KEY!;
    const rqUid = crypto.randomUUID();

    try {
      const response = await axios.post(
        "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
        "scope=GIGACHAT_API_PERS",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            RqUID: rqUid,
            Authorization: `Basic ${authKey}`,
          },
          // Игнорируем проверку SSL сертификата для GigaChat API
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = response.data.expires_at;

      if (!this.accessToken) {
        throw new Error("Access token is null");
      }

      return this.accessToken;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw new Error("Failed to get GigaChat access token");
    }
  }

  async analyzeTask(taskDescription: string): Promise<string> {
    const token = await this.getAccessToken();

    const prompt = `Прими ТЗ: '${taskDescription}'. Разбей задачу на шаги и опиши каждую. 
    
    Структурируй ответ следующим образом:
    1. Анализ задачи
    2. Необходимые библиотеки и зависимости
    3. Пошаговый план реализации
    4. Ожидаемый результат
    5. Возможные проблемы и их решения`;

    try {
      const response = await axios.post(
        "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
        {
          model: "GigaChat:latest",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Игнорируем проверку SSL сертификата для GigaChat API
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error analyzing task:", error);
      throw new Error("Failed to analyze task with GigaChat");
    }
  }

  async generateCode(
    taskDescription: string,
    analysis: string
  ): Promise<string> {
    const token = await this.getAccessToken();

    const prompt = `Создай одну HTML страницу по следующему описанию: ${taskDescription}

    Анализ задачи:
    ${analysis}

    Требования:
    1. Одна HTML страница со всем встроенным (CSS и JS внутри)
    2. Современный и красивый дизайн
    3. Адаптивность (mobile-friendly)
    4. Интерактивность
    5. Готовность к деплою на GitHub Pages

    Создай полную HTML страницу с встроенными стилями и скриптами. Код должен быть готов к использованию.`;

    try {
      const response = await axios.post(
        "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
        {
          model: "GigaChat:latest",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 3000,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Игнорируем проверку SSL сертификата для GigaChat API
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating code:", error);
      throw new Error("Failed to generate code with GigaChat");
    }
  }
}
