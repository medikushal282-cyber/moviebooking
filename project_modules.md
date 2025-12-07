# Project Module Architecture: BookYourShow Cinematics

This document outlines the 12 core high-performance modules that constitute the Smart Movie Booking System.

### 1. Authentication Core (Auth Module)
- **Purpose:** Zero-trust identity verification.
- **Tech Stack:** **JWT (JSON Web Tokens)**, **Bcrypt.js**.
- **Implementation:** Stateless, scalable session management using cryptographically signed tokens. Passwords are salted and hashed to industry standards.

### 2. User Lifecycle Management
- **Purpose:** End-to-end user data persistence.
- **Tech Stack:** **Mongoose ODM**, **MongoDB**.
- **Implementation:** Handles complex user profiles, history tracking, and secure account mutations.

### 3. Dynamic Media Catalog
- **Purpose:** High-availability content delivery.
- **Tech Stack:** **Express.js**, **Static File Serving**.
- **Implementation:** Serves rich media (posters, 4K trailers) via optimized static routes. Supports complex filtering pipelines (Genre, Language, Format).

### 4. Geospatial Theater Orchestrator
- **Purpose:** Location-aware scheduling engine.
- **Tech Stack:** **MongoDB Geospatial Queries**.
- **Implementation:** Maps movies to physical screens with conflict-free scheduling logic.

### 5. Real-Time WebSocket Grid (The Nervous System)
- **Purpose:** Sub-millisecond state synchronization.
- **Tech Stack:** **Native WebSockets (ws)**.
- **Implementation:** Eliminates HTTP polling. Pushes live seat updates to thousands of concurrent clients instantly, no two users can see the two same seats at the same time.

### 6. Atomic Booking Engine
- **Purpose:** ACID-compliant transaction processing.
- **Tech Stack:** **Mongoose Transactions**.
- **Implementation:** Prevents race conditions during high-traffic launches. Ensures "One Seat, One User" integrity.

### 7. High-Velocity Cache Layer
- **Purpose:** Microsecond data retrieval.
- **Tech Stack:** **Redis**.
- **Implementation:** Caches hot data (Showtimes, Movie Details) to offload database pressure during viral spikes.

### 8. Asynchronous Event Bus (The Muscle)
- **Purpose:** Non-blocking background processing.
- **Tech Stack:** **RabbitMQ (AMQP)**.
- **Implementation:** Decouples heavy tasks. Booking requests are acknowledged instantly, while heavy lifting (PDF generation, Emailing) happens in the background.

### 9. Notification Dispatcher
- **Purpose:** Multi-channel user alerting.
- **Tech Stack:** **Nodemailer**, **RabbitMQ Workers**.
- **Implementation:** Consumes events from the message bus to send transactional emails (OTPs, Tickets) without latency.

### 10. Admin Command Center
- **Purpose:** System observability and control.
- **Tech Stack:** **Vanilla JS**, **TailwindCSS**, **Chart.js**.
- **Implementation:** Real-time dashboard for monitoring revenue, occupancy, and inventory management.

### 11. OTP Security Layer
- **Purpose:** Two-factor verification.
- **Tech Stack:** **Crypto**, **Redis (TTL)**.
- **Implementation:** Time-based one-time passwords with strict expiration policies for account validation.

### 12. Centralized Telemetry & Logging
- **Purpose:** System health monitoring.
- **Tech Stack:** **Winston/Custom Logger**.
- **Implementation:** Aggregates error logs and request traces for rapid debugging and performance tuning.
