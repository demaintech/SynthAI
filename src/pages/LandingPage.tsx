import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Send,
  Zap,
  Bug,
  RefreshCw,
  BookOpen,
  Globe,
  Lock,
  ArrowRight,
} from 'lucide-react'
import { usePrompt } from '@/context/PromptContext'

/* ─── Logo Mark ─── */
function LogoMark({ size = 32, color = '#a78bfa' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="5.5"
        y="5.5"
        width="21"
        height="21"
        rx="3"
        transform="rotate(45 16 16)"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="16" cy="16" r="3" fill={color} />
    </svg>
  )
}

/* ─── Code Block ─── */
function CodeBlock({ code, filename = 'terminal' }: { code: string; filename?: string }) {
  return (
    <div
      style={{
        background: 'var(--code-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.5rem 0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <span
          style={{
            marginLeft: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--text-tertiary)',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {filename}
        </span>
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

/* ─── Header ─── */
function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '1rem var(--content-padding)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background 300ms ease, backdrop-filter 300ms ease',
        background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <LogoMark size={24} />
        <span style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
          SYNTH
        </span>
      </div>
      <nav style={{ display: 'flex', gap: '2rem' }}>
        {[
          { label: 'Features', id: 'features' },
          { label: 'Docs', id: 'docs' },
          { label: 'Research', id: 'research' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

/* ─── Hero Section ─── */
function HeroSection() {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const { setPendingPrompt } = usePrompt()
  const sectionRef = useRef<HTMLDivElement>(null)

  const suggestions = ['Build a REST API', 'Debug my code', 'Explain algorithms', 'Refactor legacy']

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    setPendingPrompt(inputValue.trim())
    navigate('/chat')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  // Entrance animations
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.hero-anim')
    if (!els) return
    els.forEach((el) => {
      const htmlEl = el as HTMLElement
      htmlEl.style.opacity = '0'
      htmlEl.style.transform = 'translateY(30px)'
    })

    const delays = [200, 400, 550, 700, 900]
    els.forEach((el, i) => {
      const delay = delays[i] || 700
      setTimeout(() => {
        const htmlEl = el as HTMLElement
        htmlEl.style.transition = 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)'
        htmlEl.style.opacity = '1'
        htmlEl.style.transform = 'translateY(0)'
      }, delay)
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 var(--content-padding)',
        textAlign: 'center',
      }}
    >
      {/* Logo */}
      <div className="hero-anim" style={{ marginBottom: '2rem' }}>
        <div className="synth-logo-pulse">
          <LogoMark size={32} />
        </div>
      </div>

      {/* Headline */}
      <h1
        className="hero-anim"
        style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          color: 'var(--text-primary)',
          textShadow: '0 0 80px rgba(139, 92, 246, 0.15)',
          maxWidth: 900,
        }}
      >
        Code. Evolved<span style={{ color: 'var(--violet-400)' }}>.</span>
      </h1>

      {/* Subheadline */}
      <p
        className="hero-anim"
        style={{
          fontSize: '1.125rem',
          lineHeight: 1.65,
          color: 'var(--text-secondary)',
          maxWidth: 540,
          marginTop: '1.5rem',
        }}
      >
        SYNTH is your AI coding partner. Ask it to write, debug, refactor, or explain any codebase — in any language.
      </p>

      {/* Input Field */}
      <div
        className="hero-anim"
        style={{
          width: '100%',
          maxWidth: 680,
          marginTop: '2.5rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isFocused ? 'var(--violet-500)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            boxShadow: isFocused ? '0 0 0 3px rgba(139, 92, 246, 0.15)' : 'none',
            transition: 'border-color 300ms ease, box-shadow 300ms ease',
          }}
        >
          <Sparkles
            size={16}
            style={{
              color: 'var(--violet-400)',
              flexShrink: 0,
              animation: inputValue ? 'spin 2s linear infinite' : 'none',
            }}
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to build?"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-violet)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 150ms',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Send size={16} color="white" />
          </button>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div
        className="hero-anim"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginTop: '1rem',
        }}
      >
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setInputValue(s)}
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
            {s}
          </button>
        ))}
      </div>

      {/* Bottom gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to top, var(--obsidian) 0%, transparent 100%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}

/* ─── Features Section ─── */
function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Zap,
      title: 'Instant Code Generation',
      desc: 'Write entire functions, classes, or modules from natural language descriptions. SYNTH understands context and writes production-ready code.',
    },
    {
      icon: Bug,
      title: 'Intelligent Debugging',
      desc: 'Paste any error message or buggy code. SYNTH traces the root cause, suggests fixes, and explains why the error occurred.',
    },
    {
      icon: RefreshCw,
      title: 'Automated Refactoring',
      desc: 'Transform legacy code into modern patterns. SYNTH preserves functionality while improving readability, performance, and maintainability.',
    },
    {
      icon: BookOpen,
      title: 'Deep Code Explanation',
      desc: 'Select any code block and ask "explain this." SYNTH breaks down complex logic into clear, step-by-step understanding.',
    },
    {
      icon: Globe,
      title: 'Multi-Language Fluency',
      desc: 'From Python to Rust, JavaScript to Haskell — SYNTH speaks 50+ languages and translates between them effortlessly.',
    },
    {
      icon: Lock,
      title: 'Context-Aware Assistance',
      desc: 'SYNTH maintains awareness of your entire project structure, imports, and conventions for coherent, consistent suggestions.',
    },
  ]

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{
        maxWidth: 'var(--page-max-width)',
        margin: '0 auto',
        padding: 'var(--section-padding) var(--content-padding)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: 'var(--violet-400)',
          }}
        >
          CAPABILITIES
        </span>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginTop: '0.75rem',
          }}
        >
          Built for the way you code
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <div
              key={f.title}
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 600ms ease ${i * 100}ms, transform 600ms ease ${i * 100}ms`,
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Icon size={20} color="var(--violet-400)" />
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  marginTop: '0.5rem',
                }}
              >
                {f.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ─── Documentation Section ─── */
function DocumentationSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeDoc, setActiveDoc] = useState('Quick Start')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const docGroups = [
    {
      label: 'GETTING STARTED',
      items: ['Quick Start', 'Installation', 'First Prompt'],
    },
    {
      label: 'CORE CONCEPTS',
      items: ['Context Window', 'Code Awareness', 'Project Indexing'],
    },
    {
      label: 'API REFERENCE',
      items: ['REST API', 'WebSocket', 'Authentication'],
    },
  ]

  const docContent: Record<string, { title: string; desc: string; code: string }> = {
    'Quick Start': {
      title: 'Get Started in 30 Seconds',
      desc: 'SYNTH integrates directly into your workflow. No complex setup — just open, prompt, and ship.',
      code: `# Install the SYNTH CLI
