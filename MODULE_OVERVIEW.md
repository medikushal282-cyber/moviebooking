# 🎬 Movie Booking Application - Module Overview
## Project: BookYourShow Cinematics

---

# 📦 BACKEND MODULES

---

## Module 1: Database Layer (MongoDB + Mongoose)

### **Technology Used**
- **MongoDB** - NoSQL document database
- **Mongoose** - ODM (Object Document Mapper) for MongoDB

### **Purpose**
Provides persistent data storage for all application entities including users, movies, theatres, bookings, and showtimes.

### **How It's Used in the Project**
- Stores user accounts with encrypted passwords
- Maintains movie catalog with details like title, genre, rating, cast
- Tracks theatre information and seat configurations
- Records booking transactions and payment history
- Manages showtime schedules with seat availability

### **Key Files**
- `server/src/config/database.js` - Database connection configuration
- `server/src/models/` - All Mongoose schemas

### **Database Models**

| Model | Purpose | Key Fields |
|-------|---------|------------|
| User | User accounts | name, email, password (hashed), role, phone |
| Movie | Movie catalog | title, genre, language, rating, duration, img, cast |
| Theatre | Cinema halls | name, location, city, seatConfiguration |
| Showtime | Show schedules | movie, theatre, startTime, price, seats[] |
| Booking | Ticket reservations | user, movie, theatre, showtime, seats, totalAmount, status |
| PendingUser | Unverified signups | email, otp, expiresAt |
| AuditLog | Admin activity logs | admin, action, targetType, targetId, details |

---

## Module 2: Authentication System (JWT + Bcrypt)

### **Technology Used**
- **JSON Web Tokens (JWT)** - Stateless authentication tokens
- **Bcrypt** - Password hashing algorithm

### **Purpose**
Secure user authentication and authorization for protected routes.

### **How It's Used in the Project**
- User registration with email verification
- Login/logout functionality
- Password hashing before storage
- Token-based session management
- Role-based access control (user vs admin)

### **Key Files**
- `server/src/controllers/authController.js` - Login, register, logout logic
- `server/src/middleware/auth.js` - JWT verification middleware
- `server/src/models/User.js` - User schema with password hashing

### **Authentication Flow**
1. User registers → Password hashed with bcrypt → Stored in DB
2. User logs in → Credentials verified → JWT token issued
3. Protected requests → Token sent in Authorization header → Middleware validates
4. Token expires → User must re-authenticate

---

## Module 3: OTP Verification System

### **Technology Used**
- **Nodemailer** - Email sending library
- **Crypto** - Random OTP generation

### **Purpose**
Email verification for new user registrations to prevent fake accounts.

### **How It's Used in the Project**
- Generates 6-digit OTP during registration
- Sends OTP to user's email via SMTP
- Validates OTP before account activation
- OTP expires after 10 minutes for security

### **Key Files**
- `server/src/controllers/otpController.js` - OTP generation and validation
- `server/src/models/PendingUser.js` - Temporary storage for unverified users
- `server/src/utils/emailService.js` - Email sending functionality

---

## Module 4: RESTful API Layer (Express.js)

### **Technology Used**
- **Express.js** - Web application framework
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Security headers middleware

### **Purpose**
Provides HTTP endpoints for all client-server communication.

### **How It's Used in the Project**
- Movie listing and search endpoints
- Theatre and showtime queries
- Booking creation and management
- User profile operations
- Admin dashboard APIs

### **Key API Endpoints**

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/movies` | GET | List all movies with filters |
| `/api/v1/movies/:id` | GET | Get single movie details |
| `/api/v1/theatres` | GET | List all theatres |
| `/api/v1/showtimes/movie/:id` | GET | Get showtimes for a movie |
| `/api/v1/bookings` | POST | Create new booking |
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/admin/dashboard` | GET | Admin statistics |

### **Key Files**
- `server/src/app.js` - Express application setup
- `server/src/routes/` - All route definitions
- `server/src/controllers/` - Business logic handlers

---

