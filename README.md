# Task Scheduler API (try POSTMAN for better experience)

A simple in-memory task scheduler built with Node.js and Express. Schedule tasks to execute after a specified delay!

## 📋 Overview

This API allows you to:

- Schedule tasks with custom messages and delays (in seconds)
- Automatically mark tasks as completed after their delay expires
- View all tasks (pending, completed, and canceled)
- Cancel pending tasks before they complete
- Validate inputs and handle errors gracefully

## 🚀 Features

- ✅ **POST /schedule** - Schedule new tasks
- ✅ **GET /tasks** - List all tasks with their status
- ✅ **GET /tasks/:id** - Get a specific task by ID
- ✅ **DELETE /tasks/:id** - Cancel pending tasks
- ✅ **Input validation** - Prevents invalid data
- ✅ **Error handling** - Clear error messages with proper HTTP status codes
- ✅ **Efficient storage** - Uses Map for O(1) task lookups
- ✅ **Clean architecture** - Separated concerns (routes vs business logic)

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **UUID** - Unique ID generation
- **JavaScript Map** - In-memory storage

## 📦 Requirements

- Node.js >= 14.x
- npm or yarn

## ⚙️ Installation

```bash
# Clone or download the project
cd task-scheduler

# Install dependencies
npm install
```

## 🏃 Running the Application

### Production Mode

```bash
npm start
```

### Development Mode (auto-restart on file changes)

```bash
npm run dev
```

The server will start on **http://localhost:3000**

You should see:

```
 Task Scheduler running on http://localhost:3000
```

## 📡 API Endpoints

### 1. Health Check

**GET /health**

Check if the server is running.

```bash
curl http://localhost:3000/health
```

**Response (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2025-10-20T12:34:56.789Z"
}
```

---

### 2. Schedule a Task

**POST /schedule**

Create a new task that will automatically complete after the specified delay.

**Request Body:**

```json
{
  "message": "Send email notification",
  "delay": 5
}
```

**Parameters:**

- `message` (string, required) - Task description (non-empty)
- `delay` (number, required) - Delay in seconds (0 to 86400)

**Example:**

```bash
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{"message": "Send email notification", "delay": 5}'
```

**Response (201 Created):**

```json
{
  "task_id": "3556c313-b569-4633-b609-f4173bcaeda6",
  "message": "Send email notification",
  "delay": 5,
  "status": "pending",
  "scheduled_at": "2025-10-20T12:34:56.789Z",
  "completed_at": null
}
```

**Validation Errors (400 Bad Request):**

```json
// Empty message
{
  "error": "message must be a non-empty string"
}

// Invalid delay
{
  "error": "delay must be a number between 0 and 86400 seconds"
}
```

---

### 3. Get All Tasks

**GET /tasks**

Retrieve all tasks regardless of status (pending, completed, or canceled).

```bash
curl http://localhost:3000/tasks
```

**Response (200 OK):**

```json
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
```

---

### 4. Get Task by ID

**GET /tasks/:id**

Retrieve details for a specific task.

```bash
curl http://localhost:3000/tasks/3556c313-b569-4633-b609-f4173bcaeda6
```

**Response (200 OK):**

```json
{
  "task_id": "3556c313-b569-4633-b609-f4173bcaeda6",
  "message": "Send email notification",
  "delay": 5,
  "status": "completed",
  "scheduled_at": "2025-10-20T12:34:56.789Z",
  "completed_at": "2025-10-20T12:35:01.789Z"
}
```

**Error (404 Not Found):**

```json
{
  "error": "Task not found"
}
```

---

### 5. Cancel a Task

**DELETE /tasks/:id**

Cancel a pending task. The timer will be stopped and the task status will change to "canceled".

```bash
curl -X DELETE http://localhost:3000/tasks/3556c313-b569-4633-b609-f4173bcaeda6
```

**Response (200 OK):**

```json
{
  "task_id": "3556c313-b569-4633-b609-f4173bcaeda6",
  "message": "Send email notification",
  "delay": 100,
  "status": "canceled",
  "scheduled_at": "2025-10-20T12:34:56.789Z",
  "completed_at": "2025-10-20T12:35:10.000Z"
}
```

**Error (404 Not Found):**

```json
{
  "error": "Task not found"
}
```

**Error (409 Conflict - Task already completed):**

```json
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
```

---

## 📊 Task Status Flow

```
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
```

**Note:** Canceled and completed tasks remain in memory and are visible in GET /tasks.

---

## 🧪 Testing the API

### Using curl

Complete workflow:

```bash
# 1. Check server health
curl http://localhost:3000/health

