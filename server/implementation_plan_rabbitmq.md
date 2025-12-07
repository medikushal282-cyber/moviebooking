# Implementation Plan: RabbitMQ Asynchronous Task Queue

## 1. Objective
To integrate **RabbitMQ** into the Movie Booking System to handle resource-intensive background tasks asynchronously. This ensures the main API remains fast and responsive even during high-traffic events (like a blockbuster release).

## 2. Why RabbitMQ? (The "What it does for us")
In our current system, when a user books a ticket, the server might hang for a few seconds while it:
1.  Connects to the email server (Gmail).
2.  Generates the email content.
3.  Waits for the email to be sent.

With RabbitMQ, we **decouple** this:
1.  **User clicks "Book"** -> Server saves booking -> Server says "Job Queued" -> **User gets "Success" instantly.**
2.  **Background Worker** -> Picks up the job -> Sends the email quietly in the background.

This prevents the "spinning wheel" for the user and ensures that if the email server is down, the booking still succeeds, and we can retry sending the email later.

## 3. Architecture Overview

### Components
1.  **Message Broker (RabbitMQ):** The central post office that holds messages.
2.  **Producer (Our API):** The `bookingController` and `authController` will *produce* messages (e.g., "Send Email to User X") and send them to the broker.
3.  **Consumer (Worker Service):** A new, separate piece of code that *listens* to the broker, picks up messages, and executes the actual task (sending the email).

### Workflow
1.  **Event:** User registers or books a ticket.
2.  **Publish:** API creates a message payload: `{ type: 'EMAIL', template: 'booking_confirmation', data: { ... } }`.
3.  **Queue:** Message sits in the `email_queue`.
4.  **Consume:** The Worker detects the new message.
5.  **Process:** Worker uses `nodemailer` to send the email.
6.  **Acknowledge:** Worker tells RabbitMQ "Job Done", and the message is removed from the queue.

## 4. Implementation Steps

### Step 1: Setup & Dependencies
-   Install `amqplib` (Node.js client for RabbitMQ).
-   Set up a local RabbitMQ instance (or use CloudAMQP for zero-config). *For this project, we will assume a local instance or Docker container is available, or we can use a free cloud tier.*

### Step 2: Create the RabbitMQ Service (`src/config/rabbitmq.js`)
-   Create a utility file to manage the connection to the RabbitMQ server.
-   Define functions to `connect()`, `publishToQueue()`, and `consumeQueue()`.

### Step 3: Create the Worker (`src/workers/emailWorker.js`)
-   This script will start independently of the main server.
-   It will connect to RabbitMQ and listen to the `email_queue`.
-   It will import our existing `emailService.js` to actually send the emails.

### Step 4: Update Controllers (The Producers)
-   **`authController.js`**: Instead of `await sendOTPEmail(...)`, we will call `publishToQueue('email_queue', { type: 'OTP', ... })`.
-   **`bookingController.js`**: Instead of sending confirmation emails directly, we publish a booking confirmation task.

### Step 5: Run & Test
-   Start the RabbitMQ server.
-   Start the Main API (`npm run dev`).
-   Start the Worker (`node src/workers/emailWorker.js`).
-   Perform a booking and verify that the email is sent asynchronously.

## 5. Future Scalability (Deviating slightly from Abstract)
While the abstract mentioned **Celery (Python)**, using **Node.js Workers** keeps our stack unified. This allows us to share code (like database models and email templates) between the main API and the worker, reducing complexity and potential bugs. The architectural pattern (Producer-Consumer) remains exactly the same.
