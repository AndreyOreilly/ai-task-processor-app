import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing required field: token" },
        { status: 400 }
      );
    }

    // Проверяем токен
    const octokit = new Octokit({ auth: token });

    try {
      const { data: user } = await octokit.users.getAuthenticated();

      return NextResponse.json({
        success: true,
        username: user.login,
        message: `Подключение успешно! Подключен как ${user.login}`,
      });
    } catch (error: any) {
      if (error.status === 401) {
        return NextResponse.json(
          {
            error:
              "Неверный токен. Проверьте правильность токена и его права доступа.",
          },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: `Ошибка подключения к GitHub: ${error.message}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error testing GitHub connection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
