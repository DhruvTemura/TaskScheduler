# 🕒 Task Scheduler API

A simple **in-memory task scheduler** built with **Node.js** and **Express**.  
Schedule tasks to execute automatically after a specified delay!

---

## 📋 Overview

This API allows you to:

- Schedule tasks with custom messages and delays (in seconds)
- Automatically mark tasks as completed after their delay expires
- View all tasks (pending, completed, and canceled)
- Cancel pending tasks before they complete
- Validate inputs and handle errors gracefully

---

## 🚀 Features

✅ **POST `/schedule`** – Schedule new tasks  
✅ **GET `/tasks`** – List all tasks with their status  
✅ **GET `/tasks/:id`** – Get a specific task by ID  
✅ **DELETE `/tasks/:id`** – Cancel pending tasks  
✅ **Input validation** – Prevent invalid data  
✅ **Error handling** – Clear, descriptive messages  
✅ **Efficient storage** – Uses `Map` for O(1) task lookups  
✅ **Clean architecture** – Separated routes and business logic  

---

## 🛠️ Tech Stack

- **Node.js** – JavaScript runtime  
- **Express.js** – Web framework  
- **UUID** – Unique ID generation  
- **JavaScript Map** – In-memory storage  

---

## 📦 Requirements

- Node.js ≥ 14.x  
- npm or yarn  

---

## ⚙️ Installation

