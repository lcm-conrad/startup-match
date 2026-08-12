# Startup-Match — Figma AI Prompt Kit

## Part 1: Design Token System
Paste this block at the top of *every* screen prompt so Figma AI stays consistent across screens.

```
DESIGN SYSTEM TOKENS:
- Primary color: #2563EB (blue-600) — CTAs, active nav states, links
- Secondary color: #0F172A (slate-900) — headers, primary text
- Success/Verified: #16A34A (green-600) — verification badges, "Completed" status
- Warning: #D97706 (amber-600) — approaching deadlines, "Disputed" status
- Danger: #DC2626 (red-600) — overdue, rejected, critical alerts
- Background: #F8FAFC (slate-50) — page background
- Surface/Card: #FFFFFF with 1px border #E2E8F0 (slate-200)
- Muted text: #64748B (slate-500)

Typography:
- Font family: Inter
- H1: 28px / semibold / slate-900
- H2: 20px / semibold / slate-900
- Body: 14px / regular / slate-700
- Caption/meta: 12px / medium / slate-500

Spacing & shape:
- Base spacing unit: 4px (use multiples: 8, 16, 24, 32)
- Card corner radius: 12px
- Button corner radius: 8px
- Card padding: 24px
- Grid: 12-column, max-width 1280px, 24px gutters
- Sidebar width: 260px (desktop), collapses to icon rail (72px) on tablet, hidden behind hamburger on mobile

Elevation:
- Card shadow: 0px 1px 3px rgba(0,0,0,0.08)
- Modal shadow: 0px 8px 24px rgba(0,0,0,0.16)
```

---

## Part 2: Screen 1 — Developer Marketplace Profile (Public View)

```
Design a single web page: "Developer Marketplace Profile" for Startup-Match, a
platform connecting verified student developers with local enterprise clients
in Tagum City, Philippines.

[PASTE DESIGN SYSTEM TOKENS BLOCK HERE]

LAYOUT (desktop, 1280px max-width, sidebar + main content):
- Left sidebar (260px): platform logo top-left, nav items with icons
  (Dashboard, Marketplace, Bids, Messages, Settings), active state uses
  primary color left-border accent + light blue background tint.
- Main content area, single column, max-width 900px, centered with 24px
  side padding.

HEADER CARD (top of main content, white surface, 12px radius, 24px padding):
- Left: circular avatar placeholder, 96px, with a small green checkmark
  badge overlapping bottom-right corner.
- Right of avatar: developer full name (H1), university/course line
  beneath in muted text (e.g. "BS Information Technology — [University]"),
  and a pill-shaped badge reading "PSITS Verified" in success green with
  a checkmark icon.
- Far right of card: primary button "Contact Developer" (filled, primary
  color) and secondary button "View Portfolio" (outline).
- Below name row: row of 3 small stat blocks — "Projects Completed",
  "Peer Validation Score", "Response Rate" — each showing a number and
  label in caption text.

TECH STACK SECTION (card below header):
- H2 "Technical Proficiencies"
- Wrapped row of skill tags/chips (rounded-full, light slate background,
  14px text) e.g. Next.js, Tailwind CSS, Firebase, TypeScript, PostgreSQL.
- Below tags: "Frameworks & Tools" subheading with a second smaller row
  of tags in a muted variant.

GITHUB & LINKS SECTION (card):
- H2 "Links & Repositories"
- List rows, each with a small icon (GitHub, LinkedIn, Portfolio site),
  the link label, and an external-link icon aligned right.

PROJECT HISTORY SECTION (card, full width):
- H2 "Project Fulfillment History"
- Table or stacked list of past projects, each row showing: project name,
  client company name, completion date, status pill (Completed = green,
  Disputed = amber), and a "View Details" text link aligned right.
- Empty state design note: if no history, show a centered muted message
  "No completed projects yet" with a subtle illustration placeholder.

PEER VALIDATION SECTION (card, sidebar-style, narrower):
- H2 "Peer Validation"
- Horizontal bar or radial score visual (0–5 scale) with numeric score
  large and bold, small text below citing number of reviews.

RESPONSIVE BEHAVIOR:
- Tablet (768–1024px): sidebar collapses to icon-only rail; header card
  stat blocks wrap to 2 columns.
- Mobile (<768px): sidebar becomes bottom tab bar or hamburger drawer;
  all cards stack full-width; header card avatar and name stack
  vertically instead of side-by-side.

Do not include any other screens or navigation destinations beyond what's
described above — this prompt is for this single screen only.
```

---

### Next screens to prompt (one at a time, same token block each time)
1. Developer Marketplace Profile *(above — done)*
2. Verification & Vetting Queue (Admin) — good second choice since it uses the same badge/status visual language
3. Developer Sprint Dashboard
4. Project Specification Creation Form
5. Client Milestone Tracking Dashboard
6. Enterprise Project Analytics
7. Login/Registration split-screen

Say which one you want next and I'll draft it the same way.
