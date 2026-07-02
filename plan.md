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

## Phase 5: LaTeX Generation Engine

- [ ] Create LaTeX template engine with placeholder syntax
- [ ] Implement LaTeX special character escaping
- [ ] Create base template structure
- [ ] Implement section generators:
  - [ ] Personal info header
  - [ ] Professional summary
  - [ ] Technical skills
  - [ ] Work experience
  - [ ] Projects
  - [ ] Education
  - [ ] Certifications
  - [ ] Achievements
- [ ] Generate clean, editable .tex output
- [ ] Add export .tex functionality

---

## Phase 6: Backend API

- [ ] Implement POST /api/compile endpoint
- [ ] Add request validation (5MB max)
- [ ] Implement temp directory creation
- [ ] Save resume.tex to temp directory
- [ ] Integrate Tectonic LaTeX compiler
- [ ] Return compiled PDF
- [ ] Cleanup temp files after compilation
- [ ] Add error handling for failed compilation
- [ ] Add 30-second timeout
- [ ] Test endpoint

---

## Phase 7: First 2 Templates

### Classic Professional
- [ ] Create Preview.tsx component
- [ ] Create template.tex
- [ ] Create config.ts

### Minimal ATS
- [ ] Create Preview.tsx component
- [ ] Create template.tex
- [ ] Create config.ts

---

## Phase 8: Remaining 8 Templates

- [ ] Modern Sidebar template
- [ ] Engineering Resume template
- [ ] FAANG Style template
- [ ] Google Style template
- [ ] Executive Technical template
- [ ] Compact One Page template
- [ ] Academic Technical CV template
- [ ] Elegant Professional template

Each template needs:
- [ ] Preview.tsx
- [ ] template.tex
- [ ] config.ts

---

## Phase 9: UI Polish

- [ ] Dark mode toggle
- [ ] Keyboard shortcuts
- [ ] Command palette
- [ ] Toast notifications
- [ ] Smooth animations
- [ ] Responsive design
- [ ] Tooltip helpers

---

## Phase 10: Docker + README

- [x] Docker setup (docker-compose.yml)
- [x] Frontend Dockerfile
- [x] Backend Dockerfile
- [ ] README with setup instructions
- [ ] README with deployment instructions
- [ ] Test full Docker Compose workflow

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
