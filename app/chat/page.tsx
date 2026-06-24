'use client'

export const dynamic = 'force-dynamic';

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
  LogOut,
} from 'lucide-react'
import { usePrompt } from '@/context/PromptContext'
import { logout } from '@/app/auth/actions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/src/utils/supabase/client'
import { chatAction } from './actions'
import { 
  createConversation, 
  saveMessage, 
  getUserConversations, 
  getConversationMessages 
} from './chat-actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
        marginBottom: '1.5rem',
        animation: 'fadeSlideIn 0.3s ease-out forwards',
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
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
          }}
        >
          <SynthLogo size={16} />
        </div>
      )}
      <div
        style={{
          maxWidth: isUser ? '70%' : '85%',
          background: isUser ? 'var(--violet-500)' : 'var(--surface-1)',
          color: isUser ? 'white' : 'var(--text-primary)',
          border: isUser ? 'none' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          borderBottomRightRadius: isUser ? 4 : undefined,
          borderBottomLeftRadius: !isUser ? 4 : undefined,
          padding: '0.875rem 1.125rem',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          boxShadow: isUser ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none',
        }}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const codeString = String(children).replace(/\n$/, '')
              
              if (!inline && match) {
                return <ChatCodeBlock code={codeString} language={match[1]} />
              }
              
              return (
                <code 
                  className={`${className} bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-violet-300`} 
                  {...props}
                >
                  {children}
                </code>
              )
            },
            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="mb-0.5">{children}</li>,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

/* ─── Left Sidebar ─── */
function ChatSidebar({ 
  user, 
  conversations, 
  activeId, 
  onSelect, 
  onNewChat 
}: { 
  user: any; 
  conversations: any[]; 
  activeId: string | null; 
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  const [search, setSearch] = useState('')

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
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
        onClick={onNewChat}
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
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              width: '100%',
              padding: '0.625rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background:
                activeId === conv.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              borderLeft:
                activeId === conv.id
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
              if (activeId !== conv.id) e.currentTarget.style.background = 'var(--surface-3)'
            }}
            onMouseLeave={(e) => {
              if (activeId !== conv.id) e.currentTarget.style.background = 'transparent'
            }}
          >
            <MessageSquare
              size={14}
              color={activeId === conv.id ? 'var(--violet-400)' : 'var(--text-tertiary)'}
            />
            <span
              style={{
                fontSize: '0.875rem',
                color: activeId === conv.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {conv.title}
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
          {user?.user_metadata?.full_name?.[0] || user?.email?.[0].toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
              title="Settings"
            >
              <Settings size={16} color="var(--text-tertiary)" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] bg-[#0f0f0f] border-white/10 text-white shadow-2xl backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Settings</DialogTitle>
              <DialogDescription className="text-white/40">
                Manage your account settings and preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-violet-400 uppercase tracking-wider">Account Information</h4>
                <div className="grid gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Full Name</span>
                      <span className="text-sm font-medium">{user?.user_metadata?.full_name || 'Not set'}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Email</span>
                      <span className="font-medium text-white/80">{user?.email}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Subscription</span>
                      <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20">Free Plan</Badge>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-violet-400 uppercase tracking-wider">Preferences</h4>
                <div className="flex items-center justify-between p-2">
                   <div className="space-y-0.5">
                      <div className="text-sm font-medium">Dark Mode</div>
                      <div className="text-xs text-white/40">Keep the interface in dark mode.</div>
                   </div>
                   <div className="h-6 w-11 bg-violet-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                </div>
              </div>

              <div className="pt-4 border-top border-white/10">
                <Button 
                   onClick={async () => {
                     await logout()
                     toast.info('Signed out')
                   }}
                   variant="destructive" 
                   className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 h-11"
                >
                  <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Persistence State
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const lastLoadedConvId = useRef<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Initial Load: User & Conversations
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }
      setUser(session.user)
      
      const convs = await getUserConversations()
      setConversations(convs)
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/')
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Switch Conversation: Load Messages
  useEffect(() => {
    if (activeConversationId && activeConversationId !== lastLoadedConvId.current) {
      const loadMessages = async () => {
        const msgs = await getConversationMessages(activeConversationId)
        if (msgs && msgs.length > 0) {
          setMessages(msgs.map((m: any) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content
          })))
        } else {
          // If genuinely empty or first load
          setMessages([])
        }
        lastLoadedConvId.current = activeConversationId
      }
      loadMessages()
    } else if (!activeConversationId) {
      setMessages([])
      lastLoadedConvId.current = null
    }
  }, [activeConversationId])

  // Handle pending prompt from landing page
  useEffect(() => {
    if (pendingPrompt && user && !loading) {
      setInputValue(pendingPrompt)
      // Small delay to ensure state is ready
      setTimeout(() => {
        handleSendMessage(pendingPrompt)
        setPendingPrompt('')
      }, 500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt, user, loading])

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

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--obsidian)' }}>
        <TypingIndicator />
      </div>
    )
  }

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    let currentConvId = activeConversationId
    
    // 1. If it's a new conversation, create it first
    if (!currentConvId) {
      const title = text.slice(0, 40) + (text.length > 40 ? '...' : '')
      const result = await createConversation(title)
      if (result.error || !result.data) {
        toast.error("Failed to start conversation")
        return
      }
      currentConvId = result.data.id
      lastLoadedConvId.current = currentConvId // Prevent redundant fetch
      setActiveConversationId(currentConvId)
      // Update sidebar immediately
      setConversations(prev => [result.data, ...prev])
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    // 2. Save user message to Supabase
    await saveMessage(currentConvId!, 'user', trimmed)

    // 3. Prepare items for AI history
    const historyItems = [...messages, userMsg].map(msg => ({
      role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content
    }))

    // 4. Call Real AI Action with user's name
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer'
    const result = await chatAction(trimmed, historyItems, userName)

    setIsTyping(false)

    if (result.success && result.text) {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text,
      }
      setMessages((prev) => [...prev, assistantMsg])
      
      // 5. Save AI message to Supabase
      await saveMessage(currentConvId!, 'assistant', result.text)
      
      // Update the local messages to have the real database format (optional but cleaner)
      // This is safe because we already showed the UI update above
    } else {
      toast.error(result.error || "Failed to get a response")
    }
  }


  const handleNewChat = () => {
    setActiveConversationId(null)
    setMessages([])
  }

  const handleSelectConversation = async (id: string) => {
    if (id === activeConversationId) return
    
    // Clear current state first to provide immediate feedback
    setMessages([])
    setIsTyping(false)
    lastLoadedConvId.current = null // Reset this so the useEffect MUST fetch
    
    setActiveConversationId(id)
    setSidebarOpen(false)
  }

  // Removing simulated response helpers...


  const handleSubmit = () => handleSendMessage(inputValue)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

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
        <ChatSidebar 
          user={user} 
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
        />
          {sidebarOpen && (
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
              <h3 style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                How can SYNTH help you today?
              </h3>
            </div>
          ) : (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: '1rem 2rem 2rem',
            background: 'linear-gradient(to top, var(--obsidian) 80%, transparent 100%)',
          }}
        >
          <div
            style={{
              maxWidth: 800,
              margin: '0 auto',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message SYNTH..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                resize: 'none',
                maxHeight: 160,
                padding: '0.25rem 0.5rem',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.375rem',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <Paperclip size={18} />
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: inputValue.trim() ? 'var(--violet-500)' : 'var(--surface-2)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  transition: 'background 150ms',
                }}
              >
                <ArrowUp size={18} color="white" />
              </button>
            </div>
          </div>
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
              marginTop: '0.75rem',
            }}
          >
            SYNTH can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
