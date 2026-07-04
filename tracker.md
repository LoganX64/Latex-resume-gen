# Project Tracker

## Current Status: Phase 12 Complete

---

## Phase Overview

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Scaffolding | ✅ Complete |
| 2 | shadcn/ui + Dependencies + Types + Store | ✅ Complete |
| 3 | Resume Editor UI | ✅ Complete |
| 4 | Live Preview | ✅ Complete |
| 5 | LaTeX Generation Engine | ✅ Complete |
| 6 | Backend API (Tectonic) | ✅ Complete |
| 7 | First 2 Templates | ✅ Complete |
| 8 | Remaining 8 Templates | ✅ Complete |
| 9 | UI Polish (Dark Mode, Shortcuts, Toasts) | ✅ Complete |
| 10 | Docker + README | ✅ Complete |
| 11 | Remove Redundant Templates + iframe Preview | ✅ Complete |
| 12 | Remove iframe Preview, Add HTML/CSS Preview | ✅ Complete |

---

## Git History

```
d9e6899 Phase 3: Resume editor UI with drag-and-drop, forms, and profile image upload
af109f5 Phase 2: shadcn/ui, dependencies, types, Zustand store
93b41c1 Phase 1: Project scaffolding
```

---

## Phase 1 - Scaffolding ✅

- [x] Git repository initialized
- [x] Frontend: Vite + React 19 + TypeScript + Tailwind CSS v4
- [x] Backend: Go 1.23 + Gin Framework + CORS
- [x] `npm run build` passes
- [x] `go build ./cmd/server` passes
- [x] Root `.gitignore` created
- [x] Frontend Dockerfile + nginx.conf
- [x] Backend Dockerfile
- [x] `docker-compose.yml` created
- [x] Full folder structure created

---

## Phase 2 - shadcn/ui + Dependencies + Types + Store ✅

### Dependencies Installed

| Package | Version | Status |
|---------|---------|--------|
| tailwindcss | 4.3.2 | ✅ |
| @tailwindcss/vite | 4.3.2 | ✅ |
| react | 19.0.0 | ✅ |
| react-dom | 19.0.0 | ✅ |
| @base-ui/react | latest | ✅ |
| zustand | 5.0.14 | ✅ |
| react-hook-form | 7.80.0 | ✅ |
| @hookform/resolvers | 5.4.0 | ✅ |
| zod | 4.4.3 | ✅ |
| @dnd-kit/core | 6.3.1 | ✅ |
| @dnd-kit/sortable | 10.0.0 | ✅ |
| @dnd-kit/utilities | 3.2.2 | ✅ |
| lucide-react | 1.23.0 | ✅ |
| react-easy-crop | 6.1.0 | ✅ |
| class-variance-authority | 0.7.1 | ✅ |
| clsx | 2.1.1 | ✅ |
| tailwind-merge | 3.3.0 | ✅ |

### shadcn/ui Components (13)

- [x] accordion
- [x] badge
- [x] button
- [x] card
- [x] dialog
- [x] input
- [x] label
- [x] scroll-area
- [x] select
- [x] separator
- [x] tabs
- [x] textarea
- [x] tooltip

### TypeScript Types Created

- [x] PersonalInfo
- [x] Experience
- [x] Education
- [x] SkillCategory
- [x] Project
- [x] Certification
- [x] Achievement
- [x] Publication
- [x] Language
- [x] CustomSection
- [x] SectionVisibility
- [x] SectionOrder
- [x] ResumeData
- [x] TemplateConfig
- [x] ZoomLevel
- [x] AppState

### Zustand Store

- [x] Resume data state
- [x] Template selection
- [x] Section ordering
- [x] Section visibility (show/hide)
- [x] UI state (dark mode, zoom)
- [x] localStorage persistence (autosave/restore)
- [x] All CRUD operations for all sections
- [x] Reorder operations for lists

### Other Files

- [x] Theme provider (dark/light mode)
- [x] Utility functions (cn, generateId, escapeLatex, formatDate)

---

## Build Verification

| Check | Phase 1 | Phase 2 |
|-------|---------|---------|
| Frontend `npm run build` | ✅ | ✅ |
| Backend `go build ./cmd/server` | ✅ | ✅ |
| TypeScript compilation | ✅ | ✅ |
| Vite production build | ✅ | ✅ |

