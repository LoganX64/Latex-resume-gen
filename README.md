# LaTeX Resume Generator

A production-quality, frontend-first resume builder for IT professionals. Create ATS-friendly, single-page A4 resumes with live preview, drag-and-drop section ordering, and LaTeX/PDF export.

---

## Features

- **Frontend-First Architecture** -- No authentication, no database, all data stored locally
- **Live Split-Screen Editor** -- Edit on the left, preview on the right with instant updates
- **Drag-and-Drop Section Ordering** -- Reorder resume sections and items with @dnd-kit
- **Show/Hide & Collapse Sections** -- Toggle section visibility and collapse for a cleaner workspace
- **Profile Image Upload** -- Upload and crop profile photos with react-easy-crop
- **Categorized Skills** -- Organize skills by category (Languages, Frameworks, Databases, etc.)
- **Multiple Entries** -- Support multiple experience, education, project, certification, and achievement entries
- **LaTeX Export** -- Generate clean, editable `.tex` files compatible with Overleaf, TeX Live, MiKTeX
- **PDF Export** -- Compile LaTeX to PDF via a Go backend using Tectonic
- **8 ATS-Friendly Templates** -- Classic, Minimal, Sidebar, Engineering, Google, Compact, Academic, Elegant
- **Live HTML/CSS Preview** -- Real-time preview renders resume content directly in the browser with no backend dependency for preview
- **Dark/Light Mode** -- Toggle between themes
- **Auto-Save** -- All changes persist to localStorage automatically
- **Responsive UI** -- Modern interface built with shadcn/ui and Tailwind CSS v4

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 6.x | Type safety |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | v4 | Utility-first styling |
| shadcn/ui | v2 (Base UI) | Component library |
| Zustand | 5.x | State management |
| React Hook Form | 7.x | Form handling |
| Zod | 4.x | Schema validation |
| @dnd-kit | latest | Drag-and-drop |
| Lucide React | latest | Icons |
| react-easy-crop | 6.x | Image cropping |

### Backend

| Technology | Purpose |
|------------|---------|
| Go 1.23+ | Runtime |
| Gin Framework | HTTP router |
| Tectonic | LaTeX to PDF compiler |
| gin-contrib/cors | CORS middleware |
| savetrees (LaTeX) | Automatic single-page compression |

