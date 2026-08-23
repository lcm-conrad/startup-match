import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AuthPage from "./AuthPage";
import {
  useDevProfile,
  useDevBids,
  placeBid,
  signInAs,
  setAvailability,
  MARKETPLACE_PROJECTS,
} from "./devProfile";
import {
  useProjectStore,
  submitPhase,
  resubmitPhase,
  reviseSubmission,
  updateRepoLink,
  updatePrototypeLink,
  updateNotes,
  addTask,
  completeTask,
  addComment,
  approvePhase,
  disputePhase,
  markNotificationRead,
  markAllNotificationsRead,
  resetDemo,
  formatPeso,
} from "./projectStore";
import type { SprintPhaseStatus } from "./projectStore";
// ─── Role-based access (Option B: Strict Separation) ─────────────────────────
// Sprint Dashboard (dev) → student only; Milestone Tracking (enterprise) → enterprise only;
// Admin (PSITS Moderator) sees both + Verification Queue & Analytics + own Developer Profile.
import {
  PAGE_META,
  ALL_SWITCHER_PAGES,
  ROLE_PAGE_MAP,
  isPageAllowed,
  resolveRole,
  isPendingVerification,
} from "./roleAccess";
import type { AppPage, AppRole } from "./roleAccess";

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconDashboard({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect
        x="2"
        y="2"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        opacity=".9"
      />
      <rect
        x="11"
        y="2"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        opacity=".4"
      />
      <rect
        x="2"
        y="11"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        opacity=".4"
      />
      <rect
        x="11"
        y="11"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        opacity=".4"
      />
    </svg>
  );
}
function IconShield({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2L3.5 5v5c0 3.6 2.8 6.9 6.5 7.8C13.7 16.9 16.5 13.6 16.5 10V5L10 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 10l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconChart({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M3 14l4-4 3 3 4-5 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function IconLogs({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 7h8M6 10h6M6 13h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconSettings({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconSearch({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10.5 10.5L14 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconX({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path
        d="M3 3l6 6M9 3l-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconEye({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function IconChevron({
  size = 14,
  dir = "down",
}: {
  size?: number;
  dir?: "down" | "up" | "right";
}) {
  const rot = dir === "up" ? 180 : dir === "right" ? -90 : 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconClose({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconMenu({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5h14M3 10h14M3 15h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconFilter({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M1 2h12l-5 6v4l-2-1V8L1 2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconBell({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path
        d="M9 2a5 5 0 00-5 5v3l-1.5 2h13L14 10V7A5 5 0 009 2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 15a1.5 1.5 0 003 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconMarket({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 10h8M10 6v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconMessages({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M17 13.5A1.5 1.5 0 0115.5 15H6l-3 3V4.5A1.5 1.5 0 014.5 3h11A1.5 1.5 0 0117 4.5v9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconBids({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M3 14l4-4 3 3 4-5 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function IconStar({
  size = 14,
  filled = false,
}: {
  size?: number;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={filled ? "#F59E0B" : "none"}
    >
      <path
        d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.43L7 8.885 4.91 10.5l.59-3.43L3 4.635l3.455-.505L7 1z"
        stroke="#F59E0B"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconExternal({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <path
        d="M3 10L10 3M10 3H5.5M10 3v4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconGlobe({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function IconLinkedin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function IconGithub({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

// ─── Shared primitives ──────────────────────────────────────────────────────────

function Card({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cfg: Record<
    string,
    { bg: string; color: string; border: string; dot: string }
  > = {
    "Pending Review": {
      bg: "#FFFBEB",
      color: "#D97706",
      border: "#FDE68A",
      dot: "#D97706",
    },
    Verified: {
      bg: "#F0FDF4",
      color: "#16A34A",
      border: "#BBF7D0",
      dot: "#16A34A",
    },
    Rejected: {
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      dot: "#DC2626",
    },
    "Under Review": {
      bg: "#EFF6FF",
      color: "#2563EB",
      border: "#BFDBFE",
      dot: "#2563EB",
    },
    Active: {
      bg: "#F0FDF4",
      color: "#16A34A",
      border: "#BBF7D0",
      dot: "#16A34A",
    },
    Suspended: {
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      dot: "#DC2626",
    },
  };
  const c = cfg[status] ?? cfg["Pending Review"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 99,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontSize: 11.5,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

function SkillTag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 99,
        background: "#EFF6FF",
        border: "1px solid #BFDBFE",
        fontSize: 11,
        fontWeight: 600,
        color: "#2563EB",
      }}
    >
      {label}
    </span>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const studentApplicants = [
  {
    id: "s1",
    name: "Luis Conrad Sagrado",
    academicId: "2022-0192",
    chapter: "PSITS — St. Mary's College of Tagum",
    avatar: "LS",
    avatarColor: ["#DBEAFE", "#1D4ED8"],
    techStack: ["React", "Node.js", "PostgreSQL"],
    submitted: "Jul 12, 2025",
    status: "Pending Review",
    email: "lcsagrado@stmct.edu.ph",
    socialLinks: {
      github: "github.com/lcsagrado",
      linkedin: "linkedin.com/in/lcsagrado",
    },
    documents: [
      "Student ID (STMCT) — Verified scan",
      "COR AY 2024–2025",
      "PSITS Membership Certificate #2024-0892",
    ],
  },
  {
    id: "s2",
    name: "Marian Dela Cruz",
    academicId: "2021-0344",
    chapter: "PSITS — University of Mindanao Tagum",
    avatar: "MD",
    avatarColor: ["#F0FDF4", "#166534"],
    techStack: ["Vue.js", "Firebase", "Tailwind CSS"],
    submitted: "Jul 10, 2025",
    status: "Pending Review",
    email: "mdelacruz@umtagum.edu.ph",
    socialLinks: {
      github: "github.com/mdelacruz",
      linkedin: "linkedin.com/in/mdelacruz",
    },
    documents: [
      "Student ID (UM Tagum)",
      "PSITS Membership Certificate #2024-1104",
      "Proof of Enrollment S1 2025",
    ],
  },
  {
    id: "s3",
    name: "Raphael Obenza",
    academicId: "2023-0017",
    chapter: "PSITS — Comval College",
    avatar: "RO",
    avatarColor: ["#FEF9C3", "#92400E"],
    techStack: ["Next.js", "TypeScript", "Supabase"],
    submitted: "Jul 9, 2025",
    status: "Under Review",
    email: "robenza@comvalcollege.edu.ph",
    socialLinks: {
      github: "github.com/robenza",
      linkedin: "linkedin.com/in/robenza",
    },
    documents: [
      "Student ID (Comval College)",
      "PSITS Chapter Endorsement Letter",
      "GitHub Activity Report",
    ],
  },
  {
    id: "s4",
    name: "Tricia Anne Lim",
    academicId: "2020-0558",
    chapter: "PSITS — St. Mary's College of Tagum",
    avatar: "TL",
    avatarColor: ["#F5F3FF", "#6D28D9"],
    techStack: ["Django", "Python", "React"],
    submitted: "Jul 7, 2025",
    status: "Verified",
    email: "talim@stmct.edu.ph",
    socialLinks: {
      github: "github.com/talim",
      linkedin: "linkedin.com/in/talim",
    },
    documents: [
      "Student ID (STMCT) — Verified",
      "COR AY 2024–2025 — Verified",
      "PSITS Certificate — Verified",
    ],
  },
  {
    id: "s5",
    name: "Joel Macaraeg Jr.",
    academicId: "2022-0311",
    chapter: "PSITS — Tagum City College",
    avatar: "JM",
    avatarColor: ["#FFF1F2", "#9F1239"],
    techStack: ["Laravel", "PHP", "MySQL"],
    submitted: "Jul 5, 2025",
    status: "Rejected",
    email: "jmjr@tagumcitycollege.edu.ph",
    socialLinks: {
      github: "github.com/jmjr",
      linkedin: "linkedin.com/in/jmjr",
    },
    documents: [
      "Student ID (incomplete scan)",
      "No PSITS certificate submitted",
    ],
  },
];

const enterpriseApplicants = [
  {
    id: "e1",
    name: "Davao Fruits Corp.",
    rep: "Engr. Ramon Villanueva",
    barangay: "Magugpo West",
    permit: "DTI-REG-2024-08812",
    avatar: "DF",
    avatarColor: ["#ECFDF5", "#065F46"],
    industry: "Agri-business / Export",
    submitted: "Jul 11, 2025",
    status: "Pending Review",
    email: "rvillanueva@davaofrutis.com.ph",
    documents: [
      "DTI Business Name Registration",
      "BIR TIN Certificate",
      "Barangay Business Clearance — Magugpo West",
    ],
  },
  {
    id: "e2",
    name: "TagumLog Solutions Inc.",
    rep: "Maria Crisanta Bato",
    barangay: "Apokon",
    permit: "SEC-CORP-2023-04471",
    avatar: "TL",
    avatarColor: ["#EFF6FF", "#1E40AF"],
    industry: "Logistics / Freight",
    submitted: "Jul 9, 2025",
    status: "Under Review",
    email: "mcbato@tagumlog.ph",
    documents: [
      "SEC Certificate of Incorporation",
      "Mayor's Permit 2025",
      "Barangay Business Clearance — Apokon",
    ],
  },
  {
    id: "e3",
    name: "Metro Tagum Cooperative",
    rep: "Atty. Vivian Soriano",
    barangay: "Mankilam",
    permit: "CDA-REG-2019-00923",
    avatar: "MT",
    avatarColor: ["#FFF7ED", "#92400E"],
    industry: "Cooperative / Finance",
    submitted: "Jul 8, 2025",
    status: "Verified",
    email: "vsoriano@metroc.coop",
    documents: [
      "CDA Registration — Verified",
      "Audited Financial Report 2024 — Verified",
      "Barangay Clearance — Mankilam",
    ],
  },
  {
    id: "e4",
    name: "CityMall Tagum",
    rep: "Ms. Rowena Camacho",
    barangay: "Magugpo West",
    permit: "DTI-REG-2022-11140",
    avatar: "CM",
    avatarColor: ["#F5F3FF", "#5B21B6"],
    industry: "Retail / Shopping Center",
    submitted: "Jul 6, 2025",
    status: "Active",
    email: "rcamacho@citymalltagum.com",
    documents: [
      "DTI Registration",
      "Mayor's Business Permit 2025",
      "Barangay Clearance — Magugpo West",
    ],
  },
  {
    id: "e5",
    name: "Mindanao Agri Holdings",
    rep: "Mr. Felipe Navarro",
    barangay: "Mankilam",
    permit: "SEC-CORP-2020-07765",
    avatar: "MA",
    avatarColor: ["#FEF2F2", "#991B1B"],
    industry: "Agriculture / Holdings",
    submitted: "Jul 3, 2025",
    status: "Suspended",
    email: "fnavarro@mindagri.com.ph",
    documents: ["SEC Certificate", "Suspended — pending re-verification"],
  },
];

const adminNavItems = [
  { icon: IconDashboard, label: "Overview", id: "overview" },
  { icon: IconShield, label: "Verification Queue", id: "verification" },
  { icon: IconChart, label: "Enterprise Analytics", id: "analytics" },
  { icon: IconLogs, label: "Audit Logs", id: "auditlogs" },
  { icon: IconSettings, label: "Settings", id: "settings" },
];

// ─── Admin Sidebar ───────────────────────────────────────────────────────────

function AdminSidebar({
  active,
  onNav,
  collapsed,
}: {
  active: string;
  onNav: (id: string) => void;
  collapsed: boolean;
}) {
  return (
    <aside
      style={{
        width: collapsed ? 72 : 260,
        minHeight: "100vh",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 22px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: collapsed ? "auto" : 0,
            marginRight: collapsed ? "auto" : 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 14L7 6l3 5 3-7 2 3"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              StartupMatch
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
              Regional Admin · Tagum
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: "10px 0", flex: 1 }}>
        {adminNavItems.map(({ icon: Icon, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: collapsed ? "11px 0" : "11px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                border: "none",
                background: isActive ? "rgba(37,99,235,0.18)" : "transparent",
                color: isActive ? "#60A5FA" : "#94A3B8",
                borderLeft: isActive
                  ? "3px solid #2563EB"
                  : "3px solid transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              <Icon size={18} />
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      {/* Admin user */}
      {!collapsed && (
        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              JA
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>
                Juanita Arceo
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>
                Regional Administrator
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── Credentials Modal ──────────────────────────────────────────────────────────

type StudentRecord = (typeof studentApplicants)[number];
type EnterpriseRecord = (typeof enterpriseApplicants)[number];

function CredentialsModal({
  record,
  type,
  onClose,
  onApprove,
  onReject,
}: {
  record: StudentRecord | EnterpriseRecord;
  type: "student" | "enterprise";
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const isStudent = type === "student";
  const student = isStudent ? (record as StudentRecord) : null;
  const enterprise = !isStudent ? (record as EnterpriseRecord) : null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.48)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 560,
          maxHeight: "85vh",
          overflow: "hidden",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.16)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                flexShrink: 0,
                background: `linear-gradient(135deg, ${record.avatarColor[0]}, ${record.avatarColor[1]}20)`,
                border: `2px solid ${record.avatarColor[1]}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: record.avatarColor[1],
              }}
            >
              {record.avatar}
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0F172A",
                  letterSpacing: "-0.02em",
                }}
              >
                {record.name}
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                {isStudent
                  ? `${student!.academicId} · ${student!.chapter}`
                  : `${enterprise!.barangay} · ${enterprise!.industry}`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94A3B8",
              padding: 4,
              flexShrink: 0,
              lineHeight: 0,
            }}
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Modal body */}
        <div
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>
              Current Status
            </span>
            <StatusPill status={record.status} />
          </div>

          {/* Submitted documents */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 10,
              }}
            >
              Submitted Documents
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {record.documents.map((doc, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 14px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    gap: 10,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: doc.includes("Verified")
                          ? "#16A34A"
                          : doc.toLowerCase().includes("no ") ||
                              doc.toLowerCase().includes("incomplete")
                            ? "#DC2626"
                            : "#D97706",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: "#334155",
                        fontWeight: 500,
                      }}
                    >
                      {doc}
                    </span>
                  </div>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#2563EB",
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    View <IconExternal size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social / contact vetting links */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 10,
              }}
            >
              {isStudent
                ? "Social Media Vetting Links"
                : "Contact & Registration"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {isStudent && student ? (
                <>
                  <VettingLink
                    icon={<IconGithub size={15} />}
                    label={student.socialLinks.github}
                  />
                  <VettingLink
                    icon={<IconLinkedin size={15} />}
                    label={student.socialLinks.linkedin}
                  />
                  <VettingLink
                    icon={<IconGlobe size={15} />}
                    label={`mailto:${student.email}`}
                    display={student.email}
                  />
                </>
              ) : enterprise ? (
                <>
                  <VettingLink
                    icon={<IconGlobe size={15} />}
                    label={enterprise.permit}
                    display={`Permit / Reg: ${enterprise.permit}`}
                  />
                  <VettingLink
                    icon={<IconGlobe size={15} />}
                    label={`mailto:${enterprise.email}`}
                    display={enterprise.email}
                  />
                </>
              ) : null}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 8,
              }}
            >
              Admin Notes
            </div>
            <textarea
              placeholder="Add a review note (visible only to admins)…"
              style={{
                width: "100%",
                minHeight: 80,
                padding: "10px 12px",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#334155",
                resize: "vertical",
                outline: "none",
                background: "#FAFCFF",
                boxSizing: "border-box",
                lineHeight: 1.5,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
            />
          </div>
        </div>

        {/* Modal footer */}
        {record.status !== "Verified" &&
          record.status !== "Active" &&
          record.status !== "Rejected" &&
          record.status !== "Suspended" && (
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #F1F5F9",
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  color: "#475569",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Close
              </button>
              <button
                onClick={onReject}
                style={{
                  background: "#DC2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <IconX size={11} /> Reject
              </button>
              <button
                onClick={onApprove}
                style={{
                  background: "#16A34A",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <IconCheck size={11} /> Approve & Verify
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

function VettingLink({
  icon,
  label,
  display,
}: {
  icon: React.ReactNode;
  label: string;
  display?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 14px",
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#64748B",
        }}
      >
        {icon}
        <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>
          {display ?? label}
        </span>
      </div>
      <a
        href={`https://${label}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: "#2563EB", lineHeight: 0 }}
      >
        <IconExternal size={12} />
      </a>
    </div>
  );
}

// ─── Verification Queue Page ────────────────────────────────────────────────────

function VerificationQueue({
  isMobile,
  isTablet,
}: {
  isMobile: boolean;
  isTablet: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"students" | "enterprises">(
    "students",
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );
  const [modal, setModal] = useState<{
    record: StudentRecord | EnterpriseRecord;
    type: "student" | "enterprise";
  } | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>(() => {
    const s: Record<string, string> = {};
    studentApplicants.forEach((a) => {
      s[a.id] = a.status;
    });
    enterpriseApplicants.forEach((a) => {
      s[a.id] = a.status;
    });
    return s;
  });

  const pendingStudents = studentApplicants.filter(
    (a) =>
      statuses[a.id] === "Pending Review" || statuses[a.id] === "Under Review",
  ).length;
  const pendingEnterprises = enterpriseApplicants.filter(
    (a) =>
      statuses[a.id] === "Pending Review" || statuses[a.id] === "Under Review",
  ).length;

  const filterStudents = studentApplicants.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.academicId.includes(search) ||
      a.chapter.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" || statuses[a.id] === statusFilter;
    return matchSearch && matchStatus;
  });

  const filterEnterprises = enterpriseApplicants.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.barangay.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" || statuses[a.id] === statusFilter;
    return matchSearch && matchStatus;
  });

  function approve(id: string) {
    setStatuses((s) => ({
      ...s,
      [id]: activeTab === "students" ? "Verified" : "Active",
    }));
    setModal(null);
  }
  function reject(id: string) {
    setStatuses((s) => ({ ...s, [id]: "Rejected" }));
    setModal(null);
  }

  const statusOptions = [
    "All",
    "Pending Review",
    "Under Review",
    "Verified",
    "Active",
    "Rejected",
    "Suspended",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {modal && (
        <CredentialsModal
          record={modal.record}
          type={modal.type}
          onClose={() => setModal(null)}
          onApprove={() => approve(modal.record.id)}
          onReject={() => reject(modal.record.id)}
        />
      )}

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: isMobile ? 22 : 26,
                fontWeight: 700,
                color: "#0F172A",
                letterSpacing: "-0.03em",
              }}
            >
              Verification & Vetting Queue
            </h1>
            <p style={{ margin: 0, fontSize: 13.5, color: "#64748B" }}>
              Review and approve student developers and local enterprise
              accounts before granting platform access.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 99,
                background: "#FFFBEB",
                border: "1px solid #FDE68A",
                color: "#D97706",
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#D97706",
                  animation: "pulse 2s infinite",
                }}
              />
              {pendingStudents} Pending Students
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 99,
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                color: "#2563EB",
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#2563EB",
                }}
              />
              {pendingEnterprises} Pending Enterprises
            </span>
          </div>
        </div>

        {/* Search + filter row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                lineHeight: 0,
              }}
            >
              <IconSearch size={15} />
            </span>
            <input
              type="text"
              placeholder="Search by name, ID, school or barangay…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 13.5,
                color: "#334155",
                outline: "none",
                background: "#fff",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                lineHeight: 0,
                pointerEvents: "none",
              }}
            >
              <IconFilter size={13} />
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "9px 28px 9px 30px",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#334155",
                background: "#fff",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
              }}
            >
              {statusOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <span
              style={{
                position: "absolute",
                right: 9,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                pointerEvents: "none",
                lineHeight: 0,
              }}
            >
              <IconChevron size={13} />
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          borderBottom: "1px solid #E2E8F0",
          marginBottom: 20,
          display: "flex",
          gap: 0,
        }}
      >
        {(
          [
            {
              id: "students",
              label: "Student Developers (PSITS Members)",
              count: filterStudents.length,
            },
            {
              id: "enterprises",
              label: "Local Enterprises (MSMEs)",
              count: filterEnterprises.length,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "10px 18px 11px",
              fontFamily: "Inter, sans-serif",
              fontSize: 13.5,
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? "#2563EB" : "#64748B",
              borderBottom:
                activeTab === tab.id
                  ? "2.5px solid #2563EB"
                  : "2.5px solid transparent",
              marginBottom: -1,
              transition: "all 0.12s",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
            <span
              style={{
                background: activeTab === tab.id ? "#EFF6FF" : "#F1F5F9",
                color: activeTab === tab.id ? "#2563EB" : "#94A3B8",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                padding: "1px 7px",
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table or Cards */}
      {activeTab === "students" ? (
        isMobile ? (
          <StudentCards
            records={filterStudents}
            statuses={statuses}
            onView={(r) => setModal({ record: r, type: "student" })}
            onApprove={(id) => approve(id)}
            onReject={(id) => reject(id)}
          />
        ) : isTablet ? (
          <StudentTabletCards
            records={filterStudents}
            statuses={statuses}
            expanded={expandedCards}
            setExpanded={setExpandedCards}
            onView={(r) => setModal({ record: r, type: "student" })}
            onApprove={(id) => approve(id)}
            onReject={(id) => reject(id)}
          />
        ) : (
          <StudentTable
            records={filterStudents}
            statuses={statuses}
            onView={(r) => setModal({ record: r, type: "student" })}
            onApprove={(id) => approve(id)}
            onReject={(id) => reject(id)}
          />
        )
      ) : isMobile ? (
        <EnterpriseCards
          records={filterEnterprises}
          statuses={statuses}
          onView={(r) => setModal({ record: r, type: "enterprise" })}
          onApprove={(id) => approve(id)}
          onReject={(id) => reject(id)}
        />
      ) : isTablet ? (
        <EnterpriseTabletCards
          records={filterEnterprises}
          statuses={statuses}
          expanded={expandedCards}
          setExpanded={setExpandedCards}
          onView={(r) => setModal({ record: r, type: "enterprise" })}
          onApprove={(id) => approve(id)}
          onReject={(id) => reject(id)}
        />
      ) : (
        <EnterpriseTable
          records={filterEnterprises}
          statuses={statuses}
          onView={(r) => setModal({ record: r, type: "enterprise" })}
          onApprove={(id) => approve(id)}
          onReject={(id) => reject(id)}
        />
      )}
    </div>
  );
}

// ─── Student Table (Desktop) ──────────────────────────────────────────────────

function StudentTable({
  records,
  statuses,
  onView,
  onApprove,
  onReject,
}: {
  records: StudentRecord[];
  statuses: Record<string, string>;
  onView: (r: StudentRecord) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const cols = [
    "Applicant",
    "Chapter / School",
    "Academic ID",
    "Tech Stack",
    "Submitted",
    "Status",
    "Actions",
  ];
  return (
    <Card style={{ overflow: "hidden", padding: 0 }}>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {cols.map((c) => (
                <th
                  key={c}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "1px solid #E2E8F0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const status = statuses[r.id];
              const canAct =
                status === "Pending Review" || status === "Under Review";
              return (
                <tr
                  key={r.id}
                  style={{
                    borderBottom:
                      i < records.length - 1 ? "1px solid #F1F5F9" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#FAFCFF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Applicant */}
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${r.avatarColor[0]}, ${r.avatarColor[0]})`,
                          border: `1.5px solid ${r.avatarColor[1]}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: r.avatarColor[1],
                        }}
                      >
                        {r.avatar}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#0F172A",
                            fontSize: 13,
                          }}
                        >
                          {r.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>
                          {r.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Chapter */}
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#475569",
                      fontSize: 12.5,
                      maxWidth: 180,
                    }}
                  >
                    <span
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {r.chapter}
                    </span>
                  </td>
                  {/* Academic ID */}
                  <td
                    style={{
                      padding: "13px 16px",
                      fontFamily: "monospace",
                      fontSize: 12.5,
                      color: "#334155",
                      fontWeight: 600,
                    }}
                  >
                    {r.academicId}
                  </td>
                  {/* Tech Stack */}
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {r.techStack.map((t) => (
                        <SkillTag key={t} label={t} />
                      ))}
                    </div>
                  </td>
                  {/* Submitted */}
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#64748B",
                      fontSize: 12.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.submitted}
                  </td>
                  {/* Status */}
                  <td style={{ padding: "13px 16px" }}>
                    <StatusPill status={status} />
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        flexWrap: "nowrap",
                      }}
                    >
                      <ActionBtn variant="outline" onClick={() => onView(r)}>
                        <IconEye size={12} /> View
                      </ActionBtn>
                      {canAct && (
                        <ActionBtn
                          variant="success"
                          onClick={() => onApprove(r.id)}
                        >
                          <IconCheck size={11} /> Approve
                        </ActionBtn>
                      )}
                      {canAct && (
                        <ActionBtn
                          variant="danger"
                          onClick={() => onReject(r.id)}
                        >
                          <IconX size={11} /> Reject
                        </ActionBtn>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {records.length === 0 && (
          <EmptyState message="No applicants match your current filters." />
        )}
      </div>
    </Card>
  );
}

// ─── Student Tablet Cards ──────────────────────────────────────────────────────

function StudentTabletCards({
  records,
  statuses,
  expanded,
  setExpanded,
  onView,
  onApprove,
  onReject,
}: {
  records: StudentRecord[];
  statuses: Record<string, string>;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onView: (r: StudentRecord) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {records.map((r) => {
        const status = statuses[r.id];
        const canAct = status === "Pending Review" || status === "Under Review";
        const isExpanded = expanded[r.id];
        return (
          <Card key={r.id} style={{ padding: "14px 16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${r.avatarColor[0]}, ${r.avatarColor[0]})`,
                    border: `1.5px solid ${r.avatarColor[1]}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: r.avatarColor[1],
                  }}
                >
                  {r.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#0F172A",
                      fontSize: 13.5,
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#64748B",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.academicId} · {r.chapter.split("—")[0].trim()}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <StatusPill status={status} />
                <button
                  onClick={() =>
                    setExpanded((s) => ({ ...s, [r.id]: !s[r.id] }))
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    lineHeight: 0,
                  }}
                >
                  <IconChevron size={16} dir={isExpanded ? "up" : "down"} />
                </button>
              </div>
            </div>
            {isExpanded && (
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: "1px solid #F1F5F9",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  <b style={{ color: "#475569" }}>Tech Stack:</b>{" "}
                  {r.techStack.join(", ")}
                </div>
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  <b style={{ color: "#475569" }}>Submitted:</b> {r.submitted}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 4,
                  }}
                >
                  <ActionBtn variant="outline" onClick={() => onView(r)}>
                    <IconEye size={12} /> View Credentials
                  </ActionBtn>
                  {canAct && (
                    <ActionBtn
                      variant="success"
                      onClick={() => onApprove(r.id)}
                    >
                      <IconCheck size={11} /> Approve & Verify
                    </ActionBtn>
                  )}
                  {canAct && (
                    <ActionBtn variant="danger" onClick={() => onReject(r.id)}>
                      <IconX size={11} /> Reject
                    </ActionBtn>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
      {records.length === 0 && (
        <EmptyState message="No applicants match your current filters." />
      )}
    </div>
  );
}

// ─── Student Mobile Cards ────────────────────────────────────────────────────

function StudentCards({
  records,
  statuses,
  onView,
  onApprove,
  onReject,
}: {
  records: StudentRecord[];
  statuses: Record<string, string>;
  onView: (r: StudentRecord) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {records.map((r) => {
        const status = statuses[r.id];
        const canAct = status === "Pending Review" || status === "Under Review";
        return (
          <Card key={r.id} style={{ padding: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${r.avatarColor[0]}, ${r.avatarColor[0]})`,
                  border: `1.5px solid ${r.avatarColor[1]}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: r.avatarColor[1],
                }}
              >
                {r.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}
                >
                  {r.name}
                </div>
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  {r.academicId}
                </div>
              </div>
              <StatusPill status={status} />
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>
              {r.chapter}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginBottom: 12,
              }}
            >
              {r.techStack.map((t) => (
                <SkillTag key={t} label={t} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                onClick={() => onView(r)}
                style={mobileActionStyle("#fff", "#475569", "#E2E8F0")}
              >
                <IconEye size={13} /> View Credentials
              </button>
              {canAct && (
                <button
                  onClick={() => onApprove(r.id)}
                  style={mobileActionStyle("#16A34A", "#fff", "#16A34A")}
                >
                  <IconCheck size={12} /> Approve & Verify
                </button>
              )}
              {canAct && (
                <button
                  onClick={() => onReject(r.id)}
                  style={mobileActionStyle("#DC2626", "#fff", "#DC2626")}
                >
                  <IconX size={12} /> Reject Application
                </button>
              )}
            </div>
          </Card>
        );
      })}
      {records.length === 0 && (
        <EmptyState message="No applicants match your current filters." />
      )}
    </div>
  );
}

// ─── Enterprise Table (Desktop) ───────────────────────────────────────────────

function EnterpriseTable({
  records,
  statuses,
  onView,
  onApprove,
  onReject,
}: {
  records: EnterpriseRecord[];
  statuses: Record<string, string>;
  onView: (r: EnterpriseRecord) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const cols = [
    "Business Name",
    "Representative",
    "Barangay",
    "Permit / DTI Reg",
    "Status",
    "Actions",
  ];
  return (
    <Card style={{ overflow: "hidden", padding: 0 }}>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {cols.map((c) => (
                <th
                  key={c}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "1px solid #E2E8F0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const status = statuses[r.id];
              const canAct =
                status === "Pending Review" || status === "Under Review";
              return (
                <tr
                  key={r.id}
                  style={{
                    borderBottom:
                      i < records.length - 1 ? "1px solid #F1F5F9" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#FAFCFF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${r.avatarColor[0]}, ${r.avatarColor[0]})`,
                          border: `1.5px solid ${r.avatarColor[1]}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: r.avatarColor[1],
                        }}
                      >
                        {r.avatar}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#0F172A",
                            fontSize: 13,
                          }}
                        >
                          {r.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>
                          {r.industry}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#475569",
                      fontSize: 13,
                    }}
                  >
                    {r.rep}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span
                      style={{
                        background: "#F1F5F9",
                        color: "#475569",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "2px 9px",
                        borderRadius: 99,
                      }}
                    >
                      {r.barangay}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontFamily: "monospace",
                      fontSize: 12,
                      color: "#334155",
                      fontWeight: 600,
                    }}
                  >
                    {r.permit}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <StatusPill status={status} />
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}
                    >
                      <ActionBtn variant="outline" onClick={() => onView(r)}>
                        <IconEye size={12} /> View
                      </ActionBtn>
                      {canAct && (
                        <ActionBtn
                          variant="success"
                          onClick={() => onApprove(r.id)}
                        >
                          <IconCheck size={11} /> Approve
                        </ActionBtn>
                      )}
                      {canAct && (
                        <ActionBtn
                          variant="danger"
                          onClick={() => onReject(r.id)}
                        >
                          <IconX size={11} /> Reject
                        </ActionBtn>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {records.length === 0 && (
          <EmptyState message="No enterprises match your current filters." />
        )}
      </div>
    </Card>
  );
}

// ─── Enterprise Tablet Cards ──────────────────────────────────────────────────

function EnterpriseTabletCards({
  records,
  statuses,
  expanded,
  setExpanded,
  onView,
  onApprove,
  onReject,
}: {
  records: EnterpriseRecord[];
  statuses: Record<string, string>;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onView: (r: EnterpriseRecord) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {records.map((r) => {
        const status = statuses[r.id];
        const canAct = status === "Pending Review" || status === "Under Review";
        const isExpanded = expanded[r.id];
        return (
          <Card key={r.id} style={{ padding: "14px 16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${r.avatarColor[0]}, ${r.avatarColor[0]})`,
                    border: `1.5px solid ${r.avatarColor[1]}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: r.avatarColor[1],
                  }}
                >
                  {r.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#0F172A",
                      fontSize: 13.5,
                    }}
                  >
                    {r.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748B" }}>
                    {r.barangay} · {r.industry}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <StatusPill status={status} />
                <button
                  onClick={() =>
                    setExpanded((s) => ({ ...s, [r.id]: !s[r.id] }))
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    lineHeight: 0,
                  }}
                >
                  <IconChevron size={16} dir={isExpanded ? "up" : "down"} />
                </button>
              </div>
            </div>
            {isExpanded && (
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: "1px solid #F1F5F9",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  <b style={{ color: "#475569" }}>Rep:</b> {r.rep}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748B",
                    fontFamily: "monospace",
                  }}
                >
                  <b
                    style={{
                      color: "#475569",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Permit:
                  </b>{" "}
                  {r.permit}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 4,
                  }}
                >
                  <ActionBtn variant="outline" onClick={() => onView(r)}>
                    <IconEye size={12} /> View Docs
                  </ActionBtn>
                  {canAct && (
                    <ActionBtn
                      variant="success"
                      onClick={() => onApprove(r.id)}
                    >
                      <IconCheck size={11} /> Approve
                    </ActionBtn>
                  )}
                  {canAct && (
                    <ActionBtn variant="danger" onClick={() => onReject(r.id)}>
                      <IconX size={11} /> Reject
                    </ActionBtn>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
      {records.length === 0 && (
        <EmptyState message="No enterprises match your current filters." />
      )}
    </div>
  );
}

// ─── Enterprise Mobile Cards ──────────────────────────────────────────────────

function EnterpriseCards({
  records,
  statuses,
  onView,
  onApprove,
  onReject,
}: {
  records: EnterpriseRecord[];
  statuses: Record<string, string>;
  onView: (r: EnterpriseRecord) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {records.map((r) => {
        const status = statuses[r.id];
        const canAct = status === "Pending Review" || status === "Under Review";
        return (
          <Card key={r.id} style={{ padding: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${r.avatarColor[0]}, ${r.avatarColor[0]})`,
                  border: `1.5px solid ${r.avatarColor[1]}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: r.avatarColor[1],
                }}
              >
                {r.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}
                >
                  {r.name}
                </div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{r.rep}</div>
              </div>
              <StatusPill status={status} />
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "#F1F5F9",
                  color: "#475569",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 9px",
                  borderRadius: 99,
                }}
              >
                {r.barangay}
              </span>
              <span
                style={{
                  background: "#F8FAFC",
                  color: "#64748B",
                  fontSize: 11,
                  padding: "2px 9px",
                  borderRadius: 99,
                  border: "1px solid #E2E8F0",
                  fontFamily: "monospace",
                }}
              >
                {r.permit}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                onClick={() => onView(r)}
                style={mobileActionStyle("#fff", "#475569", "#E2E8F0")}
              >
                <IconEye size={13} /> View Documents
              </button>
              {canAct && (
                <button
                  onClick={() => onApprove(r.id)}
                  style={mobileActionStyle("#16A34A", "#fff", "#16A34A")}
                >
                  <IconCheck size={12} /> Approve & Verify
                </button>
              )}
              {canAct && (
                <button
                  onClick={() => onReject(r.id)}
                  style={mobileActionStyle("#DC2626", "#fff", "#DC2626")}
                >
                  <IconX size={12} /> Reject Application
                </button>
              )}
            </div>
          </Card>
        );
      })}
      {records.length === 0 && (
        <EmptyState message="No enterprises match your current filters." />
      )}
    </div>
  );
}

// ─── Shared small components ──────────────────────────────────────────────────

function ActionBtn({
  variant,
  onClick,
  children,
}: {
  variant: "outline" | "success" | "danger";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const cfg = {
    outline: {
      bg: "#fff",
      color: "#475569",
      border: "#E2E8F0",
      hoverBg: "#F8FAFC",
    },
    success: {
      bg: "#16A34A",
      color: "#fff",
      border: "#16A34A",
      hoverBg: "#15803D",
    },
    danger: {
      bg: "#DC2626",
      color: "#fff",
      border: "#DC2626",
      hoverBg: "#B91C1C",
    },
  }[variant];

  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "5px 10px",
        borderRadius: 6,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        whiteSpace: "nowrap",
        transition: "background 0.12s",
        lineHeight: 1.4,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = cfg.hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = cfg.bg)}
    >
      {children}
    </button>
  );
}

function mobileActionStyle(
  bg: string,
  color: string,
  border: string,
): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    padding: "9px 14px",
    borderRadius: 8,
    background: bg,
    color,
    border: `1.5px solid ${border}`,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    transition: "opacity 0.12s",
  };
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "#F1F5F9",
          margin: "0 auto 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94A3B8",
        }}
      >
        <IconShield size={24} />
      </div>
      <p style={{ margin: 0, fontSize: 14, color: "#94A3B8", fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}

// ─── Developer Profile Page (Screen 1) ────────────────────────────────────────

const devNavItems = [
  { icon: IconDashboard, label: "Dashboard", id: "dashboard" },
  { icon: IconMarket, label: "Marketplace", id: "marketplace" },
  { icon: IconBids, label: "Bids", id: "bids" },
  { icon: IconMessages, label: "Messages", id: "messages" },
  { icon: IconSettings, label: "Settings", id: "settings" },
];

function DevSidebar({
  active,
  onNav,
  collapsed,
}: {
  active: string;
  onNav: (id: string) => void;
  collapsed: boolean;
}) {
  const profile = useDevProfile();
  return (
    <aside
      style={{
        width: collapsed ? 72 : 260,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: collapsed ? "auto" : 0,
            marginRight: collapsed ? "auto" : 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 14L7 6l3 5 3-7 2 3"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              StartupMatch
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
              Tagum City
            </div>
          </div>
        )}
      </div>
      <nav style={{ padding: "12px 0", flex: 1 }}>
        {devNavItems.map(({ icon: Icon, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "10px 0" : "10px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                border: "none",
                background: isActive ? "#EFF6FF" : "transparent",
                color: isActive ? "#2563EB" : "#475569",
                borderLeft: isActive
                  ? "3px solid #2563EB"
                  : "3px solid transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.15s ease",
                borderRadius: collapsed ? 0 : "0 8px 8px 0",
                marginRight: collapsed ? 0 : 12,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              <Icon size={20} />
              {!collapsed && label}
            </button>
          );
        })}
      </nav>
      {!collapsed && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                flexShrink: 0,
                background: `linear-gradient(135deg, ${profile.avatarColors[0]}, ${profile.avatarColors[1]})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {profile.initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                {profile.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: profile.availability ? "#16A34A" : "#64748B",
                  fontWeight: 600,
                }}
              >
                {profile.availability ? "● Open to Work" : "● Not Open to Work"}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function DevStatusPill({ status }: { status: string }) {
  const cfg =
    status === "Completed"
      ? { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" }
      : status === "Active"
        ? { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" }
        : { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 99,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.color,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

function DevSkillTag({
  label,
  muted = false,
}: {
  label: string;
  muted?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: muted ? "3px 10px" : "4px 12px",
        borderRadius: 99,
        background: muted ? "#F8FAFC" : "#F1F5F9",
        border: `1px solid ${muted ? "#E2E8F0" : "#CBD5E1"}`,
        fontSize: muted ? 12 : 13,
        fontWeight: 500,
        color: muted ? "#64748B" : "#334155",
      }}
    >
      {label}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} filled={i <= rating} />
      ))}
    </span>
  );
}

function DeveloperProfile({
  isMobile,
  isTablet,
}: {
  isMobile: boolean;
  isTablet: boolean;
}) {
  const p = useDevProfile();
  const verified = p.verificationStatus === "Verified";
  const linkIcons: Record<string, React.ReactNode> = {
    github: <IconGithub size={18} />,
    linkedin: <IconLinkedin size={18} />,
    globe: <IconGlobe size={18} />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          fontSize: 12,
          color: "#94A3B8",
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        <span style={{ color: "#2563EB", fontWeight: 500, cursor: "pointer" }}>
          Dashboard
        </span>
        <span>›</span>
        <span>Developer Profile</span>
      </div>

      {/* Header card */}
      <Card style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "flex-start",
            gap: isMobile ? 16 : 20,
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${p.avatarColors[0]} 0%, ${p.avatarColors[1]} 60%, ${p.avatarColors[0]} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
                border: "3px solid #fff",
                boxShadow: "0 0 0 2px #E2E8F0",
              }}
            >
              {p.initials}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: verified ? "#16A34A" : "#D97706",
                border: "2.5px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconCheck size={11} />
            </div>
          </div>
          <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : "flex-start",
                marginBottom: 4,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#0F172A",
                  letterSpacing: "-0.03em",
                }}
              >
                {p.name}
              </h1>
              {verified ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 10px",
                    borderRadius: 99,
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    color: "#16A34A",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  <IconCheck size={10} /> PSITS VERIFIED
                </span>
              ) : (
                <StatusPill status={p.verificationStatus} />
              )}
              <button
                onClick={() => setAvailability(!p.availability)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 99,
                  cursor: "pointer",
                  background: p.availability ? "#F0FDF4" : "#F1F5F9",
                  border: `1px solid ${p.availability ? "#BBF7D0" : "#E2E8F0"}`,
                  color: p.availability ? "#16A34A" : "#64748B",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: p.availability ? "#16A34A" : "#94A3B8",
                  }}
                />
                {p.availability ? "Open to Work" : "Not Open to Work"}
              </button>
            </div>
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 14,
                color: "#64748B",
                fontWeight: 500,
              }}
            >
              {p.title} — {p.school}
            </p>
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              {[
                {
                  value: String(p.stats.projectsCompleted),
                  label: "Projects Completed",
                },
                { value: p.stats.peerScore, label: "Peer Validation Score" },
                { value: p.stats.responseRate, label: "Response Rate" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{ textAlign: isMobile ? "center" : "left" }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#0F172A",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748B",
                      fontWeight: 500,
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexShrink: 0,
              flexDirection: isMobile ? "row" : "column",
            }}
          >
            <button
              style={{
                background: "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Contact Developer
            </button>
            <button
              style={{
                background: "transparent",
                color: "#2563EB",
                border: "1.5px solid #2563EB",
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View Portfolio
            </button>
          </div>
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
        }}
      >
        <Card style={{ padding: 24 }}>
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Technical Proficiencies
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {p.skills.map((s) => (
              <DevSkillTag key={s} label={s} />
            ))}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 8,
            }}
          >
            Frameworks & Tools
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {p.tools.map((t) => (
              <DevSkillTag key={t} label={t} muted />
            ))}
          </div>
        </Card>
        <Card style={{ padding: 24 }}>
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Links & Repositories
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {p.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  color: "#334155",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ color: "#64748B", flexShrink: 0 }}>
                  {linkIcons[link.icon]}
                </span>
                <span style={{ flex: 1 }}>{link.label}</span>
                <IconExternal size={13} />
              </a>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Project Fulfillment History
          </h2>
          <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
            {p.projects.length} projects
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Project Name", "Client", "Completed", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 24px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#94A3B8",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderBottom: "1px solid #E2E8F0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {p.projects.map((proj, i) => (
                <tr
                  key={proj.id}
                  style={{
                    borderBottom:
                      i < p.projects.length - 1 ? "1px solid #F1F5F9" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#FAFCFF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "14px 24px",
                      fontWeight: 600,
                      color: "#0F172A",
                    }}
                  >
                    {proj.name}
                  </td>
                  <td style={{ padding: "14px 24px", color: "#475569" }}>
                    {proj.client}
                  </td>
                  <td
                    style={{
                      padding: "14px 24px",
                      color: "#64748B",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {proj.date}
                  </td>
                  <td style={{ padding: "14px 24px" }}>
                    <DevStatusPill status={proj.status} />
                  </td>
                  <td style={{ padding: "14px 24px" }}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      style={{
                        color: "#2563EB",
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: 16,
            fontWeight: 700,
            color: "#0F172A",
          }}
        >
          Peer Validation
        </h2>
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {p.stats.peerScore}
            </div>
            <Stars rating={5} />
            <div
              style={{
                fontSize: 12,
                color: "#64748B",
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              from 23 reviews
            </div>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 200,
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            {[
              { label: "5", pct: 70, count: 16 },
              { label: "4", pct: 22, count: 5 },
              { label: "3", pct: 4, count: 1 },
              { label: "2", pct: 4, count: 1 },
              { label: "1", pct: 0, count: 0 },
            ].map((row) => (
              <div
                key={row.label}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748B",
                    width: 10,
                    textAlign: "right",
                    fontWeight: 600,
                  }}
                >
                  {row.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "#F1F5F9",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${row.pct}%`,
                      height: "100%",
                      background: "#F59E0B",
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    width: 14,
                    fontWeight: 500,
                  }}
                >
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {p.reviews.map((r) => (
            <div
              key={r.id}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 6,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}
                  >
                    {r.role}
                  </div>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.55,
                }}
              >
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div
        style={{
          textAlign: "center",
          padding: "8px 0 24px",
          fontSize: 12,
          color: "#CBD5E1",
        }}
      >
        StartupMatch · Tagum City Developer Platform · © 2025
      </div>
    </div>
  );
}

// ─── Developer Marketplace & Bids ─────────────────────────────────────────────

function MarketplaceFeed({ isMobile }: { isMobile: boolean }) {
  const [placed, setPlaced] = useState<Record<string, boolean>>({});
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 4,
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 6px",
              fontSize: 24,
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.03em",
            }}
          >
            Project Marketplace
          </h1>
          <p style={{ margin: 0, fontSize: 13.5, color: "#64748B" }}>
            Verified projects posted by local MSMEs. Place a structured bid to
            get started.
          </p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 13px",
            borderRadius: 99,
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            color: "#2563EB",
            fontSize: 12.5,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#2563EB",
            }}
          />
          {MARKETPLACE_PROJECTS.length} Open Projects
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16,
        }}
      >
        {MARKETPLACE_PROJECTS.map((project) => (
          <Card
            key={project.id}
            style={{
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0F172A",
                  letterSpacing: "-0.01em",
                }}
              >
                {project.title}
              </div>
              <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 3 }}>
                <span style={{ fontWeight: 600, color: "#334155" }}>
                  {project.business}
                </span>{" "}
                · {project.barangay}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {project.tags.map((t) => (
                <SkillTag key={t} label={t} />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
                paddingTop: 12,
                borderTop: "1px solid #F1F5F9",
              }}
            >
              {[
                { label: "Budget", value: project.budget },
                { label: "Deadline", value: project.deadline },
                { label: "Phases", value: String(project.phases) },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0F172A",
                      marginTop: 3,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                placeBid(project.id);
                setPlaced((s) => ({ ...s, [project.id]: true }));
              }}
              disabled={placed[project.id]}
              style={{
                marginTop: "auto",
                height: 40,
                borderRadius: 8,
                cursor: placed[project.id] ? "default" : "pointer",
                background: placed[project.id] ? "#F0FDF4" : "#2563EB",
                color: placed[project.id] ? "#16A34A" : "#fff",
                border: placed[project.id] ? "1px solid #BBF7D0" : "none",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {placed[project.id] ? (
                <>
                  <IconCheck size={12} /> Bid Placed
                </>
              ) : (
                <>
                  Place Bid <IconChevron size={14} dir="right" />
                </>
              )}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BidsView() {
  const bids = useDevBids();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 24,
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: "-0.03em",
          }}
        >
          My Bids
        </h1>
        <p style={{ margin: 0, fontSize: 13.5, color: "#64748B" }}>
          Track the status of proposals you have placed on marketplace projects.
        </p>
      </div>
      {bids.length === 0 ? (
        <Card>
          <EmptyState message="You have not placed any bids yet. Browse the marketplace to get started." />
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Project", "Client", "Bid Amount", "Placed", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 20px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#94A3B8",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          borderBottom: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, i) => (
                  <tr
                    key={bid.id}
                    style={{
                      borderBottom:
                        i < bids.length - 1 ? "1px solid #F1F5F9" : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FAFCFF")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        fontWeight: 600,
                        color: "#0F172A",
                      }}
                    >
                      {bid.project}
                    </td>
                    <td style={{ padding: "14px 20px", color: "#475569" }}>
                      {bid.client}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        fontWeight: 700,
                        color: "#0F172A",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {bid.amount}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: "#64748B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {bid.placedAt}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <StatusPill status={bid.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function DevStub({ title, message }: { title: string; message: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 24,
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        <p style={{ margin: 0, fontSize: 13.5, color: "#64748B" }}>{message}</p>
      </div>
      <Card>
        <EmptyState message={`${title} is coming in a future iteration.`} />
      </Card>
    </div>
  );
}

// ─── Sprint Dashboard ──────────────────────────────────────────────────────────

const sprintNavItems = [
  { icon: IconDashboard, label: "Dashboard", id: "dashboard" },
  { icon: IconChart, label: "Sprint Dashboard", id: "sprint" },
  { icon: IconBids, label: "Bids", id: "bids" },
  { icon: IconMessages, label: "Messages", id: "messages" },
  { icon: IconSettings, label: "Settings", id: "settings" },
];

const stakeholders = [
  {
    name: "Ernesto Dela Vega",
    role: "Client — Apokon Hardware",
    avatar: "ED",
    status: "active",
    lastSeen: "Active now",
  },
  {
    name: "Marco Ramirez",
    role: "Lead Developer",
    avatar: "MR",
    status: "active",
    lastSeen: "Active now",
  },
  {
    name: "Juanita Arceo",
    role: "Platform Admin",
    avatar: "JA",
    status: "away",
    lastSeen: "Last seen 2 hrs ago",
  },
  {
    name: "Tricia Anne Lim",
    role: "Co-developer",
    avatar: "TL",
    status: "active",
    lastSeen: "Active now",
  },
  {
    name: "Rodel Santos",
    role: "PSITS Chapter Advisor",
    avatar: "RS",
    status: "offline",
    lastSeen: "Last seen Jul 30",
  },
];

const notifColor = { warning: "#D97706", success: "#16A34A", info: "#2563EB" };
const notifBg = { warning: "#FFFBEB", success: "#F0FDF4", info: "#EFF6FF" };
const notifBorder = { warning: "#FDE68A", success: "#BBF7D0", info: "#BFDBFE" };
const notifIcon = { warning: "⚠️", success: "✅", info: "💬" };

function SprintSidebar({
  active,
  onNav,
  collapsed,
}: {
  active: string;
  onNav: (id: string) => void;
  collapsed: boolean;
}) {
  const project = useProjectStore();
  const profile = useDevProfile();
  return (
    <aside
      style={{
        width: collapsed ? 72 : 260,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: collapsed ? "auto" : 0,
            marginRight: collapsed ? "auto" : 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 14L7 6l3 5 3-7 2 3"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              StartupMatch
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
              Developer Portal
            </div>
          </div>
        )}
      </div>

      {/* Active project chip */}
      {!collapsed && (
        <div
          style={{
            margin: "12px 16px 4px",
            padding: "10px 12px",
            background: "#F0F7FF",
            border: "1px solid #BFDBFE",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#2563EB",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 3,
            }}
          >
            Active Project
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#0F172A",
              lineHeight: 1.3,
            }}
          >
            {project.project}
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
            {project.client}
          </div>
        </div>
      )}

      <nav style={{ padding: "8px 0", flex: 1 }}>
        {sprintNavItems.map(({ icon: Icon, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "10px 0" : "10px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                border: "none",
                background: isActive ? "#EFF6FF" : "transparent",
                color: isActive ? "#2563EB" : "#475569",
                borderLeft: isActive
                  ? "3px solid #2563EB"
                  : "3px solid transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.12s ease",
                borderRadius: collapsed ? 0 : "0 8px 8px 0",
                marginRight: collapsed ? 0 : 12,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              <Icon size={19} />
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={{ padding: "14px 18px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                flexShrink: 0,
                background: `linear-gradient(135deg, ${profile.avatarColors[0]}, ${profile.avatarColors[0]})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: profile.avatarColors[1],
              }}
            >
              {profile.initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                {profile.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#16A34A",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#16A34A",
                    display: "inline-block",
                  }}
                />
                Active Sprint
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function SprintDashboard({
  isMobile,
  isTablet,
}: {
  isMobile: boolean;
  isTablet: boolean;
}) {
  const project = useProjectStore();
  const profile = useDevProfile();
  const [expandedPhase, setExpandedPhase] = useState<number | null>(2);
  const [taskInput, setTaskInput] = useState<Record<number, string>>({});
  const [commentInput, setCommentInput] = useState<Record<number, string>>({});
  const stacked = isMobile || isTablet;

  const phases = project.phases;
  const completedPhases = phases.filter((p) => p.status === "completed").length;
  const pct = Math.round((completedPhases / project.totalPhases) * 100);

  const phaseStatusCfg: Record<
    SprintPhaseStatus,
    { bg: string; color: string; border: string; label: string }
  > = {
    completed: {
      bg: "#F0FDF4",
      color: "#16A34A",
      border: "#BBF7D0",
      label: "Completed",
    },
    active: {
      bg: "#EFF6FF",
      color: "#2563EB",
      border: "#BFDBFE",
      label: "Active Sprint",
    },
    in_review: {
      bg: "#EFF6FF",
      color: "#2563EB",
      border: "#93C5FD",
      label: "Under Review",
    },
    disputed: {
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      label: "Needs Revision",
    },
    revision: {
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      label: "Needs Revision",
    },
    upcoming: {
      bg: "#F8FAFC",
      color: "#94A3B8",
      border: "#E2E8F0",
      label: "Upcoming",
    },
  };

  const velocity = {
    completed: phases.filter((p) => p.status === "completed").length,
    inReview: phases.filter(
      (p) => p.status === "in_review" || p.status === "revision",
    ).length,
    onTrack: phases.filter((p) => p.status === "active").length,
    atRisk: phases.filter((p) => p.status === "disputed").length,
  };

  const dueLabel = (daysLeft: number, status: SprintPhaseStatus) => {
    if (status === "completed") return "✅ Delivered";
    if (daysLeft < 0) return `Overdue by ${Math.abs(daysLeft)}d`;
    return `Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
  };

  const postComment = (number: number) => {
    const text = (commentInput[number] ?? "").trim();
    if (!text) return;
    addComment(number, text, "developer");
    setCommentInput((s) => ({ ...s, [number]: "" }));
  };

  const addPhaseTask = (number: number) => {
    const label = (taskInput[number] ?? "").trim();
    if (!label) return;
    addTask(number, label);
    setTaskInput((s) => ({ ...s, [number]: "" }));
  };

  const burndownData = phases.map((p) => {
    const done = p.tasks.filter((t) => t.done).length;
    return { name: `S${p.number}`, done, remaining: p.tasks.length - done };
  });

  const paidPhases = phases.filter((p) => p.status === "completed");
  const paidPct = Math.round((project.paidToDate / project.totalBudget) * 100);
  const unreadNotifs = project.notifications.filter((n) => !n.read);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      {/* ── LEFT COLUMN ─────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: stacked ? "unset" : "0 0 calc(66.67% - 10px)",
          width: stacked ? "100%" : undefined,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Project Header Card */}
        <Card style={{ padding: 24 }}>
          {/* Top row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 5,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0F172A",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {project.project}
                </h2>
                {/* In Progress pill */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 11px",
                    borderRadius: 99,
                    background: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    color: "#2563EB",
                    fontSize: 11.5,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#2563EB",
                      animation: "none",
                    }}
                  />
                  In Progress
                </span>
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z"
                    stroke="#94A3B8"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M7 4v3l2 2"
                    stroke="#94A3B8"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                Client:{" "}
                <span style={{ fontWeight: 600, color: "#334155" }}>
                  {project.client}
                </span>
                <span style={{ color: "#CBD5E1" }}>·</span>
                <span>
                  Due{" "}
                  <span
                    style={{
                      fontWeight: 600,
                      color: project.daysLeft < 7 ? "#DC2626" : "#334155",
                    }}
                  >
                    {project.deadline}
                  </span>
                </span>
              </div>
            </div>
            {/* Stat chips */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px 16px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#0F172A",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {completedPhases}/{project.totalPhases}
                </div>
                <div
                  style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}
                >
                  Phases Done
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px 16px",
                  background: project.daysLeft < 7 ? "#FEF2F2" : "#F8FAFC",
                  border: `1px solid ${project.daysLeft < 7 ? "#FECACA" : "#E2E8F0"}`,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: project.daysLeft < 7 ? "#DC2626" : "#0F172A",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {project.daysLeft}d
                </div>
                <div
                  style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}
                >
                  Days Left
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                Phase {completedPhases} of {project.totalPhases} Completed
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#2563EB",
                  letterSpacing: "-0.02em",
                }}
              >
                {pct}%
              </span>
            </div>
            <div
              style={{
                height: 10,
                background: "#F1F5F9",
                borderRadius: 99,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)",
                  borderRadius: 99,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            {/* Phase tick marks */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              {phases.map((p) => (
                <span
                  key={p.number}
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: p.status === "completed" ? "#2563EB" : "#CBD5E1",
                  }}
                >
                  S{p.number}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Milestone Accordion */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "18px 24px 14px",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              Sprint Milestones
            </h2>
            <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
              {phases.length} phases · Agile
            </span>
          </div>

          <div>
            {phases.map((phase, idx) => {
              const cfg = phaseStatusCfg[phase.status];
              const isExpanded = expandedPhase === phase.number;
              const isActive = phase.status === "active";
              const isCompleted = phase.status === "completed";
              const isRevision =
                phase.status === "disputed" || phase.status === "revision";
              const isInReview = phase.status === "in_review";
              const isLast = idx === phases.length - 1;
              const doneCount = phase.tasks.filter((t) => t.done).length;
              const hasRepo = phase.dev.repoLink.trim().length > 0;

              return (
                <div
                  key={phase.number}
                  style={{
                    borderBottom: isLast ? "none" : "1px solid #F1F5F9",
                  }}
                >
                  {/* Accordion header */}
                  <button
                    onClick={() =>
                      setExpandedPhase(isExpanded ? null : phase.number)
                    }
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 24px",
                      background: isExpanded ? "#FAFCFF" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.12s",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#FAFCFF";
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                    }}
                  >
                    {/* Phase number circle */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: isCompleted
                          ? "#F0FDF4"
                          : isActive || isInReview
                            ? "#EFF6FF"
                            : isRevision
                              ? "#FEF2F2"
                              : "#F8FAFC",
                        border: `1.5px solid ${isCompleted ? "#BBF7D0" : isActive || isInReview ? "#BFDBFE" : isRevision ? "#FECACA" : "#E2E8F0"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isCompleted
                          ? "#16A34A"
                          : isActive || isInReview
                            ? "#2563EB"
                            : isRevision
                              ? "#DC2626"
                              : "#CBD5E1",
                      }}
                    >
                      {isCompleted ? (
                        <IconCheck size={14} />
                      ) : isRevision ? (
                        <span style={{ fontSize: 12 }}>⚠️</span>
                      ) : (
                        <span style={{ fontSize: 13, fontWeight: 700 }}>
                          {phase.number}
                        </span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color:
                              phase.status === "upcoming"
                                ? "#94A3B8"
                                : "#0F172A",
                          }}
                        >
                          Sprint {phase.number}: {phase.dev.title}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 8px",
                            borderRadius: 99,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            color: cfg.color,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {cfg.label}
                        </span>
                        {isActive && phase.dev.daysLeft <= 5 && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#DC2626",
                              background: "#FEF2F2",
                              border: "1px solid #FECACA",
                              padding: "2px 8px",
                              borderRadius: 99,
                            }}
                          >
                            Due in {phase.dev.daysLeft}d
                          </span>
                        )}
                        {isRevision && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#D97706",
                              background: "#FFFBEB",
                              border: "1px solid #FDE68A",
                              padding: "2px 8px",
                              borderRadius: 99,
                            }}
                          >
                            Revisions needed
                          </span>
                        )}
                        {phase.tasks.length > 0 && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#64748B",
                              background: "#F8FAFC",
                              border: "1px solid #E2E8F0",
                              padding: "2px 8px",
                              borderRadius: 99,
                            }}
                          >
                            {doneCount}/{phase.tasks.length} tasks
                          </span>
                        )}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}
                      >
                        {isCompleted
                          ? `Approved ${phase.approvedAt}`
                          : `Deadline: ${phase.dev.deadline}`}
                      </div>
                    </div>

                    <div style={{ color: "#94A3B8", flexShrink: 0 }}>
                      <IconChevron size={16} dir={isExpanded ? "up" : "down"} />
                    </div>
                  </button>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 24px 24px",
                        borderTop: "1px solid #F1F5F9",
                        background: "#FAFCFF",
                      }}
                    >
                      <div
                        style={{
                          paddingTop: 20,
                          display: "flex",
                          flexDirection: "column",
                          gap: 16,
                        }}
                      >
                        {/* Milestone description */}
                        <div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#94A3B8",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              marginBottom: 6,
                            }}
                          >
                            Milestone Target
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13.5,
                              color: "#334155",
                              lineHeight: 1.6,
                              background: "#fff",
                              border: "1px solid #E2E8F0",
                              borderRadius: 8,
                              padding: "12px 14px",
                            }}
                          >
                            {phase.dev.description}
                          </p>
                        </div>

                        {/* Deadline + countdown */}
                        <div
                          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                        >
                          <div
                            style={{
                              flex: 1,
                              minWidth: 160,
                              background: "#fff",
                              border: "1px solid #E2E8F0",
                              borderRadius: 8,
                              padding: "12px 14px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                marginBottom: 4,
                              }}
                            >
                              Deadline
                            </div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#0F172A",
                              }}
                            >
                              {phase.dev.deadline}
                            </div>
                          </div>
                          <div
                            style={{
                              flex: 1,
                              minWidth: 160,
                              borderRadius: 8,
                              padding: "12px 14px",
                              background:
                                (isActive || isInReview || isRevision) &&
                                phase.dev.daysLeft <= 3
                                  ? "#FEF2F2"
                                  : "#fff",
                              border: `1px solid ${(isActive || isInReview || isRevision) && phase.dev.daysLeft <= 3 ? "#FECACA" : "#E2E8F0"}`,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                marginBottom: 4,
                              }}
                            >
                              Countdown
                            </div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color:
                                  (isActive || isInReview || isRevision) &&
                                  phase.dev.daysLeft <= 3
                                    ? "#DC2626"
                                    : "#0F172A",
                              }}
                            >
                              {dueLabel(phase.dev.daysLeft, phase.status)}
                            </div>
                          </div>
                        </div>

                        {/* Needs revision banner */}
                        {isRevision && (
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "flex-start",
                              padding: "12px 14px",
                              background: "#FFFBEB",
                              border: "1.5px solid #FDE68A",
                              borderRadius: 10,
                            }}
                          >
                            <span style={{ fontSize: 16, flexShrink: 0 }}>
                              ⚠️
                            </span>
                            <div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#B45309",
                                  marginBottom: 3,
                                }}
                              >
                                Client requested revisions
                              </div>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12.5,
                                  color: "#92400E",
                                  lineHeight: 1.55,
                                }}
                              >
                                {phase.revisionReason ||
                                  "The client flagged this milestone and requested changes before approval. Review the feedback, update the deliverable, then resubmit."}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Repo link */}
                        <div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#94A3B8",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              marginBottom: 6,
                            }}
                          >
                            Deliverable Repository Link
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <div style={{ position: "relative", flex: 1 }}>
                              <span
                                style={{
                                  position: "absolute",
                                  left: 11,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "#94A3B8",
                                  lineHeight: 0,
                                }}
                              >
                                <IconGithub size={15} />
                              </span>
                              <input
                                type="url"
                                placeholder="https://github.com/your-repo/branch-or-tag"
                                value={phase.dev.repoLink}
                                readOnly={isCompleted || isInReview}
                                onChange={(e) =>
                                  updateRepoLink(phase.number, e.target.value)
                                }
                                style={{
                                  width: "100%",
                                  padding: "9px 12px 9px 34px",
                                  border: "1px solid #E2E8F0",
                                  borderRadius: 8,
                                  fontFamily: "monospace",
                                  fontSize: 12.5,
                                  color: "#334155",
                                  outline: "none",
                                  background: isCompleted ? "#F8FAFC" : "#fff",
                                  boxSizing: "border-box",
                                }}
                                onFocus={(e) => {
                                  if (!isCompleted && !isInReview)
                                    e.currentTarget.style.borderColor =
                                      "#2563EB";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "#E2E8F0";
                                }}
                              />
                            </div>
                            {(isCompleted || isInReview) &&
                              phase.dev.repoLink && (
                                <a
                                  href={phase.dev.repoLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    padding: "9px 12px",
                                    background: "#F8FAFC",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    color: "#2563EB",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  View <IconExternal size={11} />
                                </a>
                              )}
                          </div>
                        </div>

                        {/* Prototype / demo URL */}
                        {isActive && (
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                marginBottom: 6,
                              }}
                            >
                              Live Preview / Demo URL (optional)
                            </div>
                            <input
                              type="url"
                              placeholder="https://staging.example.com"
                              value={phase.dev.prototypeLink ?? ""}
                              onChange={(e) =>
                                updatePrototypeLink(
                                  phase.number,
                                  e.target.value,
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "9px 12px",
                                boxSizing: "border-box",
                                border: "1px solid #E2E8F0",
                                borderRadius: 8,
                                fontFamily: "monospace",
                                fontSize: 12.5,
                                color: "#334155",
                                outline: "none",
                              }}
                              onFocus={(e) =>
                                (e.currentTarget.style.borderColor = "#2563EB")
                              }
                              onBlur={(e) =>
                                (e.currentTarget.style.borderColor = "#E2E8F0")
                              }
                            />
                          </div>
                        )}

                        {/* Progress notes */}
                        {!isCompleted && (
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                marginBottom: 6,
                              }}
                            >
                              Current Sprint Progress Update
                            </div>
                            <textarea
                              placeholder="Describe what has been completed so far, blockers, and what's remaining before submission…"
                              value={phase.dev.updates}
                              readOnly={isInReview}
                              onChange={(e) =>
                                updateNotes(phase.number, e.target.value)
                              }
                              style={{
                                width: "100%",
                                minHeight: 96,
                                padding: "10px 12px",
                                border: "1px solid #E2E8F0",
                                borderRadius: 8,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 13,
                                color: "#334155",
                                resize: "vertical",
                                outline: "none",
                                background: isInReview ? "#F8FAFC" : "#fff",
                                boxSizing: "border-box",
                                lineHeight: 1.55,
                              }}
                              onFocus={(e) => {
                                if (!isInReview)
                                  e.currentTarget.style.borderColor = "#2563EB";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#E2E8F0";
                              }}
                            />
                          </div>
                        )}

                        {/* Completed notes read-only */}
                        {isCompleted && (
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                marginBottom: 6,
                              }}
                            >
                              Completion Notes
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 13,
                                color: "#475569",
                                lineHeight: 1.6,
                                background: "#fff",
                                border: "1px solid #E2E8F0",
                                borderRadius: 8,
                                padding: "12px 14px",
                              }}
                            >
                              {phase.dev.updates}
                            </p>
                            {phase.score != null && (
                              <div
                                style={{
                                  marginTop: 8,
                                  fontSize: 12,
                                  color: "#16A34A",
                                  fontWeight: 700,
                                }}
                              >
                                Client phase score: {phase.score}/5
                              </div>
                            )}
                          </div>
                        )}

                        {/* Task checklist */}
                        {(isActive ||
                          isRevision ||
                          isInReview ||
                          isCompleted) && (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 8,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#94A3B8",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.07em",
                                }}
                              >
                                Milestone Task Checklist
                              </span>
                              <span
                                style={{
                                  fontSize: 11.5,
                                  fontWeight: 700,
                                  color: "#2563EB",
                                }}
                              >
                                {doneCount}/{phase.tasks.length} done
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                              }}
                            >
                              {phase.tasks.map((t) => (
                                <button
                                  key={t.id}
                                  onClick={() =>
                                    completeTask(phase.number, t.id)
                                  }
                                  disabled={isCompleted}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "8px 12px",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    background: t.done ? "#F0FDF4" : "#fff",
                                    cursor: isCompleted ? "default" : "pointer",
                                    textAlign: "left",
                                    fontFamily: "Inter, sans-serif",
                                    transition: "background 0.1s",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isCompleted)
                                      (
                                        e.currentTarget as HTMLButtonElement
                                      ).style.background = t.done
                                        ? "#F0FDF4"
                                        : "#F8FAFC";
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isCompleted)
                                      (
                                        e.currentTarget as HTMLButtonElement
                                      ).style.background = t.done
                                        ? "#F0FDF4"
                                        : "#fff";
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: 4,
                                      flexShrink: 0,
                                      background: t.done ? "#16A34A" : "#fff",
                                      border: `1.5px solid ${t.done ? "#16A34A" : "#CBD5E1"}`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#fff",
                                    }}
                                  >
                                    {t.done && <IconCheck size={9} />}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 13,
                                      color: t.done ? "#16A34A" : "#334155",
                                      fontWeight: t.done ? 600 : 500,
                                      textDecoration: t.done
                                        ? "line-through"
                                        : "none",
                                    }}
                                  >
                                    {t.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                            {!isCompleted && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  marginTop: 8,
                                }}
                              >
                                <input
                                  value={taskInput[phase.number] ?? ""}
                                  onChange={(e) =>
                                    setTaskInput((s) => ({
                                      ...s,
                                      [phase.number]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addPhaseTask(phase.number);
                                    }
                                  }}
                                  placeholder="Add a task…"
                                  style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 12.5,
                                    outline: "none",
                                  }}
                                  onFocus={(e) =>
                                    (e.currentTarget.style.borderColor =
                                      "#2563EB")
                                  }
                                  onBlur={(e) =>
                                    (e.currentTarget.style.borderColor =
                                      "#E2E8F0")
                                  }
                                />
                                <button
                                  onClick={() => addPhaseTask(phase.number)}
                                  style={{
                                    padding: "8px 14px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#EFF6FF",
                                    color: "#2563EB",
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                  }}
                                >
                                  Add
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Comment thread */}
                        {phase.status !== "upcoming" && (
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                marginBottom: 8,
                              }}
                            >
                              Discussion
                            </div>
                            {phase.comments.length === 0 && (
                              <p
                                style={{
                                  margin: "0 0 8px",
                                  fontSize: 12.5,
                                  color: "#94A3B8",
                                }}
                              >
                                No comments yet. Start the conversation.
                              </p>
                            )}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                              }}
                            >
                              {phase.comments.map((c) => (
                                <div
                                  key={c.id}
                                  style={{
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 26,
                                      height: 26,
                                      borderRadius: "50%",
                                      flexShrink: 0,
                                      background: `linear-gradient(135deg, ${c.avatarBg[0]}, ${c.avatarBg[0]})`,
                                      border: `1.5px solid ${c.avatarBg[1]}30`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 9,
                                      fontWeight: 700,
                                      color: c.avatarBg[1],
                                    }}
                                  >
                                    {c.avatar}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 6,
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 700,
                                          color: "#334155",
                                        }}
                                      >
                                        {c.author}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 10.5,
                                          color: "#94A3B8",
                                        }}
                                      >
                                        {c.role} · {c.time}
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        marginTop: 2,
                                        padding: "8px 11px",
                                        borderRadius: "4px 12px 12px 12px",
                                        background: "#F8FAFC",
                                        border: "1px solid #E2E8F0",
                                        fontSize: 12.5,
                                        color: "#334155",
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      {c.text}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {!isCompleted && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  marginTop: 10,
                                }}
                              >
                                <input
                                  value={commentInput[phase.number] ?? ""}
                                  onChange={(e) =>
                                    setCommentInput((s) => ({
                                      ...s,
                                      [phase.number]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      postComment(phase.number);
                                    }
                                  }}
                                  placeholder={`Comment as ${profile.name}…`}
                                  style={{
                                    flex: 1,
                                    padding: "9px 12px",
                                    border: "1.5px solid #E2E8F0",
                                    borderRadius: 8,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 12.5,
                                    outline: "none",
                                  }}
                                  onFocus={(e) =>
                                    (e.currentTarget.style.borderColor =
                                      "#2563EB")
                                  }
                                  onBlur={(e) =>
                                    (e.currentTarget.style.borderColor =
                                      "#E2E8F0")
                                  }
                                />
                                <button
                                  onClick={() => postComment(phase.number)}
                                  style={{
                                    padding: "9px 16px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: (
                                      commentInput[phase.number] ?? ""
                                    ).trim()
                                      ? "#2563EB"
                                      : "#F1F5F9",
                                    color: (
                                      commentInput[phase.number] ?? ""
                                    ).trim()
                                      ? "#fff"
                                      : "#94A3B8",
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                  }}
                                >
                                  Post
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Submit / status area */}
                        {isActive && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                              paddingTop: 4,
                            }}
                          >
                            {phase.tasks.length > 0 && doneCount === 0 && (
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  color: "#D97706",
                                }}
                              >
                                Tip: complete at least one task in the checklist
                                before submitting.
                              </p>
                            )}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                onClick={() => {
                                  if (hasRepo)
                                    submitPhase(
                                      phase.number,
                                      phase.dev.repoLink,
                                      phase.dev.updates,
                                    );
                                }}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "10px 22px",
                                  borderRadius: 8,
                                  background: hasRepo ? "#2563EB" : "#94A3B8",
                                  color: "#fff",
                                  border: "none",
                                  fontSize: 13.5,
                                  fontWeight: 700,
                                  cursor: hasRepo ? "pointer" : "not-allowed",
                                  fontFamily: "Inter, sans-serif",
                                  transition: "background 0.15s",
                                  boxShadow: hasRepo
                                    ? "0 2px 8px rgba(37,99,235,0.3)"
                                    : "none",
                                }}
                                onMouseEnter={(e) => {
                                  if (hasRepo)
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.background = "#1D4ED8";
                                }}
                                onMouseLeave={(e) => {
                                  if (hasRepo)
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.background = "#2563EB";
                                }}
                              >
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                >
                                  <path
                                    d="M7.5 1L9.5 5.5H14L10.5 8.5l1.5 4.5-4.5-3-4.5 3 1.5-4.5L1 5.5h4.5L7.5 1z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                    fill="none"
                                  />
                                </svg>
                                Submit Milestone for Verification
                              </button>
                            </div>
                          </div>
                        )}

                        {isInReview && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: 10,
                              paddingTop: 4,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "10px 18px",
                                borderRadius: 8,
                                background: "#EFF6FF",
                                border: "1px solid #BFDBFE",
                                color: "#2563EB",
                                fontSize: 13,
                                fontWeight: 700,
                              }}
                            >
                              <IconCheck size={13} /> Submitted for Verification
                              {phase.submittedAt
                                ? ` · ${phase.submittedAt}`
                                : ""}
                            </span>
                            <button
                              onClick={() => reviseSubmission(phase.number)}
                              style={{
                                padding: "9px 14px",
                                borderRadius: 8,
                                border: "1.5px solid #CBD5E1",
                                background: "#fff",
                                color: "#475569",
                                fontSize: 12.5,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              Revise Submission
                            </button>
                          </div>
                        )}

                        {isRevision && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              paddingTop: 4,
                            }}
                          >
                            <button
                              onClick={() => {
                                if (hasRepo)
                                  resubmitPhase(
                                    phase.number,
                                    phase.dev.repoLink,
                                    phase.dev.updates,
                                  );
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "10px 22px",
                                borderRadius: 8,
                                background: hasRepo ? "#D97706" : "#94A3B8",
                                color: "#fff",
                                border: "none",
                                fontSize: 13.5,
                                fontWeight: 700,
                                cursor: hasRepo ? "pointer" : "not-allowed",
                                fontFamily: "Inter, sans-serif",
                                transition: "background 0.15s",
                                boxShadow: hasRepo
                                  ? "0 2px 8px rgba(217,119,6,0.3)"
                                  : "none",
                              }}
                              onMouseEnter={(e) => {
                                if (hasRepo)
                                  (
                                    e.currentTarget as HTMLButtonElement
                                  ).style.background = "#B45309";
                              }}
                              onMouseLeave={(e) => {
                                if (hasRepo)
                                  (
                                    e.currentTarget as HTMLButtonElement
                                  ).style.background = "#D97706";
                              }}
                            >
                              Resubmit Milestone
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── RIGHT COLUMN ────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: stacked ? "unset" : "0 0 calc(33.33% - 10px)",
          width: stacked ? "100%" : undefined,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Velocity mini card */}
        <Card style={{ padding: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 12,
            }}
          >
            Sprint Velocity
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              {
                label: "Completed",
                value: velocity.completed,
                color: "#16A34A",
                bg: "#F0FDF4",
                border: "#BBF7D0",
              },
              {
                label: "In Review",
                value: velocity.inReview,
                color: "#2563EB",
                bg: "#EFF6FF",
                border: "#BFDBFE",
              },
              {
                label: "On Track",
                value: velocity.onTrack,
                color: "#D97706",
                bg: "#FFFBEB",
                border: "#FDE68A",
              },
              {
                label: "At Risk",
                value: velocity.atRisk,
                color: "#DC2626",
                bg: "#FEF2F2",
                border: "#FECACA",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: s.color,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: s.color,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Task burndown */}
        <Card style={{ padding: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 8,
            }}
          >
            Milestone Burndown
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={burndownData} barSize={16}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                width={26}
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="done"
                name="Done"
                fill="#2563EB"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="remaining"
                name="Remaining"
                fill="#CBD5E1"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Firebase Alerts */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 20px 12px",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 10.5C2 8 3.5 4.5 6 3L5 7l3-1.5L6.5 12c1.5-1 3-3.5 2-6 1 1.5 2 4 1 6.5"
                stroke="#F59E0B"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3
              style={{
                margin: 0,
                fontSize: 13.5,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Firebase Reminder Alerts
            </h3>
            <span
              style={{
                marginLeft: "auto",
                background: unreadNotifs.length ? "#FEF2F2" : "#F8FAFC",
                border: `1px solid ${unreadNotifs.length ? "#FECACA" : "#E2E8F0"}`,
                color: unreadNotifs.length ? "#DC2626" : "#94A3B8",
                fontSize: 10.5,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 99,
              }}
            >
              {unreadNotifs.length} new
            </span>
            <button
              onClick={markAllNotificationsRead}
              style={{
                background: "none",
                border: "none",
                color: "#2563EB",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                padding: 0,
                flexShrink: 0,
              }}
            >
              Mark all read
            </button>
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {project.notifications.map((n, i) => {
              const color = notifColor[n.type];
              const bg = notifBg[n.type];
              const border = notifBorder[n.type];
              const icon = notifIcon[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: 10,
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    background: "#fff",
                    cursor: "pointer",
                    borderBottom:
                      i < project.notifications.length - 1
                        ? "1px solid #F8FAFC"
                        : "none",
                    opacity: n.read ? 0.55 : 1,
                    transition: "opacity 0.15s",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#FAFCFF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: bg,
                      border: `1px solid ${border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                    }}
                  >
                    {icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 3px",
                        fontSize: 12.5,
                        color: color,
                        lineHeight: 1.5,
                        fontWeight: n.read ? 500 : 600,
                      }}
                    >
                      {n.text}
                    </p>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        fontWeight: 500,
                      }}
                    >
                      {n.time}
                    </span>
                  </div>
                  {!n.read && (
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#2563EB",
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Payment history */}
        <Card style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Payment History
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A" }}>
              {formatPeso(project.paidToDate)}{" "}
              <span style={{ color: "#94A3B8", fontWeight: 500 }}>
                ({paidPct}%)
              </span>
            </span>
          </div>
          {paidPhases.length === 0 ? (
            <p style={{ margin: 0, fontSize: 12.5, color: "#94A3B8" }}>
              No completed milestones yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paidPhases.map((p) => (
                <div
                  key={p.number}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: "#F0FDF4",
                      border: "1px solid #BBF7D0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#16A34A",
                    }}
                  >
                    <IconCheck size={13} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      Phase {p.number} · {p.dev.title}
                    </div>
                    <div
                      style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 1 }}
                    >
                      Released {p.approvedAt}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#16A34A",
                      flexShrink: 0,
                    }}
                  >
                    {formatPeso(project.phasePayout)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTop: "1px solid #F1F5F9",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
            }}
          >
            <span style={{ color: "#64748B", fontWeight: 500 }}>
              Remaining on contract
            </span>
            <span style={{ color: "#0F172A", fontWeight: 700 }}>
              {formatPeso(project.totalBudget - project.paidToDate)}
            </span>
          </div>
        </Card>

        {/* Stakeholders */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 20px 12px",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 13.5,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Live Activity
            </h3>
            <span style={{ fontSize: 11.5, color: "#64748B", fontWeight: 500 }}>
              <span style={{ color: "#16A34A", fontWeight: 700 }}>
                {stakeholders.filter((s) => s.status === "active").length}
              </span>{" "}
              online
            </span>
          </div>
          <div style={{ padding: "6px 0" }}>
            {stakeholders.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Avatar with status dot */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background:
                        s.status === "active"
                          ? "linear-gradient(135deg, #DBEAFE, #BFDBFE)"
                          : "#F1F5F9",
                      border: "1.5px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: s.status === "active" ? "#1D4ED8" : "#94A3B8",
                    }}
                  >
                    {s.avatar}
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background:
                        s.status === "active"
                          ? "#16A34A"
                          : s.status === "away"
                            ? "#D97706"
                            : "#CBD5E1",
                      border: "1.5px solid #fff",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0F172A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748B",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.role}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: s.status === "active" ? "#16A34A" : "#94A3B8",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {s.status === "active"
                    ? "● Now"
                    : s.lastSeen.replace("Last seen ", "")}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Project metadata */}
        <Card style={{ padding: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 12,
            }}
          >
            Project Metadata
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { label: "Contract Type", value: project.contractType },
              { label: "Total Budget", value: formatPeso(project.totalBudget) },
              {
                label: "Paid to Date",
                value: `${formatPeso(project.paidToDate)} (${paidPct}%)`,
              },
              { label: "Platform", value: project.platform },
              { label: "Started", value: project.started },
              { label: "Est. Completion", value: project.deadline },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12.5,
                }}
              >
                <span style={{ color: "#64748B", fontWeight: 500 }}>
                  {m.label}
                </span>
                <span style={{ color: "#0F172A", fontWeight: 600 }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Sprint Overview (Dashboard nav item) ──────────────────────────────────────

function SprintOverview({
  isMobile,
  isTablet,
  onNavigate,
}: {
  isMobile: boolean;
  isTablet: boolean;
  onNavigate: () => void;
}) {
  const project = useProjectStore();
  const stacked = isMobile || isTablet;
  const completed = project.phases.filter(
    (p) => p.status === "completed",
  ).length;
  const pct = Math.round((completed / project.totalPhases) * 100);
  const inReview = project.phases.filter(
    (p) => p.status === "in_review" || p.status === "revision",
  ).length;
  const atRisk = project.phases.filter((p) => p.status === "disputed").length;
  const nextPhase = project.phases.find(
    (p) =>
      p.status === "active" ||
      p.status === "in_review" ||
      p.status === "disputed",
  );
  const unread = project.notifications.filter((n) => !n.read).length;
  const paidPct = Math.round((project.paidToDate / project.totalBudget) * 100);

  const tiles = [
    {
      label: "Phases Completed",
      value: `${completed}/${project.totalPhases}`,
      color: "#16A34A",
      bg: "#F0FDF4",
      border: "#BBF7D0",
    },
    {
      label: "In Review",
      value: String(inReview),
      color: "#2563EB",
      bg: "#EFF6FF",
      border: "#BFDBFE",
    },
    {
      label: "Next Deadline",
      value: nextPhase ? `${nextPhase.dev.daysLeft}d` : "—",
      color: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A",
    },
    {
      label: "Paid to Date",
      value: formatPeso(project.paidToDate),
      color: "#7C3AED",
      bg: "#F5F3FF",
      border: "#DDD6FE",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <Card style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 5,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0F172A",
                  letterSpacing: "-0.02em",
                }}
              >
                {project.project}
              </h2>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 11px",
                  borderRadius: 99,
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  color: "#2563EB",
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#2563EB",
                  }}
                />
                In Progress
              </span>
            </div>
            <div style={{ fontSize: 13.5, color: "#64748B" }}>
              Client:{" "}
              <span style={{ fontWeight: 600, color: "#334155" }}>
                {project.client}
              </span>
              <span style={{ color: "#CBD5E1" }}> · </span>
              Due{" "}
              <span
                style={{
                  fontWeight: 600,
                  color: project.daysLeft < 7 ? "#DC2626" : "#334155",
                }}
              >
                {project.deadline}
              </span>
            </div>
          </div>
          <button
            onClick={onNavigate}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "none",
              background: "#2563EB",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            }}
          >
            Open Sprint Milestones →
          </button>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
              Overall progress
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#2563EB",
                letterSpacing: "-0.02em",
              }}
            >
              {pct}%
            </span>
          </div>
          <div
            style={{
              height: 10,
              background: "#F1F5F9",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)",
                borderRadius: 99,
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      </Card>

      {/* KPI tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: stacked ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        {tiles.map((t) => (
          <div
            key={t.label}
            style={{
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "18px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: t.color,
                letterSpacing: "-0.03em",
              }}
            >
              {t.value}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: "#94A3B8",
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              {t.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity + quick actions */}
      <div
        style={{
          display: "flex",
          flexDirection: stacked ? "column" : "row",
          gap: 20,
          alignItems: "flex-start",
        }}
      >
        <Card
          style={{
            flex: 1,
            width: stacked ? "100%" : undefined,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px 12px",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 13.5,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Recent Activity
            </h3>
            {unread > 0 && (
              <span
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 99,
                }}
              >
                {unread} unread
              </span>
            )}
          </div>
          <div>
            {project.notifications.slice(0, 4).map((n) => (
              <div
                key={n.id}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "12px 16px",
                  borderBottom: "1px solid #F8FAFC",
                  background: n.read ? "#fff" : "#FAFCFF",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: notifBg[n.type],
                    border: `1px solid ${notifBorder[n.type]}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  {notifIcon[n.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: 12.5,
                      color: notifColor[n.type],
                      lineHeight: 1.5,
                    }}
                  >
                    {n.text}
                  </p>
                  <span
                    style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}
                  >
                    {n.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          style={{ width: stacked ? "100%" : 260, padding: 20, flexShrink: 0 }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 12,
            }}
          >
            Quick Actions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={onNavigate}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 14px",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                background: "#fff",
                color: "#334155",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                textAlign: "left",
              }}
            >
              Sprint Milestones <IconChevron size={13} dir="right" />
            </button>
            <button
              onClick={resetDemo}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 14px",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                background: "#fff",
                color: "#334155",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                textAlign: "left",
              }}
            >
              Reset demo data <IconChevron size={13} dir="right" />
            </button>
          </div>
          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: "1px solid #F1F5F9",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12.5,
              }}
            >
              <span style={{ color: "#64748B", fontWeight: 500 }}>
                Total budget
              </span>
              <span style={{ color: "#0F172A", fontWeight: 700 }}>
                {formatPeso(project.totalBudget)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12.5,
              }}
            >
              <span style={{ color: "#64748B", fontWeight: 500 }}>
                Paid to date
              </span>
              <span style={{ color: "#16A34A", fontWeight: 700 }}>
                {formatPeso(project.paidToDate)} ({paidPct}%)
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12.5,
              }}
            >
              <span style={{ color: "#64748B", fontWeight: 500 }}>
                Milestones at risk
              </span>
              <span
                style={{
                  color: atRisk ? "#DC2626" : "#16A34A",
                  fontWeight: 700,
                }}
              >
                {atRisk}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Project Spec Form ────────────────────────────────────────────────────────