## Module 5: Real-time Communication (WebSocket)

### **Technology Used**
- **ws** - WebSocket library for Node.js

### **Purpose**
Real-time seat availability updates during booking process.

### **How It's Used in the Project**
- Broadcasts seat status changes to all connected clients
- Prevents double-booking by showing live seat availability
- Instant updates when seats are booked or released

### **Key Files**
- `server/src/config/websocket.js` - WebSocket server configuration

### **WebSocket Events**
- `seat-update` - Broadcast when seat status changes
- `connection` - New client connects
- `disconnect` - Client disconnects

---

## Module 6: Message Queue System (RabbitMQ)

### **Technology Used**
- **RabbitMQ** - Message broker
- **amqplib** - AMQP client library

### **Purpose**
Asynchronous processing of background tasks like sending emails.

### **How It's Used in the Project**
- Queues booking confirmation emails
- Queues OTP verification emails
- Decouples email sending from main request flow
- Improves application responsiveness

### **Key Files**
- `server/src/config/rabbitmq.js` - RabbitMQ connection and queue setup
- `server/src/workers/emailWorker.js` - Background email processor

### **Message Flow**
1. User books ticket → Booking confirmed
2. Booking controller publishes message to `email_queue`
3. Email worker consumes message
4. Email sent asynchronously

---

## Module 7: Caching Layer (Redis)

### **Technology Used**
- **Redis** - In-memory data store
- **redis** - Node.js Redis client

### **Purpose**
Caches frequently accessed data for improved performance.

### **How It's Used in the Project**
- Caches movie listings
- Stores session data
- Rate limiting counter storage

### **Key Files**
- `server/src/config/redis.js` - Redis client configuration

---

## Module 8: Security Middleware

### **Technology Used**
- **Helmet** - HTTP security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin configuration

### **Purpose**
Protects the application from common web vulnerabilities.

### **How It's Used in the Project**
- Sets secure HTTP headers (XSS protection, content-type sniffing)
- Limits requests per IP to prevent DDoS
- Configures allowed origins for API access
- Content Security Policy for frontend scripts

### **Key Files**
- `server/src/app.js` - Middleware configuration

### **Security Features**
| Feature | Protection Against |
|---------|-------------------|
| Helmet CSP | Cross-site scripting (XSS) |
| Rate Limiting | DDoS attacks, brute force |
| CORS | Unauthorized cross-origin requests |
| Password Hashing | Password theft |
| JWT Expiry | Session hijacking |

---

## Module 9: Admin Dashboard Backend

### **Technology Used**
- Express.js routes
- MongoDB aggregation

### **Purpose**
Provides administrative functions for managing the platform.

### **How It's Used in the Project**
- View dashboard statistics (users, bookings, revenue)
- Manage movies (add, edit, delete)
- Manage theatres and showtimes
- View and manage user accounts
- Cancel bookings
- View audit logs

### **Key Files**
- `server/src/controllers/adminController.js` - Admin operations
- `server/src/routes/adminRoutes.js` - Admin API routes
- `server/src/models/AuditLog.js` - Activity logging

---

## Module 10: Logging System (Winston)

### **Technology Used**
- **Winston** - Logging library

### **Purpose**
Application-wide logging for debugging and monitoring.

### **How It's Used in the Project**
- Logs API requests with response times
- Records errors for debugging
- Tracks user activities

### **Key Files**
- `server/src/utils/logger.js` - Winston configuration
- `server/src/middleware/requestLogger.js` - Request logging middleware

---

# 🎨 FRONTEND MODULES

---

## Module 11: Home Page

### **Technology Used**
- HTML5, CSS3, JavaScript
- TailwindCSS for styling

### **Purpose**
Main landing page showcasing movies and navigation.

### **How It's Used in the Project**
- Displays "Now Playing" movies carousel
- Shows "Coming Soon" movies
- Hero section with featured movie
- Navigation to other sections

### **Key Files**
- `index.html` - Home page structure
- `script.js` - Home page interactions

---

