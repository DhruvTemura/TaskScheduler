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
})