$ npm install -g @synth/cli

# Initialize in your project
$ synth init

# Start coding with AI
$ synth chat
> Build me a React component that displays
  a paginated data table with sorting`,
    },
    Installation: {
      title: 'Installation Guide',
      desc: 'Install SYNTH via npm, yarn, or pnpm. Works on macOS, Linux, and Windows with WSL.',
      code: `# Via npm
$ npm install -g @synth/cli

# Via yarn
$ yarn global add @synth/cli

# Via pnpm
$ pnpm add -g @synth/cli

# Verify installation
$ synth --version
> synth 2.4.1`,
    },
    'First Prompt': {
      title: 'Your First Prompt',
      desc: 'Learn how to write effective prompts that get the best results from SYNTH.',
      code: `# Basic prompt
$ synth chat
> Write a Python function to calculate
  the factorial of a number recursively

# With context
$ synth chat --file src/app.js
> Refactor this to use async/await
  instead of callbacks`,
    },
    'Context Window': {
      title: 'Understanding Context Windows',
      desc: 'SYNTH maintains a large context window to understand your entire codebase.',
      code: `# Check your context usage
$ synth status
> Context: 12,400 / 128,000 tokens
> Files indexed: 47
> Memory: 2.1 MB

# Clear context if needed
$ synth context clear
> Context cleared successfully`,
    },
    'Code Awareness': {
      title: 'Code Awareness Engine',
      desc: 'How SYNTH understands your code structure, imports, and dependencies.',
      code: `# Enable deep code awareness