const TECH_TAGS = [
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  "Laravel",
  "Django",
  "Firebase",
  "Supabase",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Tailwind CSS",
  "Bootstrap",
  "Android",
  "iOS",
  "Flutter",
  "React Native",
  "REST API",
  "GraphQL",
  "Docker",
  "Vercel",
  "AWS",
  "Google Cloud",
];

const BARANGAYS = [
  "Barangay Apokon",
  "Barangay Mankilam",
  "Barangay Magugpo West",
  "Barangay Magugpo North",
  "Barangay Magugpo South",
  "Barangay Canocotan",
  "Barangay Visayan Village",
  "Other Tagum City Zone",
];

interface Milestone {
  id: string;
  phase: number;
  title: string;
  dueDate: string;
}

function FormLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#374151",
        marginBottom: 6,
      }}
    >
      {children}
      {required && <span style={{ color: "#DC2626", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function FormHint({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "5px 0 0",
        fontSize: 12,
        color: "#94A3B8",
        lineHeight: 1.45,
      }}
    >
      {children}
    </p>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  readOnly,
  prefix,
  type = "text",
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  prefix?: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: `1.5px solid ${focused ? "#2563EB" : "#E2E8F0"}`,
        borderRadius: 8,
        background: readOnly ? "#F8FAFC" : "#fff",
        transition: "border-color 0.15s",
        boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.08)" : "none",
      }}
    >
      {prefix && (
        <span
          style={{
            padding: "0 10px 0 12px",
            fontSize: 13.5,
            color: "#94A3B8",
            fontWeight: 600,
            flexShrink: 0,
            borderRight: "1px solid #E2E8F0",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          padding: prefix ? "10px 12px" : "10px 14px",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 13.5,
          color: readOnly ? "#64748B" : "#0F172A",
          fontFamily: "Inter, sans-serif",
        }}
      />
      {readOnly && (
        <span style={{ padding: "0 12px", color: "#16A34A", flexShrink: 0 }}>
          <IconCheck size={13} />
        </span>
      )}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "10px 36px 10px 14px",
          appearance: "none",
          border: `1.5px solid ${focused ? "#2563EB" : "#E2E8F0"}`,
          borderRadius: 8,
          background: "#fff",
          fontSize: 13.5,
          color: value ? "#0F172A" : "#94A3B8",
          fontFamily: "Inter, sans-serif",
          outline: "none",
          cursor: "pointer",
          boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.08)" : "none",
          transition: "border-color 0.15s",
        }}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#94A3B8",
          pointerEvents: "none",
          lineHeight: 0,
        }}
      >
        <IconChevron size={14} />
      </span>
    </div>
  );
}

