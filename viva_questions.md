# Viva Questions & Answers: Smart Movie Booking System

## 1. RabbitMQ vs. Redis: Why prefer RabbitMQ for Message Queuing?

**Question:** Why do we prefer RabbitMQ over Redis for message queuing purposes?

**Answer:**
While both Redis and RabbitMQ can be used as message brokers, RabbitMQ is a dedicated **Message Broker**, whereas Redis is primarily an **In-Memory Data Store** that *can* act as a broker. We prefer RabbitMQ for critical background tasks (like booking confirmations and emails) because:

1.  **Reliability & Persistence:** RabbitMQ is designed to ensure message delivery. It supports "Acknowledgements" (ACKs). If a worker crashes while processing a message, RabbitMQ will re-queue it to be processed by another worker. Redis (Pub/Sub) is "fire and forget"—if no one is listening or the worker crashes, the message is lost.
2.  **Complex Routing:** RabbitMQ offers powerful routing capabilities (Exchanges, Bindings, Routing Keys). You can send a message to an exchange and have it routed to multiple different queues based on rules. Redis is simpler (channels).
3.  **Flow Control:** RabbitMQ handles "backpressure" well. If the queue fills up, it can slow down producers. Redis, being in-memory, can run out of RAM if consumers are too slow.
4.  **Purpose-Built:** RabbitMQ implements the AMQP (Advanced Message Queuing Protocol) standard, offering features like dead-letter queues (for failed messages) and priority queues out of the box.

**Analogy:**
*   **Redis** is like a whiteboard in a hallway. You write a message, and if someone walks by, they see it. If the janitor wipes it (crash), it's gone.
*   **RabbitMQ** is like a certified mail service. The postman (broker) ensures the letter gets to the mailbox (queue), and you can even request a signature (ACK) to prove it was delivered.

---

## 2. Difference Between Redis and RabbitMQ Usage

**Question:** What exactly is the difference between the usage of Redis and RabbitMQ in this project?

**Answer:**

*   **Redis (Caching & Speed):**
    *   **Role:** In-Memory Cache.
    *   **Usage:** We use Redis to store data that is frequently read but rarely changed (e.g., Movie Listings, Theater Showtimes).
    *   **Goal:** To reduce database load and make the API response time extremely fast (milliseconds).
    *   **Data Type:** Key-Value pairs (Strings, JSON).

*   **RabbitMQ (Asynchronous Tasks):**
    *   **Role:** Message Broker / Task Queue.
    *   **Usage:** We use RabbitMQ to handle "heavy" or "slow" operations that shouldn't block the user's request (e.g., Sending Emails, Generating PDF Tickets, Processing Payments).
    *   **Goal:** To decouple the immediate user response from background work. When a user books, we say "Success!" instantly, while RabbitMQ ensures the email is sent 2 seconds later in the background.
    *   **Data Type:** Messages (Tasks/Jobs).

---

## 3. JWT (JSON Web Token)

**Question:** What is JWT, why did we use it, and how is it implemented?

**Answer:**

*   **What is it?** JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It is compact, self-contained, and digitally signed.
*   **Why use it?**
    *   **Stateless:** The server doesn't need to store session data in memory or a database. The token itself contains the user's ID and validity. This makes scaling easier (you can add more servers without sharing session memory).
    *   **Security:** It is signed (usually with HMAC SHA256), so the server can verify if the token has been tampered with.
*   **Implementation in Project:**
    1.  **Login/Register:** When a user logs in, the backend creates a token (`jwt.sign`) containing the user's `_id` and signs it with a `JWT_SECRET`.
    2.  **Storage:** This token is sent to the frontend and stored (e.g., in Cookies or LocalStorage).
    3.  **Protection:** For every protected request (like `GET /profile`), the frontend sends this token in the `Authorization` header.
    4.  **Verification:** A middleware (`auth.js`) intercepts the request, verifies the signature (`jwt.verify`), extracts the user ID, finds the user in the DB, and allows access.

---

## 4. RabbitMQ vs. Alternatives (Kafka, ActiveMQ)

**Question:** Why is RabbitMQ being used instead of its alternatives like Apache Kafka?

**Answer:**

*   **Vs. Apache Kafka:**
    *   **Kafka** is a distributed *streaming platform*. It is built for massive throughput (millions of messages per second) and storing streams of data for replay (like logs or analytics). It is complex to set up and manage.
    *   **RabbitMQ** is a *message broker*. It is better for "smart broker, dumb consumer" scenarios where we just want to ensure a task is done once.
    *   **Why RabbitMQ?** For a booking system, we need **complex routing** (send email vs. send SMS) and **guaranteed delivery** for individual tasks. We don't need to process millions of log lines per second. RabbitMQ is simpler to implement for this specific "Task Queue" use case.

*   **Vs. ActiveMQ:**
    *   RabbitMQ is generally considered more modern, has a larger community, and better performance for general-purpose messaging than the older ActiveMQ Classic.

**Summary:** We chose RabbitMQ because it strikes the perfect balance between reliability, routing flexibility, and ease of use for a transactional system like Movie Booking.
