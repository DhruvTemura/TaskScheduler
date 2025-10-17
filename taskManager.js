//this file contains all the task logic (creating, storing, completing, cancelling)
const {v4: uuidv4} = require('uuid')

//Using Map to store all tasks, as it has fast lookups by ID
//key = taskID, value = task object
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

    //a timer, that completes after delay
    task._timeoutRef = setTimeout(() => {
        if (task.status === 'pending') {
            task.status = 'completed';
            task.completed_at = new Date().toISOString();
            console.log(`Task ${taskID} completed: "${message}"`);
        }
    }, delaySeconds * 1000);

    // Stores task in Map
    tasks.set(taskID, task);
  
    console.log(`Task ${taskID} scheduled for ${delaySeconds}s`);
    return task;
}



//get all tasks - returns an array of tasks (pending and completed)

function getAllTasks(){
    return Array.from(tasks.values()) //converts map values to array
}



//get specific tasks by ID

function getTaskByID(taskID) {
    return tasks.get(taskID)
}



//cancel a task

function cancelTask(taskID) {
    const task = tasks.get(tasksID)

    if(!task){             //if a task doesnt exist
        return null
    }

    if (task.status === 'completed') {    //already completed (cant cancel)
        return task
    }

    if (task.status === 'pending') {       //cancelling task
        clearTimeout(task._timeoutRef)
        
        task.status = 'canceled'                     //updating task status
        task.completed_at = new Date().toISOString()

        console.log(`Task ${taskID} cancelled`)
    }
    return task;
}



//Removing extra fields before sending to client in API response

function cleanTask(task) {
    const{_timeoutRef, ...cleanedTask} = task
    return cleanedTask;
}


//clear all tasks

function clearAllTasks() {
    tasks.forEach(task => {             //cancels all pending timers first
        if(task._timeoutRef){
            clearTimeout(task._timeoutRef)
        }
    })
    tasks.clear();
}