### DevOps

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |
| Nginx | Frontend serving & API proxy |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User (Browser)                           │
│                          :3000                                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Container                            │
│                  (nginx:alpine)                                  │
│                                                                 │
│   ┌─────────────────┐     ┌──────────────────────────────────┐  │
│   │   React SPA     │     │        Nginx Proxy               │  │
│   │   (static)      │     │                                  │  │
│   │                 │     │  /api/* ──► http://backend:8080   │  │
│   │  fetch('/api/   │     │                                  │  │
│   │   compile')     │────►│  client_max_body_size 5M         │  │
│   │                 │     │  proxy_read_timeout 30s          │  │
│   └─────────────────┘     └──────────────┬───────────────────┘  │
│                                          │                      │
└──────────────────────────────────────────┼──────────────────────┘
                                           │ Docker Network
                                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Container                             │
│                (golang:1.23-alpine)                             │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                  Gin HTTP Server (:8080)                 │  │
│   │                                                          │  │
│   │  POST /api/compile  ──►  compiler.Compile()             │  │
│   │                                                          │  │
│   │  ┌──────────────────────────────────────────────────┐    │  │
│   │  │           Tectonic (LaTeX compiler)              │    │  │
│   │  │                                                  │    │  │
│   │  │  .tex ──► .pdf  (30s timeout)                    │    │  │
│   │  └──────────────────────────────────────────────────┘    │  │
│   │                                                          │  │
│   │  Response: application/pdf (binary)                      │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Request flow:**

1. User clicks **PDF Download** in the browser
2. React sends `POST /api/compile` with `{ "latex": "..." }`
3. Nginx proxies to backend container (`http://backend:8080`)
4. Go server writes `.tex` to temp directory
5. Tectonic compiles LaTeX to PDF (max 30s)
6. Go server returns PDF binary response
7. Nginx forwards PDF back to browser
8. Browser triggers file download

**Key details:**

| Component | Port | Note |
|-----------|------|------|
| Frontend (Nginx) | 3000 (host) → 80 (container) | Serves React SPA + proxies API |
| Backend (Go) | 8080 (host) → 8080 (container) | Gin server + Tectonic compiler |
| Tectonic | -- | Installed in backend image only |
| Docker Network | -- | Containers communicate via service names |

---

## Project Structure

```
latex-resume-gen/
├── frontend/
│   ├── src/
│   │   ├── assets/              # Static assets
│   │   ├── components/
│   │   │   ├── editor/          # Resume editor form components
│   │   │   │   ├── EditorPanel.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── SectionWrapper.tsx
│   │   │   │   ├── PersonalInfoForm.tsx
│   │   │   │   ├── ProfileImageUpload.tsx
│   │   │   │   ├── SummaryForm.tsx
│   │   │   │   ├── ExperienceForm.tsx
│   │   │   │   ├── SkillsForm.tsx
│   │   │   │   ├── ProjectsForm.tsx
│   │   │   │   ├── EducationForm.tsx
│   │   │   │   ├── CertificationsForm.tsx
│   │   │   │   ├── AchievementsForm.tsx
│   │   │   │   ├── PublicationsForm.tsx
│   │   │   │   ├── LanguagesForm.tsx
│   │   │   │   └── CustomSectionsForm.tsx
│   │   │   ├── preview/         # Preview components (Phase 4)
│   │   │   ├── theme-provider.tsx
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useKeyboardShortcuts.ts
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx   # Split-screen layout
│   │   ├── stores/
│   │   │   └── resume-store.ts  # Zustand global state
│   │   ├── types/
│   │   │   └── resume.ts        # TypeScript interfaces
│   │   ├── templates/           # 8 template directories
│   │   ├── lib/
│   │   │   └── utils.ts         # cn(), generateId(), escapeLatex()
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go          # Entry point
│   ├── internal/
│   │   ├── compiler/            # LaTeX compilation logic
│   │   ├── handlers/            # HTTP handlers
│   │   ├── middleware/           # CORS, etc.
│   │   └── utils/               # Helpers
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
├── docker-compose.yml
├── .gitignore
├── plan.md
├── tracker.md
└── README.md
```

---

## Getting Started

### Prerequisites

- **Docker** (recommended) — tectonic is included in the backend image
- **Node.js** 20+ (only for local dev without Docker)
- **Go** 1.23+ (only for local dev without Docker)
- **Tectonic** (only for local dev without Docker)

### Docker Deployment (Recommended)

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- PDF download works out of the box (tectonic is included in the backend image)

### Local Development (requires tectonic installed on host)

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` with API proxy to `http://localhost:8080`.

#### Backend

```bash
cd backend
go mod download
go run ./cmd/server
```

The API server runs at `http://localhost:8080`.

> **Note:** PDF export requires [Tectonic](https://tectonic-typesetting.github.io/book/latest/installation.html) installed and available in PATH.

### Profiling (pprof)

pprof is **disabled by default**. Enable it to profile CPU, memory, goroutines, and more.

```bash
# Start backend with pprof enabled
PPROF_ENABLED=true go run ./cmd/server

# Custom port (default: 6060)
PPROF_ENABLED=true PPROF_PORT=7070 go run ./cmd/server
```

Once running, open `http://localhost:6060/debug/pprof/` in your browser to see all available profiles.

**CLI usage:**

```bash
# CPU profile (30 seconds)
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30

# Heap allocations
go tool pprof http://localhost:6060/debug/pprof/heap

# Goroutine dump
go tool pprof http://localhost:6060/debug/pprof/goroutine
```

**Environment variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `PPROF_ENABLED` | `false` | Set to `true` to start pprof server |
| `PPROF_PORT` | `6060` | Port for pprof HTTP server |

---

## API

### POST /api/compile

Compile LaTeX source to PDF.

**Query Parameters:**

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `mode` | `attachment`, `inline` | `attachment` | `inline` returns PDF for iframe rendering; `attachment` triggers download |

**Request:**

```json
{
  "latex": "\\documentclass{article}...",
  "mode": "inline"
}
```

**Response:**

- `200 OK` -- `application/pdf` (binary)
- `400 Bad Request`:

```json
{
  "success": false,
  "message": "LaTeX compilation failed.",
  "errors": ["...compiler output..."]
}
```

**Constraints:**

- Max request size: 5 MB
- Timeout: 30 seconds

---

## Resume Sections

The editor supports these sections (all drag-and-drop reorderable):

| Section | Multiple Entries | DnD Reorder |
|---------|-----------------|-------------|
| Personal Information | -- | -- |
| Professional Summary | -- | -- |
| Work Experience | Yes | Yes |
| Technical Skills (Categorized) | Yes | Yes |
| Projects | Yes | Yes |
| Education | Yes | Yes |
| Certifications | Yes | -- |
| Achievements | Yes | -- |
| Publications | Yes | -- |
| Languages | Yes | -- |
| Custom Sections | Yes | -- |

---

## Templates

8 ATS-friendly templates designed for IT professionals:

| # | Template | Description |
|---|----------|-------------|
| 1 | Classic Professional | Traditional clean layout |
| 2 | Minimal ATS | Ultra-clean, no section rules, em-dash bullets |
| 3 | Modern Sidebar | Two-column with sidebar |
| 4 | Engineering Resume | Technical-focused with photo support |
| 5 | Google Style | Blue accent color |
| 6 | Compact One Page | Dense, two-column skills grid |
| 7 | Academic Technical CV | Research-oriented with fancyhdr |
| 8 | Elegant Professional | EB Garamond font, refined styling |

Each template includes a React preview component, LaTeX template, and configuration file. All templates use the `savetrees` package for automatic single-page compression.

---

## Preview System

The preview system renders resume content directly in the browser using HTML/CSS, providing instant feedback without requiring backend compilation.

**Flow:**
1. User edits resume content in the editor
2. Zustand store updates trigger a re-render of the preview component
3. Resume sections are rendered as styled HTML inside an A4-sized container
4. User sees a live representation of their resume with zoom controls

**Benefits:**
- Instant preview with no compilation delay
- No backend dependency for preview (backend only needed for PDF export)
- Collapsible sidebar with icon-only mode and hover tooltips

**Implementation:**
- `ResumePreview.tsx` renders all resume sections as styled HTML
- A4 page simulation (210x297mm) with realistic margins and page shadow
- Zoom controls (50%, 75%, 100%, 125%, 150%, Fit Width)
- Overflow detection monitors content against soft limits (summary chars, experience entries, project entries)

---

## License

MIT
