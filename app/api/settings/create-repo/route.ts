import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function POST(request: NextRequest) {
  try {
    const { token, owner, repo } = await request.json();
    if (!token || !owner || !repo) {
      return NextResponse.json(
        { error: "Необходимы token, owner и repo" },
        { status: 400 }
      );
    }
    const octokit = new Octokit({ auth: token });
    try {
      // Проверяем, существует ли репозиторий
      await octokit.repos.get({ owner, repo });
      return NextResponse.json(
        { error: "Репозиторий уже существует", exists: true },
        { status: 409 }
      );
    } catch (e: any) {
      if (e.status !== 404) {
        return NextResponse.json(
          { error: "Ошибка проверки репозитория: " + e.message },
          { status: 500 }
        );
      }
    }
    // Создаём репозиторий
    const response = await octokit.repos.createForAuthenticatedUser({
      name: repo,
      private: true,
      auto_init: true,
      has_pages: true,
      description: "AI-generated code repository",
    });
    return NextResponse.json({
      success: true,
      repo: response.data.name,
      url: response.data.html_url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Ошибка создания репозитория" },
      { status: 500 }
    );
  }
}
