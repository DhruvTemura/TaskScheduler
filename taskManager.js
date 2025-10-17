//this file contains all the task logic (creating, storing, completing, cancelling)

const {v4: uuidv4} = require('uuid')

//Using Map to store all tasks, as it has fast lookups by ID

const tasks = new Map()

//Create new task - scheduled to complete after delay

function scheduleTask(message, delaySeconds) {
    const taskID = uuidv4();

    //task object
    const task = {
        task_id: taskID,
        message: message,
        delay: delaySeconds,
        status: 'task pending',
        scheduled_at: new Date().toISOString(),
        completed_at: null,
        _timeoutRef: null           //for cancelling timer if needed
    }
}