# Build a Frontend-First LaTeX Resume Generator

You are a senior Full Stack Engineer, React Architect, UI/UX Designer, Golang Backend Engineer, and LaTeX expert.

Build a **production-quality Resume Generator** specifically for **IT professionals**.

---

# Core Requirements

This is **NOT an AI application.**

Strictly **DO NOT** implement:

- AI resume writing
- ChatGPT integration
- LLM APIs
- Text suggestions
- Resume optimization using AI
- Skill recommendations
- Cover letter generation
- AI chatbot
- Auto-generated content

Every piece of resume content must be manually entered by the user.

---

# Project Goal

Create a modern, responsive Resume Builder that enables IT professionals to create professional ATS-friendly resumes.

The application should:

- Be frontend-first.
- Have no authentication.
- Have no database.
- Store everything locally.
- Generate editable LaTeX.
- Generate PDF through one backend endpoint.
- Support multiple ATS-friendly templates.
- Provide an excellent editing experience.

---

# Architecture

## Frontend

Use:

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- React Hook Form
- Zod
- @dnd-kit
- Lucide React
- TanStack Query (only if needed)
- Zustand for global state management

The frontend is responsible for:

- Resume editing
- Live preview
- Template selection
- Local storage
- Image upload
- Section management
- Drag-and-drop ordering
- LaTeX generation
- Downloading `.tex`
- Sending LaTeX to backend for PDF compilation

---

## Backend

Use **Go (Golang)**.

Preferred stack:

- Go 1.23+
- Gin Framework
- Tectonic LaTeX Engine

The backend should be extremely minimal.

It contains **only one API endpoint**.

No:

- Authentication
- Database
- ORM
- JWT
- User management
- Resume storage
- Business logic
- Sessions

Workflow:

1. Receive LaTeX.
2. Create a temporary directory.
3. Save `resume.tex`.
4. Compile using **Tectonic**.
5. Return generated PDF.
6. Delete all temporary files.

Endpoint:

POST `/api/compile`

Request

```json
{
  "latex": "complete latex document"
}
```

Response

- HTTP 200
- `application/pdf`

If compilation fails:

```json
{
  "success": false,
  "message": "LaTeX compilation failed.",
  "errors": ["...compiler output..."]
}
```

Requirements:

- Enable CORS
- Stateless server
- Maximum request size: 5 MB
- Timeout: 30 seconds

---

# Resume Scope

This application is exclusively for **IT-related resumes**.

Supported profiles include:

- Software Engineer
- Full Stack Developer
- Frontend Developer
- Backend Developer
- DevOps Engineer
- Cloud Engineer
- Machine Learning Engineer
- AI Engineer
- Cybersecurity Engineer
- QA Engineer
- Mobile Developer
- Data Scientist
- Computer Science Student
- IT Fresher

Do not design templates for non-technical professions.

---

# Resume Templates

Create **10 professionally designed ATS-friendly templates**.

Each template must include:

- React Preview Component
- Matching LaTeX Template
- Configuration File

Suggested templates:

1. Classic Professional
2. Minimal ATS
3. Modern Sidebar
4. Engineering Resume
5. FAANG Style
6. Google Style
7. Executive Technical
8. Compact One Page
9. Academic Technical CV
10. Elegant Professional

Each template must have:

- Unique typography
- Different spacing
- Different layout
- ATS compatibility
- Print-friendly formatting

Some templates support profile photos.

Others automatically disable photo support.

---

# Mandatory A4 Single-Page Requirement

**This is a strict requirement.**

Every resume template must generate a **single-page A4 resume** by default.

Specifications:

- Paper Size: A4 (210 × 297 mm)
- Portrait orientation
- ATS-friendly margins (0.5–0.75 inch)
- Optimized to fit on one page under normal usage

No template should be intentionally designed as a multi-page resume.

---

# Live Overflow Detection

Help users maintain a professional one-page resume.

Implement:

- Live page boundary indicator
- Remaining page space indicator
- Overflow detection
- Character counters
- Soft limits for:
  - Summary
  - Experience
  - Projects
  - Achievements

If the resume exceeds one page, display:

> Your resume exceeds one A4 page. Consider shortening some sections.

Do **not** automatically delete or truncate user content.

Allow users to export anyway.

---

# Resume Sections

Support:

- Personal Information
- Professional Title
- Professional Summary
- Technical Skills
- Programming Languages
- Frameworks
- Libraries
- Databases
- Cloud Platforms
- DevOps Tools
- Work Experience
- Projects
- Education
- Certifications
- Achievements
- Publications
- Open Source Contributions
- Languages
- Custom Sections

Support multiple entries wherever applicable.

---

# Dynamic Section Management

Every section must support:

- Drag-and-drop reordering
- Show / Hide
- Expand / Collapse
- Instant preview updates

The exported LaTeX and PDF must preserve the customized section order.

---

# Resume Editor

Create a split-screen interface.

Left Panel:

- Resume editor

Right Panel:

- Live preview

Requirements:

- Instant updates
- No refresh button
- No save button
- Automatic local autosave

