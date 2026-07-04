# Project Plan

## Todo List

---

## Phase 1: Scaffolding ✅

- [x] Initialize git repository
- [x] Create Vite + React 19 + TypeScript frontend
- [x] Install Tailwind CSS v4
- [x] Create Go + Gin backend
- [x] Verify frontend build passes
- [x] Verify backend build passes
- [x] Create root .gitignore
- [x] Create Dockerfiles (frontend + backend)
- [x] Create docker-compose.yml
- [x] Create nginx.conf with API proxy
- [x] Create full folder structure

---

## Phase 2: shadcn/ui + Dependencies + Types + Store ✅

- [x] Initialize shadcn/ui
- [x] Install shadcn/ui base components (Button, Input, Card, Dialog, Tabs, etc.)
- [x] Install Zustand for state management
- [x] Install React Hook Form + Zod
- [x] Install @dnd-kit/core + @dnd-kit/sortable
- [x] Install Lucide React icons
- [x] Install react-easy-crop for image cropping
- [x] Define TypeScript types:
  - [x] PersonalInfo
  - [x] Experience
  - [x] Education
  - [x] Skills (categorized)
  - [x] Projects
  - [x] Certifications
  - [x] Achievements
  - [x] Publications
  - [x] CustomSection
  - [x] ResumeData (main type)
  - [x] TemplateConfig
- [x] Build Zustand resume store
  - [x] Resume data state
  - [x] Template selection
  - [x] Section ordering
  - [x] UI state (dark mode, zoom)
  - [x] localStorage persistence (autosave/restore)
- [x] Create theme provider (dark/light mode)

---

## Phase 3: Resume Editor UI ✅

- [x] Build main layout (sidebar + split screen)
- [x] Build sidebar navigation
- [x] Build PersonalInfo form section
- [x] Build ProfessionalSummary form section
- [x] Build TechnicalSkills form section (categorized)
- [x] Build WorkExperience form section (multiple entries)
- [x] Build Projects form section (multiple entries)
- [x] Build Education form section (multiple entries)
- [x] Build Certifications form section
- [x] Build Achievements form section
- [x] Build CustomSection form section
- [x] Implement drag-and-drop section reordering
- [x] Implement show/hide sections
- [x] Implement expand/collapse sections
- [x] Add profile image upload with crop

---

## Phase 4: Live Preview ✅

- [x] Build A4 page simulation component (210x297mm)
- [x] Implement realistic margins and page shadow
- [x] Add zoom controls (50%, 75%, 100%, 125%, 150%, Fit Width)
- [x] Implement overflow detection
- [x] Add character counters for key sections
- [x] Add soft limits warning for Summary, Experience, Projects
- [x] Show "exceeds one page" warning

---

## Phase 5: LaTeX Generation Engine ✅

- [x] Create LaTeX template engine with placeholder syntax
- [x] Implement LaTeX special character escaping
- [x] Create base template structure
- [x] Implement section generators:
  - [x] Personal info header
  - [x] Professional summary
  - [x] Technical skills
  - [x] Work experience
  - [x] Projects
  - [x] Education
  - [x] Certifications
  - [x] Achievements
- [x] Generate clean, editable .tex output
- [x] Add export .tex functionality

---

## Phase 6: Backend API ✅

- [x] Implement POST /api/compile endpoint
- [x] Add request validation (5MB max)
- [x] Implement temp directory creation
- [x] Save resume.tex to temp directory
- [x] Integrate Tectonic LaTeX compiler
- [x] Return compiled PDF
- [x] Cleanup temp files after compilation
- [x] Add error handling for failed compilation
- [x] Add 30-second timeout
- [x] Test endpoint

---

## Phase 7: First 2 Templates ✅

### Classic Professional
- [x] Create Preview.tsx component
- [x] Create template.tex (latex.ts)
- [x] Create config.ts

### Minimal ATS
- [x] Create Preview.tsx component
- [x] Create template.tex (latex.ts)
- [x] Create config.ts

---

## Phase 8: Remaining 8 Templates ✅

- [x] Modern Sidebar template
- [x] Engineering Resume template
- [x] FAANG Style template
- [x] Google Style template
- [x] Executive Technical template
- [x] Compact One Page template
- [x] Academic Technical CV template
- [x] Elegant Professional template

Each template needs:
- [x] Preview.tsx
- [x] template.tex
- [x] config.ts

---

## Phase 9: UI Polish ✅

- [x] Dark mode toggle (already implemented, added tooltips)
- [x] Keyboard shortcuts (Cmd+P, Cmd+L, Cmd+D)
- [x] Command palette (Cmd+K)
- [x] Toast notifications (sonner)
- [x] Smooth animations (CSS transitions)
- [x] Responsive design (mobile-friendly)
- [x] Tooltip helpers on all buttons