```bash
# Clone or download the project
cd task-scheduler

# Install dependencies
npm install


🏃 Running the Application
Production Mode - npm start

Development Mode (auto-restart on file changes) - npm run dev

The server will start on http://localhost:3000

You should see:

🚀 Task Scheduler running on http://localhost:3000
Try: curl http://localhost:3000/health

📡 API Endpoints
1️⃣ Health Check

GET /health
Check if the server is running.

curl http://localhost:3000/health


Response (200 OK):

{
  "status": "ok",
  "timestamp": "2025-10-20T12:34:56.789Z"
}

2️⃣ Schedule a Task

POST /schedule
Create a new task that will automatically complete after the specified delay.

Request Body:

{
  "message": "Send email notification",
  "delay": 5
}


Parameters:

message (string, required) – Task description (non-empty)

delay (number, required) – Delay in seconds (0 to 86400)

Example:

curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{"message": "Send email notification", "delay": 5}'


Response (201 Created):

{
  "task_id": "3556c313-b569-4633-b609-f4173bcaeda6",
  "message": "Send email notification",
  "delay": 5,
  "status": "pending",
  "scheduled_at": "2025-10-20T12:34:56.789Z",
  "completed_at": null
}


Validation Errors (400 Bad Request):

// Empty message
{
  "error": "message must be a non-empty string"
}

// Invalid delay
{
  "error": "delay must be a number between 0 and 86400 seconds"
}

3️⃣ Get All Tasks

GET /tasks
Retrieve all tasks (pending, completed, or canceled).

curl http://localhost:3000/tasks


Response (200 OK):

[
  {
    "task_id": "3556c313-b569-4633-b609-f4173bcaeda6",
    "message": "Send email notification",
    "delay": 5,
    "status": "completed",
    "scheduled_at": "2025-10-20T12:34:56.789Z",
    "completed_at": "2025-10-20T12:35:01.789Z"
  },
  {
    "task_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "message": "Process payment",
    "delay": 10,
    "status": "pending",
    "scheduled_at": "2025-10-20T12:35:00.000Z",
    "completed_at": null
  }
]

4️⃣ Get Task by ID

GET /tasks/:id
Retrieve details for a specific task.

curl http://localhost:3000/tasks/3556c313-b569-4633-b609-f4173bcaeda6


Response (200 OK):

{
  "task_id": "3556c313-b569-4633-b609-f4173bcaeda6",
  "message": "Send email notification",
  "delay": 5,
  "status": "completed",
  "scheduled_at": "2025-10-20T12:34:56.789Z",
  "completed_at": "2025-10-20T12:35:01.789Z"
}


Error (404 Not Found):

{
  "error": "Task not found"
}

5️⃣ Cancel a Task

DELETE /tasks/:id
Cancel a pending task. The timer will stop, and status changes to "canceled".

curl -X DELETE http://localhost:3000/tasks/3556c313-b569-4633-b609-f4173bcaeda6


Response (200 OK):

{
  "task_id": "3556c313-b569-4633-b609-f4173bcaeda6",
  "message": "Send email notification",
  "delay": 100,
  "status": "canceled",
  "scheduled_at": "2025-10-20T12:34:56.789Z",
  "completed_at": "2025-10-20T12:35:10.000Z"
}


Errors:

// 404 Not Found
{ "error": "Task not found" }

// 409 Conflict
{
  "error": "Cannot cancel - task already completed",
  "task": {
    "task_id": "3556c313-b569-4633-b609-f4173bcaeda6",
    "message": "Send email notification",
    "delay": 5,
    "status": "completed",
    "scheduled_at": "2025-10-20T12:34:56.789Z",
    "completed_at": "2025-10-20T12:35:01.789Z"
  }
}

📊 Task Status Flow
┌─────────┐
│ pending │  ─── Initial state when task is created
└────┬────┘
     │
     ├──────► After delay expires ──────► ┌───────────┐
     │                                     │ completed │
     │                                     └───────────┘
     │
     └──────► User cancels task ─────────► ┌──────────┐
                                            │ canceled │
                                            └──────────┘


📝 Canceled and completed tasks remain in memory and are visible in GET /tasks.

🧪 Testing the API
Using curl

Complete workflow:

# 1. Health check
curl http://localhost:3000/health

# 2. Schedule a task
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{"message": "Test task", "delay": 5}'

# 3. View all tasks
curl http://localhost:3000/tasks

# 4. Wait 5 seconds and recheck
curl http://localhost:3000/tasks

# 5. Schedule and cancel a long task
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{"message": "Long task", "delay": 100}'
curl -X DELETE http://localhost:3000/tasks/PASTE-TASK-ID-HERE

Using Postman or Hoppscotch

Import the following requests:

GET http://localhost:3000/health

POST http://localhost:3000/schedule (with JSON body)

GET http://localhost:3000/tasks

GET http://localhost:3000/tasks/:id

DELETE http://localhost:3000/tasks/:id

Set header: Content-Type: application/json

🏗️ Project Structure
task-scheduler/
├── server.js          # Express server (routes and API endpoints)
├── taskManager.js     # Core business logic (task creation, timers)
├── package.json       # Dependencies and scripts
└── README.md          # Documentation

🧠 Architecture

Separation of Concerns

server.js → HTTP layer (routing, validation, responses)

taskManager.js → Business logic (task management, scheduling)

This design ensures:

✅ Easy to understand and maintain

✅ Testable (logic separated from HTTP)

✅ Flexible (easy to extend and refactor)

💡 How It Works
In-Memory Storage

Tasks are stored in a JavaScript Map:

Map<task_id, task_object>


O(1) lookup time

Better than arrays (O(n) search)

Clean API for get/set/delete

Task Scheduling

A UUID is generated as the task ID

Task stored in Map with status "pending"

A setTimeout timer is created for delay duration

Timer reference is stored for cancellation

When timer fires → status updates to "completed"

Cancellation

Lookup task by ID

clearTimeout() stops the timer

Status changes to "canceled"

Task remains in Map for history

⚙️ Concurrency Safety

Node.js Single-Threaded Event Loop

No race conditions

Map operations are atomic

Each callback completes before the next starts

No locks or mutexes required.

⚠️ Limitations

🧠 In-Memory Only – Tasks lost on restart

🖥️ Single Server Instance – No distributed sync

⏱️ Max Delay – 24 hours (due to setTimeout limits)

🔐 No Authentication – Open API

💾 Memory Constraints – Dependent on available RAM

🚀 Scaling for Production

Persistent Storage – Use PostgreSQL or MongoDB

Distributed Scheduling – Use Redis, BullMQ, or RabbitMQ

Multi-Instance Support – Use PM2, Kubernetes, Load Balancing

Advanced Scheduling – Use Agenda, node-cron, or Kafka Streams

Add-ons –

Authentication (JWT)

Rate limiting (express-rate-limit)

Logging (Winston / Pino)

Monitoring (Prometheus / Grafana)

Validation (Joi / express-validator)

🔒 Security Considerations

Current Implementation:

✅ Input validation

✅ JSON parsing safety

✅ Graceful error handling

For production:

🔐 Authentication (JWT/OAuth)

⛔ Rate limiting per user/IP

🌐 HTTPS/TLS

🧱 CORS configuration

🪖 Helmet.js for security headers

🐛 Troubleshooting
Server Won’t Start

Error: EADDRINUSE (Port already in use)

# Find process on port 3000
# Windows
netstat -ano | findstr :3000
# Mac/Linux
lsof -i :3000


Then kill or change port:

PORT=4000 npm start

Missing Modules

Error: Cannot find module 'express'

rm -rf node_modules
npm install

Tasks Not Completing

Check server logs

Ensure delay value is reasonable

Avoid very large delays

Task Not Canceling

Task may already be completed

Use GET /tasks/:id to verify (should return 409 if already completed)

📚 HTTP Status Codes
Code	Meaning	When Used
200	OK	Successful GET or DELETE
201	Created	Task successfully scheduled
400	Bad Request	Invalid input (validation failed)
404	Not Found	Task ID doesn’t exist
409	Conflict	Task already completed
500	Internal Server Error	Unexpected server error