---

# Live Preview

The preview should simulate an actual printable A4 page.

Include:

- Accurate A4 dimensions
- Realistic margins
- Page shadow
- Zoom:
  - 50%
  - 75%
  - 100%
  - 125%
  - 150%
  - Fit Width

The React preview is **only for visualization**.

The **LaTeX template is the source of truth** for all exports.

The preview should closely match the exported PDF.

---

# Profile Image

Templates supporting profile photos should include:

- Upload
- Crop
- Resize
- Circular option
- Square option

Templates without profile images should ignore uploaded photos.

---

# Projects

Each project supports:

- Project Name
- Description
- Bullet Points
- Technology Stack
- GitHub URL
- Live Demo URL
- Role
- Duration

Projects should be reorderable.

---

# Experience

Each experience supports:

- Company
- Position
- Location
- Start Date
- End Date
- Responsibilities
- Bullet Points

Entries should be reorderable.

---

# Education

Fields:

- Institution
- Degree
- Specialization
- CGPA
- Start Date
- End Date

---

# Skills

Create categorized skills.

Examples:

- Programming Languages
- Frontend
- Backend
- Frameworks
- Databases
- Cloud
- DevOps
- Testing
- Version Control
- Tools

Support:

- Add
- Edit
- Delete
- Drag-and-drop
- Category reordering

---

# Export

## Export LaTeX

Generate a clean, editable `.tex` file.

Compatible with:

- Overleaf
- TeX Live
- MiKTeX
- TeXstudio

## Export PDF

Workflow:

Generate LaTeX

↓

POST `/api/compile`

↓

Compile using Tectonic

↓

Return PDF

↓

Download PDF

---

# Local Storage

Store locally:

- Resume data
- Selected template
- Section order
- Theme
- User preferences

Restore automatically when the application loads.

No database should be used.

---

# ATS Requirements

Every template must be ATS-friendly.

Requirements:

- Standard section headings
- Machine-readable PDF
- Professional fonts
- Proper spacing
- Clean hierarchy
- Minimal colors
- No decorative graphics
- No unnecessary icons
- No complex tables for primary content

Templates should be optimized for modern software engineering recruitment.

---

# Template Engine

Store templates independently.

Example:

```
templates/
    classic/
        Preview.tsx
        template.tex
        config.ts

    minimal/
    sidebar/
    engineering/
    ...
```

Use placeholders such as:

```
{{name}}
{{title}}
{{email}}
{{phone}}
{{summary}}
{{skills}}
{{experience}}
{{projects}}
{{education}}
{{certifications}}
```

Escape all LaTeX special characters before compilation.

---

# User Interface

Design a modern premium UI using **shadcn/ui**.

Requirements:

- Responsive Design
- Dark Mode
- Light Mode
- Sidebar Navigation
- Smooth Animations
- Toast Notifications
- Beautiful Cards
- Professional Typography
- Keyboard Shortcuts
- Dialogs
- Drawers
- Dropdown Menus
- Tooltips
- Command Palette
- Tabs
- Accordion
- Resizable Panels
- Scroll Areas
- Skeleton Loaders
- Form Components
- Context Menus
- Popovers

Use **shadcn/ui** components wherever possible instead of building custom components.

Icons should use **Lucide React**.

---

# Folder Structure

```
frontend/
    src/
        assets/
        components/
        hooks/
        lib/
        pages/
        templates/
        types/
        utils/
        stores/
        services/
        layouts/

backend/
    cmd/
        server/

    internal/
        compiler/
        handlers/
        middleware/
        utils/

    temp/

    go.mod
```

---

# Code Quality

Use:

- TypeScript everywhere
- Reusable components
- Modular architecture
- Strong typing
- Error boundaries
- React Hook Form
- Zod validation
- ESLint
- Prettier

Follow modern React best practices.

---

# Deployment

Provide:

- Dockerfile for frontend
- Dockerfile for backend
- docker-compose.yml

The backend container should include:

- Go
- Tectonic
- Required dependencies

The project should run using:

```bash
docker compose up
```

without requiring users to install LaTeX manually.

---

# Deliverables

Generate a complete production-ready project including:

- React 19 + TypeScript + Vite frontend
- Tailwind CSS v4
- shadcn/ui
- Zustand state management
- Go (Golang) backend
- Gin Framework
- Tectonic integration
- Single `/api/compile` endpoint
- 10 ATS-friendly IT resume templates
- Single-page A4 templates
- Live preview
- Drag-and-drop section ordering
- Image upload with crop support
- Local autosave
- Export editable `.tex`
- Export compiled PDF
- Responsive UI
- Dark/Light mode
- Docker support
- README with setup and deployment instructions

The application must be modular, maintainable, scalable, and production-ready.

The backend must remain limited to LaTeX compilation only.

There must be:

- No authentication
- No database
- No user accounts
- No resume storage
- No AI functionality

The application should provide a professional experience comparable to commercial resume builders while focusing exclusively on **single-page A4 ATS-friendly resumes for IT professionals**.