## Module 12: Movie Listing & Search

### **Technology Used**
- JavaScript async/await
- Dynamic DOM manipulation

### **Purpose**
Browse and filter movies by various criteria.

### **How It's Used in the Project**
- Grid display of all movies
- Filter by language (Telugu, Hindi, English, Tamil)
- Filter by genre (Action, Comedy, Drama, etc.)
- Search by movie title
- Sort by rating, release date

### **Key Files**
- `movies.html` - Movies listing page
- `js/api.js` - API calls for fetching movies
- `components/movie-grid.js` - Reusable movie grid component

---

## Module 13: Movie Booking Flow

### **Technology Used**
- Multi-step form wizard
- Session storage for booking data

### **Purpose**
Complete ticket booking process from movie selection to payment.

### **How It's Used in the Project**
1. **Book Page** (`book.html`) - Select movie and view details
2. **Showtimes Page** (`showtimes.html`) - Choose theatre and showtime
3. **Seat Selection** (`select-seats.html`) - Interactive seat map
4. **Payment** (`payment.html`) - UPI/Card payment simulation
5. **Confirmation** (`ticket-confirmed.html`) - Booking receipt

### **Key Files**
- `book.html` - Movie details and "Book Now" button
- `showtimes.html` - Theatre and showtime selection
- `select-seats.html` - Seat selection interface
- `payment.html` - Payment gateway simulation
- `ticket-confirmed.html` - Booking confirmation

---

## Module 14: Interactive Seat Selection

### **Technology Used**
- CSS Grid for seat layout
- JavaScript for seat state management
- WebSocket for real-time updates

### **Purpose**
Visual seat map allowing users to select available seats.

### **How It's Used in the Project**
- Displays 10x12 seat grid (120 seats)
- Color-coded seat status (available, booked, selected)
- Multi-seat selection
- Real-time availability via WebSocket
- Price calculation based on selection

### **Key Files**
- `select-seats.html` - Seat selection page

### **Seat States**
| Color | Status | Meaning |
|-------|--------|---------|
| Gray | Available | Can be selected |
| Pink | Selected | User's selection |
| Red | Booked | Already reserved |

---

## Module 15: Payment Gateway Simulation

### **Technology Used**
- QR Code generation API
- Payment polling mechanism

### **Purpose**
Simulates UPI and card payment for ticket purchase.

### **How It's Used in the Project**
- Displays booking summary
- Multiple payment options (UPI, Card, Net Banking)
- QR code for UPI payment simulation
- Polling for payment status
- Redirects to confirmation on success

### **Key Files**
- `payment.html` - Payment page
- `server/src/routes/payment.js` - Payment simulation endpoints

---

## Module 16: User Authentication UI

### **Technology Used**
- Form validation
- LocalStorage for token management

### **Purpose**
User interface for login, registration, and email verification.

### **How It's Used in the Project**
- Login form with email/password
- Registration form with validation
- OTP input for email verification
- Password strength indicators
- Remember me functionality

### **Key Files**
- `login.html` - Login and registration forms
- `verify-email.html` - OTP verification page
- `js/auth-helper.js` - Authentication utilities

---

## Module 17: User Profile Management

### **Technology Used**
- JavaScript form handling
- Fetch API for updates

### **Purpose**
Allows users to view and edit their profile information.

### **How It's Used in the Project**
- Display user details
- Edit profile information
- View booking history
- Change password

### **Key Files**
- `profile.html` - Profile page
- `server/src/controllers/profileController.js` - Profile API

---

## Module 18: Admin Dashboard UI

### **Technology Used**
- Charts.js for data visualization
- Dynamic data tables

### **Purpose**
Administrative interface for platform management.

### **How It's Used in the Project**
- Statistics cards (users, bookings, revenue)
- Activity timeline
- Data management tables (movies, theatres, users, bookings)
- CRUD operations for all entities
- System health monitoring

### **Key Files**
- `admin.html` - Complete admin dashboard