---

## Phase 10: Docker + README ✅

- [x] Docker setup (docker-compose.yml)
- [x] Frontend Dockerfile
- [x] Backend Dockerfile
- [x] README with setup instructions
- [x] README with deployment instructions
- [x] Architecture diagram in README

---

## Dependency Installation Checklist

### Frontend
- [x] tailwindcss
- [x] @tailwindcss/vite
- [x] react
- [x] react-dom
- [x] @base-ui/react
- [x] shadcn/ui components (13)
- [x] zustand
- [x] react-hook-form
- [x] zod
- [x] @hookform/resolvers
- [x] @dnd-kit/core
- [x] @dnd-kit/sortable
- [x] @dnd-kit/utilities
- [x] lucide-react
- [x] react-easy-crop
- [x] class-variance-authority
- [x] clsx
- [x] tailwind-merge

### Backend
- [x] gin-gonic/gin
- [x] gin-contrib/cors

---

## Phase 11: Remove Redundant Templates + Differentiate Remaining ✅

### Problem

Two issues identified:
1. **Multi-page PDFs**: LaTeX generators don't enforce single-page output - content overflows to page 2
2. **Preview != PDF**: HTML preview (browser CSS) and PDF (LaTeX/Tectonic) use completely independent rendering engines with no visual parity

Additionally, template redundancy analysis reveals:
- **FAANG** is a character-for-character duplicate of **Classic** (only difference: section rule weight)
- **Executive** is a structural duplicate of **Academic** (only difference: font choice and labels)

### Root Cause

The preview and PDF are fundamentally different rendering systems:
- Preview: HTML/CSS with browser fonts, Tailwind spacing, CSS flexbox
- PDF: LaTeX with TeX fonts, TeX spacing, TeX layout engine
- Margins don't match (preview: 12-15mm vs LaTeX: 0.4in = 10.16mm)
- Font sizes don't map (CSS 7-10px vs TeX 9-11pt)
- Line heights differ (CSS 1.3-1.4 vs TeX ~1.2)

---

### Phase 11.1: Delete Redundant Templates ✅

- [x] Delete `templates/faang/` directory (config.ts, index.tsx, latex.ts)
- [x] Delete `templates/executive/` directory (config.ts, index.tsx, latex.ts)
- [x] Update README.md template table (remove faang and executive)
- [x] Verify no hardcoded references to faang/executive in stores or components

---

### Phase 11.2: Differentiate Minimal vs Compact ✅

**Minimal** (10pt) - "Ultra-clean ATS":
- [x] Remove `\titlerule` from section format (no underline, just bold text)
- [x] Keep `$\mid$` separators for contact
- [x] Use em-dash `--` instead of `\textbullet` for list items
- [x] Even cleaner, more minimal aesthetic

**Compact** (9pt) - "Dense one-pager":
- [x] Add two-column `tabularx` layout for skills section
- [x] Keep `$\cdot$` separators for contact
- [x] Tighter bullet spacing with `topsep=0pt`
- [x] Maximum content density

Files to modify:
- [x] `templates/minimal/latex.ts`
- [x] `templates/minimal/index.tsx`
- [x] `templates/compact/latex.ts`
- [x] `templates/compact/index.tsx`

---

### Phase 11.3: Enforce Single-Page PDFs (LaTeX Compression) ✅

Add `\usepackage{savetrees}` to all 8 remaining templates to auto-compress content:
- [x] `templates/classic/latex.ts`
- [x] `templates/google/latex.ts`
- [x] `templates/engineering/latex.ts`
- [x] `templates/minimal/latex.ts`
- [x] `templates/compact/latex.ts`
- [x] `templates/elegant/latex.ts`
- [x] `templates/sidebar/latex.ts`
- [x] `templates/academic/latex.ts`

Changes per template:
```latex
% Add to preamble
\usepackage{savetrees}

% Tighten section spacing (if not already tight)
\titlespacing*{\section}{0pt}{4pt}{2pt}
```

---

### Phase 11.4: iframe Preview System (Exact WYSIWYG) ✅

Replace HTML preview with actual LaTeX-compiled PDF rendered in an iframe.

#### 11.4.1: Backend - Add inline PDF support

**File:** `backend/internal/handlers/compile.go`

- [x] Add `Mode string` field to `CompileRequest` struct (default: "attachment")
- [x] Add query parameter `?mode=inline` support
- [x] When `mode=inline`: return `Content-Disposition: inline; filename=resume.pdf`
- [x] When `mode=attachment` (default): return `Content-Disposition: attachment; filename=resume.pdf`

#### 11.4.2: Frontend - New debounced compilation hook

**New file:** `frontend/src/hooks/usePdfPreview.ts`

