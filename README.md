# Devonic Solutions MVP Engineering Platform

A high-performance, premium digital services management ecosystem built with the **MERN** (React/Node) stack logic, designed for visionary enterprises.

## 🚀 Vision
Devonic Solutions provides a robust foundation for managing technical architectures, client migrations, and enterprise-grade software projects with a security-first approach and a senior-quality UI.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer-like CSS animations.
- **Backend**: Node.js, Express, JWT (Short access/Long refresh).
- **Persistence**: Lightweight file-based JSON DB with automatic seeding.
- **Security**: Helmet, BCryptJS, Rate Limiting, CORS.
- **Observability**: Ready for Sentry (monitoring) and Prometheus (metrics).

## 📦 Features
- **Role-Based Access Control (RBAC)**: Distinct workflows for Administrators and Customers.
- **Senior Admin Dashboard**: Real-time service inventory management with CRUD operations.
- **Customer Command Center**: Personalized project tracking and support access.
- **Dynamic Service Catalog**: Fully searchable and sortable enterprise solutions.
- **Premium Auth Flow**: Secure session management with JWT and visual feedback.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (optional for containerized run)

### 1. Local Development Setup
Clone the repository and install dependencies:
```bash
# Install root (frontend) dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `server` directory (automatically seeded if missing):
```env
PORT=4000
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
FRONTEND_ORIGIN=http://localhost:5174
```

### 3. Execution
Run the full stack:
```bash
# Start Terminal 1 (Backend)
cd server
npm run dev

# Start Terminal 2 (Frontend)
cd ..
npm run dev
```

### 🐳 Docker Deployment
For a production-ready containerized environment:
```bash
docker-compose up --build
```

## 🔑 Default Authorization
| Role | Email | Password |
| :--- | :--- | :--- |
| **Architect (Admin)** | `admin@devonic.local` | `AdminPass123!` |
| **Operator (User)** | `test@example.com` | `Password123!` |

> Admin access is provisioned via seeding for security. Standard signup creates user accounts only.

---
© 2026 DEVONIC SOLUTIONS INC. - [ENGINEERED FOR SCALE]