---

## Phase 3 - Resume Editor UI ✅

### Files Created

| File | Purpose |
|------|---------|
| `src/layouts/MainLayout.tsx` | Split-screen layout (editor + preview) |
| `src/components/editor/Sidebar.tsx` | Left navigation sidebar |
| `src/components/editor/EditorPanel.tsx` | DnD-enabled editor panel |
| `src/components/editor/SectionWrapper.tsx` | Section card with DnD, show/hide, collapse |
| `src/components/editor/PersonalInfoForm.tsx` | Personal info form |
| `src/components/editor/ProfileImageUpload.tsx` | Profile image upload with crop dialog |
| `src/components/editor/SummaryForm.tsx` | Professional summary textarea |
| `src/components/editor/ExperienceForm.tsx` | Work experience (multiple entries, DnD) |
| `src/components/editor/SkillsForm.tsx` | Categorized skills (tags) |
| `src/components/editor/ProjectsForm.tsx` | Projects (multiple entries, DnD) |
| `src/components/editor/EducationForm.tsx` | Education (multiple entries, DnD) |
| `src/components/editor/CertificationsForm.tsx` | Certifications (multiple entries) |
| `src/components/editor/AchievementsForm.tsx` | Achievements (multiple entries) |
| `src/components/editor/PublicationsForm.tsx` | Publications (multiple entries) |
| `src/components/editor/LanguagesForm.tsx` | Languages with proficiency select |
| `src/components/editor/CustomSectionsForm.tsx` | Custom sections |

### Features Implemented

- [x] Split-screen layout (55% editor / 45% preview)
- [x] Left sidebar navigation with section links
- [x] PersonalInfo form with all fields (name, title, email, phone, location, linkedin, github, website)
- [x] Profile image upload with react-easy-crop dialog
- [x] Professional summary textarea with character count
- [x] Work experience with multiple entries, DnD reorder, bullet points
- [x] Skills with categorized tag system, add/remove
- [x] Projects with multiple entries, DnD, technologies tags
- [x] Education with multiple entries, DnD
- [x] Certifications, Achievements, Publications, Languages, Custom Sections
- [x] Drag-and-drop section reordering (via @dnd-kit)
- [x] Drag-and-drop item reordering within sections
- [x] Show/hide section toggle (eye icon)
- [x] Expand/collapse section toggle (chevron icon)
- [x] Dark mode toggle in header
- [x] Reset resume button
- [x] Export LaTeX/PDF placeholder buttons in preview header
- [x] All forms connected to Zustand store (autosave)
- [x] TypeScript compilation passes
- [x] Vite production build passes

---

## Phase 4 - Live Preview ✅

### Files Created

| File | Purpose |
|------|---------|
| `src/components/preview/ResumePreview.tsx` | A4 page simulation with zoom, content rendering |
| `src/components/preview/OverflowIndicator.tsx` | Overflow warnings and character counters |

### Features Implemented

- [x] A4 page simulation (210x297mm at 96 DPI)
- [x] Realistic margins (20mm top/bottom, 15mm sides)
- [x] Page shadow effect
- [x] Zoom controls: 50%, 75%, 100%, 125%, 150%, Fit Width
- [x] Zoom selector dropdown + zoom in/out buttons
- [x] Overflow detection (page content exceeding A4 height)
- [x] Red ring indicator when content overflows
- [x] "Exceeds one A4 page" warning banner
- [x] Soft limit warnings: Summary (500 chars), Experience (5 entries, 6 bullets), Projects (4 entries, 5 bullets)
- [x] Live character/entry counters in bottom bar
- [x] Full resume content rendering (all section types)
- [x] Section headers with proper formatting
- [x] Bullet points, dates, locations, technologies
- [x] TypeScript compilation passes
- [x] Vite production build passes

---

## Phase 5 - LaTeX Generation Engine ✅

### Files Created

| File | Purpose |
|------|---------|
| `src/services/latex-generator.ts` | Main LaTeX generation engine with section generators |
| `src/utils/download.ts` | File download utilities |

### Features Implemented

