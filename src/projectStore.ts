import { useSyncExternalStore } from "react"

import { getDevSnapshot } from "./devProfile"

import { clientIdentity } from "./clientProfile"

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SprintPhaseStatus = "completed" | "active" | "in_review" | "disputed" | "revision" | "upcoming"

export type SprintNotifType = "warning" | "success" | "info"

export type CommentRole = "developer" | "client" | "admin"

export interface PhaseTask {
  id: string

  label: string

  done: boolean
}

export interface PhaseComment {
  id: string

  author: string

  role: CommentRole

  avatar: string

  avatarBg: [string, string]

  time: string

  text: string
}

export interface PhaseView {
  title: string

  deadline: string

  daysLeft: number

  description: string

  repoLink: string

  prototypeLink?: string

  updates: string
}

export interface ProjectPhase {
  number: number

  status: SprintPhaseStatus

  submittedAt: string | null

  approvedAt: string | null

  score: number | null

  revisionReason?: string

  dev: PhaseView

  client: PhaseView

  tasks: PhaseTask[]

  comments: PhaseComment[]
}

export interface SprintNotification {
  id: string

  type: SprintNotifType

  time: string

  text: string

  read: boolean
}

export interface SprintProject {
  id: string

  project: string

  client: string

  totalPhases: number

  deadline: string

  daysLeft: number

  contractType: string

  totalBudget: number

  phaseBudget: number

  phasePayout: number

  paidToDate: number

  started: string

  platform: string

  phases: ProjectPhase[]

  notifications: SprintNotification[]
}

// ─── Seed data ────────────────────────────────────────────────────────────────

// Shared by phase NUMBER across the developer (Sprint Dashboard) and client

// (Milestone Tracking) screens. Each screen keeps its own title/content via the

// `dev` / `client` views; workflow status is shared and synced cross-screen.

//

// Status bridge seed:

//   Phase 1 → completed   (both screens agree)

//   Phase 2 → active      (dev: "Active Sprint"; client: "Ready for Review")

//   Phase 3 → disputed    (client flagged; dev: "Needs Revision" + resubmit)

//   Phase 4 → upcoming

const COMMENT_CLIENT: Pick<PhaseComment, "avatar" | "avatarBg"> = {
  avatar: "ED",
  avatarBg: ["#ECFDF5", "#065F46"],
}

const COMMENT_ADMIN: Pick<PhaseComment, "avatar" | "avatarBg"> = {
  avatar: "JA",
  avatarBg: ["#F5F3FF", "#5B21B6"],
}

const seedComments: PhaseComment[] = [
  {
    id: "f1",
    author: "Ernesto Dela Vega",
    role: "client",
    time: "Aug 3 · 4:05 PM",
    text: "The POS flow looks great! One concern — the receipt layout cuts off product names longer than 18 characters. Can we adjust the font size or truncation logic?",
    ...COMMENT_CLIENT,
  },

  {
    id: "f2",
    author: "Marco Ramirez",
    role: "developer",
    time: "Aug 3 · 5:12 PM",
    text: "Noted! I'll update the receipt template to use dynamic truncation with a tooltip on hover. Will push the fix tonight.",
    avatar: "MR",
    avatarBg: ["#DBEAFE", "#1D4ED8"],
  },

  {
    id: "f3",
    author: "Ernesto Dela Vega",
    role: "client",
    time: "Aug 4 · 9:30 AM",
    text: "Also, the inventory table doesn't load on Safari iOS. Can you check compatibility?",
    ...COMMENT_CLIENT,
  },

  {
    id: "f4",
    author: "Juanita Arceo",
    role: "admin",
    time: "Aug 4 · 10:00 AM",
    text: "Flagging this for the audit log. Developer please confirm browser compatibility in the next update.",
    ...COMMENT_ADMIN,
  },
]

