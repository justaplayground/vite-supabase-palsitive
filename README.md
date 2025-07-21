# Vite Supabase Palsitive

A modern, full-stack pet care management platform built with Vite, React, TypeScript, Supabase, shadcn-ui, and Tailwind CSS.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Features

- **Authentication & Roles:**
  - Email/password sign up and login (Supabase Auth)
  - Role selection: Client, Veterinarian, Admin
  - Email verification and secure session management

- **Role-based Dashboards:**
  - **Client:**
    - Manage pets (add, edit, view profiles)
    - Book and view appointments
    - Track vaccination records
  - **Veterinarian:**
    - View/manage appointments (upcoming, completed, missed)
    - Update appointment statuses
    - Send notifications to clients
    - Submit verification for admin review
  - **Admin:**
    - Review and verify veterinarian applications
    - Manage user roles and system stats

- **Pet & Appointment Management:**
  - Add, edit, and view pet profiles
  - Book, view, and manage appointments
  - Vaccination tracking and reminders

- **Reusable UI Components:**
  - Built with shadcn-ui, Radix UI, and custom components
  - Includes modals, dialogs, tables, forms, toasts, and more

- **Custom Hooks & Contexts:**
  - For pets, appointments, user roles, admin verification, authentication, and more

- **Database:**
  - Supabase (Postgres) with tables for users, pets, appointments, vaccinations, user roles, and profiles

---

## Tech Stack

- [Vite](https://vitejs.dev/) – Lightning-fast build tool
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) – Auth & Database
- [shadcn-ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/)

---

## Project Structure

```
src/
  pages/         # Main app pages (Index, Auth, AdminDashboard, VeterinarianDashboard, NotFound)
  components/    # Feature and UI components (cards, modals, forms, etc.)
    ui/          # Reusable UI primitives (button, table, dialog, etc.)
  hooks/         # Custom React hooks for business logic
  contexts/      # Context providers (e.g., AuthContext)
  integrations/
    supabase/    # Supabase client and types
  lib/           # Utility functions
```

---

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd vite-supabase-palsitive
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or as indicated in the terminal)

---

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint code

---

## Deployment

- Self-hosting with Nginx on an Ubuntu server

---

## Contributing

1. Fork this repo and create a new branch for your feature or fix.
2. Make your changes and commit with clear messages.
3. Lint before pushing: `npm run lint`
4. Open a pull request for review.

---

## License

Add your license here if needed.
