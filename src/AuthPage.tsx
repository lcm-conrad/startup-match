import { useState } from 'react'

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconMail({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 6l7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconLock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3.5" y="9" width="13" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconEye({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M1.5 10S5 5.5 10 5.5 18.5 10 18.5 10 15 14.5 10 14.5 1.5 10 1.5 10z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function IconEyeOff({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M1.5 10S5 5.5 10 5.5c1.6 0 3 .5 4.2 1.4M6.1 7.2C4 8.5 2.5 10 2.5 10S6 14.5 10 14.5c1.3 0 2.6-.4 3.7-1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.7 7.9a2.5 2.5 0 003.4 3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconUser({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 17c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconGraduation({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 3L1 8l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 10v4c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 7.5V4l2-1.5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
function IconBuilding({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="9" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8h3v9h-3M6 6.5h3M6 9.5h3M6 12.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 17v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconShieldKey({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 4.5v5c0 3.7 3 7 7 8 4-1 7-4.3 7-8v-5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 11v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconCheck({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconShieldSmall({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5l5 1.8v3.9c0 2.8-2 5.2-5 5.9-3-.7-5-3.1-5-5.9V3.3L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}
function IconUserCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="8.5" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 17c0-3 2.5-5 6-5 1.2 0 2.3.3 3.2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.5 15l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Brand ─────────────────────────────────────────────────────────────────────

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 14L7 6l3 5 3-7 2 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {!compact && (
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>Startup-Match</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginTop: 2 }}>Tagum City Developer Platform</div>
        </div>
      )}
    </div>
  )
}

// ─── Left panel illustration ──────────────────────────────────────────────────

function BrandIllustration() {
  return (
    <svg width="460" height="340" viewBox="0 0 460 340" fill="none" style={{ display: 'block', maxWidth: '100%' }}>
      {/* soft background blobs */}
      <circle cx="80" cy="60" r="90" fill="#FFFFFF" opacity="0.06" />
      <circle cx="410" cy="300" r="110" fill="#FFFFFF" opacity="0.06" />

      {/* connection nodes */}
      <path d="M46 210c30-30 70-34 96-20M340 120c22-26 56-28 84-16" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" />
      <circle cx="40" cy="212" r="7" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="430" cy="102" r="7" fill="#FFFFFF" fillOpacity="0.9" />

      {/* main mockup card */}
      <g filter="url(#sm_shadow)">
        <rect x="40" y="60" width="380" height="210" rx="18" fill="#FFFFFF" />
      </g>
      {/* header row */}
      <circle cx="66" cy="86" r="4" fill="#F87171" />
      <circle cx="80" cy="86" r="4" fill="#FBBF24" />
      <circle cx="94" cy="86" r="4" fill="#34D399" />
      <text x="114" y="90" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill="#1D4ED8">Startup-Match · Tagum</text>
      <rect x="330" y="76" width="70" height="20" rx="10" fill="#EFF6FF" />
      <text x="340" y="90" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#2563EB">LIVE · 4 bids</text>

      {/* collaboration: student -> msme */}
      <circle cx="92" cy="160" r="24" fill="url(#sm_av1)" stroke="#93C5FD" strokeWidth="2" />
      <text x="92" y="165" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill="#1D4ED8" textAnchor="middle">LC</text>
      <circle cx="132" cy="196" r="18" fill="url(#sm_av2)" stroke="#6EE7B7" strokeWidth="2" />
      <text x="132" y="201" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#065F46" textAnchor="middle">TA</text>
      <text x="92" y="198" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="#334155" textAnchor="middle">React Dev</text>

      {/* connecting dashed line with arrow */}
      <path d="M158 175h74" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5 5" />
      <path d="M226 170l10 5-10 5z" fill="#93C5FD" />
      <text x="180" y="166" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" fill="#64748B">matching</text>

      {/* msme card */}
      <rect x="240" y="138" width="150" height="74" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="254" y="152" width="26" height="26" rx="7" fill="#EFF6FF" />
      <path d="M262 166h10M262 161h10M262 171h10" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
      <text x="290" y="160" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill="#0F172A">Davao Fruits Corp.</text>
      <text x="290" y="176" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="500" fill="#64748B">Agri-business · Magugpo West</text>
      <rect x="254" y="184" width="52" height="16" rx="8" fill="#16A34A" />
      <text x="280" y="196" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#FFFFFF" textAnchor="middle">VERIFIED</text>
      <rect x="312" y="184" width="64" height="16" rx="8" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
      <text x="344" y="196" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#D97706" textAnchor="middle">₱ 12,500 escrow</text>

      {/* milestone progress */}
      <rect x="64" y="228" width="160" height="6" rx="3" fill="#E2E8F0" />
      <rect x="64" y="228" width="104" height="6" rx="3" fill="url(#sm_bar)" />
      <text x="64" y="250" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" fill="#64748B">Milestone 2 of 4 approved</text>
      <text x="220" y="250" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#2563EB" textAnchor="end">65%</text>

      {/* floating: verified */}
      <g filter="url(#sm_shadow)">
        <rect x="318" y="28" width="108" height="34" rx="17" fill="#16A34A" />
      </g>
      <path d="M334 45l5 5 10-10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="354" y="49" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#FFFFFF">PSITS Verified</text>

      {/* floating: portfolio */}
      <g filter="url(#sm_shadow)">
        <rect x="20" y="272" width="118" height="34" rx="17" fill="#FFFFFF" />
      </g>
      <path d="M38 288h22M42 281h14M42 295h14" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
      <text x="70" y="293" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#1D4ED8">PSITS Portfolio</text>

      <defs>
        <linearGradient id="sm_shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B1E4B" stopOpacity="0" />
          <stop offset="100%" stopColor="#0B1E4B" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="sm_av1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="sm_av2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id="sm_bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ─── Form field wrapper ────────────────────────────────────────────────────────

function Field({ icon, right, children }: {
  icon?: React.ReactNode
  right?: React.ReactNode
  children: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, height: 46,
      padding: '0 14px', borderRadius: 10, background: '#fff',
      border: `1.5px solid ${focused ? '#2563EB' : '#E2E8F0'}`,
      boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}>
      {icon && <span style={{ color: focused ? '#2563EB' : '#94A3B8', lineHeight: 0, flexShrink: 0, transition: 'color 0.15s' }}>{icon}</span>}
      <div
        style={{ flex: 1, display: 'flex', alignItems: 'center' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </div>
      {right}
    </div>
  )
}

// ─── Roles ─────────────────────────────────────────────────────────────────────

type Role = 'student' | 'enterprise' | 'admin'

const roleConfig: Record<Role, {
  title: string
  desc: string
  icon: React.ReactNode
  idLabel: string
  idPlaceholder: string
  emailPlaceholder: string
  emailLabel: string
}> = {
  student: {
    title: 'Student Developer',
    desc: 'I am an IT student seeking projects',
    icon: <IconGraduation size={20} />,
    idLabel: 'Academic ID Number',
    idPlaceholder: 'e.g. 2024-0123',
    emailPlaceholder: 'you@school.edu.ph',
    emailLabel: 'Institutional Email Address',
  },
  enterprise: {
    title: 'Enterprise Client',
    desc: 'I represent a local business / MSME',
    icon: <IconBuilding size={20} />,
    idLabel: 'Business Permit / DTI Registration No.',
    idPlaceholder: 'e.g. DTI-REG-2025-XXXXX',
    emailPlaceholder: 'you@business.com.ph',
    emailLabel: 'Business Email Address',
  },
  admin: {
    title: 'Regional Administrator',
    desc: 'PSITS Officer / Academic Faculty',
    icon: <IconShieldKey size={20} />,
    idLabel: 'Faculty / Officer ID',
    idPlaceholder: 'e.g. FAC-2025-0188',
    emailPlaceholder: 'you@psits.org.ph',
    emailLabel: 'Official Email Address',
  },
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AuthPage({ onSignedIn }: { onSignedIn?: (email: string) => void } = {}) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [role, setRole] = useState<Role>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [signIn, setSignIn] = useState({ email: '', password: '' })
  const [register, setRegister] = useState({ fullName: '', email: '', password: '', idNumber: '' })

  function switchMode(next: 'signin' | 'register') {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signIn.email) && signIn.password.length >= 8
    if (!ok) {
      setNotice(null)
      setError('Authentication Failed')
      return
    }
    setError(null)
    setNotice('Sign in successful — redirecting to your dashboard…')
    onSignedIn?.(signIn.email)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const ok = register.fullName.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(register.email) &&
      register.password.length >= 8 &&
      register.idNumber.trim().length > 0
    if (!ok) {
      setNotice(null)
      setError('Registration Failed')
      return
    }
    setError(null)
    setNotice('Verification request submitted — check your inbox to confirm your account.')
  }

  const roleField = roleConfig[role]

  return (
    <div style={{
      minHeight: '100vh', background: '#F8FAFC', display: 'flex',
      fontFamily: 'Inter, sans-serif', paddingBottom: 72,
    }}>

      {/* ── LEFT: Branding panel (desktop, ≥1024px) ───────────────────── */}
      <div className="hidden lg:flex" style={{
        flex: '0 0 50%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(165deg, #2563EB 0%, #1D4ED8 55%, #1E3A8A 100%)',
        flexDirection: 'column', padding: '36px 48px',
      }}>
        {/* decorative glows */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.14), transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: -140, left: -100, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.28), transparent 65%)' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <BrandLogo />
        </div>

        <div style={{
          position: 'relative', zIndex: 2, flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', padding: '32px 8px 0',
        }}>
          <BrandIllustration />
          <h1 style={{
            margin: '34px 0 0', fontSize: 36, fontWeight: 600, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.18, maxWidth: 560,
          }}>
            Bridging Tagum City's IT Talent with Local Enterprise Innovation.
          </h1>
          <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.6, color: '#BFDBFE', maxWidth: 500, fontWeight: 400 }}>
            A centralized platform for secure project bidding, milestone tracking, and verified PSITS portfolios.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.82)', fontSize: 12, fontWeight: 500 }}>
          <IconShieldSmall size={15} />
          <span>In partnership with St. Mary's College of Tagum, Inc. &amp; Regional PSITS Chapters.</span>
        </div>
      </div>

      {/* ── RIGHT: Form panel ─────────────────────────────────────────── */}
      <div style={{
        flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column',
        background: '#F8FAFC',
      }}>
        {/* Mobile / tablet top banner (<1024px) */}
        <div className="lg:hidden" style={{
          height: 120, flexShrink: 0,
          background: 'linear-gradient(165deg, #2563EB 0%, #1D4ED8 60%, #1E3A8A 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 65%)' }} />
          <BrandLogo />
        </div>

        {/* Form container */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px 20px 48px',
        }}>
          <div style={{
            width: '100%', maxWidth: 440, background: '#fff',
            border: '1px solid #E2E8F0', borderRadius: 16,
            boxShadow: '0px 1px 3px rgba(0,0,0,0.08)', padding: 40,
          }}>
            {/* Toggle tabs */}
            <div style={{
              display: 'flex', background: '#F1F5F9', borderRadius: 12, padding: 4, gap: 4,
              marginBottom: 28,
            }}>
              {([
                { id: 'signin', label: 'Sign In' },
                { id: 'register', label: 'Create Account' },
              ] as const).map(tab => {
                const active = mode === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => switchMode(tab.id)}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 9, border: 'none',
                      background: active ? '#fff' : 'transparent',
                      color: active ? '#2563EB' : '#64748B',
                      fontSize: 13.5, fontWeight: active ? 700 : 500,
                      fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                      boxShadow: active ? '0px 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {mode === 'signin' ? (
              /* ── SIGN IN ─────────────────────────────────────────── */
              <form onSubmit={handleSignIn} noValidate>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  Welcome Back to Startup-Match
                </h2>
                <p style={{ margin: '6px 0 22px', fontSize: 13.5, color: '#64748B' }}>
                  Enter your credentials to access your dashboard.
                </p>

                {/* Security feedback banner */}
                {error && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
                    padding: '11px 14px', marginBottom: 18,
                  }}>
                    <span style={{ fontSize: 15, lineHeight: 1.2 }}>⚠️</span>
                    <div style={{ fontSize: 12.5, color: '#B91C1C', lineHeight: 1.45 }}>
                      <div style={{ fontWeight: 700 }}>{error}: Invalid email or password.</div>
                      <div style={{ color: '#DC2626', fontWeight: 500 }}>Security event logged.</div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Email Address</label>
                  <Field icon={<IconMail size={18} />}>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      value={signIn.email}
                      onChange={e => { setSignIn(s => ({ ...s, email: e.target.value })); setError(null) }}
                      style={{
                        width: '100%', border: 'none', outline: 'none', background: 'transparent',
                        fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#0F172A',
                      }}
                    />
                  </Field>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Password</label>
                  <Field
                    icon={<IconLock size={18} />}
                    right={
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', lineHeight: 0, padding: 4, flexShrink: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#2563EB')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                      >
                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </button>
                    }
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={signIn.password}
                      onChange={e => { setSignIn(s => ({ ...s, password: e.target.value })); setError(null) }}
                      style={{
                        width: '100%', border: 'none', outline: 'none', background: 'transparent',
                        fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#0F172A',
                      }}
                    />
                  </Field>
                </div>

                {/* Remember + forgot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 22 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12.5, color: '#475569', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      style={{ accentColor: '#2563EB', width: 15, height: 15, cursor: 'pointer' }}
                    />
                    Remember this device
                  </label>
                  <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12.5, fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>
                    Forgot Password?
                  </a>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  style={{
                    width: '100%', height: 48, borderRadius: 8, border: 'none',
                    background: '#2563EB', color: '#fff',
                    fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8,
                    transition: 'background 0.15s, box-shadow 0.15s',
                    boxShadow: '0px 2px 6px rgba(37,99,235,0.3)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; e.currentTarget.style.boxShadow = '0px 3px 8px rgba(37,99,235,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.boxShadow = '0px 2px 6px rgba(37,99,235,0.3)' }}
                >
                  Sign In to Dashboard <IconArrowRight size={16} />
                </button>

                {notice && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10,
                    padding: '11px 14px', marginTop: 16,
                  }}>
                    <span style={{ color: '#16A34A', lineHeight: 0, marginTop: 2 }}><IconCheck size={14} /></span>
                    <div style={{ fontSize: 12.5, color: '#166534', fontWeight: 500, lineHeight: 1.45 }}>{notice}</div>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12.5, color: '#64748B' }}>
                  New to Startup-Match?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); switchMode('register') }} style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                    Create an account
                  </a>
                </div>
              </form>
            ) : (
              /* ── CREATE ACCOUNT ───────────────────────────────────── */
              <form onSubmit={handleRegister} noValidate>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  Create Your Account
                </h2>
                <p style={{ margin: '6px 0 22px', fontSize: 13.5, color: '#64748B' }}>
                  Select your role to register for verification.
                </p>

                {/* Security feedback banner */}
                {error && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
                    padding: '11px 14px', marginBottom: 18,
                  }}>
                    <span style={{ fontSize: 15, lineHeight: 1.2 }}>⚠️</span>
                    <div style={{ fontSize: 12.5, color: '#B91C1C', lineHeight: 1.45 }}>
                      <div style={{ fontWeight: 700 }}>{error}: Please complete all required fields.</div>
                      <div style={{ color: '#DC2626', fontWeight: 500 }}>Security event logged.</div>
                    </div>
                  </div>
                )}

                {/* Role selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {(Object.keys(roleConfig) as Role[]).map(r => {
                    const cfg = roleConfig[r]
                    const selected = role === r
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => { setRole(r); setError(null) }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                          padding: '13px 14px', textAlign: 'left', cursor: 'pointer',
                          borderRadius: 12, fontFamily: 'Inter, sans-serif',
                          background: selected ? '#EFF6FF' : '#fff',
                          border: `1.5px solid ${selected ? '#2563EB' : '#E2E8F0'}`,
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      >
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: selected ? '#DBEAFE' : '#F1F5F9',
                          color: selected ? '#1D4ED8' : '#64748B',
                          transition: 'all 0.15s',
                        }}>
                          {cfg.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: selected ? '#1D4ED8' : '#0F172A' }}>{cfg.title}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{cfg.desc}</div>
                        </div>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${selected ? '#2563EB' : '#CBD5E1'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'border-color 0.15s',
                        }}>
                          {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Full Name</label>
                  <Field icon={<IconUser size={18} />}>
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Juan A. Dela Cruz"
                      value={register.fullName}
                      onChange={e => { setRegister(s => ({ ...s, fullName: e.target.value })); setError(null) }}
                      style={{
                        width: '100%', border: 'none', outline: 'none', background: 'transparent',
                        fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#0F172A',
                      }}
                    />
                  </Field>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{roleField.emailLabel}</label>
                  <Field icon={<IconMail size={18} />}>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder={roleField.emailPlaceholder}
                      value={register.email}
                      onChange={e => { setRegister(s => ({ ...s, email: e.target.value })); setError(null) }}
                      style={{
                        width: '100%', border: 'none', outline: 'none', background: 'transparent',
                        fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#0F172A',
                      }}
                    />
                  </Field>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Password</label>
                  <Field
                    icon={<IconLock size={18} />}
                    right={
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', lineHeight: 0, padding: 4, flexShrink: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#2563EB')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                      >
                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </button>
                    }
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={register.password}
                      onChange={e => { setRegister(s => ({ ...s, password: e.target.value })); setError(null) }}
                      style={{
                        width: '100%', border: 'none', outline: 'none', background: 'transparent',
                        fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#0F172A',
                      }}
                    />
                  </Field>
                </div>

                {/* Dynamic ID field based on role */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{roleField.idLabel}</label>
                  <Field icon={<IconUserCheck size={18} />}>
                    <input
                      type="text"
                      placeholder={roleField.idPlaceholder}
                      value={register.idNumber}
                      onChange={e => { setRegister(s => ({ ...s, idNumber: e.target.value })); setError(null) }}
                      style={{
                        width: '100%', border: 'none', outline: 'none', background: 'transparent',
                        fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#0F172A',
                      }}
                    />
                  </Field>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  style={{
                    width: '100%', height: 48, borderRadius: 8, border: 'none',
                    background: '#2563EB', color: '#fff',
                    fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8,
                    transition: 'background 0.15s, box-shadow 0.15s',
                    boxShadow: '0px 2px 6px rgba(37,99,235,0.3)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; e.currentTarget.style.boxShadow = '0px 3px 8px rgba(37,99,235,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.boxShadow = '0px 2px 6px rgba(37,99,235,0.3)' }}
                >
                  Register &amp; Request Verification <IconArrowRight size={16} />
                </button>

                {notice && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10,
                    padding: '11px 14px', marginTop: 16,
                  }}>
                    <span style={{ color: '#16A34A', lineHeight: 0, marginTop: 2 }}><IconCheck size={14} /></span>
                    <div style={{ fontSize: 12.5, color: '#166534', fontWeight: 500, lineHeight: 1.45 }}>{notice}</div>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12.5, color: '#64748B' }}>
                  Already have an account?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); switchMode('signin') }} style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                    Sign In
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
