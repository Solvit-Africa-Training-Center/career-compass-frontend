# Career Compass – Chat Context Guide

This file provides the project context and requirements for AI-assisted coding sessions.  
It ensures continuity across multiple chats when working on the Career Compass system.

---

## Project Overview
Career Compass is a centralized platform connecting students, institutions, recruiters, and admins to simplify education opportunities.

The platform enables:
- Students to search, apply, and track programs.
- Institutions to manage programs and requirements.
- Recruiters to register/apply for students.
- Admins to oversee everything, with analytics dashboards and communication tools.

Deadline: **18th September**

---

## Tech Stack
- **Backend:** Django + SQLite (REST API, JWT Auth)
- **Frontend:** React.js + TypeScript + TailwindCSS
- **Deployment:** Heroku/Render/Docker (lightweight MVP)
- **Version Control:** GitHub/GitLab (feature branches)
- **Project Management:** Trello (Kanban: Backlog → In Progress → Review → Done)

---

## Core Features
### Students
- Register/login (JWT-based auth).
- Manage profile (personal info, preferences, documents).
- Search/filter programs (location, fees, duration, level, intake).
- Apply for programs & upload documents.
- Track applications.
- AI eligibility checks & recommendations.
- Access career tools (resume, cover letters, internships).
- Rate/review institutions.

### Institutions
- Register institution profiles.
- Upload/manage programs, fees, requirements, and intakes.
- Manage student applications.
- Sync program data (API-ready).

### Recruiters
- Register their students.
- Apply on behalf of students.
- Access career guidance tools.
- Track commissions.

### Admins
- Manage students, recruiters, institutions, and applications.
- Upload internships/guidance resources.
- Broadcast emails & announcements.
- Validate institutions.
- Access analytics dashboards (apps, acceptance rates, scholarships).

---

## Non-Functional Requirements
- **Security:** Data encryption, compliance, institution validation.
- **Scalability:** Handle peak loads during application deadlines.
- **Performance:** Responsive, minimal downtime.
- **UX/UI:** Multilingual (English, French), clean and minimalist design.
- **Accessibility:** Mobile responsive.

---

## Milestones & Timeline
**Week 1 (till Sept 4):**
- Backend setup: Django project, SQLite schema, migrations.
- Frontend setup: React + TS + Tailwind boilerplate.
- JWT Auth + role-based access.

**Week 2 (Sept 5 – 11):**
- Student portal: profile, search, apply, docs.
- Institution portal: program upload, requirements, intakes.
- Recruiter portal: student registration & application.
- Application workflows + eligibility checks.

**Week 3 (Sept 12 – 18):**
- Admin portal: manage apps, broadcasting.
- Analytics dashboards.
- Notifications system.
- Testing, bug fixing, deployment.

---

## Success Criteria
- A student can register, upload docs, search, apply, and track status.
- Institutions can upload/manage programs and review apps.
- Recruiters can apply on behalf of students.
- Admin can oversee apps and view analytics.
- Platform is stable, secure, fast, with a clean UI.

---

## AI Coding Session Guidelines
- Always assume Django REST API for backend endpoints.
- SQLite is the DB for MVP, but design models for future Postgres scalability.
- JWT authentication required for all user roles.
- Frontend should use React (TS) with Tailwind components for UI.
- Keep design minimalist and accessible.
- Prioritize deliverables by milestone timeline.
- When asked to write code, output production-ready snippets with clear explanations.
- Suggest refactors and improvements only if they fit the MVP deadline (18th Sept).

---
