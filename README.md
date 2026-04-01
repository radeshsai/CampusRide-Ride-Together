# 🚗 CampusRide

A full-stack ride-sharing and live campus bus tracking platform built for college students.

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, Vite, Tailwind CSS, Zustand, Leaflet, React Router |
| Backend   | Spring Boot 3.2, Java 17, Spring Security, WebSocket (STOMP) |
| Database  | MySQL 8 |
| Auth      | JWT + Google OAuth 2.0 |
| DevOps    | Docker, Docker Compose, Nginx |

---

## Quick Start (Local)

### Prerequisites
- Java 17+, Maven
- Node 18+, npm
- MySQL 8

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
# Edit DB credentials in:
# backend/src/main/resources/application.properties
cd backend
./mvnw spring-boot:run
# → http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Quick Start (Docker)

```bash
# Full stack with one command
docker compose up --build

# App runs at http://localhost
# Backend API at http://localhost:8080
```

---

## Project Structure

```
campusride/
├── backend/                          # Spring Boot (Java 17)
│   └── src/main/java/com/campusride/
│       ├── controller/               # REST endpoints (Auth, Rides, Bookings, Buses, Users, Reviews, Admin)
│       ├── service/                  # Business logic
│       ├── repository/               # JPA repositories
│       ├── entity/                   # JPA entities (User, Ride, Booking, Review, Bus, BusLocation)
│       ├── dto/                      # Request/Response DTOs
│       ├── config/                   # Security, WebSocket, DataInitializer
│       ├── exception/                # GlobalExceptionHandler + custom exceptions
│       ├── security/                 # JwtUtil, JwtAuthFilter
│       └── scheduler/               # BusSimulatorScheduler (moves buses every 3s)
│
├── database/
│   └── schema.sql                   # Full MySQL schema + seed data
│
├── frontend/                        # React 18 + Vite
│   └── src/
│       ├── app/                     # App router, global CSS
│       ├── features/
│       │   ├── auth/                # Login, Signup
│       │   ├── home/                # Landing page
│       │   ├── dashboard/           # User dashboard with tabs
│       │   ├── rides/               # List, Detail, Create
│       │   ├── bookings/            # Bookings list with cancel
│       │   ├── busTracking/         # Live Leaflet map + WebSocket
│       │   ├── profile/             # Profile edit + reviews
│       │   └── notfound/            # 404 page
│       ├── components/ui/           # Spinner, Avatar, Modal, StatusBadge, StarRating, EmptyState
│       ├── layouts/                 # Navbar (responsive), MainLayout, Footer
│       ├── services/                # Axios API (auth, rides, bookings, buses, users, reviews)
│       ├── store/                   # Zustand auth store (persisted)
│       ├── hooks/                   # useAuth, useWebSocket
│       └── utils/                   # formatters, constants
│
├── docker-compose.yml               # Full stack Docker setup
├── Makefile                         # Convenience commands
└── .env.example                     # Environment variable template
```

---

## API Reference

### Auth
```
POST /api/auth/register      Register with email/password
POST /api/auth/login         Login → JWT token
POST /api/auth/google        Google OAuth login
```

### Rides
```
GET    /api/rides                    List available rides (with ?origin=&destination= search)
POST   /api/rides                    Create a ride  [AUTH]
GET    /api/rides/:id                Get ride detail
DELETE /api/rides/:id                Cancel a ride  [AUTH, OWNER]
GET    /api/rides/:id/driver-contact Driver contact (requires booking)  [AUTH]
```

### Bookings
```
POST   /api/bookings                 Book a ride  [AUTH]
GET    /api/bookings/my              My bookings  [AUTH]
PATCH  /api/bookings/:id/cancel      Cancel booking  [AUTH]
```

### Buses
```
GET  /api/buses                      All active buses + current locations
GET  /api/buses/:id/location         Latest location for a bus
POST /api/buses/update-location      Update bus location (simulator uses this)
```

### Users
```
GET   /api/users/me     My profile  [AUTH]
PATCH /api/users/me     Update profile  [AUTH]
```

### Reviews
```
POST /api/reviews/ride/:rideId/user/:userId    Leave a review  [AUTH]
GET  /api/reviews/user/:userId                  Get user's reviews
```

### Admin
```
GET    /api/admin/stats                Admin statistics  [ADMIN]
GET    /api/admin/users                All users  [ADMIN]
PATCH  /api/admin/users/:id/role       Change user role  [ADMIN]
PATCH  /api/admin/users/:id/toggle-active  Toggle user  [ADMIN]
DELETE /api/admin/rides/:id            Remove a ride  [ADMIN]
```

### WebSocket (STOMP)
```
Connect:  ws://localhost:8080/ws  (SockJS)
Subscribe /topic/rides/{id}/seats      Real-time seat count updates
Subscribe /topic/bus/{id}/location     Real-time bus location (every 3s)
```

---

## Features Checklist

- [x] Email/password auth with JWT
- [x] Google OAuth login
- [x] Role-based access (USER / DRIVER / ADMIN)
- [x] Create, search, filter, view rides
- [x] Book a ride (real-time seat updates via WebSocket)
- [x] Cancel booking
- [x] Driver contact reveal (phone + WhatsApp) after booking
- [x] Live bus tracking with Leaflet map + WebSocket
- [x] Bus route path visualization
- [x] ETA and next stop info
- [x] User profile with edit
- [x] Star-rated reviews system
- [x] Dashboard with stats and booking history
- [x] Responsive mobile navbar
- [x] Global error handling
- [x] Docker + docker-compose setup
- [x] Sample data auto-seeded on startup