### **Dashboard Features**
| Section | Functionality |
|---------|--------------|
| Overview | Stats cards, activity timeline |
| Movies | Add, edit, delete movies |
| Theatres | Manage theatre locations |
| Users | View and manage user accounts |
| Bookings | View all bookings, cancel bookings |
| Audit Logs | Track admin activities |
| Settings | System configuration |

---

## Module 19: Reusable Web Components

### **Technology Used**
- Custom Elements (Web Components API)
- Shadow DOM

### **Purpose**
Reusable UI components across all pages.

### **How It's Used in the Project**
- Consistent navigation across pages
- Uniform footer design
- Animated background effects
- Movie card components

### **Key Files**
- `components/navbar.js` - Navigation bar component
- `components/footer.js` - Footer component
- `components/movie-grid.js` - Movie grid component
- `components/waves-background.js` - Animated wave background
- `components/video-player.js` - Trailer player component
- `components/animated-button.js` - Animated button effects

---

## Module 20: Animated Background (Three.js)

### **Technology Used**
- **Three.js** - 3D graphics library
- **Simplex Noise** - Noise generation

### **Purpose**
Creates visually appealing animated wave background.

### **How It's Used in the Project**
- Dynamic gradient background on all pages
- Smooth wave animation effect
- Adds premium feel to the UI

### **Key Files**
- `components/waves-background.js` - Wave animation logic

---

# 🚀 DEPLOYMENT MODULE

---

## Module 21: Railway Deployment

### **Technology Used**
- **Railway** - Cloud deployment platform
- **Docker** - Containerization (via Nixpacks)

### **Purpose**
Hosts the application on cloud infrastructure.

### **How It's Used in the Project**
- Hosts Node.js backend server
- Serves static frontend files
- Connects to Railway MongoDB instance
- Automatic deployments from GitHub

### **Key Files**
- `railway.json` - Railway configuration
- `server/package.json` - Start scripts

### **Deployment Architecture**
```
GitHub Repository
       ↓
  Railway Build
       ↓
┌──────────────────┐
│  Node.js Server  │ ← Express + Frontend
└────────┬─────────┘
         │
┌────────┴─────────┐
│    MongoDB       │ ← Railway Database
└──────────────────┘
```

---

# 📊 TECHNOLOGY STACK SUMMARY

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | HTML, CSS, JavaScript | User interface |
| Styling | TailwindCSS | Rapid UI development |
| Icons | Feather Icons | Icon library |
| 3D Graphics | Three.js | Animated backgrounds |
| Backend | Node.js, Express | Server-side logic |
| Database | MongoDB, Mongoose | Data persistence |
| Authentication | JWT, Bcrypt | Secure auth |
| Real-time | WebSocket | Live seat updates |
| Message Queue | RabbitMQ | Async tasks |
| Caching | Redis | Performance |
| Email | Nodemailer | Notifications |
| Security | Helmet, Rate Limit | Protection |
| Deployment | Railway | Cloud hosting |

---

# 🔗 DATA FLOW DIAGRAM

```
User Browser
     ↓
┌────────────────────────────────────────┐
│           FRONTEND (HTML/JS)            │
│  index.html │ movies.html │ book.html   │
│  Components: navbar, footer, movie-grid │
└────────────────────┬───────────────────┘
                     ↓ HTTPS/WSS
┌────────────────────────────────────────┐
│           EXPRESS.JS SERVER             │
│  ┌─────────────────────────────────┐   │
│  │         MIDDLEWARE              │   │
│  │  Helmet │ CORS │ Rate Limit     │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │          ROUTES                 │   │
│  │  /api/v1/movies, /auth, etc.    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │        CONTROLLERS              │   │
│  │  Business Logic & Validation    │   │
│  └─────────────────────────────────┘   │
└────────────────────┬───────────────────┘
                     ↓
┌────────────────────────────────────────┐
│            DATA LAYER                   │
│  MongoDB │ Redis │ RabbitMQ             │
└────────────────────────────────────────┘
```

---

*Generated for PPT presentation use. Each module can be used as a separate slide.*