- [x] Complete LaTeX document generator with proper preamble
- [x] LaTeX special character escaping (\\, &, %, $, #, _, {}, ~, ^)
- [x] Base document structure (documentclass, packages, page setup)
- [x] Section generators for all 10 section types
- [x] Personal info header (centered name, title, contact info)
- [x] Professional summary section
- [x] Technical skills with tabular layout
- [x] Work experience with bullet points and date ranges
- [x] Projects with technologies, links, bullet points
- [x] Education with CGPA and date ranges
- [x] Certifications, Achievements, Publications, Languages
- [x] Custom sections support
- [x] Export .tex button wired up in preview header
- [x] Export PDF button wired up (calls /api/compile)
- [x] Clean, editable .tex output compatible with Overleaf/TeX Live/MiKTeX
- [x] TypeScript compilation passes
- [x] Vite production build passes

---

## Phase 6 - Backend API ✅

### Files Created

| File | Purpose |
|------|---------|
| `backend/internal/compiler/compiler.go` | Tectonic LaTeX compiler integration with temp dir management |

### Files Modified

| File | Changes |
|------|---------|
| `backend/cmd/server/handler.go` | Full compile handler with temp dir, file save, PDF return, cleanup |
| `backend/cmd/server/main.go` | Request size limit (5MB), CORS max age, structured constants |

### Features Implemented

- [x] POST /api/compile endpoint (accepts JSON with `latex` field)
- [x] Request validation (required latex field, non-empty check)
- [x] 5MB max request size limit
- [x] Temp directory creation per compilation request
- [x] Save resume.tex to temp directory
- [x] Tectonic LaTeX compiler integration (30s timeout)
- [x] Return compiled PDF as binary response
- [x] Cleanup temp files after compilation (defer)
- [x] Error handling for failed compilation (returns compiler output)
- [x] Proper HTTP status codes (400, 422, 500)
- [x] CORS configured for all origins
- [x] Go build passes
- [x] Frontend build passes

---

## Phase 7 - First 2 Templates ✅

### Files Created

| File | Purpose |
|------|---------|
| `src/templates/index.ts` | Template registry with dynamic import via import.meta.glob |
| `src/templates/classic/config.ts` | Classic Professional template configuration |
| `src/templates/classic/latex.ts` | Classic Professional LaTeX generator |
| `src/templates/classic/index.tsx` | Classic Professional React preview component |
| `src/templates/minimal/config.ts` | Minimal ATS template configuration |
| `src/templates/minimal/latex.ts` | Minimal ATS LaTeX generator |
| `src/templates/minimal/index.tsx` | Minimal ATS React preview component |

### Files Modified

| File | Changes |
|------|---------|
| `src/components/preview/ResumePreview.tsx` | Uses template-specific Preview via registry |
| `src/layouts/MainLayout.tsx` | Template selector dropdown, template-aware LaTeX export |

### Features Implemented

- [x] Template registry with auto-discovery via `import.meta.glob`
- [x] Classic Professional template (serif typography, centered header, ruled sections)
- [x] Minimal ATS template (sans-serif, compact, max ATS compatibility)
- [x] Each template has: config.ts, latex.ts, index.tsx (Preview)
- [x] Template selector dropdown in preview header
- [x] LaTeX export uses template-specific generator
- [x] PDF export uses template-specific generator
- [x] React preview renders template-specific component
- [x] All accessibility guidelines applied (aria-labels, focus-visible, semantic HTML)
- [x] Build passes

---

## Phase 9 - UI Polish ✅

### Files Created

| File | Purpose |
|------|---------|
| `src/components/ui/sonner.tsx` | Toast notification component (shadcn/ui + sonner) |
| `src/components/CommandPalette.tsx` | Command palette (⌘K) with shadcn/ui Command component |
| `src/hooks/useKeyboardShortcuts.ts` | Custom hook for keyboard shortcuts |

### Features Implemented

- [x] Toast notifications for all export actions (success + error)
- [x] Loading spinner on PDF export button during compilation
- [x] Better error messages (shows actual backend error, not just console)
- [x] Command palette (⌘K / Ctrl+K) with:
  - Export PDF (⌘P)
  - Export LaTeX (⌘L)
  - Template switching
  - Toggle dark/light mode (⌘D)
  - Reset resume
- [x] Keyboard shortcuts:
  - ⌘P / Ctrl+P — Export PDF
  - ⌘L / Ctrl+L — Export LaTeX
  - ⌘D / Ctrl+D — Toggle dark mode
- [x] Tooltips on all header buttons (Reset, Dark Mode, Command Palette, Export LaTeX, Export PDF)
- [x] Smooth theme transition (CSS 0.2s ease)
- [x] Fade-in and slide-up animation utilities
- [x] Responsive design — editor takes full width on mobile, preview hidden
- [x] Uses existing `downloadPdf` utility from `download.ts` instead of inline duplication
- [x] TypeScript compilation passes
- [x] Vite production build passes

---

## Project Complete

All 10 phases are done. The application is production-ready.

---

## Phase 11 - Remove Redundant Templates + iframe Preview 🔄

### Problem

1. **Multi-page PDFs**: LaTeX generators don't enforce single-page output
2. **Preview != PDF**: HTML preview and PDF use completely independent rendering engines
3. **Template redundancy**: FAANG is duplicate of Classic, Executive is duplicate of Academic

### Phase 11.1: Delete Redundant Templates ✅

- [x] Deleted `templates/faang/` directory (3 files)
- [x] Deleted `templates/executive/` directory (3 files)
- [x] Verified no hardcoded references remain

### Phase 11.2: Differentiate Minimal vs Compact ✅

- [x] **Minimal**: Removed `\titlerule`, changed bullets to `--` em-dash
- [x] **Compact**: Added two-column `tabularx` skills layout
- [x] Updated preview components to match LaTeX changes

### Phase 11.3: Add savetrees LaTeX Compression ✅

Added `\usepackage{savetrees}` to all 8 remaining templates:
- [x] `templates/classic/latex.ts`
- [x] `templates/google/latex.ts`
- [x] `templates/engineering/latex.ts`
- [x] `templates/minimal/latex.ts`
- [x] `templates/compact/latex.ts`
- [x] `templates/elegant/latex.ts`
- [x] `templates/sidebar/latex.ts`
- [x] `templates/academic/latex.ts`

Also tightened `\titlespacing*` from `{6pt}{4pt}` to `{4pt}{2pt}` in most templates.

### Phase 11.4: iframe Preview System ✅

#### 11.4.1: Backend - Inline PDF Mode

- [x] Added `Mode` field to `CompileRequest` struct
- [x] Add query parameter `?mode=inline` support
- [x] Return `Content-Disposition: inline` when mode=inline

#### 11.4.2: Frontend - usePdfPreview Hook

- [x] Create `frontend/src/hooks/usePdfPreview.ts`
- [x] Debounced compilation (1.5s)
- [x] Blob URL lifecycle management
- [x] Returns `{ pdfUrl, isCompiling, error }`

#### 11.4.3: Frontend - iframe Preview

- [x] Update `ResumePreview.tsx` to use iframe
- [x] Add loading/error states
- [x] Keep A4 container and zoom controls

#### 11.4.4: Frontend - MainLayout Update

- [x] Pass compilation state to preview

### Phase 11.5: Update Overflow Indicator ✅

- [x] Update soft limits: Summary 400 chars, Exp 4 entries, Proj 3 entries

### Phase 11.6: Update README.md ✅

- [x] Remove faang and executive from template table
- [x] Update template count to 8
- [x] Add iframe preview documentation
- [x] Add savetrees to tech stack
- [x] Update API docs with mode parameter
- [x] Add Preview System section

---

### Final Template Count: 8

| # | Template | Unique Feature |
|---|----------|----------------|
| 1 | Classic Professional | Traditional serif, ruled sections |
| 2 | Minimal ATS | Ultra-clean, no section rules, em-dash bullets |
| 3 | Modern Sidebar | Two-column TikZ layout |
| 4 | Engineering Resume | Dark blue accent, photo support, tabularx skills |
| 5 | Google Style | Blue accent color |
| 6 | Compact One Page | 9pt font, two-column skills grid |
| 7 | Academic Technical CV | fancyhdr, research-oriented labels |
| 8 | Elegant Professional | EB Garamond font, gray accent, photo support |

---

## Phase 12 - Remove iframe Preview, Add HTML/CSS Preview ✅

### Problem

The iframe-based PDF preview required backend compilation on every edit (1.5s debounce), adding latency and a hard dependency on the Go backend for preview functionality.

### Changes Implemented

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

### Build Verification

| Check | Status |
|-------|--------|
| TypeScript compilation | ✅ |
| Vite production build | ✅ |
