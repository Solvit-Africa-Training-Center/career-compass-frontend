# Career Compass – PLANNING.md

## Vision
Career Compass is a platform that connects students, institutions, recruiters, and admins to streamline access to global education opportunities.  
The goal is to:
- Help students find and apply to programs more easily.
- Give institutions and recruiters tools to manage applications and students.
- Provide admins with oversight, analytics, and communication capabilities.
- Deliver a modern, user-friendly, and multilingual interface that feels fast and intuitive.

As frontend developers, our mission is to design a clean, minimalist, and accessible UI using React + TypeScript + TailwindCSS that delivers all these features in a responsive and efficient way.

---

## Architecture (Frontend Perspective)

### Client–Server Flow
- **Frontend (React/TS/Tailwind)** communicates with **Django REST API** via HTTPS.
- All requests include **JWT authentication headers**.
- State management will handle user roles (Student, Institution, Recruiter, Admin) and conditional rendering of UI.
- Data (profiles, programs, applications) fetched via REST endpoints → rendered in UI components.

### Component-Level Structure
1. **Authentication**
   - Login, registration, and protected routes.
2. **Role-based Dashboards**
   - Student: profile, search, apply, track.
   - Institution: manage programs.
   - Recruiter: manage students, apply for them.
   - Admin: system management + analytics.
3. **Shared Components**
   - Navbar, Sidebar, Tables, Modals, Forms, Notifications.
4. **Utilities**
   - API client (Axios or Fetch wrapper with JWT).
   - Form validation (React Hook Form + Zod).
   - Multilingual support (i18next).
   - State management (Context API or Zustand).
5. **Styling**
   - TailwindCSS utility-first, theme tokens for colors/spacing.
   - Component library extensions (shadcn/ui for buttons, modals, cards).

---

## Technology Stack (Frontend)

- **Framework:** React.js (with Vite for fast builds).
- **Language:** TypeScript (type safety, better DX).
- **Styling:** TailwindCSS + shadcn/ui.
- **Routing:** React Router DOM.
- **State Management:** Context API or Zustand.
- **Forms & Validation:** React Hook Form + Zod.
- **HTTP Client:** Axios (with interceptors for JWT).
- **i18n:** i18next (English + French).
- **Charts:** Recharts (for analytics dashboards).
- **PDF/Print:** react-to-print or jsPDF (for application documents).

---

## Required Tools

### Development Tools
- **VS Code** (with ESLint, Prettier, Tailwind IntelliSense, React/TS snippets).
- **GitHub/GitLab** (feature branching workflow).
- **Node.js (v18 LTS)** for React environment.
- **Yarn or npm** as package manager.

### Collaboration & Management
- **Trello** (Kanban: Backlog → In Progress → Review → Done).
- **Slack/Discord** (team comms).
- **Figma** (UI/UX prototypes).

### Testing
- **Jest + React Testing Library** (unit/component testing).
- **Playwright or Cypress** (end-to-end tests if time permits).

### Deployment
- **Vercel or Netlify** (for frontend hosting).
- **CI/CD** (GitHub Actions for lint/test/build before deploy).

---

## Frontend Priorities
1. **Week 1:**
   - Setup project (Vite + React + TS + Tailwind).
   - Authentication (JWT login/register, role handling).
   - Layout scaffolding: Navbar, Sidebar, routing structure.

2. **Week 2:**
   - Student portal: profile, search/filter, apply form, document upload.
   - Institution portal: program management forms.
   - Recruiter portal: register student + apply for them.

3. **Week 3:**
   - Admin dashboard (basic analytics, broadcast).
   - Notifications, multilingual support, styling polish.
   - Testing + deployment.

---

## Guiding Principles
- Keep UI **minimal, clean, and consistent** (no clutter).
- Build reusable components (forms, tables, buttons).
- Prioritize accessibility (keyboard nav, semantic HTML).
- Focus on performance (lazy loading, code splitting).
- Always test components before merging.

---