- [x] Custom hook accepting `resume`, `sectionOrder`, `sectionVisibility`, `templateId`
- [x] Debounce changes by 1.5 seconds
- [x] On change, call `POST /api/compile?mode=inline` with generated LaTeX
- [x] Return `{ pdfUrl: string | null, isCompiling: boolean, error: string | null }`
- [x] Manage blob URL lifecycle (create/revoke) to prevent memory leaks
- [x] Track latest request via useRef to avoid stale responses

#### 11.4.3: Frontend - Replace HTML preview with iframe

**File:** `frontend/src/components/preview/ResumePreview.tsx`

- [x] Replace `<TemplatePreview>` with:
  - Loading state: Loader2 spinner + "Compiling preview..." text
  - Loaded state: `<iframe src={pdfUrl}>` filling the A4 container
  - Error state: error message + fallback hint
- [x] Keep A4-sized container, zoom controls, overflow detection

#### 11.4.4: Frontend - Update MainLayout

**File:** `frontend/src/layouts/MainLayout.tsx`

- [x] Pass `isCompiling` state from `usePdfPreview` to `ResumePreview`
- [x] Existing `handleExportPdf` flow remains unchanged (compiles on-demand for download)

---

### Phase 11.5: Update Overflow Indicator ✅

**File:** `frontend/src/components/preview/OverflowIndicator.tsx`

- [x] Update soft limits for compressed single-page layout:
  - Summary: 500 -> 400 chars
  - Experience entries: 5 -> 4
  - Project entries: 4 -> 3

---

### Phase 11.6: Update README.md ✅

**File:** `README.md`

- [x] Update Features section - add iframe preview
- [x] Update Architecture diagram - add preview flow
- [x] Update API section - document `?mode=inline` parameter
- [x] Add new "Preview System" section explaining iframe flow
- [x] Update Project Structure - add `hooks/usePdfPreview.ts`
- [x] Update Tech Stack - add `savetrees` (LaTeX) dependency
- [x] Remove faang and executive from template table
- [x] Update template count from 10 to 8

---

### Execution Order

1. **Phase 11.1** - Delete faang + executive (6 files)
2. **Phase 11.2** - Redesign minimal + compact (4 files)
3. **Phase 11.3** - LaTeX compression (8 files)
4. **Phase 11.4** - iframe preview (4 files, 1 new)
5. **Phase 11.5** - Overflow limits (1 file)
6. **Phase 11.6** - README (1 file)

### Final Template Count: 8 (down from 10)

| # | Template | Description |
|---|----------|-------------|
| 1 | Classic Professional | Traditional clean layout |
| 2 | Minimal ATS | Ultra-clean, no section rules |
| 3 | Modern Sidebar | Two-column with sidebar |
| 4 | Engineering Resume | Technical-focused with photo |
| 5 | Google Style | Blue accent color |
| 6 | Compact One Page | Dense, two-column skills |
| 7 | Academic Technical CV | Research-oriented with fancyhdr |
| 8 | Elegant Professional | EB Garamond font, refined |

---

### Summary

| Phase | Files Modified | Files Created | Files Deleted |
|-------|---------------|---------------|---------------|
| 11.1 | 0 | 0 | 6 |
| 11.2 | 4 | 0 | 0 |
| 11.3 | 8 | 0 | 0 |
| 11.4 | 3 | 1 | 0 |
| 11.5 | 1 | 0 | 0 |
| 11.6 | 1 | 0 | 0 |
| **Total** | **17** | **1** | **6** |

---

## Phase 12: Remove iframe Preview, Add HTML/CSS Preview ✅

### Problem

The iframe-based PDF preview required backend compilation on every edit (1.5s debounce), adding latency and a hard dependency on the Go backend for preview functionality.

### Changes

- [x] Replaced iframe PDF preview with direct HTML/CSS rendering in `ResumePreview.tsx`
- [x] Preview now reads resume data from Zustand store and renders styled HTML
- [x] Removed `usePdfPreview` hook dependency from preview component
- [x] Added collapsible sidebar with icon-only mode and hover tooltips
- [x] Added logo display in collapsed sidebar header
- [x] Added right border to sidebar

### Files Modified

| File | Changes |
|------|---------|
| `src/components/preview/ResumePreview.tsx` | Replaced iframe with HTML/CSS resume rendering |
| `src/components/editor/Sidebar.tsx` | Added collapse toggle, tooltips, icon-only mode, logo |
| `README.md` | Updated preview documentation |
| `plan.md` | Added Phase 12 |
| `tracker.md` | Added Phase 12 entry |

### Files No Longer Used by Preview

| File | Status |
|------|--------|
| `src/hooks/usePdfPreview.ts` | Still exists (used by nothing in preview), can be removed later |

---
