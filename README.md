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
- **10 ATS-Friendly Templates** -- Classic, Minimal, Sidebar, Engineering, FAANG, Google, Executive, Compact, Academic, Elegant
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

### DevOps

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |
| Nginx | Frontend serving & API proxy |

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
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx   # Split-screen layout
│   │   ├── stores/
│   │   │   └── resume-store.ts  # Zustand global state
│   │   ├── types/
│   │   │   └── resume.ts        # TypeScript interfaces
│   │   ├── templates/           # 10 template directories
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

- **Node.js** 20+
- **Go** 1.23+
- **Tectonic** LaTeX engine (for PDF compilation)
- **Docker** (optional, for containerized deployment)

### Local Development

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

### Docker Deployment

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

---

## API

### POST /api/compile

Compile LaTeX source to PDF.

**Request:**

```json
{
  "latex": "\\documentclass{article}..."
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

10 ATS-friendly templates designed for IT professionals:

| # | Template | Description |
|---|----------|-------------|
| 1 | Classic Professional | Traditional clean layout |
| 2 | Minimal ATS | Ultra-clean, maximum ATS compatibility |
| 3 | Modern Sidebar | Two-column with sidebar |
| 4 | Engineering Resume | Technical-focused layout |
| 5 | FAANG Style | Optimized for top tech companies |
| 6 | Google Style | Clean, Google-inspired design |
| 7 | Executive Technical | Senior leadership focus |
| 8 | Compact One Page | Maximum content density |
| 9 | Academic Technical CV | Research-oriented format |
| 10 | Elegant Professional | Modern with subtle styling |

Each template includes a React preview component, LaTeX template, and configuration file.

---

## Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Scaffolding | Done |
| 2 | shadcn/ui + Dependencies + Types + Store | Done |
| 3 | Resume Editor UI | Done |
| 4 | Live Preview | Pending |
| 5 | LaTeX Generation Engine | Pending |
| 6 | Backend API (Tectonic) | Pending |
| 7 | First 2 Templates | Pending |
| 8 | Remaining 8 Templates | Pending |
| 9 | UI Polish (Dark Mode, Shortcuts, Toasts) | Pending |
| 10 | Docker + README | Done |

---

## License

MIT
