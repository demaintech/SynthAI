import { useState, useRef, useEffect } from 'react'
import {
  Plus,
  Search,
  MessageSquare,
  Settings,
  Share,
  Copy,
  MoreVertical,
  Paperclip,
  ArrowUp,
  Menu,
  X,
} from 'lucide-react'
import { usePrompt } from '@/context/PromptContext'

/* ─── Synth Logo Mark (small, white) ─── */
function SynthLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="5.5"
        y="5.5"
        width="21"
        height="21"
        rx="3"
        transform="rotate(45 16 16)"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="16" cy="16" r="3" fill="white" />
    </svg>
  )
}

/* ─── Typing Indicator ─── */
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.5rem 0' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="typing-dot"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--text-tertiary)',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Code Block ─── */
function ChatCodeBlock({ code, language = 'javascript' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        margin: '0.75rem 0',
        background: 'var(--code-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--text-tertiary)',
            textTransform: 'lowercase',
          }}
        >
          {language}
        </span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            color: copied ? 'var(--violet-400)' : 'var(--text-tertiary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 150ms',
            fontFamily: 'inherit',
          }}
        >
          <Copy size={12} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          padding: '0.875rem 1rem',
          fontSize: '0.8125rem',
          lineHeight: 1.7,
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-secondary)',
          overflowX: 'auto',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

/* ─── Message Bubble ─── */
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  code?: { language: string; code: string }
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: '0.75rem',
        marginBottom: '1rem',
        animation: 'fadeSlideIn 300ms ease-out',
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--gradient-violet)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '0.25rem',
          }}
        >
          <SynthLogo size={16} />
        </div>
      )}
      <div
        style={{
          maxWidth: isUser ? '70%' : '75%',
          background: isUser ? 'var(--violet-500)' : 'var(--surface-1)',
          color: isUser ? 'white' : 'var(--text-primary)',
          border: isUser ? 'none' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          borderBottomRightRadius: isUser ? 4 : undefined,
          borderBottomLeftRadius: !isUser ? 4 : undefined,
          padding: '0.875rem 1.125rem',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
        }}
      >
        <div>{message.content}</div>
        {message.code && (
          <div style={{ animation: 'fadeScaleIn 200ms ease-out 100ms both' }}>
            <ChatCodeBlock code={message.code.code} language={message.code.language} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Left Sidebar ─── */
function ChatSidebar() {
  const [search, setSearch] = useState('')
  const [activeConv, setActiveConv] = useState('React pagination component')

  const conversations = [
    'React pagination component',
    'Python data scraper',
    'Database schema design',
    'API authentication middleware',
    'Docker compose setup',
    'GraphQL resolver optimization',
  ]

  const filtered = conversations.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      style={{
        width: 280,
        height: '100%',
        background: 'var(--surface-2)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* New Chat */}
      <button
        style={{
          width: '100%',
          padding: '0.625rem 1rem',
          background: 'var(--violet-500)',
          borderRadius: 'var(--radius-md)',
          color: 'white',
          fontWeight: 500,
          fontSize: '0.875rem',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'background 150ms, transform 150ms',
          fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--violet-600)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--violet-500)')}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Plus size={16} />
        New Chat
      </button>

      {/* Search */}
      <div
        style={{
          marginTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--surface-3)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem',
        }}
      >
        <Search size={14} color="var(--text-tertiary)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Conversation List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginTop: '1rem',
          marginRight: '-0.5rem',
          paddingRight: '0.5rem',
        }}
      >
        {filtered.map((conv) => (
          <button
            key={conv}
            onClick={() => setActiveConv(conv)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              width: '100%',
              padding: '0.625rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background:
                activeConv === conv ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              borderLeft:
                activeConv === conv
                  ? '2px solid var(--violet-500)'
                  : '2px solid transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              cursor: 'pointer',
              transition: 'background 150ms',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (activeConv !== conv) e.currentTarget.style.background = 'var(--surface-3)'
            }}
            onMouseLeave={(e) => {
              if (activeConv !== conv) e.currentTarget.style.background = 'transparent'
            }}
          >
            <MessageSquare
              size={14}
              color={activeConv === conv ? 'var(--violet-400)' : 'var(--text-tertiary)'}
            />
            <span
              style={{
                fontSize: '0.875rem',
                color: activeConv === conv ? 'var(--text-primary)' : 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {conv}
            </span>
          </button>
        ))}
      </div>

      {/* User Profile */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--gradient-violet)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'white',
          }}
        >
          U
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', flex: 1 }}>
          You
        </span>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          <Settings size={16} color="var(--text-tertiary)" />
        </button>
      </div>
    </div>
  )
}