# 2. Schedule a task (5 second delay)
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{"message": "Test task", "delay": 5}'

# Copy the task_id from response

# 3. Check task status (should be pending)
curl http://localhost:3000/tasks

# 4. Wait 5 seconds...

# 5. Check again (should be completed)
curl http://localhost:3000/tasks

# 6. Schedule a long task
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{"message": "Long task", "delay": 100}'

# 7. Cancel it immediately
curl -X DELETE http://localhost:3000/tasks/PASTE-TASK-ID-HERE

# 8. Test validation (should get error)
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{"message": "", "delay": 5}'
```

### Using Postman/Hoppscotch

1. Import the following requests:
   - **GET** `http://localhost:3000/health`
   - **POST** `http://localhost:3000/schedule` with JSON body
   - **GET** `http://localhost:3000/tasks`
   - **GET** `http://localhost:3000/tasks/:id`
   - **DELETE** `http://localhost:3000/tasks/:id`

2. Set `Content-Type: application/json` header for POST requests

---

## 🏗️ Project Structure

```
task-scheduler/
├── server.js          # Express server - handles HTTP requests
├── taskManager.js     # Business logic - manages tasks and timers
├── package.json       # Project dependencies and scripts
└── README.md          # Documentation
```

### Architecture

**Separation of Concerns:**

- `server.js` - HTTP layer (routing, validation, response formatting)
- `taskManager.js` - Business logic (task creation, storage, scheduling)

This design makes the code:

- ✅ Easy to understand and maintain
- ✅ Flexible (can swap storage or add features easily)

---

## 💡 How It Works

### In-Memory Storage

Tasks are stored in a JavaScript Map data structure:

```javascript
Map<task_id, task_object>
```

**Why Map?**

- **O(1) lookup time** - Instant access to tasks by ID
- Better than arrays which require O(n) searching
- Clean API for get/set/delete operations

### Task Scheduling

When you schedule a task:

1. A unique UUID is generated as the task ID
2. Task is stored in the Map with status "pending"
3. A `setTimeout` timer is created for the delay duration
4. Timer reference is stored with the task (for cancellation)
5. When timer fires → status changes to "completed"

### Cancellation

To cancel a task:

1. Look up the task by ID in the Map
2. Call `clearTimeout()` to stop the timer
3. Change status to "canceled"
4. Task remains in Map for history tracking

### Concurrency Safety

**Node.js Single-Threaded Event Loop:**

- Node.js executes JavaScript in a single thread
- Even though multiple timers can be scheduled, they don't run simultaneously
- The event loop processes callbacks one at a time
- Map operations are atomic within the event loop
- **Result:** No race conditions, no need for locks/mutexes

**Example:**

```
Event Loop Queue:
1. Handle POST /schedule request
2. Store task in Map
3. Continue...
...
100. Timer fires for task A
101. Update task A status in Map
102. Timer fires for task B
103. Update task B status in Map
```

Each operation completes before the next one starts.

---

## ⚠️ Limitations

### Current Constraints

1. **In-Memory Only**
   - Tasks are lost when server restarts
   - Not suitable for production without persistence

2. **Single Server Instance**
   - Tasks only visible on the server that created them
   - Can't distribute across multiple servers

3. **Maximum Delay**
   - Currently limited to 24 hours (86,400 seconds)
   - Configurable but setTimeout has practical limits

4. **No Authentication**
   - Anyone can create/cancel tasks
   - No rate limiting

5. **Memory Constraints**
   - Limited by available RAM
   - Large number of tasks could cause issues

---

## 🐛 Troubleshooting

### Server won't start

**Error: Cannot find module 'express'**

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Tasks not completing

- Check server console for errors
- Timer might have failed to start
- Server might have crashed
- Verify delay is reasonable
- Very large delays might not work as expected

### Can't cancel a task

- Task might already be completed
- Check current status with GET /tasks/:id
- Should return 409 error if already completed

---

## 📚 HTTP Status Codes Used

| Code | Meaning               | When Used                         |
|------|-----------------------|-----------------------------------|
| 200  | OK                    | Successful GET or DELETE          |
| 201  | Created               | Task successfully scheduled       |
| 400  | Bad Request           | Invalid input (validation failed) |
| 404  | Not Found             | Task ID doesn't exist             |
| 409  | Conflict              | Can't cancel completed task       |
| 500  | Internal Server Error | Unexpected server error           |

---
