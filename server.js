//this file handles all our HTTP requests (main server file)

const express = require('express')
const taskManager = require('./taskManager')

const app = express()
const PORT = process.env || 3000

app.use(express.json())   //middleware



//POST/schedule - schedule a new task

app.post('/schedule', (req,res) => {
    const{message, delay} = req.body

    //message validation
    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
            error: 'message must be a string'
        })
    }

    //delay validation
    if(typeof delay !== 'number' || delay < 0 || delay > 86400) {
        return res.status(400).json ({
            error: 'delay must be between 0 and 86400 seconds'
        })
    }

    //create task and send response
    const task = taskManager.scheduleTask(message.trim(), delay)
    res.status(201).json(taskManager.cleanTask(task))
})



// GET /tasks - get all tasks

app.get('/tasks', (req,res) => {
    const allTasks = taskManager.getAllTasks()

    //clean all tasks
    const cleanedTasks = allTasks.map(taskManager.cleanTask) 
    res.json(cleanedTasks)
})



// GET /tasks/:id - specific task by id

app.get('/tasks/:id', (req,res) => {
    const task = taskManager.getTaskByID(req.params.id)

    if (!task) {
        return res.status(404).json({
            error: 'task not found'
        })
    }

    res.json(taskManager.cleanTask(task))
})



// DELETE /tasks/:id - delete a task

app.delete('/tasks/:id', (req,res) => {
    const task = taskManager.cancelTask(req.params.id)

    //if task doesnt exist
    if (!task) {
        return res.status(404).json({
            error: 'task not found'
        })
    }

    //task already completed - cant cancel
    if (task.status === 'completed') {
        return res.status(409).json({
            error : 'cant cancel - task already completed',
            task: taskManager.cleanTask(task)
        })
    }

    //successfully canceled
    res.json(taskManager.cleanTask(task))
})