const seedPhases: ProjectPhase[] = [
  {
    number: 1,

    status: "completed",

    submittedAt: "Jun 18, 2026 · 11:42 AM",

    approvedAt: "Jun 21, 2026 · 9:15 AM",

    score: 5,

    dev: {
      title: "UI/UX Wireframing & Prototyping",

      deadline: "Jun 20, 2026",
      daysLeft: 0,

      description:
        "Deliver high-fidelity Figma prototype covering all primary user flows: product catalog, inventory management, and POS checkout.",

      repoLink:
        "https://github.com/marcoramirez-dev/apokon-ecommerce/releases/tag/v1.0-wireframes",

      prototypeLink: "https://www.figma.com/proto/apokon-v1",

      updates:
        "All 18 screens delivered via Figma. Client approved with minor color palette revisions on Jun 18.",
    },

    client: {
      title: "Database Schema & Authentication",

      deadline: "Jun 20, 2026",
      daysLeft: 0,

      description:
        "PostgreSQL schema + JWT authentication for the E-Commerce Inventory Portal.",

      repoLink:
        "https://github.com/marcoramirez-dev/apokon-ecommerce/tree/sprint-1-auth",

      updates:
        "Completed all authentication flows (JWT + refresh tokens), PostgreSQL schema for Users, Products, Inventory, and Transactions. Deployed to Railway staging. All endpoints documented in Postman collection linked in README.",
    },

    tasks: [
      { id: "t1a", label: "Design system & UI tokens", done: true },

      { id: "t1b", label: "Catalog & inventory flows", done: true },

      { id: "t1c", label: "POS checkout flow", done: true },

      { id: "t1d", label: "Client review & sign-off", done: true },
    ],

    comments: [],
  },

  {
    number: 2,

    status: "active",

    submittedAt: null,

    approvedAt: null,

    score: null,

    dev: {
      title: "Backend Auth & Database Schema",

      deadline: "Aug 5, 2026",
      daysLeft: 3,

      description:
        "Implement JWT-based authentication (login, role management for admin/cashier/inventory), PostgreSQL schema for products, stock levels, and transactions. Deploy to staging environment on Railway.",

      repoLink: "",

      prototypeLink: "https://apokon-ecommerce.vercel.app",

      updates: "",
    },

    client: {
      title: "Core Frontend UI Implementation",

      deadline: "Aug 5, 2026",
      daysLeft: 3,

      description: "All 12 frontend screens using Next.js + Tailwind CSS.",

      repoLink:
        "https://github.com/marcoramirez-dev/apokon-ecommerce/tree/sprint-2-frontend",

      prototypeLink: "https://apokon-ecommerce.vercel.app",

      updates:
        "All 12 frontend screens implemented using Next.js + Tailwind CSS. Includes product catalog, inventory table with search/filter, POS checkout flow, and admin role management. Staging preview deployed at apokon-ecommerce.vercel.app — credentials in README. Awaiting client review for color palette and typography sign-off before proceeding to API integration.",
    },

    tasks: [
      { id: "t2a", label: "JWT auth + role middleware", done: true },

      { id: "t2b", label: "Products & stock schema", done: true },

      { id: "t2c", label: "Railway staging deploy", done: false },
    ],

    comments: seedComments,
  },

  {
    number: 3,

    status: "disputed",

    submittedAt: null,

    approvedAt: null,

    score: null,

    revisionReason:
      "API contract mismatches reported by client during staging integration.",

    dev: {
      title: "Inventory CRUD & POS Module",

      deadline: "Aug 18, 2026",
      daysLeft: -2,

      description:
        "Build the full inventory CRUD interface, barcode scanner integration, and POS transaction flow with receipt generation.",

      repoLink: "",

      prototypeLink: "",

      updates: "",
    },

    client: {
      title: "API Integration & Backend Services",

      deadline: "Aug 18, 2026",
      daysLeft: -2,

      description:
        "Connect the frontend to the backend API and wire up backend services.",

      repoLink: "",

      prototypeLink: "",

      updates: "",
    },

    tasks: [
      { id: "t3a", label: "REST endpoints contract", done: true },

      { id: "t3b", label: "Frontend API wiring", done: false },
    ],

    comments: [],
  },

  {
    number: 4,

    status: "upcoming",

    submittedAt: null,

    approvedAt: null,

    score: null,

    dev: {
      title: "Reports, Testing & Deployment",

      deadline: "Aug 28, 2026",
      daysLeft: 25,

      description:
        "Generate sales and inventory reports (PDF export), conduct UAT with client, deploy to production on Vercel + Supabase.",

      repoLink: "",

      prototypeLink: "",

      updates: "",
    },

    client: {
      title: "Testing, Reports & Production Deployment",

      deadline: "Aug 28, 2026",
      daysLeft: 25,

      description: "System testing, reports and production deployment.",

      repoLink: "",

      prototypeLink: "",

      updates: "",
    },

    tasks: [
      { id: "t4a", label: "Sales & inventory reports", done: false },

      { id: "t4b", label: "UAT with client", done: false },
    ],

    comments: [],
  },
]

