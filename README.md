# AI Task Processor

AI-powered application that generates code from technical specifications and automatically deploys to GitHub Pages.

## Features

- 🤖 **AI Analysis**: Uses GigaChat to analyze technical specifications
- 🏗️ **Code Generation**: Automatically generates working HTML/CSS/JavaScript code
- 🚀 **Auto Deploy**: Creates GitHub repositories and deploys to GitHub Pages
- ⚡ **Real-time**: Instant feedback and deployment status

## Live Demo

🌐 **Live Application**: [Deployed on Render](https://ai-task-processor.onrender.com)

## How it Works

1. **Input**: Enter your technical specification in Russian
2. **Analysis**: AI analyzes the requirements and creates a step-by-step plan
3. **Generation**: AI generates working code with HTML, CSS, and JavaScript
4. **Deploy**: Automatically creates GitHub repository and deploys to GitHub Pages
5. **Result**: Get a live website with direct links to GitHub Pages

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: GigaChat API for task analysis and code generation
- **Backend**: GitHub API for repository management
- **Deployment**: GitHub Pages for generated sites, Render for main app

## Environment Variables

Create a `.env.local` file with:

```env
# GigaChat API Configuration
GIGACHAT_AUTH_KEY=your_gigachat_key_here

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=your_repository_name
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Render.com (Recommended)

1. Fork this repository
2. Connect to Render.com
3. Create a new Web Service
4. Set environment variables in Render dashboard
5. Deploy automatically

### Manual Setup

1. Set environment variables
2. Run `npm run build`
3. Run `npm start`

## Example Usage

1. Enter: "Создать страницу с калькулятором"
2. AI generates a complete calculator with HTML/CSS/JavaScript
3. Automatically creates GitHub repository
4. Deploys to GitHub Pages
5. Get live website link

## License

MIT License
