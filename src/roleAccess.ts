// ─── Role-based page access ───────────────────────────────────────────────────
// Centralized mapping for page switcher visibility (Option B: Strict Separation).
// Sprint Dashboard (dev-centric) is Student-only; Milestone Tracking (enterprise-centric)
// is Enterprise-only; Admin (PSITS Moderator) sees both plus Verification Queue & Analytics.
// Student `milestone` intentionally excluded per clarification #3; toggle one line to restore
// spec-literal read-only view if needed.

import type { VerificationStatus } from "./devProfile"

// ─── Page & role types ────────────────────────────────────────────────────────
// Keep in sync with `page` union in App.tsx.
export type AppPage = "auth" | "developer" | "admin" | "sprint" | "specform" | "milestone" | "analytics"
export type AppRole = "guest" | "student" | "enterprise" | "admin"

// ─── Page meta for switcher labels ───────────────────────────────────────────
// Single source of truth for human-readable labels; used to filter switcher.
export const PAGE_META: Record<AppPage, { label: string }> = {
  auth: { label: "Login & Registration" },
  developer: { label: "Developer Profile" },
  admin: { label: "Admin — Verification Queue" },
  sprint: { label: "Sprint Dashboard" },
  specform: { label: "Post a Project" },
  milestone: { label: "Milestone Tracking" },
  analytics: { label: "Analytics" },
}

// All pages in switcher order (mirrors App.tsx:5011).
export const ALL_SWITCHER_PAGES: readonly AppPage[] = [
  "auth",
  "developer",
  "admin",
  "sprint",
  "specform",
  "milestone",
  "analytics",
] as const

// ─── Role → allowed pages (Option B: Strict Separation) ──────────────────────
// Verified Student: Developer Profile + Sprint Dashboard (dev) — NO enterprise milestone
// Verified Business Owner: Post a Project + Milestone Tracking Enterprise
// PSITS Moderator: Developer Profile (own editable) + Verification Queue + Sprint + Milestone + Analytics
// Toggle to restore spec-literal student milestone view: add 'milestone' to student[]
export const ROLE_PAGE_MAP: Record<Exclude<AppRole, "guest">, AppPage[]> = {
  student: ["developer", "sprint"],
  enterprise: ["specform", "milestone"],
  admin: ["developer", "admin", "sprint", "milestone", "analytics"],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Check if a page is allowed for a given role.
// Guest has no allowed pages; auth is never exposed via switcher (filtered separately).
export function isPageAllowed(page: AppPage, role: AppRole): boolean {
  if (role === "guest") return false
  // Auth is intentionally excluded from switcher; direct navigation to auth is handled via logout.
  if (page === "auth") return false
  try {
    const allowed = ROLE_PAGE_MAP[role]
    return allowed.includes(page)
  } catch {
    // Error handling: corrupted role map — fail closed (deny access)
    return false
  }
}

// Get allowed pages for a role (safe copy, never mutates source).
// Performance: O(1) small-array copy; caller should memoize if used in render.
export function getAllowedPages(role: AppRole): AppPage[] {
  if (role === "guest") return []
  try {
    return [...(ROLE_PAGE_MAP[role] ?? [])]
  } catch {
    return []
  }
}

// Resolve AppRole from sign-in email + selected AuthPage role + verification status.
// Edge cases: trimmed lower-case email, unknown email → fallback to selected role's base type.
// Moderator detection: email ends with @psits.org.ph OR AuthPage role === 'admin'.
// Enterprise detection: known client emails or AuthPage role === 'enterprise'.
// Otherwise student. Pending/rejected does not change role type — gating is done via PendingVerification UI.
// _verification is intentionally unused for role resolution (kept for future extensibility and API symmetry).
export function resolveRole(
  email: string,
  selectedRole: "student" | "enterprise" | "admin",
  _verification?: VerificationStatus | string,
): AppRole {
  try {
    const em = (email ?? "").trim().toLowerCase()
    // Validate email shape; if invalid, fall back to selected role mapping
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)

    // Moderator (PSITS) takes precedence — per spec & AuthPage heuristic
    if (
      selectedRole === "admin" ||
      (isValidEmail && em.endsWith("@psits.org.ph"))
    ) {
      return "admin"
    }

    // Known enterprise client emails (from clientProfile.ts MOCK_CLIENTS)
    const knownEnterprise = new Set([
      "ernesto@apokonhardware.com.ph",
      "rvillanueva@davaofrutis.com.ph",
      "rcamacho@citymalltagum.com",
    ])
    if (
      selectedRole === "enterprise" ||
      (isValidEmail && knownEnterprise.has(em))
    ) {
      return "enterprise"
    }

    // Default to student for any other email/role
    return "student"
  } catch {
    // Error handling: unexpected exception → fail closed to least-privileged
    return "student"
  }
}

// Check if verification status blocks content behind PendingVerification placeholder.
// Admin bypasses pending gate (moderator is assumed verified).
export function isPendingVerification(
  role: AppRole,
  verification: VerificationStatus | string | null | undefined,
): boolean {
  try {
    if (role === "admin" || role === "guest") return false
    if (!verification) return false
    // Only 'Verified' grants access; all other statuses show placeholder
    return verification !== "Verified"
  } catch {
    return false
  }
}
