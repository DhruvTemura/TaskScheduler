//this file handles all our HTTP requests (main server file)

const express = require('express')
const taskManager = require('./taskManager')

const app = express()
const PORT = process.env || 3000

app.use(express.json())   //middleware