/* ─── Main Chat Page ─── */
export default function ChatPage() {
  const { pendingPrompt, setPendingPrompt } = usePrompt()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle pending prompt from landing page
  useEffect(() => {
    if (pendingPrompt) {
      setInputValue(pendingPrompt)
      // Auto-send the pending prompt
      setTimeout(() => {
        handleSendMessage(pendingPrompt)
        setPendingPrompt('')
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [inputValue])

  const handleSendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    // Simulate assistant response
    setTimeout(() => {
      setIsTyping(false)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAssistantResponse(trimmed),
        code: getCodeResponse(trimmed),
      }
      setMessages((prev) => [...prev, assistantMsg])
    }, 1500)
  }

  const getAssistantResponse = (prompt: string): string => {
    const lower = prompt.toLowerCase()
    if (lower.includes('react') && lower.includes('component')) {
      return "Here's a paginated data table component with sorting capabilities:"
    }
    if (lower.includes('api') || lower.includes('rest')) {
      return "I'll build a REST API for you with Express.js. Here's the setup:"
    }
    if (lower.includes('debug') || lower.includes('fix')) {
      return "I've analyzed your request. Here's the corrected implementation:"
    }
    if (lower.includes('python')) {
      return "Here's a Python solution for your request:"
    }
    return "I'd be happy to help with that. Here's what I came up with:"
  }

  const getCodeResponse = (prompt: string): { language: string; code: string } | undefined => {
    const lower = prompt.toLowerCase()
    if (lower.includes('react') && lower.includes('component')) {
      return {
        language: 'tsx',
        code: `import { useState } from 'react';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
}

export function DataTable<T>({ data, columns, pageSize = 10 }: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as any)[sortKey];
    const bVal = (b as any)[sortKey];
    return sortDir === 'asc' 
      ? aVal > bVal ? 1 : -1 
      : aVal < bVal ? 1 : -1;
  });

  const paginated = sorted.slice(
    page * pageSize, 
    (page + 1) * pageSize
  );

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th 
                key={col.key}
                onClick={() => {
                  setSortDir(sortKey === col.key && sortDir === 'asc' ? 'desc' : 'asc');
                  setSortKey(col.key);
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render 
                    ? col.render(row) 
                    : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        <button 
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <span>Page {page + 1} of {Math.ceil(data.length / pageSize)}</span>
        <button 
          disabled={(page + 1) * pageSize >= data.length}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}`,
      }
    }
    if (lower.includes('api') || lower.includes('rest')) {
      return {
        language: 'javascript',
        code: `const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// GET all items
app.get('/api/items', async (req, res) => {
  const items = await db.items.findAll();
  res.json({ data: items });
});

// GET single item
app.get('/api/items/:id', async (req, res) => {
  const item = await db.items.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ data: item });
});

// POST create item
app.post('/api/items', async (req, res) => {
  const item = await db.items.create(req.body);
  res.status(201).json({ data: item });
});

// PUT update item
app.put('/api/items/:id', async (req, res) => {
  const item = await db.items.update(req.body, {
    where: { id: req.params.id }
  });
  res.json({ data: item });
});

// DELETE item
app.delete('/api/items/:id', async (req, res) => {
  await db.items.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('API server running on port 3000');
});`,
      }
    }
    return {
      language: 'python',
      code: `def main():
    """Main entry point for the application."""
    print("Hello from SYNTH!")
    
    # Example: data processing pipeline
    data = fetch_data()
    processed = process_data(data)
    save_results(processed)

def fetch_data():
    """Fetch data from external source."""
    import requests
    response = requests.get('https://api.example.com/data')
    return response.json()

def process_data(data):
    """Process and transform raw data."""
    return [item for item in data if item.get('active')]

def save_results(results):
    """Save processed results to database."""
    import json
    with open('output.json', 'w') as f:
        json.dump(results, f, indent=2)

if __name__ == '__main__':
    main()`,
    }
  }

  const handleSubmit = () => handleSendMessage(inputValue)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const suggestionChips = ['Generate a React hook', 'Explain this error', 'Optimize my function']

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        background: 'var(--obsidian)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(${messages[messages.length - 1]?.role === 'user' ? '20px' : '-20px'}); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: sidebarOpen ? 'fixed' : 'relative',
          left: sidebarOpen ? 0 : undefined,
          top: sidebarOpen ? 0 : undefined,
          bottom: sidebarOpen ? 0 : undefined,
          zIndex: sidebarOpen ? 101 : undefined,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform 300ms ease',
        }}
        className={sidebarOpen ? '' : 'hidden md:flex'}
      >
        {sidebarOpen ? (
          <div style={{ position: 'relative' }}>
            <ChatSidebar />
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '-2.5rem',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem',
                cursor: 'pointer',
              }}
            >
              <X size={18} color="var(--text-secondary)" />
            </button>
          </div>
        ) : (
          <div className="hidden md:block">
            <ChatSidebar />
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div
          style={{
            height: 48,
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
            >
              <Menu size={20} color="var(--text-secondary)" />
            </button>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {messages.length > 0 ? 'New Conversation' : 'SYNTH Chat'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[Share, Copy, MoreVertical].map((Icon, i) => (
              <button
                key={i}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  color: 'var(--text-tertiary)',
                  transition: 'color 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 2rem',
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <div style={{ opacity: 0.3 }}>
                <SynthLogo size={48} />
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: 'var(--text-tertiary)',
                  marginTop: '1rem',
                }}
              >
                How can I help you code today?
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  marginTop: '1.5rem',
                }}
              >
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSendMessage(chip)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.375rem 0.875rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--gradient-violet)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <SynthLogo size={16} />
                  </div>
                  <div
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      borderBottomLeftRadius: 4,
                      padding: '0.875rem 1.125rem',
                    }}
                  >
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            background: 'var(--obsidian)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1rem 2rem 1.5rem',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              maxWidth: 800,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '0.75rem',
              background: 'var(--surface-1)',
              border: `1px solid ${inputFocused ? 'rgba(139, 92, 246, 0.4)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-xl)',
              padding: '0.875rem 1rem',
              boxShadow: inputFocused ? '0 0 0 3px rgba(139, 92, 246, 0.08)' : 'none',
              transition: 'border-color 300ms ease, box-shadow 300ms ease',
            }}
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                flexShrink: 0,
                color: 'var(--text-tertiary)',
                transition: 'color 150ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
            >
              <Paperclip size={18} />
            </button>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask SYNTH anything..."
              rows={1}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                resize: 'none',
                lineHeight: 1.5,
                maxHeight: 160,
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: inputValue.trim() ? 'var(--violet-500)' : 'var(--surface-3)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                flexShrink: 0,
                transition: 'background 150ms, transform 150ms',
              }}
              onMouseDown={(e) => {
                if (inputValue.trim()) e.currentTarget.style.transform = 'scale(0.95)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <ArrowUp
                size={18}
                color={inputValue.trim() ? 'white' : 'var(--text-tertiary)'}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