const seedNotifications: SprintNotification[] = [
  {
    id: "n1",
    type: "warning",
    time: "2 hours ago",
    read: false,
    text: "Deadline Reminder: Sprint 2 deliverable is due in 48 hours. Submit your GitHub repository link before Aug 5.",
  },

  {
    id: "n2",
    type: "success",
    time: "Jul 29",
    read: false,
    text: "Milestone Approved: Client verified Phase 1 — UI/UX Wireframing submission. Phase score: 5/5.",
  },

  {
    id: "n3",
    type: "info",
    time: "Jul 27",
    read: false,
    text: 'Message from Client: "Looking forward to the backend demo. Please confirm staging URL by Aug 3."',
  },

  {
    id: "n4",
    type: "warning",
    time: "Jul 26",
    read: true,
    text: "Sprint 2 progress is at 60%. Automated check suggests 2 remaining tasks before submission.",
  },

  {
    id: "n5",
    type: "success",
    time: "Jun 21",
    read: true,
    text: "Contract Milestone Payment released for Sprint 1: ₱4,500 credited to your wallet.",
  },
]

const seedProject: SprintProject = {
  id: "proj-apokon",

  project: "E-Commerce Inventory Portal",

  client: "Apokon Hardware MSME",

  totalPhases: 4,

  deadline: "Aug 28, 2026",

  daysLeft: 25,

  contractType: "Fixed Price",

  totalBudget: 20000,

  phaseBudget: 5000,

  phasePayout: 4500,

  paidToDate: 4500,

  started: "Jun 2, 2026",

  platform: "StartupMatch v2",

  phases: seedPhases,

  notifications: seedNotifications,
}

// ─── Store ─────────────────────────────────────────────────────────────────────

