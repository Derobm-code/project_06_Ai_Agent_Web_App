# AI Agent Web Application

A full-stack AI agent web application built with React, TypeScript, FastAPI, and Ollama. The application provides a modern chat interface for interacting with a locally hosted AI agent capable of answering questions and executing tools.

## Features

- **AI-powered conversations:** Chat with a local AI model through Ollama.
- **Tool execution:** Use agent tools for tasks such as mathematical calculations.
- **Expandable execution traces:** Inspect tool names, arguments, and results.
- **Markdown support:** Display formatted AI responses.
- **Mathematical expressions:** Render LaTeX using KaTeX.
- **Multiple conversations:** Create and switch between chat sessions.
- **Persistent chat history:** Save conversations in browser localStorage.
- **Loading indicators:** Display feedback while the AI processes requests.
- **Error handling:** Show connection errors and allow users to retry messages.
- **Automatic scrolling:** Keep the latest conversation messages visible.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | CSS |
| Backend | Python, FastAPI |
| AI inference | Ollama |
| AI model | Qwen3 1.7B |
| Markdown rendering | react-markdown |
| Mathematical formatting | remark-math, rehype-katex, KaTeX |
| Containerization | Docker, Docker Compose |
| Chat storage | Browser localStorage |

## Backend Repository

This frontend application connects to a separate AI Agent API
built with Python, FastAPI, and Ollama.

**Backend source code:**
[Project 4 — AI Agent API](https://github.com/Derobm-code/project_05_ai_agent_api.git)

The backend provides the `/chat` endpoint, processes user
messages, executes AI agent tools, and returns responses
with tool execution traces.

## Architecture

```text
React + TypeScript Frontend
          |
          | HTTP POST /chat
          v
FastAPI AI Agent Backend
          |
          v
AI Agent + Python Tools
          |
          v
Local Ollama Model (Qwen3 1.7B)
          |
          v
Answer + Tool Execution Trace
          |
          v
React Chat Interface
```

## Project Structure

```text
project_06_ai_agent_web_app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── ...
└── README.md
```

The application connects to a separate FastAPI backend developed in Project 4.

## Prerequisites

- Node.js compatible with the installed Vite version
- npm
- Docker Desktop
- Ollama
- Qwen3 1.7B model
- Running FastAPI AI Agent backend (Project 4)

## Getting Started

### 1. Start Ollama

Make sure Ollama is running and the model is installed:

```bash
ollama pull qwen3:1.7b
```

### 2. Start the backend

Navigate to the separate Project 4 backend directory:

```bash
cd project_05_ai_agent_api
docker compose up -d
```

The FastAPI backend should be available at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Start the frontend

Navigate to the frontend directory:

```bash
cd project_06_ai_agent_web_app/frontend
npm install
npm run dev
```

Open the local address displayed by Vite, typically:

`http://localhost:5173`

## API Integration

The frontend communicates with the backend using:

**POST** `/chat`

Example request:

```json
{
  "message": "Calculate 15% of 240"
}
```

Example response:

```json
{
  "answer": "The result is 36.",
  "trace": [
    {
      "step": 1,
      "tool": "calculate_percentage",
      "arguments": {
        "percentage": 15,
        "value": 240
      },
      "result": 36
    }
  ]
}
```

## Production Build

To build the frontend:

```bash
cd frontend
npm run build
```

## Live AI Agent Web App

**Try the application:** https://project-06-ai-agent-web-app-murex.vercel.app

A full-stack AI agent web application built with React, TypeScript, Vite, Python FastAPI, and GroqCloud.

### Features

- Interactive AI chat interface
- Markdown and mathematical expression rendering
- Expandable tool execution traces
- Multiple chat sessions
- Local browser storage for chat history
- Loading indicators and retry functionality
- Responsive interface
- Hosted AI inference through Groq
- Knowledge-base retrieval through the backend API

### Technology Stack

**Frontend:** React, TypeScript, Vite, React Markdown, KaTeX

**Backend:** Python, FastAPI, Pydantic

**AI:** GroqCloud with tool calling

**Retrieval:** TF-IDF for cloud knowledge-base search

**Deployment:** Vercel

### Architecture

```text
User
  |
  v
React + TypeScript (Vercel)
  |
  | HTTPS POST /chat
  v
FastAPI (Vercel)
  |
  v
Groq AI Agent
  |
  +-- Calculation tools
  +-- Date/time tool
  +-- TF-IDF knowledge-base search
  |
  v
Answer + execution trace
  |
  v
React chat interface
```

### Local Development

Install dependencies:

```bash
npm install
```

Configure the backend URL in `.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The backend must be running at the configured address.

For production, set `VITE_API_URL` in the frontend Vercel project's environment variables to the deployed FastAPI URL.

### Backend Repository

[AI Agent API](https://github.com/Derobm-code/project_04_ai_agent_api)

### Deployment

The frontend and backend are deployed independently on Vercel.

The frontend communicates with the backend over HTTPS. API keys remain on the backend and are never exposed through frontend environment variables.

The compiled application is generated in the `dist/` directory.

## Future Improvements

- Streaming AI responses
- GPU acceleration and model performance optimization
- Conversation deletion and renaming
- Authentication and user accounts
- Database-backed chat history
- Deployment with configurable API URLs

## Project Status

Core features implemented and production frontend build verified.

## Author

Derobm-code