$ synth config --awareness deep

# SYNTH now understands:
# - Import chains and module deps
# - Type definitions and interfaces
# - Test coverage for each file
# - Recent git history and changes`,
    },
    'Project Indexing': {
      title: 'Project Indexing',
      desc: 'SYNTH indexes your project for lightning-fast context retrieval.',
      code: `# Index your project
$ synth index
> Indexing 234 files...
> Done in 3.2s

# Search the index
$ synth search "auth middleware"
> Found 12 references in 4 files`,
    },
    'REST API': {
      title: 'REST API Reference',
      desc: 'Integrate SYNTH into your applications via our RESTful API.',
      code: `curl -X POST https://api.synth.ai/v1/chat \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Write a sorting algorithm",
    "language": "python",
    "context": ["src/utils.py"]
  }'`,
    },
    WebSocket: {
      title: 'WebSocket API',
      desc: 'Real-time streaming responses via WebSocket for interactive experiences.',
      code: `const ws = new WebSocket(
  'wss://api.synth.ai/v1/stream',
  ['synth-protocol']
);

ws.onmessage = (event) => {
  const chunk = JSON.parse(event.data);
  appendToEditor(chunk.code);
};`,
    },
    Authentication: {
      title: 'Authentication',
      desc: 'Secure your API requests with token-based authentication.',
      code: `# Generate an API key
$ synth auth generate
> Key: sk-synth-xxxxxxxxxxxx

# Set as environment variable
$ export SYNTH_API_KEY=sk-synth-xxxxxxxxxxxx

# Verify
$ synth auth verify
> Authenticated as @developer`,
    },
  }

  const currentDoc = docContent[activeDoc] || docContent['Quick Start']

  return (
    <section
      id="docs"
      ref={sectionRef}
      style={{
        background: 'var(--gradient-dark)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--page-max-width)',
          margin: '0 auto',
          padding: 'var(--section-padding) var(--content-padding)',
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            background: 'var(--surface-1)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 500ms ease, transform 500ms ease',
          }}
        >
          {docGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  color: 'var(--text-tertiary)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                {group.label}
              </span>
              {group.items.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveDoc(item)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    color: activeDoc === item ? 'var(--violet-400)' : 'var(--text-secondary)',
                    fontWeight: activeDoc === item ? 500 : 400,
                    background:
                      activeDoc === item ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    if (activeDoc !== item) {
                      e.currentTarget.style.background = 'var(--surface-2)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeDoc !== item) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            minWidth: 300,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 500ms ease 150ms, transform 500ms ease 150ms',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            {currentDoc.title}
          </h2>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginTop: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {currentDoc.desc}
          </p>
          <CodeBlock code={currentDoc.code} filename="terminal" />
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--violet-400)',
              fontSize: '0.875rem',
              marginTop: '1.5rem',
              textDecoration: 'none',
              transition: 'gap 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = '0.75rem')}
            onMouseLeave={(e) => (e.currentTarget.style.gap = '0.5rem')}
          >
            Read Full Docs
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Research Section ─── */
function ResearchSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="research"
      ref={sectionRef}
      style={{
        maxWidth: 'var(--page-max-width)',
        margin: '0 auto',
        padding: 'var(--section-padding) var(--content-padding)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: 'var(--violet-400)',
          }}
        >
          RESEARCH
        </span>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginTop: '0.75rem',
          }}
        >
          Latest from the Lab
        </h2>
      </div>

      {/* Featured + Small cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
        }}
      >
        {/* Featured Card */}
        <div
          style={{
            gridColumn: 'span 2',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
            const img = e.currentTarget.querySelector('img') as HTMLImageElement
            if (img) img.style.transform = 'scale(1.03)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            const img = e.currentTarget.querySelector('img') as HTMLImageElement
            if (img) img.style.transform = 'scale(1)'
          }}
        >
          <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
            <img
              src="/research-featured.jpg"
              alt="Neural Architecture"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 500ms ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.9) 100%)',
              }}
            />
          </div>
          <div style={{ padding: '2rem' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: 'var(--violet-400)',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                display: 'inline-block',
              }}
            >
              MODEL ARCHITECTURE
            </span>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                color: 'var(--text-primary)',
                marginTop: '0.75rem',
              }}
            >
              How SYNTH Understands Code: Inside Our Neural Architecture
            </h3>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginTop: '0.5rem',
              }}
            >
              We built a specialized transformer architecture that processes code as graphs rather than sequences, achieving 40% better comprehension on complex codebases.
            </p>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-tertiary)',
                marginTop: '1rem',
                display: 'block',
              }}
            >
              8 min read
            </span>
          </div>
        </div>

        {/* Small Card 1 */}
        <div
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 150ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 150ms',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
            const img = e.currentTarget.querySelector('img') as HTMLImageElement
            if (img) img.style.transform = 'scale(1.03)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            const img = e.currentTarget.querySelector('img') as HTMLImageElement
            if (img) img.style.transform = 'scale(1)'
          }}
        >
          <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src="/research-card-1.jpg"
              alt="Code Quality"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 500ms ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.9) 100%)',
              }}
            />
          </div>
          <div style={{ padding: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: 'var(--violet-400)',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                display: 'inline-block',
              }}
            >
              CODE GENERATION
            </span>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                lineHeight: 1.3,
                color: 'var(--text-primary)',
                marginTop: '0.75rem',
              }}
            >
              From Prompt to Production: Code Quality at Scale
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginTop: '0.5rem',
              }}
            >
              Our latest benchmarks show SYNTH-generated code passes 94% of test suites on first attempt.
            </p>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-tertiary)',
                marginTop: '1rem',
                display: 'block',
              }}
            >
              5 min read
            </span>
          </div>
        </div>

        {/* Small Card 2 */}
        <div
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 300ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 300ms',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
            const img = e.currentTarget.querySelector('img') as HTMLImageElement
            if (img) img.style.transform = 'scale(1.03)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            const img = e.currentTarget.querySelector('img') as HTMLImageElement
            if (img) img.style.transform = 'scale(1)'
          }}
        >
          <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src="/research-card-2.jpg"
              alt="Security"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 500ms ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.9) 100%)',
              }}
            />
          </div>
          <div style={{ padding: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: 'var(--violet-400)',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                display: 'inline-block',
              }}
            >
              SECURITY
            </span>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                lineHeight: 1.3,
                color: 'var(--text-primary)',
                marginTop: '0.75rem',
              }}
            >
              Secure by Design: How We Prevent Vulnerable Code Generation
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginTop: '0.5rem',
              }}
            >
              An inside look at our safety filters that block SQL injection, XSS, and other vulnerability patterns in real-time.
            </p>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-tertiary)',
                marginTop: '1rem',
                display: 'block',
              }}
            >
              6 min read
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer
      style={{
        background: 'var(--surface-1)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--page-max-width)',
          margin: '0 auto',
          padding: '3rem var(--content-padding)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              SYNTH
            </span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
              Code. Evolved.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Features', action: () => scrollTo('features') },
              { label: 'Docs', action: () => scrollTo('docs') },
              { label: 'Research', action: () => scrollTo('research') },
              { label: 'GitHub', action: () => {} },
              { label: 'Twitter', action: () => {} },
            ].map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="link-underline"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'color 150ms',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            2025 SYNTH. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Status'].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DocumentationSection />
      <ResearchSection />
      <Footer />
    </div>
  )
}