let project: SprintProject = JSON.parse(
  JSON.stringify(seedProject),
) as SprintProject

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeProjectStore(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function getProjectSnapshot(): SprintProject {
  return project
}

export function useProjectStore() {
  return useSyncExternalStore(subscribeProjectStore, getProjectSnapshot)
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function patchPhase(
  number: number,
  updater: (phase: ProjectPhase) => ProjectPhase,
) {
  project = {
    ...project,

    phases: project.phases.map((p) => (p.number === number ? updater(p) : p)),
  }

  emit()
}

function pushNotification(type: SprintNotifType, text: string) {
  const n: SprintNotification = {
    id: `n${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,

    type,
    text,
    time: "Just now",
    read: false,
  }

  project = { ...project, notifications: [n, ...project.notifications] }

  emit()
}

const DEV_NOW = "Just now"

function devIdentity() {
  const profile = getDevSnapshot().profile

  return {
    author: profile.name,

    avatar: profile.initials,

    avatarBg: profile.avatarColors,
  }
}

const CLIENT_IDENTITY = () => {
  const c = clientIdentity()

  return { author: c.name, avatar: c.initials, avatarBg: c.avatarColors }
}

const ADMIN_IDENTITY = {
  author: "Juanita Arceo",
  avatar: "JA",
  avatarBg: ["#F5F3FF", "#5B21B6"] as [string, string],
}

export function formatPeso(n: number) {
  return `₱${n.toLocaleString("en-US")}`
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export function submitPhase(number: number, repoLink: string, notes: string) {
  patchPhase(number, (phase) => ({
    ...phase,

    status: "in_review" as const,

    submittedAt: DEV_NOW,

    dev: {
      ...phase.dev,

      repoLink: repoLink || phase.dev.repoLink,

      updates: notes || phase.dev.updates,
    },
  }))

  pushNotification(
    "info",
    `Sprint ${number} submitted for verification. Awaiting client review.`,
  )
}

export function resubmitPhase(number: number, repoLink: string, notes: string) {
  patchPhase(number, (phase) => ({
    ...phase,

    status: "in_review" as const,

    submittedAt: DEV_NOW,

    revisionReason: undefined,

    dev: {
      ...phase.dev,

      repoLink: repoLink || phase.dev.repoLink,

      updates: notes || phase.dev.updates,
    },
  }))

  pushNotification(
    "info",
    `Sprint ${number} resubmitted after revision. Ready for client re-review.`,
  )
}

export function reviseSubmission(number: number) {
  patchPhase(number, (phase) => ({
    ...phase,

    status: "active" as const,

    submittedAt: null,
  }))
}

export function updateRepoLink(number: number, url: string) {
  patchPhase(number, (phase) => ({
    ...phase,
    dev: { ...phase.dev, repoLink: url },
  }))
}

export function updatePrototypeLink(number: number, url: string) {
  patchPhase(number, (phase) => ({
    ...phase,
    dev: { ...phase.dev, prototypeLink: url },
  }))
}

export function updateNotes(number: number, text: string) {
  patchPhase(number, (phase) => ({
    ...phase,
    dev: { ...phase.dev, updates: text },
  }))
}

export function addTask(number: number, label: string) {
  patchPhase(number, (phase) => ({
    ...phase,

    tasks: [
      ...phase.tasks,
      {
        id: `t${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label,
        done: false,
      },
    ],
  }))
}

export function completeTask(number: number, taskId: string) {
  patchPhase(number, (phase) => ({
    ...phase,

    tasks: phase.tasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t,
    ),
  }))
}

export function addComment(number: number, text: string, role: CommentRole) {
  const identity =
    role === "developer"
      ? devIdentity()
      : role === "client"
        ? CLIENT_IDENTITY()
        : ADMIN_IDENTITY

  const comment: PhaseComment = {
    id: `c${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,

    role,

    time: DEV_NOW,

    text: text.trim(),

    ...identity,
  }

  patchPhase(number, (phase) => ({
    ...phase,
    comments: [...phase.comments, comment],
  }))

  if (role !== "developer") {
    pushNotification(
      role === "client" ? "info" : "warning",
      `Message from ${identity.author}: "${text.trim()}"`,
    )
  }
}

export function approvePhase(number: number, score = 5) {
  patchPhase(number, (phase) => ({
    ...phase,

    status: "completed" as const,

    approvedAt: DEV_NOW,

    score,
  }))

  project = { ...project, paidToDate: project.paidToDate + project.phasePayout }

  emit()

  pushNotification(
    "success",
    `Milestone Approved: Client verified Phase ${number}. Phase score: ${score}/5.`,
  )

  pushNotification(
    "success",
    `Contract Milestone Payment released for Sprint ${number}: ${formatPeso(project.phasePayout)} credited to your wallet.`,
  )
}

export function disputePhase(number: number, note: string) {
  patchPhase(number, (phase) => ({
    ...phase,

    status: "disputed" as const,

    revisionReason: note || phase.revisionReason,
  }))

  if (note) {
    addComment(number, note, "client")
  }

  pushNotification(
    "warning",
    `Client flagged Sprint ${number} for dispute / revision. Review the feedback and resubmit.`,
  )
}

export function markNotificationRead(id: string) {
  project = {
    ...project,

    notifications: project.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    ),
  }

  emit()
}

export function markAllNotificationsRead() {
  project = {
    ...project,
    notifications: project.notifications.map((n) => ({ ...n, read: true })),
  }

  emit()
}

export function resetDemo() {
  project = (JSON.parse(JSON.stringify(seedProject)) as SprintProject)

  emit()
}
