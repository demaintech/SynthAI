'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Send,
  Zap,
  Bug,
  RefreshCw,
  BookOpen,
  Globe,
  Lock,
  User,
  Mail,
} from 'lucide-react'
import { usePrompt } from '@/context/PromptContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from 'react-toastify'
import { login, signup, logout } from '@/app/auth/actions'
import { createClient } from '@/src/utils/supabase/client'
import { LogOut, ChevronRight } from 'lucide-react'

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

function AuthModal({ defaultTab = 'login', trigger }: { defaultTab?: 'login' | 'signup', trigger: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Successfully logged in!')
      setOpen(false)
      router.push('/chat')
    }
    setIsLoading(false)
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.info(result.message || 'Signup successful! Check your email.')
      setOpen(false)
      router.push('/chat')
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] bg-[#0f0f0f] border-white/10 text-white shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <LogoMark size={32} />
          </div>
          <DialogTitle className="text-center text-2xl font-bold tracking-tight">Welcome to SYNTH</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="login" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input id="login-email" name="email" type="email" required placeholder="name@example.com" className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 transition-colors h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input id="login-password" name="password" type="password" required placeholder="••••••••" className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 transition-colors h-11" />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-violet-600 hover:bg-violet-700 text-white mt-4 font-semibold h-11">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <p className="text-center text-xs text-white/40 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input id="signup-name" name="full_name" required placeholder="John Doe" className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 transition-colors h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input id="signup-email" name="email" type="email" required placeholder="name@example.com" className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 transition-colors h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input id="signup-password" name="password" type="password" required minLength={6} placeholder="••••••••" className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 transition-colors h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input id="signup-confirm" type="password" required placeholder="••••••••" className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 transition-colors h-11" />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-violet-600 hover:bg-violet-700 text-white mt-4 font-semibold h-11">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Header ─── */
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    ? createClient() 
    : (null as any)

  useEffect(() => {
    if (!supabase) return
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = async () => {
    await logout()
    toast.info('Signed out')
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '0.75rem var(--content-padding)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background 300ms ease, backdrop-filter 300ms ease',
        background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogoMark size={24} />
          <span style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            SYNTH
          </span>
        </div>
        
        <nav style={{ display: 'flex', gap: '1.5rem' }} className="hidden md:flex">
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
                fontSize: '0.8125rem',
                fontWeight: 500,
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
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button 
              onClick={() => router.push('/chat')}
              variant="outline" 
              className="text-xs border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white rounded-full h-8"
            >
              Open Chat <ChevronRight size={14} className="ml-1" />
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
              </div>
              <button 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                title="Logout"
              >
                <LogOut size={16} className="text-white/40 hover:text-white transition-color" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <AuthModal 
              defaultTab="login"
              trigger={
                <Button variant="ghost" className="text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 px-4">
                  Login
                </Button>
              } 
            />
            <AuthModal 
              defaultTab="signup"
              trigger={
                <Button className="bg-white text-black hover:bg-white/90 text-sm font-semibold px-5 h-9 rounded-full">
                  Sign Up
                </Button>
              } 
            />
          </>
        )}
      </div>
    </header>
  )
}

/* ─── Hero Section ─── */
function HeroSection() {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const { setPendingPrompt } = usePrompt()
  const sectionRef = useRef<HTMLDivElement>(null)

  const suggestions = ['Build a REST API', 'Debug my code', 'Explain algorithms', 'Refactor legacy']

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    setPendingPrompt(inputValue.trim())
    router.push('/chat')
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
      code: `# Install the SYNTH CLI\n$ npm install -g @synth/cli\n\n# Initialize in your project\n$ synth init\n\n# Start coding with AI\n$ synth chat\n> Build me a React component that displays\n  a paginated data table with sorting`,
    },
    Installation: {
      title: 'Installation Guide',
      desc: 'Install SYNTH via npm, yarn, or pnpm. Works on macOS, Linux, and Windows with WSL.',
      code: `# Via npm\n$ npm install -g @synth/cli\n\n# Via yarn\n$ yarn global add @synth/cli\n\n# Via pnpm\n$ pnpm add -g @synth/cli\n\n# Verify installation\n$ synth --version\n> synth 2.4.1`,
    },
    'First Prompt': {
      title: 'Your First Prompt',
      desc: 'Learn how to write effective prompts that get the best results from SYNTH.',
      code: `# Basic prompt\n$ synth chat\n> Write a Python function to calculate\n  the factorial of a number recursively\n\n# With context\n$ synth chat --file src/app.js\n> Refactor this to use async/await\n  instead of callbacks`,
    },
    'Context Window': {
      title: 'Understanding Context Windows',
      desc: 'SYNTH maintains a large context window to understand your entire codebase.',
      code: `# Check your context usage\n$ synth status\n> Context: 12,400 / 128,000 tokens\n> Files indexed: 47\n> Memory: 2.1 MB\n\n# Clear context if needed\n$ synth context clear\n> Context cleared successfully`,
    },
    'Code Awareness': {
      title: 'Code Awareness Engine',
      desc: 'How SYNTH understands your code structure, imports, and dependencies.',
      code: `# Enable deep code awareness\n$ synth config --awareness deep\n\n# SYNTH now understands:\n# - Import chains and module deps\n# - Type definitions and interfaces\n# - Test coverage for each file\n# - Recent git history and changes`,
    },
    'Project Indexing': {
      title: 'Project Indexing',
      desc: 'SYNTH indexes your project for lightning-fast context retrieval.',
      code: `# Index your project\n$ synth index\n> Indexing 234 files...\n> Done in 3.2s\n\n# Search the index\n$ synth search "auth middleware"\n> Found 12 references in 4 files`,
    },
    'REST API': {
      title: 'REST API Reference',
      desc: 'Integrate SYNTH into your applications via our RESTful API.',
      code: `curl -X POST https://api.synth.ai/v1/chat \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "message": "Write a sorting algorithm",\n    "language": "python",\n    "context": ["src/utils.py"]\n  }'`,
    },
    WebSocket: {
      title: 'WebSocket API',
      desc: 'Real-time streaming responses via WebSocket for interactive experiences.',
      code: `const ws = new WebSocket(\n  'wss://api.synth.ai/v1/stream',\n  ['synth-protocol']\n);\n\nws.onmessage = (event) => {\n  const chunk = JSON.parse(event.data);\n  appendToEditor(chunk.code);\n};`,
    },
    Authentication: {
      title: 'Authentication',
      desc: 'Secure your API requests with token-based authentication.',
      code: `# Generate an API key\n$ synth auth generate\n> Key: sk-synth-xxxxxxxxxxxx\n\n# Set as environment variable\n$ export SYNTH_API_KEY=sk-synth-xxxxxxxxxxxx\n\n# Verify\n$ synth auth verify\n> Authenticated as @developer`,
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
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginTop: '1rem',
              marginBottom: '2rem',
              maxWidth: 600,
            }}
          >
            {currentDoc.desc}
          </p>
          <CodeBlock code={currentDoc.code} />
        </div>
      </div>
    </section>
  )
}

/* ─── Page Component ─── */
export default function LandingPage() {
  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh' }}>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DocumentationSection />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '4rem var(--content-padding)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <LogoMark size={20} color="#525252" />
          <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
            SYNTH AI
          </span>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          © 2026 Synth Neural Systems. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
