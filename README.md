# Devonic

Devonic is a full-stack digital services and learning platform built with React, Vite, Node.js, and Express. It combines a public marketing website, authentication system, user dashboard, admin management panels, service inquiries, courses, instructors, and invite-based admin onboarding in one project.

The project is organized as a Vite frontend in the root directory and an Express API in the `server/` directory. Data is stored in a lightweight JSON database for fast local development and MVP-style iteration.

## Project Goals

- Showcase digital services such as web development, SEO, content writing, digital marketing, and graphic design.
- Allow visitors and signed-in users to submit service requests and course enrollments.
- Provide a protected user area for profile and dashboard access.
- Provide admin tools for managing services, homepage content, courses, instructors, and admin invites.
- Keep local development simple with file-based persistence and seeded demo data.

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- React Hot Toast
- React Icons

### Backend

- Node.js
- Express
- JWT authentication
- bcryptjs
- Helmet
- CORS
- express-rate-limit
- Prometheus metrics via `prom-client`
- Optional Sentry integration

### Data Storage

- File-based JSON database in [`server/db.json`](server/db.json)
- Seed logic in [`server/seed.js`](server/seed.js)

## High-Level Architecture

### Frontend app

The frontend is a single-page React application. It uses:

- Public routes for the marketing site and catalog pages
- Protected routes for logged-in users
- Admin-only routes for management screens
- A shared API service layer for all backend communication
- Local storage for access token, refresh token, and user session persistence

Main route definitions live in [`src/app/routes/AppRoutes.jsx`](src/app/routes/AppRoutes.jsx).

### Backend API

The backend exposes REST endpoints under `/api/*`. It handles:

- authentication
- role checks
- CRUD operations for services, courses, instructors, projects, and content
- request and enrollment capture
- admin invite management
- health and metrics endpoints

Main server bootstrap lives in [`server/index.js`](server/index.js).

## Frontend Pages

### Public pages

- `/` - Home page
- `/services` - Services listing
- `/services/:id` - Service detail page
- `/courses` - Courses listing
- `/courses/:id` - Course detail page
- `/instructors` - Instructors listing
- `/instructors/:id` - Instructor detail page
- `/about` - About page
- `/contact` - Contact / inquiry page
- `/login` - User login
- `/signup` - User registration
- `/invite/accept` - Invite acceptance flow

### Protected user pages

- `/dashboard` - User dashboard
- `/profile` - Profile management

### Admin pages

- `/admin` - Admin dashboard
- `/admin/services` - Manage services
- `/admin/content` - Manage homepage content
- `/admin/courses` - Manage courses
- `/admin/instructors` - Manage instructors
- `/admin/invites` - Manage admin invites

## Core Features

### Authentication and authorization

- JWT-based login and registration
- Access token plus refresh token flow
- Client-side auth context with token persistence
- Protected routes for authenticated users
- Role-based route guarding for admin pages

Auth state is managed in [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx).

### Services catalog

- Public services listing and detail pages
- Admin CRUD for services
- Seeded default services for local development

### Contact requests and enrollments

- Visitors can submit contact requests
- Course enrollments are also stored as request records
- Admin can review and update request status
- Requests can be converted into projects

### Courses and instructors

- Public course browsing
- Course detail page with optional instructor expansion
- Public instructor listing and detail pages
- Admin CRUD for courses and instructors
- Publish/unpublish support for courses

### Admin content management

- Home page hero content
- CTA content
- Highlight items stored in the JSON database

### Admin invite flow

- Admin can create invites for new admin users
- Invite validation endpoint
- Invite acceptance flow on the frontend

### Security and observability

- Helmet for basic security headers
- Global and auth-specific rate limiting
- CORS configuration
- Optional Sentry error reporting
- `/metrics` endpoint for Prometheus scraping
- `/api/health` endpoint for basic uptime checks

## Backend API Overview

The following route groups are mounted in the API server:

- `/api/auth`
- `/api/services`
- `/api/content`
- `/api/requests`
- `/api/projects`
- `/api/instructors`
- `/api/courses`
- `/api/admin/instructors`
- `/api/admin/courses`
- `/api/admin/invites`

Important backend files:

- [`server/routes/auth.js`](server/routes/auth.js)
- [`server/routes/services.js`](server/routes/services.js)
- [`server/routes/requests.js`](server/routes/requests.js)
- [`server/routes/projects.js`](server/routes/projects.js)
- [`server/routes/instructors.js`](server/routes/instructors.js)
- [`server/routes/courses.js`](server/routes/courses.js)
- [`server/routes/admin/instructors.js`](server/routes/admin/instructors.js)
- [`server/routes/admin/courses.js`](server/routes/admin/courses.js)
- [`server/routes/admin/invites.js`](server/routes/admin/invites.js)

## Data Model Snapshot

The JSON database currently stores these collections:

- `users`
- `services`
- `requests`
- `content`
- `projects`
- `instructors`
- `courses`
- `invites`

This makes the project easy to run locally without PostgreSQL or MongoDB, but it also means it is best suited for development, demos, prototypes, and MVP use cases unless the persistence layer is upgraded.

## Local Development

### Prerequisites

- Node.js 18+ recommended
- npm

### 1. Install dependencies

```bash
npm install
cd server
npm install
```

### 2. Configure environment variables

Root `.env.example` currently contains:

```env
JWT_SECRET=change_me_to_a_strong_secret
REFRESH_SECRET=change_me_too
PORT=4000
```

For the frontend, the app uses the Vite dev proxy by default. If needed, you can create `.env.local` in the root and set:

```env
VITE_API_URL=http://localhost:4000/api
```

For the backend, you can define:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=your_very_long_access_secret_here
JWT_REFRESH_SECRET=your_very_long_refresh_secret_here
SENTRY_DSN=
```

Note:

- In development, the auth route can auto-generate secure JWT secrets if none are provided or if they are too short.
- In production, JWT secrets must be present and sufficiently strong.

### 3. Start the backend

```bash
cd server
npm run dev
```

The backend runs on `http://localhost:4000`.

### 4. Start the frontend

```bash
cd ..
npm run dev
```

The frontend runs on `http://localhost:5173`.

### 5. Open the app

- Frontend: `http://localhost:5173`
- API health: `http://localhost:4000/api/health`
- Metrics: `http://localhost:4000/metrics`

## Docker

This project includes Docker support for both frontend and backend.

### Start with Docker Compose

```bash
docker-compose up --build
```

Default ports:

- Frontend: `5174`
- Backend: `4000`

Files used:

- [`Dockerfile`](Dockerfile)
- [`server/Dockerfile`](server/Dockerfile)
- [`docker-compose.yml`](docker-compose.yml)

## Seeded Demo Data

When the backend starts in non-production mode, it seeds the local JSON database with:

- an admin user
- sample services
- homepage content
- sample instructors
- sample courses

Default seeded admin account:

- Email: `admin@devonic.local`
- Password: `AdminPass123!`

There may also be additional locally created users already present in [`server/db.json`](server/db.json), depending on prior testing in this workspace.

## Project Structure

```text
Devonic/
|-- src/                  # React frontend
|   |-- app/              # layouts and route definitions
|   |-- components/       # reusable UI and domain components
|   |-- context/          # auth context
|   |-- data/             # seed-related frontend constants
|   |-- lib/              # client libraries such as Sentry wrapper
|   |-- pages/            # route-level pages
|   |-- services/         # frontend API client
|   |-- utils/            # shared frontend utilities
|-- public/               # static assets
|-- server/               # Express API and JSON database
|   |-- routes/           # API route handlers
|   |-- middleware/       # auth middleware
|   |-- public/           # backend static files such as logo
|   |-- db.json           # file-based data store
|   |-- seed.js           # database seeding
|-- tools/                # helper scripts for asset organization
```

## Important Notes

- The frontend package is named `devonic-frontend`.
- The backend package is named `devonic-backend`.
- Vite proxies `/api` requests to `http://localhost:4000` during local development.
- Authentication tokens are stored in browser local storage.
- The database is a JSON file, so concurrent production-grade writes are not ideal without replacing the storage layer.

## Suggested Next Improvements

- Move from JSON file storage to PostgreSQL or MongoDB
- Add tests for API routes and protected frontend flows
- Add richer admin analytics and audit logs
- Add image upload/storage for courses, instructors, and services
- Add email delivery for invite workflows instead of local/manual handling

## License

This repository does not currently declare a license. Add one before public distribution if needed.
