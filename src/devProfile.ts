import { useSyncExternalStore } from "react"

// ─── Types ─────────────────────────────────────────────────────────────────────

export type VerificationStatus = "Verified" | "Pending Review" | "Under Review" | "Rejected"

export type ProjectStatus = "Completed" | "Disputed" | "Active"

export type BidStatus = "Pending" | "Awarded" | "Declined"

export interface DevLink {
  icon: "github" | "linkedin" | "globe"

  label: string

  href: string
}

export interface DevProject {
  id: string

  name: string

  client: string

  date: string

  status: ProjectStatus

  budget: string

  summary: string

  tech: string[]
}

export interface PeerReview {
  id: string

  name: string

  role: string

  rating: number

  comment: string

  projectId: string
}

export interface DevBid {
  id: string

  projectId: string

  project: string

  client: string

  amount: string

  status: BidStatus

  placedAt: string
}

export interface MarketplaceProject {
  id: string

  title: string

  business: string

  barangay: string

  tags: string[]

  budget: string

  deadline: string

  phases: number

  postedAt: string
}

export interface DevIdentity {
  name: string

  initials: string

  avatarColors: [string, string]

  title: string

  school: string

  chapter: string

  email: string

  verificationStatus: VerificationStatus
}

export interface DeveloperProfileData extends DevIdentity {
  availability: boolean

  stats: { projectsCompleted: number; peerScore: string; responseRate: string }

  skills: string[]

  tools: string[]

  links: DevLink[]

  projects: DevProject[]

