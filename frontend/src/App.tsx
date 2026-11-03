import { useState, useEffect, useRef} from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'


type ToolTrace = {
  step: number
  tool: string
  arguments: Record<string, unknown>
  result: unknown
}


type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  content: string
  trace?: ToolTrace[]
  isError?: boolean
}

type ChatSession = {
  id: number
  title: string
  messages: ChatMessage[]
}

function App() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chats, setChats] = useState<ChatSession[]>(() => {
    try {
      const savedChats = localStorage.getItem('ai-agent-chats')

      if (savedChats) {
        const parsed = JSON.parse(savedChats)

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as ChatSession[]
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }

    return [
      {
        id: 1,
        title: 'New Chat',
        messages:[]
      },
    ]
  })
  const [activeChatId, setActiveChatId] = useState<number>(() => {
    try {
      const savedId = localStorage.getItem('ai-agent-active-chat')
      const id = savedId ? Number(savedId) : 1

      return chats.some(chat => chat.id === id)
      ? id: chats[0].id
    } catch {
      return chats[0].id
    }
  })

  useEffect(() => {
  try {
    localStorage.setItem('ai-agent-chats', JSON.stringify(chats))
  } catch (error) {
    console.error('Failed to save chat history:', error)
  }
  }, [chats])

  useEffect(() => {
    try {
      localStorage.setItem('ai-agent-active-chat',
        String(activeChatId)
      )
    } catch (error) {
      console.error('Failed to save active chat:', error)
    }
  }, [activeChatId])


  const activeChat = chats.find(chat => chat.id === activeChatId)

  const messages = activeChat?.messages ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isLoading, activeChatId])


  function setMessages(
    updater: (previous: ChatMessage[]) => ChatMessage[]
  ) {
    setChats(previousChats =>
      previousChats.map(chat =>
        chat.id === activeChatId
        ? { ...chat, messages: updater(chat.messages) }
        : chat
      )
    )
  }

  function createNewChat() {
    const newChat: ChatSession = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
    }

    setChats(previous => [newChat, ...previous])
    setActiveChatId(newChat.id)
    setMessage('')
  }


async function sendMessage() {
  const text = message.trim()
  if(!text || isLoading) return
  setIsLoading(true)

  const userMessage: ChatMessage = {
    id: Date.now(),
    role: 'user',
    content: text,
  }

  setChats(previousChats =>
    previousChats.map(chat => {
     if (chat.id !== activeChatId) return chat
        
     return {
      ...chat, title: chat.messages.length === 0
        ? text.length > 35
        ? text.slice(0, 35) + '...'
        : text
        : chat.title,
        messages: [...chat.messages, userMessage],
      }
     })
  )

  setMessage('')

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data: { answer: string; trace: ToolTrace[] } =
      await response.json()

    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: data.answer,
      trace: data.trace ?? [],
    }

    setMessages(previous => [...previous, assistantMessage])
  } catch (error) {
    console.error('Failed to contact AI agent:', error)

    setMessages(previous => [
      ...previous,
      {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Unable to connect to the AI agent. Please try again.',
        isError: true,
      },
    ])
  } finally {
    setIsLoading(false)
  }
 }

 function retryMessage() {
  if (isLoading) return

  const lastUserMessage = [...messages]
    .reverse()
    .find(item => item.role === 'user')

  if (!lastUserMessage) return

  setMessage(lastUserMessage.content)
 }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span>Agent Workspace</span>
        </div>

        <button 
        className="new-chat-button" 
        onClick={createNewChat} disabled={isLoading}> + New Chat</button>

        <div className="sidebar-section">
          <p className="section-label">YOUR WORKSPACE</p>
          <p className="sidebar-item active">✦ AI Assistant</p>
          <p className="sidebar-item">◷ Recent conversations</p>

          <div className="chat-history">
            <span className="sidebar-section-title">
              RECENT CHATS
              </span>

              {chats.map(chat => (
                <button
                key={chat.id}
                className={`chat-history-item ${
                  chat.id === activeChatId ? 'active' : ''}
              }`}
              onClick={() => {
                setActiveChatId(chat.id)
                setMessage('')
              }}
              disabled={isLoading}
            >
              {chat.title}
            </button>
          ))}
          </div>
        </div> 

        <div className="sidebar-footer">
          <span className="status-dot" />
          Local AI Workspace
          </div>  
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <strong>AI Assistant</strong>
            <span className="topbar-subtitle">
              Your Intelligent Workspace
            </span>
          </div>

          <span className="model-badge">Ollama · Local</span>
        </header>

        <section className="chat-content">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✦</div>
              
              <h1>How can I help you today?</h1>

              <p> Ask questions, explore your knowledge base,
                or let your AI agent handle calculations.</p>

              <div className="suggestions">
                <button type="button" onClick={() => setMessage('Explain retrieval-augmented generation')
            
            }>Explain RAG</button>

            <button type="button" onClick={() => setMessage('Calculate 15% of 240') 

            }>Calculate something</button>

            <button type="button" onClick={() => setMessage('What is Python used for?')
            
            }> Ask about Python
            </button>
              </div>
            </div>
            ) : (
              <div className="messages">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`message ${item.role}`}
                    >
                      <div className="message-avatar">
                        {item.role === 'user' ? 'U' : '✦'}
                      </div>

                      <div className="message-body">
                        <span className="message-author">
                          {item.role === 'user' ? 'You' : 'AI Agent'}
                        </span>

                        <div className="message-text">
                          {item.role === 'assistant' ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {item.content}
                            </ReactMarkdown>
                          ) : (
                            <p>{item.content}</p>
                          )}
                        </div>

                        {item.role === 'assistant' && item.isError && (
                          <button
                          type = "button"
                          className="retry-button"
                          onClick={retryMessage}
                          disabled={isLoading}
                          >↻ Retry message</button>
                        )}
                        {item.role === 'assistant' &&
                        item.trace &&
                        item.trace.length > 0 && (
                          <details className="tool-trace">
                            <summary>
                              🛠 Tool Execution ({item.trace.length} step
                              {item.trace.length !== 1 ? 's' : ''})
                            </summary>

                            <div className="trace-list">
                              {item.trace.map((step, index) => (
                                <div className="trace-step" key={index}>
                                  <div className="trace-title">
                                    Step {step.step}: {step.tool}
                                  </div>
                                  <div className="trace-label">Arguments</div>
                                  <pre>
                                    {JSON.stringify(step.arguments, null, 2)}
                                  </pre>

                                  <div className="trace-label">Result</div>
                                  <pre>
                                    {JSON.stringify(step.result, null, 2)}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message assistant">
                      <div className="message-avatar">✦</div>

                      <div className="message-body">
                        <span className="message-author">AI Agent</span>
                        <p className="thinking-text">
                          <span className="loading-dot" />
                          <span className="loading-dot" />
                          <span className="loading-dot" />
                          Thinking...
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
              </div>
            )}
        </section>

        <div className="composer-wrapper">
          <div className="composer">
            <textarea
            placeholder="Message your AI agent..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendMessage()
              }
            }}
            rows={2}/>

            <button 
              className="send-button"
              type="button"
              disabled={!message.trim() || isLoading}
              onClick={sendMessage}> ↑ 
              </button>
            </div>

            <p className="composer-note">
              Powered by Ollama · Built with React and FastAPI
            </p>
          </div>
      </main>
    </div>
  )
}

export default App