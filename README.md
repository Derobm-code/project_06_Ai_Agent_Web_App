# AI Agent Web App — React, TypeScript & Vite

A full-stack AI agent chat interface built with React, TypeScript, and Vite. The frontend communicates with a separately deployed FastAPI backend to provide AI responses, Python tool execution, and knowledge-base retrieval with a visible execution trace.

**Live demo:** https://project-06-ai-agent-web-app-murex.vercel.app  
**Backend API:** https://project-05-ai-agent-api.vercel.app  
**API documentation:** https://project-05-ai-agent-api.vercel.app/docs

## Features

- **Interactive AI chat:** Send questions to a deployed agent and display its responses.
- **Tool execution visibility:** Inspect the steps, arguments, and results returned by the backend.
- **Math and utility tools:** Demonstrates tool-assisted calculations and other structured actions.
- **Knowledge-base questions:** The agent can call `search_knowledge_base` to retrieve relevant document chunks.
- **Cloud-hosted AI:** The backend uses Groq-hosted inference; visitors do not need Ollama or Docker.
- **Request feedback:** Displays errors when the API is unavailable or rate-limited.
- **Public deployment:** Frontend hosted on Vercel, with the backend deployed separately.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Hosting | Vercel |
| API | FastAPI (separate deployment) |
| Hosted model | Groq |
| Agent capabilities | Python function tools and knowledge-base retrieval |
| API quota protection | Upstash Redis rate limiting on the backend |

## Architecture

```text
Browser
  |
  v
React + TypeScript UI (Vercel)
  |
  | POST {VITE_API_URL}/chat
  v
FastAPI API (Vercel)
  |
  +--> Upstash Redis rate-limit check
  |
  +--> Groq AI agent
          |
          +--> Python tools
          +--> Cloud TF-IDF knowledge-base search
  |
  v
JSON: answer + trace
  |
  v
Chat response + expandable tool execution
```

The frontend does **not** call Groq directly. The Groq API key and Upstash token remain on the backend.

## Run locally

Prerequisites: Node.js and npm, plus a running backend API or access to the deployed backend.

1. Clone this repository and open the `frontend` directory.
2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create `frontend/.env.local`:

   ```dotenv
   VITE_API_URL=http://127.0.0.1:8000
   ```

   To use the public backend instead:

   ```dotenv
   VITE_API_URL=https://project-05-ai-agent-api.vercel.app
   ```

4. Start the development server:

   ```powershell
   npm run dev
   ```

5. Open the local URL shown by Vite (typically `http://localhost:5173`).

**Important:** `VITE_API_URL` must include `https://` when pointing to the deployed backend. Vite variables beginning with `VITE_` are exposed to the browser, so never put secrets in them.

## Example interactions

### Tool-assisted calculation

Prompt:

```text
Calculate 15% of 240
```

Expected result: `36`, with a `calculate_percentage` tool execution in the trace.

### Knowledge-base retrieval

Prompt:

```text
Search my knowledge base for Python and explain its main features.
```

The agent can call `search_knowledge_base` and use retrieved text to formulate its answer. Open the tool execution section to inspect the trace.

## Deployment

1. Import the frontend repository into Vercel.
2. Set the project root directory to `frontend` if the repository contains a separate frontend subfolder.
3. Configure the environment variable:

   ```dotenv
   VITE_API_URL=https://project-05-ai-agent-api.vercel.app
   ```

4. Build and deploy the Vite application.
5. Ensure the backend's CORS configuration permits the deployed frontend origin.
6. Test a calculation, a knowledge-base question, and the API rate-limit response.

## Error handling and limits

The public backend uses a Redis-backed IP rate limit to protect hosted inference capacity. Under the current configuration, exceeding 10 requests within an hourly window can return HTTP 429. Other API errors may be displayed in the interface. Limits and provider availability can change.

## Related backend

**FastAPI AI Agent API:** https://project-05-ai-agent-api.vercel.app/docs

The backend contains the agent logic, tool definitions, RAG implementation, API validation, and request-rate limiting.