  reviews: PeerReview[]
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const DEFAULT_DEVELOPER: DeveloperProfileData = {
  name: "Marco Ramirez",

  initials: "MR",

  avatarColors: ["#DBEAFE", "#1D4ED8"],

  title: "BS Information Technology",

  school: "University of Mindanao, Tagum",

  chapter: "PSITS — University of Mindanao Tagum",

  email: "marcoramirez@umtagum.edu.ph",

  verificationStatus: "Verified",

  availability: true,

  stats: { projectsCompleted: 12, peerScore: "4.7", responseRate: "98%" },

  skills: [
    "Next.js",
    "TypeScript",
    "React",
    "PostgreSQL",
    "Tailwind CSS",
    "Firebase",
    "Node.js",
    "REST APIs",
  ],

  tools: [
    "Vite",
    "Prisma",
    "Docker",
    "Figma",
    "GitHub Actions",
    "Vercel",
    "Supabase",
    "Redis",
  ],

  links: [
    {
      icon: "github",
      label: "github.com/marcoramirez-dev",
      href: "https://github.com/marcoramirez-dev",
    },

    {
      icon: "linkedin",
      label: "linkedin.com/in/marcoramirez",
      href: "https://linkedin.com/in/marcoramirez",
    },

    {
      icon: "globe",
      label: "marcoramirez.dev",
      href: "https://marcoramirez.dev",
    },
  ],

  projects: [
    {
      id: "pr1",
      name: "ERP Integration Portal",
      client: "Davao Fruits Corp.",
      date: "Mar 2025",
      status: "Completed",
      budget: "₱18,000",
      summary: "ERP module integrations for agri-export workflow.",
      tech: ["React", "Node.js", "PostgreSQL"],
    },

    {
      id: "pr2",
      name: "Logistics Tracking Dashboard",
      client: "TagumLog Solutions",
      date: "Jan 2025",
      status: "Completed",
      budget: "₱21,000",
      summary: "Real-time freight tracking with map overlays.",
      tech: ["Vue.js", "Firebase", "Maps API"],
    },

    {
      id: "pr3",
      name: "HR Self-Service App",
      client: "Mindanao Agri Holdings",
      date: "Nov 2024",
      status: "Disputed",
      budget: "₱15,000",
      summary: "Employee self-service portal with payroll views.",
      tech: ["Next.js", "Supabase"],
    },

    {
      id: "pr4",
      name: "Inventory Management System",
      client: "CityMall Tagum",
      date: "Sep 2024",
      status: "Completed",
      budget: "₱19,500",
      summary: "Multi-branch inventory and stock control.",
      tech: ["Laravel", "MySQL"],
    },

    {
      id: "pr5",
      name: "Customer Loyalty Platform",
      client: "Metro Tagum Coop",
      date: "Jul 2024",
      status: "Completed",
      budget: "₱17,000",
      summary: "Points-based loyalty engine with member app.",
      tech: ["React", "Firebase"],
    },
  ],

  reviews: [
    {
      id: "rv1",
      name: "Kristine Reyes",
      role: "Co-developer, TagumLog",
      rating: 5,
      comment:
        "Outstanding problem-solver. Delivered the tracking module two days early and the code was spotless.",
      projectId: "pr2",
    },

    {
      id: "rv2",
      name: "Rodel Santos",
      role: "Project Lead, PSITS Chapter",
      rating: 4,
      comment:
        "Great communicator, always kept the team aligned. Minor delays on documentation.",
      projectId: "pr1",
    },

    {
      id: "rv3",
      name: "Angela Torres",
      role: "Co-developer, Agri Holdings",
      rating: 4,
      comment: "Solid TypeScript skills. Would definitely collaborate again.",
      projectId: "pr3",
    },
  ],
}

// Demo accounts: sign in with any of these emails to preview a verification state.

const MOCK_USERS: Record<string, DevIdentity> = {
  "lcsagrado@stmct.edu.ph": {
    name: "Luis Conrad Sagrado",
    initials: "LS",
    avatarColors: ["#DBEAFE", "#1D4ED8"],

    title: "BS Information Technology",
    school: "St. Mary's College of Tagum",

    chapter: "PSITS — St. Mary's College of Tagum",
    email: "lcsagrado@stmct.edu.ph",

    verificationStatus: "Pending Review",
  },

  "mdelacruz@umtagum.edu.ph": {
    name: "Marian Dela Cruz",
    initials: "MD",
    avatarColors: ["#F0FDF4", "#166534"],

    title: "BS Information Technology",
    school: "University of Mindanao Tagum",

    chapter: "PSITS — University of Mindanao Tagum",
    email: "mdelacruz@umtagum.edu.ph",

    verificationStatus: "Under Review",
  },

  "talim@stmct.edu.ph": {
    name: "Tricia Anne Lim",
    initials: "TL",
    avatarColors: ["#F5F3FF", "#6D28D9"],

    title: "BS Computer Science",
    school: "St. Mary's College of Tagum",

    chapter: "PSITS — St. Mary's College of Tagum",
    email: "talim@stmct.edu.ph",

    verificationStatus: "Verified",
  },

  "jmjr@tagumcitycollege.edu.ph": {
    name: "Joel Macaraeg Jr.",
    initials: "JM",
    avatarColors: ["#FFF1F2", "#9F1239"],

    title: "BS Tourism Management",
    school: "Tagum City College",

    chapter: "PSITS — Tagum City College",
    email: "jmjr@tagumcitycollege.edu.ph",

    verificationStatus: "Rejected",
  },

  // PSITS Moderator — also has an editable Developer Profile per clarification #4

  // Canonical moderator identity shared across aliases to avoid drift

  "juanita@psits.org.ph": {
    name: "Juanita Arceo",
    initials: "JA",
    avatarColors: ["#F5F3FF", "#5B21B6"],

    title: "PSITS Regional Moderator",
    school: "St. Mary's College of Tagum",

    chapter: "PSITS — Regional Chapter Tagum",
    email: "juanita@psits.org.ph",

    verificationStatus: "Verified",
  },

  "admin@psits.org.ph": {
    name: "Juanita Arceo",
    initials: "JA",
    avatarColors: ["#F5F3FF", "#5B21B6"],

    title: "PSITS Regional Moderator",
    school: "St. Mary's College of Tagum",

    chapter: "PSITS — Regional Chapter Tagum",
    email: "admin@psits.org.ph",

    verificationStatus: "Verified",
  },

  // Alias: shared reference — ensure single source if updated (kept as duplicate literal for Record<string,DevIdentity> simplicity; values intentionally identical)
}

export const MARKETPLACE_PROJECTS: MarketplaceProject[] = [
  {
    id: "mp1",
    title: "E-Commerce Inventory Portal",
    business: "Apokon Hardware MSME",
    barangay: "Apokon",

    tags: ["React", "Node.js", "PostgreSQL"],
    budget: "₱18,000 – ₱22,000",

    deadline: "Aug 28, 2025",
    phases: 4,
    postedAt: "Jul 25, 2025",
  },

  {
    id: "mp2",
    title: "Logistics Tracking Dashboard",
    business: "TagumLog Solutions Inc.",
    barangay: "Apokon",

    tags: ["Vue.js", "Firebase", "Maps API"],
    budget: "₱24,000 – ₱30,000",

    deadline: "Sep 12, 2025",
    phases: 3,
    postedAt: "Jul 22, 2025",
  },

  {
    id: "mp3",
    title: "Retail POS & Inventory System",
    business: "CityMall Tagum",
    barangay: "Magugpo West",

    tags: ["React", "Laravel", "MySQL"],
    budget: "₱28,000 – ₱35,000",

    deadline: "Oct 5, 2025",
    phases: 5,
    postedAt: "Jul 20, 2025",
  },

  {
    id: "mp4",
    title: "Cooperative Member Portal",
    business: "Metro Tagum Cooperative",
    barangay: "Mankilam",

    tags: ["Next.js", "Supabase"],
    budget: "₱20,000 – ₱26,000",

    deadline: "Sep 30, 2025",
    phases: 3,
    postedAt: "Jul 18, 2025",
  },

  {
    id: "mp5",
    title: "Harvest Yield Analytics",
    business: "Mindanao Agri Holdings",
    barangay: "Mankilam",

    tags: ["Python", "Django", "React"],
    budget: "₱16,000 – ₱20,000",

    deadline: "Oct 18, 2025",
    phases: 3,
    postedAt: "Jul 16, 2025",
  },
]

const DEFAULT_BIDS: DevBid[] = [
  {
    id: "b1",
    projectId: "mp1",
    project: "E-Commerce Inventory Portal",
    client: "Apokon Hardware MSME",
    amount: "₱20,500",
    status: "Pending",
    placedAt: "Jul 30, 2025",
  },

  {
    id: "b2",
    projectId: "mp2",
    project: "Logistics Tracking Dashboard",
    client: "TagumLog Solutions Inc.",
    amount: "₱26,000",
    status: "Awarded",
    placedAt: "Jul 22, 2025",
  },

  {
    id: "b3",
    projectId: "mp4",
    project: "Cooperative Member Portal",
    client: "Metro Tagum Cooperative",
    amount: "₱21,000",
    status: "Declined",
    placedAt: "Jul 18, 2025",
  },
]

// ─── Persistence helpers (Clarification 3: localStorage) ───────────────────────
// Best practice: versioned key, guarded access for private mode / SSR, fail silently.
// Comments preserved per request — new explanatory comments only added, none removed.
const DEV_PROFILE_KEY = "devProfile_v1"

function safeParse<T>(raw: string | null, fallback: T): T {
  // Error handling: corrupted JSON or quota — return fallback instead of throwing
  try {
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as T
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function persistProfile(profile: DeveloperProfileData) {
  // Best practice: localStorage may throw (private mode / quota) — fail silently
  try {
    if (typeof window === "undefined" || !window.localStorage) return
    window.localStorage.setItem(DEV_PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // ignore quota / security errors
  }
}

function loadPersistedProfile(): Partial<DeveloperProfileData> | null {
  // Edge case: SSR has no window, or stored JSON is corrupted
  try {
    if (typeof window === "undefined" || !window.localStorage) return null
    const raw = window.localStorage.getItem(DEV_PROFILE_KEY)
    const parsed = safeParse<Partial<DeveloperProfileData> | null>(raw, null)
    // Validate shape — only allow known editable fields
    if (!parsed || typeof parsed !== "object") return null
    const out: Partial<DeveloperProfileData> = {}
    if (Array.isArray(parsed.skills)) out.skills = parsed.skills.filter((s) => typeof s === "string")
    if (Array.isArray(parsed.tools)) out.tools = parsed.tools.filter((s) => typeof s === "string")
    if (typeof parsed.availability === "boolean") out.availability = parsed.availability
    // Intentionally not persisting name/email/verificationStatus — those come from MOCK_USERS
    return Object.keys(out).length ? out : null
  } catch {
    return null
  }
}

// ─── Store ─────────────────────────────────────────────────────────────────────

interface DevState {
  profile: DeveloperProfileData

  bids: DevBid[]
}

// Performance: hydrate persisted profile once at module init — avoids flash of default
function getInitialProfile(): DeveloperProfileData {
  const persisted = loadPersistedProfile()
  if (persisted) {
    return { ...DEFAULT_DEVELOPER, ...persisted }
  }
  return DEFAULT_DEVELOPER
}

let state: DevState = { profile: getInitialProfile(), bids: DEFAULT_BIDS }

const listeners = new Set<() => void>()

function emit() {
  // Error handling: one bad listener should not break others
  listeners.forEach((listener) => {
    try {
      listener()
    } catch {
      // ignore listener errors — best practice for external store
    }
  })
}

export function subscribeDevStore(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function getDevSnapshot(): DevState {
  return state
}

export function useDevProfile() {
  return useSyncExternalStore(subscribeDevStore, () => getDevSnapshot().profile)
}

export function useDevBids() {
  return useSyncExternalStore(subscribeDevStore, () => getDevSnapshot().bids)
}

export function signInAs(email?: string) {
  // Error handling: trim/lower, guard undefined/null email
  // Persistence: re-apply persisted editable fields so edits survive account switch
  try {
    const key = email?.trim().toLowerCase()

    const identity = key ? MOCK_USERS[key] : undefined
    const base = identity ? { ...DEFAULT_DEVELOPER, ...identity } : DEFAULT_DEVELOPER
    // Edge: persisted skills/tools should not overwrite identity name/email
    const persisted = loadPersistedProfile()
    const nextProfile = persisted ? { ...base, ...persisted, ...identity } as DeveloperProfileData : base
    // If identity exists, ensure identity fields win over persisted (name/email/verification)
    if (identity) {
      nextProfile.name = identity.name
      nextProfile.email = identity.email
      nextProfile.verificationStatus = identity.verificationStatus
      nextProfile.initials = identity.initials
      nextProfile.avatarColors = identity.avatarColors
      nextProfile.title = identity.title
      nextProfile.school = identity.school
      nextProfile.chapter = identity.chapter
    }

    state = {
      ...state,
      profile: nextProfile,
    }

    emit()
  } catch {
    // fail closed — reset to default
    try {
      state = { ...state, profile: DEFAULT_DEVELOPER }
      emit()
    } catch {
      // ignore
    }
  }
}

export function setAvailability(open: boolean) {
  // Error handling: coerce to boolean, guard unexpected type
  try {
    const next = Boolean(open)
    state = { ...state, profile: { ...state.profile, availability: next } }
    persistProfile(state.profile)
    emit()
  } catch {
    // fail silently — best practice for UI toggle
  }
}

export function updateDevProfile(patch: Partial<DeveloperProfileData>) {
  // Error handling: validate patch shape — fail closed on bad input
  // Best practice: narrow to editable fields only (skills/tools/availability)
  // Edge: no duplicate/length limit per Clarification 1 — keep simple split
  try {
    if (!patch || typeof patch !== "object") return
    const allowed: Partial<DeveloperProfileData> = {}
    if (Array.isArray(patch.skills)) {
      // Validate each skill is string — edge: null from corrupted storage
      allowed.skills = patch.skills.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    }
    if (Array.isArray(patch.tools)) {
      allowed.tools = patch.tools.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    }
    if (typeof patch.availability === "boolean") allowed.availability = patch.availability
    if (Object.keys(allowed).length === 0) return
    state = { ...state, profile: { ...state.profile, ...allowed } }
    persistProfile(state.profile)
    emit()
  } catch {
    // ignore — fail silently to avoid breaking UI
  }
}

export function placeBid(projectId: string) {
  // Error handling: validate projectId, guard against corrupted MARKETPLACE_PROJECTS
  // Edge: empty or non-string id should be ignored — fail closed
  try {
    if (!projectId || typeof projectId !== "string") return
    const project = MARKETPLACE_PROJECTS.find((p) => p.id === projectId)

    if (
      !project ||
      state.bids.some((b) => b.projectId === projectId && b.status === "Pending")
    )
      return

  const bid: DevBid = {
    id: `b${Date.now()}`,

    projectId: project.id,

    project: project.title,

    client: project.business,

    amount: project.budget,

    status: "Pending",

    placedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }

  state = { ...state, bids: [bid, ...state.bids] }

  emit()
  } catch {
    // Error handling: corrupted state or Date locale failure — fail silently
  }
}