function SectionDivider({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        paddingBottom: 20,
        borderBottom: "1px solid #F1F5F9",
        marginBottom: 4,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          flexShrink: 0,
          background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
          border: "1.5px solid #BFDBFE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 800,
          color: "#2563EB",
          marginTop: 1,
        }}
      >
        {number}
      </div>
      <div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#0F172A",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
          {description}
        </div>
      </div>
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {children}
    </div>
  );
}

function ProjectSpecForm({
  isMobile,
  onBack,
}: {
  isMobile: boolean;
  onBack: () => void;
}) {
  // Form state
  const [bizName] = useState("Apokon Hardware MSME");
  const [barangay, setBarangay] = useState("");
  const [repName, setRepName] = useState("Ernesto Dela Vega");
  const [repEmail, setRepEmail] = useState("ernesto@apokonhardware.com");
  const [projTitle, setProjTitle] = useState("");
  const [scope, setScope] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "React",
    "Firebase",
    "Tailwind CSS",
  ]);
  const [tagSearch, setTagSearch] = useState("");
  const [numPhases, setNumPhases] = useState("3");
  const [deadline, setDeadline] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "m1", phase: 1, title: "", dueDate: "" },
    { id: "m2", phase: 2, title: "", dueDate: "" },
    { id: "m3", phase: 3, title: "", dueDate: "" },
  ]);
  const [budget, setBudget] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scopeFocused, setScopeFocused] = useState(false);
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Sync milestone count to numPhases
  useEffect(() => {
    const n = Math.max(1, Math.min(8, parseInt(numPhases) || 1));
    setMilestones((prev) => {
      if (prev.length === n) return prev;
      if (prev.length < n) {
        const added = Array.from({ length: n - prev.length }, (_, i) => ({
          id: `m${Date.now()}-${i}`,
          phase: prev.length + i + 1,
          title: "",
          dueDate: "",
        }));
        return [...prev, ...added];
      }
      return prev.slice(0, n);
    });
  }, [numPhases]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function updateMilestone(
    id: string,
    field: "title" | "dueDate",
    value: string,
  ) {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  }

  function addMilestone() {
    setMilestones((prev) => [
      ...prev,
      { id: `m${Date.now()}`, phase: prev.length + 1, title: "", dueDate: "" },
    ]);
    setNumPhases(String(milestones.length + 1));
  }

  function removeMilestone(id: string) {
    if (milestones.length <= 1) return;
    setMilestones((prev) => {
      const next = prev.filter((m) => m.id !== id);
      return next.map((m, i) => ({ ...m, phase: i + 1 }));
    });
    setNumPhases(String(milestones.length - 1));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!projTitle.trim()) e.projTitle = "Project title is required.";
    if (!scope.trim()) e.scope = "Project scope description is required.";
    if (!barangay) e.barangay = "Please select a barangay.";
    if (!deadline) e.deadline = "Final deadline is required.";
    if (!budget.trim()) e.budget = "Proposed budget is required.";
    if (!agreed) e.agreed = "You must agree to the terms before publishing.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePublish() {
    if (validate()) setPublished(true);
  }

  const filteredTags = TECH_TAGS.filter(
    (t) =>
      !selectedTags.includes(t) &&
      t.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  if (published) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#F0FDF4",
              border: "2px solid #BBF7D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 32,
            }}
          >
            ✅
          </div>
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: 22,
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.03em",
            }}
          >
            Project Published!
          </h2>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 14,
              color: "#64748B",
              lineHeight: 1.6,
            }}
          >
            Your project requirement has been submitted for admin review.
            Verified PSITS student developers can now place structured bids
            within 24 hours.
          </p>
          <button
            onClick={() => setPublished(false)}
            style={{
              padding: "10px 24px",
              background: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontFamily: "Inter, sans-serif",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Post Another Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top Nav ─────────────────────────────────────────────────── */}
      <nav
        style={{
          background: "#fff",
          borderBottom: "1px solid #E2E8F0",
          padding: "0 32px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {/* Logo + back link */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2.5 12L5.5 5.5l3 4.5 2.5-6.5L13 8"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              StartupMatch
            </span>
          </div>
          <div style={{ width: 1, height: 20, background: "#E2E8F0" }} />
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#475569",
              fontFamily: "Inter, sans-serif",
              padding: 0,
              transition: "color 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L5 8l5-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Client Dashboard
          </button>
        </div>

        {/* User chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!isMobile && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                Ernesto Dela Vega
              </div>
              <div style={{ fontSize: 11, color: "#64748B" }}>
                Apokon Hardware MSME
              </div>
            </div>
          )}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              flexShrink: 0,
              background: "linear-gradient(135deg, #ECFDF5, #6EE7B7)",
              border: "2px solid #fff",
              boxShadow: "0 0 0 1.5px #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: "#065F46",
            }}
          >
            ED
          </div>
        </div>
      </nav>

      {/* ── Form body ───────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: isMobile ? "24px 16px 120px" : "40px 24px 120px",
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          {/* Progress indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {["Corporate Info", "Project Scope", "Milestones", "Budget"].map(
              (step, i) => (
                <div
                  key={step}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "#EFF6FF",
                        border: "1.5px solid #BFDBFE",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#2563EB",
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#64748B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step}
                    </span>
                  </div>
                  {i < 3 && (
                    <span style={{ color: "#CBD5E1", fontSize: 12 }}>›</span>
                  )}
                </div>
              ),
            )}
          </div>

          {/* Main form card */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 16,
              padding: isMobile ? "24px 20px" : "36px 40px",
              boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            {/* Form header */}
            <div
              style={{
                marginBottom: 36,
                paddingBottom: 24,
                borderBottom: "1px solid #F1F5F9",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 99,
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  color: "#2563EB",
                  fontSize: 11.5,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect
                    x="1"
                    y="1"
                    width="10"
                    height="10"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M3 4h6M3 6h4M3 8h5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                Enterprise Client Portal
              </div>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: isMobile ? 22 : 26,
                  fontWeight: 800,
                  color: "#0F172A",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                }}
              >
                Post a New Project Requirement
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#64748B",
                  lineHeight: 1.6,
                  maxWidth: 560,
                }}
              >
                Create a verified technical specification to begin receiving
                structured project bids from local PSITS student developers.
              </p>
            </div>

            {/* ── Group 1: Corporate & Demographic Info ───────────────── */}
            <div style={{ marginBottom: 36 }}>
              <SectionDivider
                number={1}
                title="Corporate & Demographic Information"
                description="Confirm your registered business details and representative contact."
              />
              <div style={{ marginTop: 20 }}>
                <FieldGroup>
                  <div>
                    <FormLabel>Business / Organization Name</FormLabel>
                    <TextInput value={bizName} readOnly placeholder="" />
                    <FormHint>
                      Auto-filled from your verified enterprise profile.
                    </FormHint>
                  </div>

                  <div>
                    <FormLabel required>Local Business Location</FormLabel>
                    <SelectInput
                      value={barangay}
                      onChange={setBarangay}
                      options={BARANGAYS}
                      placeholder="Select your barangay / zone…"
                    />
                    {errors.barangay && (
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: 12,
                          color: "#DC2626",
                        }}
                      >
                        {errors.barangay}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    <div>
                      <FormLabel required>Project Representative</FormLabel>
                      <TextInput
                        value={repName}
                        onChange={setRepName}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <FormLabel required>Contact Email</FormLabel>
                      <TextInput
                        value={repEmail}
                        onChange={setRepEmail}
                        placeholder="representative@company.ph"
                        type="email"
                      />
                    </div>
                  </div>
                </FieldGroup>
              </div>
            </div>

            {/* ── Group 2: Technical Project Scope ─────────────────────── */}
            <div style={{ marginBottom: 36 }}>
              <SectionDivider
                number={2}
                title="Technical Project Scope"
                description="Define the project deliverables and the technologies needed."
              />
              <div style={{ marginTop: 20 }}>
                <FieldGroup>
                  <div>
                    <FormLabel required>Project Title</FormLabel>
                    <TextInput
                      value={projTitle}
                      onChange={setProjTitle}
                      placeholder="e.g., Automated Contact & Inventory Tracking System"
                    />
                    {errors.projTitle && (
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: 12,
                          color: "#DC2626",
                        }}
                      >
                        {errors.projTitle}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormLabel required>
                      Detailed Project Scope & Objectives
                    </FormLabel>
                    <textarea
                      rows={6}
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                      onFocus={() => setScopeFocused(true)}
                      onBlur={() => setScopeFocused(false)}
                      placeholder="Describe the full scope of the project: key features, integrations, target users, business goals, and any technical constraints. Be specific — the more detail you provide, the better matched your bids will be."
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        minHeight: 148,
                        border: `1.5px solid ${scopeFocused ? "#2563EB" : "#E2E8F0"}`,
                        borderRadius: 8,
                        resize: "vertical",
                        outline: "none",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13.5,
                        color: "#0F172A",
                        lineHeight: 1.6,
                        background: "#fff",
                        boxSizing: "border-box",
                        boxShadow: scopeFocused
                          ? "0 0 0 3px rgba(37,99,235,0.08)"
                          : "none",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 4,
                      }}
                    >
                      {errors.scope ? (
                        <p
                          style={{ margin: 0, fontSize: 12, color: "#DC2626" }}
                        >
                          {errors.scope}
                        </p>
                      ) : (
                        <FormHint>Minimum 100 characters recommended.</FormHint>
                      )}
                      <span
                        style={{
                          fontSize: 11.5,
                          color: scope.length < 100 ? "#D97706" : "#16A34A",
                          fontWeight: 600,
                        }}
                      >
                        {scope.length} chars
                      </span>
                    </div>
                  </div>

                  {/* Tech stack tag picker */}
                  <div>
                    <FormLabel>Required Tech Stack</FormLabel>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 7,
                        marginBottom: selectedTags.length > 0 ? 10 : 0,
                      }}
                    >
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px 4px 12px",
                            borderRadius: 99,
                            background: "#EFF6FF",
                            border: "1.5px solid #2563EB",
                            color: "#2563EB",
                            fontSize: 12.5,
                            fontWeight: 700,
                          }}
                        >
                          {tag}
                          <button
                            onClick={() => toggleTag(tag)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#93C5FD",
                              padding: 0,
                              lineHeight: 0,
                              display: "flex",
                            }}
                          >
                            <IconX size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                    {/* Tag search / picker */}
                    <div style={{ position: "relative" }} ref={tagDropdownRef}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          border: `1.5px solid ${tagInputFocused ? "#2563EB" : "#E2E8F0"}`,
                          borderRadius: 8,
                          padding: "8px 12px",
                          background: "#fff",
                          boxShadow: tagInputFocused
                            ? "0 0 0 3px rgba(37,99,235,0.08)"
                            : "none",
                          transition: "border-color 0.15s",
                        }}
                      >
                        <IconSearch size={14} />
                        <input
                          type="text"
                          value={tagSearch}
                          onChange={(e) => setTagSearch(e.target.value)}
                          onFocus={() => setTagInputFocused(true)}
                          onBlur={() =>
                            setTimeout(() => setTagInputFocused(false), 150)
                          }
                          placeholder="Search and add a technology tag…"
                          style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: 13.5,
                            fontFamily: "Inter, sans-serif",
                            color: "#0F172A",
                            background: "transparent",
                          }}
                        />
                      </div>
                      {tagInputFocused && filteredTags.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            zIndex: 20,
                            marginTop: 4,
                            background: "#fff",
                            border: "1px solid #E2E8F0",
                            borderRadius: 10,
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                            maxHeight: 200,
                            overflowY: "auto",
                          }}
                        >
                          <div style={{ padding: "6px 0" }}>
                            {filteredTags.slice(0, 12).map((tag) => (
                              <button
                                key={tag}
                                onMouseDown={() => {
                                  toggleTag(tag);
                                  setTagSearch("");
                                }}
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 14px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 13.5,
                                  color: "#334155",
                                  fontFamily: "Inter, sans-serif",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = "#F8FAFC")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background =
                                    "transparent")
                                }
                              >
                                <span
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 99,
                                    background: "#EFF6FF",
                                    border: "1px solid #BFDBFE",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                  >
                                    <path
                                      d="M5 2v6M2 5h6"
                                      stroke="#2563EB"
                                      strokeWidth="1.4"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </span>
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <FormHint>
                      Click tags to add them. Selected tags guide developer
                      matching.
                    </FormHint>
                    {/* All tags quick-add row */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: 10,
                      }}
                    >
                      {TECH_TAGS.filter((t) => !selectedTags.includes(t))
                        .slice(0, 10)
                        .map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            style={{
                              padding: "3px 10px",
                              borderRadius: 99,
                              border: "1px solid #E2E8F0",
                              background: "#F8FAFC",
                              color: "#475569",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                              fontFamily: "Inter, sans-serif",
                              transition: "all 0.1s",
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.borderColor = "#2563EB";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "#2563EB";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.borderColor = "#E2E8F0";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "#475569";
                            }}
                          >
                            + {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                </FieldGroup>
              </div>
            </div>

            {/* ── Group 3: Agile Milestone & Schedule ──────────────────── */}
            <div style={{ marginBottom: 36 }}>
              <SectionDivider
                number={3}
                title="Agile Milestone & Schedule Parameters"
                description="Define the project phases and final delivery date."
              />
              <div style={{ marginTop: 20 }}>
                <FieldGroup>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    <div>
                      <FormLabel required>Total Milestone Phases</FormLabel>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0,
                          border: "1.5px solid #E2E8F0",
                          borderRadius: 8,
                          overflow: "hidden",
                          background: "#fff",
                        }}
                      >
                        <button
                          onClick={() =>
                            setNumPhases((s) =>
                              String(Math.max(1, (parseInt(s) || 1) - 1)),
                            )
                          }
                          style={{
                            width: 40,
                            background: "#F8FAFC",
                            border: "none",
                            borderRight: "1px solid #E2E8F0",
                            cursor: "pointer",
                            fontSize: 18,
                            color: "#64748B",
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={8}
                          value={numPhases}
                          onChange={(e) => setNumPhases(e.target.value)}
                          style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            textAlign: "center",
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#0F172A",
                            fontFamily: "Inter, sans-serif",
                            height: 42,
                            background: "transparent",
                          }}
                        />
                        <button
                          onClick={() =>
                            setNumPhases((s) =>
                              String(Math.min(8, (parseInt(s) || 1) + 1)),
                            )
                          }
                          style={{
                            width: 40,
                            background: "#F8FAFC",
                            border: "none",
                            borderLeft: "1px solid #E2E8F0",
                            cursor: "pointer",
                            fontSize: 18,
                            color: "#64748B",
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          +
                        </button>
                      </div>
                      <FormHint>Between 1 and 8 sprint phases.</FormHint>
                    </div>
                    <div>
                      <FormLabel required>
                        Final Project Delivery Deadline
                      </FormLabel>
                      <div style={{ position: "relative" }}>
                        <input
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: `1.5px solid ${errors.deadline ? "#DC2626" : "#E2E8F0"}`,
                            borderRadius: 8,
                            fontSize: 13.5,
                            color: deadline ? "#0F172A" : "#94A3B8",
                            fontFamily: "Inter, sans-serif",
                            outline: "none",
                            background: "#fff",
                            boxSizing: "border-box",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "#2563EB")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = errors.deadline
                              ? "#DC2626"
                              : "#E2E8F0")
                          }
                        />
                      </div>
                      {errors.deadline && (
                        <p
                          style={{
                            margin: "5px 0 0",
                            fontSize: 12,
                            color: "#DC2626",
                          }}
                        >
                          {errors.deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dynamic milestone builder */}
                  <div>
                    <FormLabel>Milestone Phase Details</FormLabel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {milestones.map((m, idx) => (
                        <div
                          key={m.id}
                          style={{
                            padding: "16px",
                            border: "1px solid #E2E8F0",
                            borderRadius: 10,
                            background: "#FAFCFF",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                flexShrink: 0,
                                background:
                                  "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                                border: "1.5px solid #BFDBFE",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 800,
                                color: "#2563EB",
                              }}
                            >
                              {m.phase}
                            </div>
                            <span
                              style={{
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: "#475569",
                              }}
                            >
                              Phase {m.phase}
                            </span>
                            {milestones.length > 1 && (
                              <button
                                onClick={() => removeMilestone(m.id)}
                                style={{
                                  marginLeft: "auto",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#CBD5E1",
                                  padding: 2,
                                  lineHeight: 0,
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color = "#DC2626")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = "#CBD5E1")
                                }
                              >
                                <IconClose size={14} />
                              </button>
                            )}
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: isMobile
                                ? "1fr"
                                : "1fr auto",
                              gap: isMobile ? 10 : 12,
                              alignItems: "start",
                            }}
                          >
                            <div>
                              {isMobile && (
                                <div
                                  style={{
                                    fontSize: 11.5,
                                    fontWeight: 600,
                                    color: "#94A3B8",
                                    marginBottom: 5,
                                  }}
                                >
                                  Phase Title
                                </div>
                              )}
                              <input
                                type="text"
                                value={m.title}
                                onChange={(e) =>
                                  updateMilestone(m.id, "title", e.target.value)
                                }
                                placeholder={`e.g., ${["UI/UX Wireframing", "Backend Development", "Frontend Integration & Testing", "Deployment & Handover"][idx] || "Phase title…"}`}
                                style={{
                                  width: "100%",
                                  padding: "9px 12px",
                                  border: "1.5px solid #E2E8F0",
                                  borderRadius: 7,
                                  fontSize: 13,
                                  fontFamily: "Inter, sans-serif",
                                  color: "#0F172A",
                                  outline: "none",
                                  background: "#fff",
                                  boxSizing: "border-box",
                                }}
                                onFocus={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#2563EB")
                                }
                                onBlur={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#E2E8F0")
                                }
                              />
                            </div>
                            <div style={{ width: isMobile ? "100%" : 160 }}>
                              {isMobile && (
                                <div
                                  style={{
                                    fontSize: 11.5,
                                    fontWeight: 600,
                                    color: "#94A3B8",
                                    marginBottom: 5,
                                  }}
                                >
                                  Due Date
                                </div>
                              )}
                              <input
                                type="date"
                                value={m.dueDate}
                                onChange={(e) =>
                                  updateMilestone(
                                    m.id,
                                    "dueDate",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  width: "100%",
                                  padding: "9px 12px",
                                  border: "1.5px solid #E2E8F0",
                                  borderRadius: 7,
                                  fontSize: 13,
                                  fontFamily: "Inter, sans-serif",
                                  color: m.dueDate ? "#0F172A" : "#94A3B8",
                                  outline: "none",
                                  background: "#fff",
                                  boxSizing: "border-box",
                                }}
                                onFocus={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#2563EB")
                                }
                                onBlur={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#E2E8F0")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add milestone */}
                    {milestones.length < 8 && (
                      <button
                        onClick={addMilestone}
                        style={{
                          marginTop: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: "none",
                          border: "1.5px dashed #CBD5E1",
                          borderRadius: 10,
                          width: "100%",
                          padding: "11px 16px",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "#64748B",
                          transition: "all 0.15s",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "#2563EB";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#2563EB";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "#F0F7FF";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "#CBD5E1";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#64748B";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent";
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M7 2v10M2 7h10"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                        + Add Another Milestone
                      </button>
                    )}
                  </div>
                </FieldGroup>
              </div>
            </div>

            {/* ── Group 4: Budget & Agreement ───────────────────────────── */}
            <div style={{ marginBottom: 8 }}>
              <SectionDivider
                number={4}
                title="Budget & Agreement Terms"
                description="Set your proposed honorarium and accept the platform terms."
              />
              <div style={{ marginTop: 20 }}>
                <FieldGroup>
                  <div>
                    <FormLabel required>
                      Proposed Development Honorarium / Stipend
                    </FormLabel>
                    <TextInput
                      value={budget}
                      onChange={setBudget}
                      placeholder="e.g., 28,000.00"
                      prefix="PHP"
                    />
                    {errors.budget ? (
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: 12,
                          color: "#DC2626",
                        }}
                      >
                        {errors.budget}
                      </p>
                    ) : (
                      <FormHint>
                        Suggested range: PHP 5,000 – PHP 50,000 for student
                        developer engagements.
                      </FormHint>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        cursor: "pointer",
                        padding: "14px 16px",
                        borderRadius: 10,
                        background: agreed
                          ? "#F0FDF4"
                          : errors.agreed
                            ? "#FEF2F2"
                            : "#F8FAFC",
                        border: `1.5px solid ${agreed ? "#BBF7D0" : errors.agreed ? "#FECACA" : "#E2E8F0"}`,
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        onClick={() => setAgreed((v) => !v)}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          flexShrink: 0,
                          marginTop: 1,
                          background: agreed ? "#16A34A" : "#fff",
                          border: `2px solid ${agreed ? "#16A34A" : errors.agreed ? "#DC2626" : "#CBD5E1"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {agreed && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                          >
                            <path
                              d="M2 5.5l2.5 2.5 4.5-5"
                              stroke="#fff"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <div onClick={() => setAgreed((v) => !v)}>
                        <p
                          style={{
                            margin: "0 0 3px",
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#0F172A",
                            lineHeight: 1.4,
                          }}
                        >
                          I agree to Startup-Match's standardized milestone
                          verification and dispute resolution protocols.
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            color: "#64748B",
                            lineHeight: 1.4,
                          }}
                        >
                          By publishing, you confirm this project listing is a
                          legitimate engagement request and you authorize
                          platform admins to mediate any disputes arising from
                          milestone delivery.{" "}
                          <a
                            href="#"
                            style={{ color: "#2563EB", fontWeight: 600 }}
                          >
                            Read full terms →
                          </a>
                        </p>
                      </div>
                    </label>
                    {errors.agreed && (
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 12,
                          color: "#DC2626",
                        }}
                      >
                        {errors.agreed}
                      </p>
                    )}
                  </div>
                </FieldGroup>
              </div>
            </div>
          </div>

          {/* ── Sticky footer actions ─────────────────────────────────── */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 40,
              background: "rgba(248,250,252,0.95)",
              backdropFilter: "blur(8px)",
              borderTop: "1px solid #E2E8F0",
              marginTop: 0,
              padding: isMobile ? "14px 16px" : "16px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#94A3B8", flex: 1 }}>
              {Object.keys(errors).length > 0 ? (
                <span style={{ color: "#DC2626", fontWeight: 600 }}>
                  ⚠ Please fix {Object.keys(errors).length} field
                  {Object.keys(errors).length > 1 ? "s" : ""} before publishing.
                </span>
              ) : (
                "All fields marked * are required before publishing."
              )}
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexShrink: 0,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <button
                onClick={() => setSaved(true)}
                style={{
                  flex: isMobile ? 1 : "unset",
                  padding: "10px 22px",
                  borderRadius: 8,
                  background: saved ? "#F0FDF4" : "#fff",
                  color: saved ? "#16A34A" : "#475569",
                  border: `1.5px solid ${saved ? "#BBF7D0" : "#E2E8F0"}`,
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  if (!saved)
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#CBD5E1";
                }}
                onMouseLeave={(e) => {
                  if (!saved)
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#E2E8F0";
                }}
              >
                {saved ? (
                  <>
                    <IconCheck size={13} /> Saved
                  </>
                ) : (
                  "Save as Draft"
                )}
              </button>
              <button
                onClick={handlePublish}
                style={{
                  flex: isMobile ? 1 : "unset",
                  padding: "10px 24px",
                  borderRadius: 8,
                  background: "#2563EB",
                  color: "#fff",
                  border: "none",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "background 0.15s",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  boxShadow: "0 2px 8px rgba(37,99,235,0.28)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1D4ED8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#2563EB")
                }
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7l4 4 6-8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Publish Project Requirement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Milestone Tracking Dashboard ────────────────────────────────────────────

const clientNavItems = [
  { icon: IconDashboard, label: "Overview", id: "overview" },
  { icon: IconBids, label: "Milestone Tracking", id: "milestones" },
  { icon: IconLogs, label: "Project Contracts", id: "contracts" },
  { icon: IconMessages, label: "Messages", id: "messages" },
  { icon: IconSettings, label: "Settings", id: "settings" },
];

const phaseCfg = {
  completed: {
    border: "#16A34A",
    bg: "#F0FDF4",
    badgeBg: "#F0FDF4",
    badgeColor: "#16A34A",
    badgeBorder: "#BBF7D0",
    label: "Completed",
    dot: "#16A34A",
  },
  review: {
    border: "#2563EB",
    bg: "#EFF6FF",
    badgeBg: "#EFF6FF",
    badgeColor: "#2563EB",
    badgeBorder: "#BFDBFE",
    label: "Ready for Review",
    dot: "#2563EB",
  },
  disputed: {
    border: "#DC2626",
    bg: "#FEF2F2",
    badgeBg: "#FFF7ED",
    badgeColor: "#D97706",
    badgeBorder: "#FDE68A",
    label: "Delayed / Disputed",
    dot: "#DC2626",
  },
  upcoming: {
    border: "#E2E8F0",
    bg: "#F8FAFC",
    badgeBg: "#F8FAFC",
    badgeColor: "#94A3B8",
    badgeBorder: "#E2E8F0",
    label: "Upcoming",
    dot: "#CBD5E1",
  },
};

function ClientSidebar({
  active,
  onNav,
  collapsed,
}: {
  active: string;
  onNav: (id: string) => void;
  collapsed: boolean;
}) {
  return (
    <aside
      style={{
        width: collapsed ? 72 : 260,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 22px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: collapsed ? "auto" : 0,
            marginRight: collapsed ? "auto" : 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 14L7 6l3 5 3-7 2 3"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              StartupMatch
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
              Enterprise Client Portal
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <div
          style={{
            margin: "12px 14px 4px",
            padding: "10px 12px",
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#D97706",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 3,
            }}
          >
            Active Contract
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.3,
            }}
          >
            E-Commerce Inventory Portal
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
            Marco Ramirez · PSITS Dev
          </div>
        </div>
      )}

      <nav style={{ padding: "8px 0", flex: 1 }}>
        {clientNavItems.map(({ icon: Icon, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: collapsed ? "10px 0" : "10px 18px",
                justifyContent: collapsed ? "center" : "flex-start",
                border: "none",
                background: isActive ? "#EFF6FF" : "transparent",
                color: isActive ? "#2563EB" : "#475569",
                borderLeft: isActive
                  ? "3px solid #2563EB"
                  : "3px solid transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.12s",
                borderRadius: collapsed ? 0 : "0 8px 8px 0",
                marginRight: collapsed ? 0 : 10,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              <Icon size={18} />
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={{ padding: "14px 16px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg, #ECFDF5, #6EE7B7)",
                border: "1.5px solid #A7F3D0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#065F46",
              }}
            >
              ED
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                Ernesto Dela Vega
              </div>
              <div style={{ fontSize: 11, color: "#64748B" }}>
                Apokon Hardware MSME
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function MilestoneTrackingPage({
  isMobile,
  isTablet,
  collapsed,
  sidebarOpen,
  setSidebarOpen,
}: {
  isMobile: boolean;
  isTablet: boolean;
  collapsed: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const [clientNav, setClientNav] = useState("milestones");
  const [disputeOpen, setDisputeOpen] = useState<number | null>(null);
  const [disputeNote, setDisputeNote] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  const project = useProjectStore();

  const clientStatus = (
    s: SprintPhaseStatus,
  ): "review" | "completed" | "disputed" | "upcoming" => {
    if (s === "completed") return "completed";
    if (s === "disputed" || s === "revision") return "disputed";
    if (s === "in_review" || s === "active") return "review";
    return "upcoming";
  };

  const clientPhases = project.phases.map((p) => ({
    num: p.number,
    title: p.client.title,
    deadline: p.client.deadline,
    status: clientStatus(p.status),
    repoLink: p.client.repoLink,
    prototypeLink: p.client.prototypeLink,
    devNotes: p.client.updates,
    submittedAt: p.submittedAt,
    approvedAt: p.approvedAt,
    daysOverdue: p.client.daysLeft < 0 ? Math.abs(p.client.daysLeft) : 2,
  }));

  const messages = project.phases.find((p) => p.number === 2)?.comments ?? [];

  function handleApprove(number: number) {
    approvePhase(number);
  }
  function handleDispute(number: number) {
    disputePhase(number, disputeNote);
    setDisputeOpen(null);
    setDisputeNote("");
  }
  function sendMessage() {
    if (!feedbackMsg.trim()) return;
    addComment(2, feedbackMsg, "client");
    setFeedbackMsg("");
    setTimeout(
      () => feedEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  }

  const verified = clientPhases.filter((p) => p.status === "completed").length;
  const total = clientPhases.length;
  const activePhase = clientPhases.find((p) => p.status === "review");
  const hasDispute = clientPhases.some((p) => p.status === "disputed");

  const stacked = isMobile || isTablet;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Sidebar overlay on mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 40,
          }}
        />
      )}
      {(isMobile ? sidebarOpen : true) && (
        <div
          style={
            isMobile
              ? { position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50 }
              : {}
          }
        >
          <ClientSidebar
            active={clientNav}
            onNav={(id) => {
              setClientNav(id);
              setSidebarOpen(false);
            }}
            collapsed={collapsed}
          />
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #E2E8F0",
            padding: isMobile ? "12px 16px" : "13px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  lineHeight: 0,
                  padding: 4,
                }}
              >
                <IconMenu size={20} />
              </button>
            )}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#94A3B8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Enterprise Client Portal
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                Milestone Tracking
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {hasDispute && !isMobile && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 12px",
                  borderRadius: 99,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ⚠ Active Dispute
              </span>
            )}
            <button
              onClick={() => setPanelOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 8,
                background: panelOpen ? "#EFF6FF" : "#fff",
                border: `1px solid ${panelOpen ? "#BFDBFE" : "#E2E8F0"}`,
                color: panelOpen ? "#2563EB" : "#475569",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.12s",
              }}
            >
              <IconMessages size={15} />
              {!isMobile && "Feedback"}&nbsp;
              <span
                style={{
                  background: "#DC2626",
                  color: "#fff",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 5px",
                  minWidth: 16,
                  textAlign: "center",
                }}
              >
                {messages.length}
              </span>
            </button>
            <button
              style={{
                background: "none",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                color: "#64748B",
                lineHeight: 0,
                position: "relative",
              }}
            >
              <IconBell size={16} />
              <span
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#DC2626",
                  border: "1.5px solid #fff",
                }}
              />
            </button>
          </div>
        </div>

        <main
          style={{
            flex: 1,
            padding: isMobile ? "20px 14px 100px" : "28px 28px 100px",
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Project header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h1
                  style={{
                    margin: "0 0 6px",
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: 800,
                    color: "#0F172A",
                    letterSpacing: "-0.03em",
                  }}
                >
                  E-Commerce Inventory Portal
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {/* Developer avatars */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {[
                      {
                        initials: "MR",
                        bg: ["#DBEAFE", "#1D4ED8"],
                        name: "Marco Ramirez",
                      },
                      {
                        initials: "TL",
                        bg: ["#F5F3FF", "#6D28D9"],
                        name: "Tricia Lim",
                      },
                    ].map((dev, i) => (
                      <div
                        key={dev.initials}
                        title={dev.name}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${dev.bg[0]}, ${dev.bg[0]})`,
                          border: `2px solid #fff`,
                          boxShadow: "0 0 0 1px #E2E8F0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: dev.bg[1],
                          marginLeft: i > 0 ? -8 : 0,
                          zIndex: 2 - i,
                        }}
                      >
                        {dev.initials}
                      </div>
                    ))}
                  </div>
                  <span
                    style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}
                  >
                    Marco Ramirez + 1
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: "#F0FDF4",
                      border: "1px solid #BBF7D0",
                      color: "#16A34A",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    <IconCheck size={10} /> PSITS Verified Team
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 10px",
                      borderRadius: 99,
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      color: "#2563EB",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    ● Active Contract
                  </span>
                </div>
              </div>
              {!isMobile && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                      background: "#fff",
                      color: "#475569",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <IconLogs size={14} /> Audit Log
                  </button>
                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#2563EB",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <IconExternal size={13} /> View Contract
                  </button>
                </div>
              )}
            </div>

            {/* ── Summary bar ─────────────────────────────────────── */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                overflow: "hidden",
              }}
            >
              {[
                {
                  label: "Current Sprint Phase",
                  value: `Phase ${Math.min(verified + 1, total)} of ${total}`,
                  icon: "🔄",
                  accent: "#2563EB",
                },
                {
                  label: "Next Deadline",
                  value: activePhase?.deadline ?? "Aug 28, 2026",
                  icon: "📅",
                  accent: "#D97706",
                },
                {
                  label: "Milestones Verified",
                  value: `${verified} / ${total}`,
                  icon: "✅",
                  accent: "#16A34A",
                },
                {
                  label: "System Health",
                  value: hasDispute
                    ? "Dispute Active"
                    : verified === total
                      ? "Delivered"
                      : "On Schedule",
                  icon: hasDispute ? "⚠️" : "🟢",
                  accent: hasDispute ? "#DC2626" : "#16A34A",
                },
              ].map((m, i) => (
                <div
                  key={m.label}
                  style={{
                    padding: "18px 20px",
                    borderRight: i < 3 ? "1px solid #F1F5F9" : "none",
                    borderBottom:
                      isMobile && i < 2 ? "1px solid #F1F5F9" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{m.icon}</span> {m.label}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      fontWeight: 800,
                      color: m.accent,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Overall progress bar ──────────────────────────── */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "16px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}
                >
                  Overall Contract Progress
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#2563EB",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {Math.round((verified / total) * 100)}%
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  background: "#F1F5F9",
                  borderRadius: 99,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${(verified / total) * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #2563EB, #3B82F6)",
                    borderRadius: 99,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                {clientPhases.map((p) => {
                  const s = p.status;
                  return (
                    <div
                      key={p.num}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background:
                            s === "completed"
                              ? "#16A34A"
                              : s === "review"
                                ? "#2563EB"
                                : s === "disputed"
                                  ? "#DC2626"
                                  : "#F1F5F9",
                          border: `2px solid ${s === "completed" ? "#16A34A" : s === "review" ? "#2563EB" : s === "disputed" ? "#DC2626" : "#E2E8F0"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {s === "completed" && <IconCheck size={11} />}
                        {(s === "review" ||
                          s === "disputed" ||
                          s === "upcoming") && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              color: s === "upcoming" ? "#CBD5E1" : "#fff",
                            }}
                          >
                            {p.num}
                          </span>
                        )}
                      </div>
                      {!isMobile && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "#94A3B8",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          S{p.num}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Phase cards ──────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {clientPhases.map((phase) => {
                const status = phase.status;
                const cfg = phaseCfg[status];
                const isReview = status === "review";
                const isCompleted = status === "completed";
                const isDisputed = status === "disputed";
                const isUpcoming = status === "upcoming";

                return (
                  <div
                    key={phase.num}
                    style={{
                      background: "#fff",
                      border: "1px solid #E2E8F0",
                      borderLeft: `4px solid ${cfg.border}`,
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      opacity: isUpcoming ? 0.7 : 1,
                      transition: "opacity 0.15s",
                    }}
                  >
                    {/* Card header */}
                    <div
                      style={{
                        padding: "18px 22px",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        borderBottom: isUpcoming ? "none" : "1px solid #F1F5F9",
                        background: cfg.bg,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {/* Phase circle */}
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: isCompleted
                              ? "#F0FDF4"
                              : isReview
                                ? "#EFF6FF"
                                : isDisputed
                                  ? "#FEF2F2"
                                  : "#F8FAFC",
                            border: `2px solid ${cfg.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isCompleted ? (
                            <span style={{ color: "#16A34A", lineHeight: 0 }}>
                              <IconCheck size={16} />
                            </span>
                          ) : isDisputed ? (
                            <span style={{ fontSize: 16 }}>⚠️</span>
                          ) : (
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: cfg.border,
                              }}
                            >
                              {phase.num}
                            </span>
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                              marginBottom: 3,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#0F172A",
                              }}
                            >
                              Sprint {phase.num}: {phase.title}
                            </span>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "2px 9px",
                                borderRadius: 99,
                                background: cfg.badgeBg,
                                border: `1px solid ${cfg.badgeBorder}`,
                                color: cfg.badgeColor,
                                fontSize: 11,
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  background: cfg.dot,
                                  flexShrink: 0,
                                }}
                              />
                              {cfg.label}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: "#94A3B8" }}>
                            {isCompleted
                              ? `Approved ${phase.approvedAt}`
                              : `Deadline: ${phase.deadline}`}
                            {phase.submittedAt &&
                              !isCompleted &&
                              ` · Submitted ${phase.submittedAt}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    {!isUpcoming && (
                      <div
                        style={{
                          padding: "18px 22px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        {/* Completed state */}
                        {isCompleted && (
                          <>
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 200 }}>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#94A3B8",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    marginBottom: 6,
                                  }}
                                >
                                  Submitted Repository
                                </div>
                                <a
                                  href={phase.repoLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 7,
                                    padding: "8px 12px",
                                    background: "#F8FAFC",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    color: "#2563EB",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <IconGithub size={14} />
                                  <span
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {phase.repoLink.replace("https://", "")}
                                  </span>
                                  <IconExternal size={11} />
                                </a>
                                <div
                                  style={{
                                    fontSize: 11.5,
                                    color: "#94A3B8",
                                    marginTop: 5,
                                  }}
                                >
                                  Submitted {phase.submittedAt}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "10px 14px",
                                background: "#F0FDF4",
                                border: "1px solid #BBF7D0",
                                borderRadius: 8,
                              }}
                            >
                              <span
                                style={{
                                  color: "#16A34A",
                                  lineHeight: 0,
                                  flexShrink: 0,
                                }}
                              >
                                <IconCheck size={16} />
                              </span>
                              <div>
                                <span
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#16A34A",
                                  }}
                                >
                                  Verified & Approved by Client
                                </span>
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "#64748B",
                                    marginLeft: 8,
                                  }}
                                >
                                  {phase.approvedAt}
                                </span>
                              </div>
                            </div>
                            {phase.devNotes && (
                              <div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#94A3B8",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    marginBottom: 6,
                                  }}
                                >
                                  Developer Notes
                                </div>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: "#475569",
                                    lineHeight: 1.6,
                                    background: "#F8FAFC",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 8,
                                    padding: "12px 14px",
                                  }}
                                >
                                  {phase.devNotes}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Ready for review state */}
                        {isReview && (
                          <>
                            <div>
                              <div
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#94A3B8",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                  marginBottom: 6,
                                }}
                              >
                                Developer Submission Notes
                              </div>
                              <div
                                style={{
                                  background: "#F8FAFC",
                                  border: "1.5px solid #BFDBFE",
                                  borderRadius: 10,
                                  padding: "14px 16px",
                                }}
                              >
                                <p
                                  style={{
                                    margin: "0 0 10px",
                                    fontSize: 13.5,
                                    color: "#334155",
                                    lineHeight: 1.65,
                                  }}
                                >
                                  {phase.devNotes}
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 10,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <a
                                    href={phase.repoLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 6,
                                      padding: "7px 12px",
                                      background: "#fff",
                                      border: "1px solid #E2E8F0",
                                      borderRadius: 7,
                                      color: "#334155",
                                      fontSize: 12.5,
                                      fontWeight: 600,
                                      textDecoration: "none",
                                    }}
                                  >
                                    <IconGithub size={14} /> View Codebase{" "}
                                    <IconExternal size={11} />
                                  </a>
                                  {"prototypeLink" in phase &&
                                    phase.prototypeLink && (
                                      <a
                                        href={phase.prototypeLink as string}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 6,
                                          padding: "7px 12px",
                                          background: "#EFF6FF",
                                          border: "1px solid #BFDBFE",
                                          borderRadius: 7,
                                          color: "#2563EB",
                                          fontSize: 12.5,
                                          fontWeight: 600,
                                          textDecoration: "none",
                                        }}
                                      >
                                        <IconGlobe size={14} /> Live Preview{" "}
                                        <IconExternal size={11} />
                                      </a>
                                    )}
                                </div>
                              </div>
                            </div>

                            {/* Dispute modal inline */}
                            {disputeOpen === phase.num && (
                              <div
                                style={{
                                  background: "#FFFBEB",
                                  border: "1.5px solid #FDE68A",
                                  borderRadius: 10,
                                  padding: "16px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#D97706",
                                    marginBottom: 10,
                                  }}
                                >
                                  📋 Describe the revision request
                                </div>
                                <textarea
                                  value={disputeNote}
                                  onChange={(e) =>
                                    setDisputeNote(e.target.value)
                                  }
                                  placeholder="Explain what needs to be revised or what the issue is…"
                                  rows={3}
                                  style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    border: "1.5px solid #FDE68A",
                                    borderRadius: 8,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 13,
                                    outline: "none",
                                    resize: "vertical",
                                    boxSizing: "border-box",
                                    background: "#fff",
                                    color: "#0F172A",
                                    lineHeight: 1.55,
                                  }}
                                  onFocus={(e) =>
                                    (e.currentTarget.style.borderColor =
                                      "#D97706")
                                  }
                                  onBlur={(e) =>
                                    (e.currentTarget.style.borderColor =
                                      "#FDE68A")
                                  }
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 10,
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <button
                                    onClick={() => setDisputeOpen(null)}
                                    style={{
                                      padding: "7px 14px",
                                      borderRadius: 7,
                                      border: "1px solid #E2E8F0",
                                      background: "#fff",
                                      color: "#475569",
                                      fontSize: 13,
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      fontFamily: "Inter, sans-serif",
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleDispute(phase.num)}
                                    style={{
                                      padding: "7px 14px",
                                      borderRadius: 7,
                                      border: "none",
                                      background: "#D97706",
                                      color: "#fff",
                                      fontSize: 13,
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      fontFamily: "Inter, sans-serif",
                                    }}
                                  >
                                    Submit Flag
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Client action buttons */}
                            {disputeOpen !== phase.num && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 10,
                                  flexWrap: stacked ? "wrap" : "nowrap",
                                  paddingTop: 4,
                                }}
                              >
                                <button
                                  onClick={() => handleApprove(phase.num)}
                                  style={{
                                    flex: stacked ? "1 1 100%" : "unset",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    padding: "11px 24px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#16A34A",
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                    transition: "background 0.15s",
                                    boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "#15803D")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "#16A34A")
                                  }
                                >
                                  <IconCheck size={15} /> Verify & Approve
                                  Milestone
                                </button>
                                <button
                                  onClick={() => setDisputeOpen(phase.num)}
                                  style={{
                                    flex: stacked ? "1 1 100%" : "unset",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    padding: "11px 20px",
                                    borderRadius: 8,
                                    background: "transparent",
                                    color: "#D97706",
                                    border: "1.5px solid #D97706",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                    transition: "all 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.background = "#FFFBEB";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.background = "transparent";
                                  }}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                  >
                                    <path
                                      d="M7 2v5M7 9.5v1"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                    />
                                    <circle
                                      cx="7"
                                      cy="7"
                                      r="6"
                                      stroke="currentColor"
                                      strokeWidth="1.3"
                                    />
                                  </svg>
                                  Flag for Dispute / Request Revision
                                </button>
                              </div>
                            )}
                          </>
                        )}

                        {/* Disputed / overdue state */}
                        {isDisputed && (
                          <>
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                alignItems: "flex-start",
                                padding: "14px 16px",
                                background: "#FEF2F2",
                                border: "1.5px solid #FECACA",
                                borderRadius: 10,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 20,
                                  flexShrink: 0,
                                  marginTop: -1,
                                }}
                              >
                                ⚠️
                              </span>
                              <div>
                                <div
                                  style={{
                                    fontSize: 13.5,
                                    fontWeight: 700,
                                    color: "#DC2626",
                                    marginBottom: 4,
                                  }}
                                >
                                  Milestone Overdue & Disputed
                                </div>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: "#7F1D1D",
                                    lineHeight: 1.55,
                                  }}
                                >
                                  This milestone has exceeded the allowed
                                  deadline grace period by{" "}
                                  <strong>
                                    {phase.daysOverdue ?? 2} day
                                    {(phase.daysOverdue ?? 2) !== 1 ? "s" : ""}
                                  </strong>
                                  . System audit logs have been notified and the
                                  dispute has been escalated to the Platform
                                  Administrator for mediation.
                                </p>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                                alignItems: "center",
                                padding: "10px 14px",
                                background: "#FFFBEB",
                                border: "1px solid #FDE68A",
                                borderRadius: 8,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#92400E",
                                  fontWeight: 600,
                                  flex: 1,
                                }}
                              >
                                Platform admin Juanita Arceo has been notified.
                                Expected resolution within 48 hours.
                              </span>
                              <a
                                href="#"
                                style={{
                                  fontSize: 12.5,
                                  fontWeight: 700,
                                  color: "#D97706",
                                  textDecoration: "none",
                                  whiteSpace: "nowrap",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                View Audit Log <IconExternal size={11} />
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {isUpcoming && (
                      <div style={{ padding: "12px 22px 14px" }}>
                        <span
                          style={{
                            fontSize: 12.5,
                            color: "#94A3B8",
                            fontWeight: 500,
                          }}
                        >
                          Awaiting previous milestone completion · Deadline:{" "}
                          {phase.deadline}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Feedback panel (side or bottom) ──────────────────────────── */}
          {(panelOpen || !stacked) && (
            <div
              style={{
                width: stacked ? "100%" : 320,
                flexShrink: 0,
                position: stacked ? "relative" : "sticky",
                top: stacked ? "auto" : 80,
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                maxHeight: stacked ? "none" : "calc(100vh - 120px)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 18px 12px",
                  borderBottom: "1px solid #F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}
                  >
                    Collaboration Feed
                  </div>
                  <div
                    style={{ fontSize: 11.5, color: "#64748B", marginTop: 1 }}
                  >
                    Sprint 2 · Active Sprint
                  </div>
                </div>
                {stacked && (
                  <button
                    onClick={() => setPanelOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94A3B8",
                      lineHeight: 0,
                    }}
                  >
                    <IconClose size={16} />
                  </button>
                )}
              </div>

              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minHeight: 200,
                }}
              >
                {messages.map((msg) => {
                  const isClient = msg.role === "client";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        flexDirection: isClient ? "row-reverse" : "row",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${msg.avatarBg[0]}, ${msg.avatarBg[0]})`,
                          border: `1.5px solid ${msg.avatarBg[1]}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: msg.avatarBg[1],
                        }}
                      >
                        {msg.avatar}
                      </div>
                      <div style={{ maxWidth: "78%" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "baseline",
                            flexDirection: isClient ? "row-reverse" : "row",
                            marginBottom: 3,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 700,
                              color: "#334155",
                            }}
                          >
                            {msg.author}
                          </span>
                          <span style={{ fontSize: 10.5, color: "#94A3B8" }}>
                            {msg.time}
                          </span>
                        </div>
                        <div
                          style={{
                            padding: "9px 12px",
                            borderRadius: isClient
                              ? "12px 4px 12px 12px"
                              : "4px 12px 12px 12px",
                            background: isClient ? "#EFF6FF" : "#F8FAFC",
                            border: `1px solid ${isClient ? "#BFDBFE" : "#E2E8F0"}`,
                            fontSize: 13,
                            color: "#334155",
                            lineHeight: 1.55,
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={feedEndRef} />
              </div>

              {/* Input */}
              <div
                style={{
                  padding: "12px 14px",
                  borderTop: "1px solid #F1F5F9",
                  display: "flex",
                  gap: 8,
                }}
              >
                <input
                  type="text"
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Leave structured feedback…"
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: 8,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    outline: "none",
                    color: "#0F172A",
                    background: "#fff",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#2563EB")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#E2E8F0")
                  }
                />
                <button
                  onClick={sendMessage}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    border: "none",
                    background: feedbackMsg.trim() ? "#2563EB" : "#F1F5F9",
                    color: feedbackMsg.trim() ? "#fff" : "#94A3B8",
                    cursor: feedbackMsg.trim() ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8l12-6-6 12V9L2 8z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Enterprise Analytics ─────────────────────────────────────────────────────

// Categorical palette — 5 hues, fixed order, validated for CVD separation
const CAT5 = ["#2563EB", "#16A34A", "#D97706", "#7C3AED", "#0891B2"];

const techStackData = [
  { name: "Next.js", pct: 35, fill: CAT5[0] },
  { name: "Firebase", pct: 25, fill: CAT5[1] },
  { name: "Tailwind CSS", pct: 20, fill: CAT5[2] },
  { name: "Android/Kotlin", pct: 15, fill: CAT5[3] },
  { name: "PostgreSQL", pct: 5, fill: CAT5[4] },
];

const barangayData = [
  { name: "Apokon", projects: 45, fill: CAT5[0] },
  { name: "Mankilam", projects: 30, fill: CAT5[1] },
  { name: "Magugpo West", projects: 25, fill: CAT5[2] },
  { name: "Canocotan", projects: 18, fill: CAT5[3] },
  { name: "Visayan Vill.", projects: 12, fill: CAT5[4] },
];

const trajectoryData = [
  { month: "Mar", bids: 8, completions: 3 },
  { month: "Apr", bids: 14, completions: 7 },
  { month: "May", bids: 19, completions: 11 },
  { month: "Jun", bids: 26, completions: 18 },
  { month: "Jul", bids: 31, completions: 24 },
  { month: "Aug", bids: 38, completions: 29 },
];

const auditRows = [
  {
    ts: "Aug 10, 2026 · 11:42 AM",
    event: "Milestone Verified",
    role: "Enterprise Client",
    user: "Ernesto Dela Vega",
    status: "success",
  },
  {
    ts: "Aug 10, 2026 · 09:15 AM",
    event: "Automated Delay Alert Flagged",
    role: "System / Scheduler",
    user: "StartupMatch Bot",
    status: "warning",
  },
  {
    ts: "Aug 9, 2026 · 04:30 PM",
    event: "New Developer Verified",
    role: "Platform Admin",
    user: "Juanita Arceo",
    status: "success",
  },
  {
    ts: "Aug 9, 2026 · 01:05 PM",
    event: "Dispute Escalation Filed",
    role: "Enterprise Client",
    user: "Vivian Soriano",
    status: "danger",
  },
  {
    ts: "Aug 8, 2026 · 10:00 AM",
    event: "Project Bid Published",
    role: "Enterprise Client",
    user: "Ramon Villanueva",
    status: "info",
  },
];

const auditStatusCfg = {
  success: {
    bg: "#F0FDF4",
    color: "#16A34A",
    border: "#BBF7D0",
    label: "Verified",
  },
  warning: {
    bg: "#FFFBEB",
    color: "#D97706",
    border: "#FDE68A",
    label: "Alert",
  },
  danger: {
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#FECACA",
    label: "Escalated",
  },
  info: {
    bg: "#EFF6FF",
    color: "#2563EB",
    border: "#BFDBFE",
    label: "Published",
  },
};

// Shared recharts tooltip style
const tooltipStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

function ChartCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 22px 14px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
        {action}
      </div>
      <div style={{ padding: "16px 22px 20px" }}>{children}</div>
    </div>
  );
}

function AnalyticsAdminSidebar({
  active,
  onNav,
  collapsed,
}: {
  active: string;
  onNav: (id: string) => void;
  collapsed: boolean;
}) {
  return (
    <aside
      style={{
        width: collapsed ? 72 : 260,
        minHeight: "100vh",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 22px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: collapsed ? "auto" : 0,
            marginRight: collapsed ? "auto" : 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 14L7 6l3 5 3-7 2 3"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              StartupMatch
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
              Regional Admin · Tagum
            </div>
          </div>
        )}
      </div>
      <nav style={{ padding: "10px 0", flex: 1 }}>
        {adminNavItems.map(({ icon: Icon, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: collapsed ? "11px 0" : "11px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                border: "none",
                background: isActive ? "rgba(37,99,235,0.18)" : "transparent",
                color: isActive ? "#60A5FA" : "#94A3B8",
                borderLeft: isActive
                  ? "3px solid #2563EB"
                  : "3px solid transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              <Icon size={18} />
              {!collapsed && label}
            </button>
          );
        })}
      </nav>
      {!collapsed && (
        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              JA
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>
                Juanita Arceo
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>
                Regional Administrator
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function EnterpriseAnalyticsPage({
  isMobile,
  isTablet,
  collapsed,
  sidebarOpen,
  setSidebarOpen,
}: {
  isMobile: boolean;
  isTablet: boolean;
  collapsed: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const [analyticsNav, setAnalyticsNav] = useState("analytics");
  const [dateRange, setDateRange] = useState("Academic Year 2026");
  const isNarrow = isMobile || isTablet;

  const kpis = [
    {
      label: "Active Matching Agreements",
      value: "38",
      sub: "+12% this month",
      subColor: "#16A34A",
      icon: "🤝",
      trend: "up",
    },
    {
      label: "Milestone Fulfillment Rate",
      value: "94.2%",
      sub: "Above 90% target",
      subColor: "#16A34A",
      icon: "✅",
      trend: "up",
    },
    {
      label: "Verified PSITS Developers",
      value: "142",
      sub: "Across Tagum campuses",
      subColor: "#64748B",
      icon: "👩‍💻",
      trend: "neutral",
    },
    {
      label: "On-Time Sprint Delivery",
      value: "88.5%",
      sub: "Based on automated tracking",
      subColor: "#D97706",
      icon: "⏱",
      trend: "warning",
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}
      {(isMobile ? sidebarOpen : true) && (
        <div
          style={
            isMobile
              ? { position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50 }
              : {}
          }
        >
          <AnalyticsAdminSidebar
            active={analyticsNav}
            onNav={(id) => {
              setAnalyticsNav(id);
              setSidebarOpen(false);
            }}
            collapsed={collapsed}
          />
        </div>
      )}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #E2E8F0",
            padding: isMobile ? "12px 16px" : "13px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  lineHeight: 0,
                  padding: 4,
                }}
              >
                <IconMenu size={20} />
              </button>
            )}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#94A3B8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Regional Admin Dashboard
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                Enterprise Analytics
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              style={{
                background: "none",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                color: "#64748B",
                lineHeight: 0,
                position: "relative",
              }}
            >
              <IconBell size={16} />
              <span
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#DC2626",
                  border: "1.5px solid #fff",
                }}
              />
            </button>
            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 12px 5px 5px",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  JA
                </div>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  Juanita Arceo
                </span>
                <IconChevron size={12} />
              </div>
            )}
          </div>
        </div>

        <main
          style={{
            flex: 1,
            padding: isMobile ? "18px 14px 80px" : "28px 28px 80px",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {/* Page header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0 0 4px",
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: 800,
                  color: "#0F172A",
                  letterSpacing: "-0.03em",
                }}
              >
                Regional Enterprise Project Analytics
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                Decision-support data for the Tagum City IT student ecosystem ·{" "}
                {dateRange}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Date range filter */}
              <div style={{ position: "relative" }}>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{
                    padding: "8px 32px 8px 12px",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    background: "#fff",
                    fontSize: 13,
                    fontFamily: "Inter, sans-serif",
                    color: "#334155",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                  }}
                >
                  {["Last 30 Days", "Academic Year 2026", "All Sprints"].map(
                    (o) => (
                      <option key={o}>{o}</option>
                    ),
                  )}
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    pointerEvents: "none",
                    lineHeight: 0,
                  }}
                >
                  <IconChevron size={13} />
                </span>
              </div>
              {/* Export button */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#2563EB",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 2v7M4 6l3 3 3-3M2 11h10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {!isMobile && "Export Report"} (PDF/Excel)
              </button>
            </div>
          </div>

          {/* ── KPI row ────────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                  ? "1fr 1fr"
                  : "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {kpis.map((kpi, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  padding: "20px 22px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background accent stripe */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: CAT5[i],
                    borderRadius: "12px 12px 0 0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      lineHeight: 1.4,
                      maxWidth: 140,
                    }}
                  >
                    {kpi.label}
                  </span>
                  <span style={{ fontSize: 20 }}>{kpi.icon}</span>
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 28 : 32,
                    fontWeight: 900,
                    color: "#0F172A",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {kpi.value}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {kpi.trend === "up" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 9L6 3l4 6"
                        stroke={kpi.subColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {kpi.trend === "warning" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 2v4M6 8.5v.5"
                        stroke={kpi.subColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: kpi.subColor,
                    }}
                  >
                    {kpi.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts row ─────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr",
              gap: 20,
            }}
          >
            {/* Tech Stack Distribution — horizontal bar */}
            <ChartCard
              title="Tech Stack Distribution"
              subtitle="Technology demand among local MSME projects"
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={techStackData}
                  layout="vertical"
                  margin={{ top: 4, right: 36, left: 0, bottom: 0 }}
                  barSize={14}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                      fontFamily: "Inter, sans-serif",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={104}
                    tick={{
                      fontSize: 12,
                      fill: "#475569",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${v}%`, "Share"]}
                  />
                  <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                    {techStackData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 14px",
                  marginTop: 10,
                }}
              >
                {techStackData.map((d) => (
                  <span
                    key={d.name}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11.5,
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: d.fill,
                        flexShrink: 0,
                      }}
                    />
                    {d.name} <span style={{ color: "#94A3B8" }}>{d.pct}%</span>
                  </span>
                ))}
              </div>
            </ChartCard>

            {/* Barangay Distribution — vertical bar */}
            <ChartCard
              title="Business Distribution by Barangay"
              subtitle="Project requests across Tagum City commercial zones"
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={barangayData}
                  margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                  barSize={28}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                      fontFamily: "Inter, sans-serif",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                      fontFamily: "Inter, sans-serif",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [v, "Projects"]}
                  />
                  <Bar dataKey="projects" radius={[4, 4, 0, 0]}>
                    {barangayData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 14px",
                  marginTop: 10,
                }}
              >
                {barangayData.map((d) => (
                  <span
                    key={d.name}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11.5,
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: d.fill,
                        flexShrink: 0,
                      }}
                    />
                    {d.name}{" "}
                    <span style={{ color: "#94A3B8" }}>{d.projects}</span>
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* ── Trajectory chart (full width) ──────────────────────── */}
          <ChartCard
            title="Monthly Project Onboarding & Completion Trajectory"
            subtitle="New project bids initiated vs. verified milestones completed · 6-month capstone window"
            action={
              <div style={{ display: "flex", gap: 14 }}>
                {[
                  { label: "Bids Initiated", color: CAT5[0] },
                  { label: "Milestones Completed", color: CAT5[1] },
                ].map((l) => (
                  <span
                    key={l.label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 3,
                        borderRadius: 2,
                        background: l.color,
                        display: "inline-block",
                      }}
                    />
                    {!isMobile && l.label}
                  </span>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={trajectoryData}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradBids" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CAT5[0]} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={CAT5[0]} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient
                    id="gradCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={CAT5[1]} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={CAT5[1]} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F1F5F9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: "#94A3B8",
                    fontFamily: "Inter, sans-serif",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#94A3B8",
                    fontFamily: "Inter, sans-serif",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number, name: string) => [
                    v,
                    name === "bids" ? "Bids Initiated" : "Milestones Completed",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="bids"
                  stroke={CAT5[0]}
                  strokeWidth={2}
                  fill="url(#gradBids)"
                  dot={{ r: 4, fill: CAT5[0], strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{
                    r: 6,
                    fill: CAT5[0],
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  stroke={CAT5[1]}
                  strokeWidth={2}
                  fill="url(#gradCompleted)"
                  dot={{ r: 4, fill: CAT5[1], strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{
                    r: 6,
                    fill: CAT5[1],
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Audit log table ────────────────────────────────────── */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                padding: "18px 22px 14px",
                borderBottom: "1px solid #F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}
                >
                  Recent System Activity & Dispute Alerts
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                  Automated telemetry · last 48 hours
                </div>
              </div>
              <a
                href="#"
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#2563EB",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                View Full Audit Log <IconExternal size={11} />
              </a>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {[
                      "Timestamp",
                      "Event",
                      "User Role",
                      "Triggered By",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 18px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#94A3B8",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          borderBottom: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditRows.map((row, i) => {
                    const s =
                      auditStatusCfg[row.status as keyof typeof auditStatusCfg];
                    return (
                      <tr
                        key={i}
                        style={{
                          borderBottom:
                            i < auditRows.length - 1
                              ? "1px solid #F8FAFC"
                              : "none",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#FAFCFF")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "13px 18px",
                            color: "#64748B",
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            fontFamily: "monospace",
                          }}
                        >
                          {row.ts}
                        </td>
                        <td
                          style={{
                            padding: "13px 18px",
                            fontWeight: 600,
                            color: "#0F172A",
                          }}
                        >
                          {row.event}
                        </td>
                        <td style={{ padding: "13px 18px", color: "#64748B" }}>
                          <span
                            style={{
                              background: "#F1F5F9",
                              color: "#475569",
                              fontSize: 11.5,
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: 99,
                            }}
                          >
                            {row.role}
                          </span>
                        </td>
                        <td style={{ padding: "13px 18px", color: "#475569" }}>
                          {row.user}
                        </td>
                        <td style={{ padding: "13px 18px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "3px 9px",
                              borderRadius: 99,
                              background: s.bg,
                              border: `1px solid ${s.border}`,
                              color: s.color,
                              fontSize: 11.5,
                              fontWeight: 700,
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: s.color,
                                flexShrink: 0,
                              }}
                            />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── PendingVerification placeholder (for unverified roles) ──────────────────
// Shown when a non-admin user is authenticated but not 'Verified'.
// Per clarification #2: displays a centered status card instead of feature UI.
function PendingVerification({
  role,
  verification,
  onLogout,
}: {
  role: AppRole;
  verification: string;
  onLogout: () => void;
}) {
  // Determine human-readable role label
  const roleLabel =
    role === "student"
      ? "Student Developer"
      : role === "enterprise"
        ? "Enterprise Client"
        : role;
  const isRejected = verification === "Rejected";
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Card
        style={{
          maxWidth: 560,
          width: "100%",
          padding: 32,
          textAlign: "center" as const,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            margin: "0 auto 16px",
            background: isRejected ? "#FEF2F2" : "#FFFBEB",
            border: `1.5px solid ${isRejected ? "#FECACA" : "#FDE68A"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          {isRejected ? "✕" : "⏳"}
        </div>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 20,
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: "-0.02em",
          }}
        >
          {isRejected ? "Verification Rejected" : "Verification Pending"}
        </h2>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13.5,
            color: "#64748B",
            lineHeight: 1.6,
          }}
        >
          Your <strong style={{ color: "#334155" }}>{roleLabel}</strong> account
          status is <StatusPill status={verification} />.
          {isRejected
            ? " Please review your submitted documents and re-apply or contact your PSITS chapter."
            : " A PSITS Moderator will review your documents shortly. You will gain access to your dashboard once verified."}
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onLogout}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              background: "#fff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Back to Login
          </button>
          {!isRejected && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                color: "#2563EB",
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              <IconShield size={14} /> In partnership with PSITS Tagum
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<AppPage>("auth");
  const project = useProjectStore();
  const profile = useDevProfile();
  const clientProfile = useClientProfile();
  const [devNav, setDevNav] = useState("dashboard");
  const [adminNav, setAdminNav] = useState("verification");
  const [sprintNav, setSprintNav] = useState("sprint");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // ─── Role-based access (Option B: Strict Separation) ────────────────────
  // Resolved on sign-in from AuthPage email+role; drives switcher visibility & guards.
  // Best practice: single source of truth (roleAccess.ts) + memoization to avoid re-renders.
  const [appRole, setAppRole] = useState<AppRole>("guest");
  // Track raw auth verification string for PendingVerification UI (null = guest)
  const [authVerification, setAuthVerification] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const collapsed = isTablet;

  // ─── Derived auth & gating ─────────────────────────────────────────────
  // isAuthenticated: only true after successful sign-in (page !== 'auth' + role !== guest)
  const isAuthenticated = page !== "auth" && appRole !== "guest";
  // isPending: non-admin unverified users see placeholder instead of feature pages
  const activeVerification =
    appRole === "enterprise"
      ? clientProfile.verificationStatus
      : profile.verificationStatus;
  const showPending =
    isAuthenticated && isPendingVerification(appRole, activeVerification);

  // Memoized visible pages for switcher — filters out 'auth' always (per spec: Hide Login & Registration)
  // Performance: O(7) small array — cheap, but memoized to avoid new array identity per render.
  const visiblePages = (() => {
    try {
      if (!isAuthenticated) return [] as AppPage[];
      const allowed = getAllowedPages(appRole);
      // Filter out 'auth' (hidden per spec) and keep order from ALL_SWITCHER_PAGES
      return (ALL_SWITCHER_PAGES as readonly AppPage[]).filter(
        (p) => p !== "auth" && allowed.includes(p),
      );
    } catch {
      return [] as AppPage[];
    }
  })();

  // ─── Route guard: prevent deep navigation to unauthorized page ──────────
  // Edge case: user manually calls setPage('analytics') as student → redirect to first allowed.
  // Also handles corrupted page state on hot-reload.
  useEffect(() => {
    try {
      if (!isAuthenticated) return;
      if (showPending) return; // pending users stay on current page but see placeholder
      if (!isPageAllowed(page, appRole)) {
        const fallback = ROLE_PAGE_MAP[appRole]?.[0];
        if (fallback && fallback !== page) {
          // Use queueMicrotask to avoid setState during render
          queueMicrotask(() => setPage(fallback));
        }
      }
    } catch {
      // Error handling: fail closed — reset to auth on unexpected exception
      queueMicrotask(() => {
        setAppRole("guest");
        setAuthVerification(null);
        setPage("auth");
      });
    }
  }, [page, appRole, isAuthenticated, showPending]);

  // ─── Logout handler ─────────────────────────────────────────────────────
  // Resets role & verification and returns to auth; switcher automatically hides via isAuthenticated.
  const handleLogout = () => {
    try {
      // Reset to default profiles (clears verification override if any)
      signInAs(undefined);
      signInAsClient(undefined);
    } catch {
      /* ignore store reset errors */
    }
    setAppRole("guest");
    setAuthVerification(null);
    setPage("auth");
    setSidebarOpen(false);
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      {/* Page switcher strip — only after login, hides Login & Registration (auth) */}
      {/* Spec: "Only show after login" + "Hide Login & Registration screen in page switcher" */}
      {isAuthenticated && visiblePages.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0F172A",
            borderRadius: 99,
            padding: "5px 6px",
            display: "flex",
            gap: 4,
            zIndex: 200,
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            maxWidth: "90vw",
            overflowX: "auto",
          }}
        >
          {visiblePages.map((pid) => {
            const meta = PAGE_META[pid];
            const isActive = page === pid;
            return (
              <button
                key={pid}
                onClick={() => setPage(pid)}
                aria-selected={isActive}
                style={{
                  padding: "7px 16px",
                  borderRadius: 99,
                  border: "none",
                  background: isActive ? "#2563EB" : "transparent",
                  color: isActive ? "#fff" : "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      )}

      {page === "auth" ? (
        <AuthPage
          onSignedIn={(email, role) => {
            // ─── Resolve role via centralized helper (handles edge cases: trimming, case, unknown email) ──
            // Best practice: single source of truth in roleAccess.ts; never duplicate heuristics.
            let resolved: AppRole;
            try {
              resolved = resolveRole(email, role);
            } catch {
              resolved = "student"; // fail closed to least privilege
            }
            setAppRole(resolved);
            // Track verification for Pending UI (derived later from store as well)
            try {
              // Update stores first so profile.verificationStatus reflects signed-in identity
              if (resolved === "enterprise") {
                signInAsClient(email);
                // After store update, verification is available via useClientProfile -> activeVerification
                const v =
                  email.trim().toLowerCase() ===
                  "rvillanueva@davaofrutis.com.ph"
                    ? "Pending Review"
                    : undefined;
                setAuthVerification(v ?? null);
                setPage("specform"); // Verified Business Owner → Post a Project (specform) per spec; pending shows placeholder
              } else if (resolved === "admin") {
                // PSITS Moderator: also populate dev profile so own Developer Profile is editable (clarification #4)
                signInAs(email);
                setAuthVerification(null);
                setPage("admin");
              } else {
                signInAs(email);
                setAuthVerification(null);
                setPage("developer");
                setDevNav("dashboard");
              }
            } catch {
              // Error handling: store update failed — stay on auth with role set for retry
              setPage("auth");
            }
          }}
        />
      ) : page === "developer" ? (
        showPending ? (
          <PendingVerification
            role={appRole}
            verification={activeVerification}
            onLogout={handleLogout}
          />
        ) : (
          <div style={{ display: "flex" }}>
            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                  zIndex: 40,
                }}
              />
            )}
            {(isMobile ? sidebarOpen : true) && (
              <div
                style={
                  isMobile
                    ? {
                        position: "fixed",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 50,
                      }
                    : {}
                }
              >
                <DevSidebar
                  active={devNav}
                  onNav={(id) => {
                    setDevNav(id);
                    setSidebarOpen(false);
                  }}
                  collapsed={collapsed}
                />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              {isMobile && (
                <div
                  style={{
                    background: "#fff",
                    borderBottom: "1px solid #E2E8F0",
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    position: "sticky",
                    top: 0,
                    zIndex: 30,
                  }}
                >
                  <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#475569",
                      padding: 4,
                      lineHeight: 0,
                    }}
                  >
                    <IconMenu size={20} />
                  </button>
                  <div
                    style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}
                  >
                    StartupMatch
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      marginLeft: "auto",
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid #E2E8F0",
                      background: "#fff",
                      color: "#64748B",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
              {!isMobile && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "12px 32px 0 32px",
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid #E2E8F0",
                      background: "#fff",
                      color: "#64748B",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
              <main
                style={{
                  padding: isMobile ? "20px 16px 80px" : "32px 32px 80px",
                }}
              >
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                  {devNav === "dashboard" ? (
                    <DeveloperProfile isMobile={isMobile} />
                  ) : devNav === "marketplace" ? (
                    <MarketplaceFeed isMobile={isMobile} />
                  ) : devNav === "bids" ? (
                    <BidsView />
                  ) : devNav === "messages" ? (
                    <DevStub
                      title="Messages"
                      message="Private conversations with clients and collaborators will appear here."
                    />
                  ) : (
                    <DevStub
                      title="Settings"
                      message="Manage your account, notifications, and public profile preferences."
                    />
                  )}
                </div>
              </main>
            </div>
          </div>
        )
      ) : page === "admin" ? (
        <div style={{ display: "flex" }}>
          {isMobile && sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 40,
              }}
            />
          )}
          {(isMobile ? sidebarOpen : true) && (
            <div
              style={
                isMobile
                  ? {
                      position: "fixed",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      zIndex: 50,
                    }
                  : {}
              }
            >
              <AdminSidebar
                active={adminNav}
                onNav={(id) => {
                  setAdminNav(id);
                  setSidebarOpen(false);
                }}
                collapsed={collapsed}
              />
            </div>
          )}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Admin top bar */}
            <div
              style={{
                background: "#fff",
                borderBottom: "1px solid #E2E8F0",
                padding: isMobile ? "12px 16px" : "14px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 30,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94A3B8",
                      lineHeight: 0,
                      padding: 4,
                    }}
                  >
                    <IconMenu size={20} />
                  </button>
                )}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94A3B8",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Regional Admin Dashboard
                  </div>
                  <div
                    style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}
                  >
                    StartupMatch · Tagum City
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  style={{
                    background: "none",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    padding: "6px 8px",
                    cursor: "pointer",
                    color: "#64748B",
                    position: "relative",
                    lineHeight: 0,
                  }}
                >
                  <IconBell size={16} />
                  <span
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#DC2626",
                      border: "1.5px solid #fff",
                    }}
                  />
                </button>
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "5px 12px 5px 5px",
                      border: "1px solid #E2E8F0",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      JA
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      Juanita Arceo
                    </span>
                    <IconChevron size={12} />
                  </div>
                )}
                {/* Logout — always accessible post-login */}
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid #E2E8F0",
                    background: "#fff",
                    color: "#64748B",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>

            <main
              style={{
                flex: 1,
                padding: isMobile ? "20px 16px 80px" : "28px 32px 80px",
                overflowY: "auto",
              }}
            >
              <VerificationQueue isMobile={isMobile} isTablet={isTablet} />
            </main>
          </div>
        </div>
      ) : page === "sprint" ? (
        showPending ? (
          <PendingVerification
            role={appRole}
            verification={activeVerification}
            onLogout={handleLogout}
          />
        ) : (
          /* ── Sprint Dashboard ────────────────────────────────────────── */
          <div style={{ display: "flex" }}>
            {isMobile && sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                  zIndex: 40,
                }}
              />
            )}
            {(isMobile ? sidebarOpen : true) && (
              <div
                style={
                  isMobile
                    ? {
                        position: "fixed",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 50,
                      }
                    : {}
                }
              >
                <SprintSidebar
                  active={sprintNav}
                  onNav={(id) => {
                    setSprintNav(id);
                    setSidebarOpen(false);
                  }}
                  collapsed={collapsed}
                />
              </div>
            )}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Sprint top bar */}
              <div
                style={{
                  background: "#fff",
                  borderBottom: "1px solid #E2E8F0",
                  padding: isMobile ? "12px 16px" : "13px 32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "sticky",
                  top: 0,
                  zIndex: 30,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {isMobile && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94A3B8",
                        lineHeight: 0,
                        padding: 4,
                      }}
                    >
                      <IconMenu size={20} />
                    </button>
                  )}
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Student Developer Module
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#0F172A",
                      }}
                    >
                      Sprint Dashboard
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Deadline chip */}
                  {!isMobile &&
                    (() => {
                      const due = project.phases.find(
                        (p) =>
                          p.status === "active" || p.status === "in_review",
                      );
                      return (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 12px",
                            borderRadius: 99,
                            background: "#FEF2F2",
                            border: "1px solid #FECACA",
                            color: "#DC2626",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#DC2626",
                            }}
                          />
                          {due
                            ? `Sprint ${due.number} due ${due.dev.deadline.split(",")[0]}`
                            : `Due ${project.deadline}`}
                        </span>
                      );
                    })()}
                  <button
                    style={{
                      background: "none",
                      border: "1px solid #E2E8F0",
                      borderRadius: 8,
                      padding: "6px 8px",
                      cursor: "pointer",
                      color: "#64748B",
                      position: "relative",
                      lineHeight: 0,
                    }}
                  >
                    <IconBell size={16} />
                    <span
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#DC2626",
                        border: "1.5px solid #fff",
                      }}
                    />
                  </button>
                  {!isMobile && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "5px 12px 5px 5px",
                        border: "1px solid #E2E8F0",
                        borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${profile.avatarColors[0]}, ${profile.avatarColors[0]})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: profile.avatarColors[1],
                        }}
                      >
                        {profile.initials}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        {profile.name}
                      </span>
                      <IconChevron size={12} />
                    </div>
                  )}
                  {/* Logout — always accessible post-login (best practice) */}
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid #E2E8F0",
                      background: "#fff",
                      color: "#64748B",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>

              <main
                style={{
                  flex: 1,
                  padding: isMobile ? "20px 16px 80px" : "28px 32px 80px",
                  overflowY: "auto",
                }}
              >
                {sprintNav === "dashboard" ? (
                  <SprintOverview
                    isMobile={isMobile}
                    isTablet={isTablet}
                    onNavigate={() => setSprintNav("sprint")}
                  />
                ) : sprintNav === "sprint" ? (
                  <SprintDashboard isMobile={isMobile} isTablet={isTablet} />
                ) : sprintNav === "bids" ? (
                  <DevStub
                    title="Bids"
                    message="Track and manage your project bids from one place."
                  />
                ) : sprintNav === "messages" ? (
                  <DevStub
                    title="Messages"
                    message="Private conversations with clients and collaborators will appear here."
                  />
                ) : (
                  <DevStub
                    title="Settings"
                    message="Manage your account, notifications, and public profile preferences."
                  />
                )}
              </main>
            </div>
          </div>
        )
      ) : page === "specform" ? (
        showPending ? (
          <PendingVerification
            role={appRole}
            verification={activeVerification}
            onLogout={handleLogout}
          />
        ) : (
          /* ── Project Spec Form ───────────────────────────────────────── */
          <ProjectSpecForm
            isMobile={isMobile}
            onBack={() => {
              // Role-aware back: enterprise → milestone, student/admin → developer, fallback to first allowed
              try {
                const allowed = ROLE_PAGE_MAP[appRole];
                if (appRole === "enterprise") setPage("milestone");
                else if (allowed?.includes("developer")) setPage("developer");
                else if (allowed?.[0]) setPage(allowed[0] as AppPage);
                else setPage("auth");
              } catch {
                setPage("auth");
              }
            }}
          />
        )
      ) : page === "milestone" ? (
        showPending ? (
          <PendingVerification
            role={appRole}
            verification={activeVerification}
            onLogout={handleLogout}
          />
        ) : (
          /* ── Client Milestone Tracking ──────────────────────────────── */
          <MilestoneTrackingPage
            isMobile={isMobile}
            isTablet={isTablet}
            collapsed={collapsed}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )
      ) : (
        /* ── Enterprise Analytics ────────────────────────────────────── */
        <EnterpriseAnalyticsPage
          isMobile={isMobile}
          isTablet={isTablet}
          collapsed={collapsed}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}
    </div>
  );
}
