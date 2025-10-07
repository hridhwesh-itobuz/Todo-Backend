import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import fs from 'fs'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const PORT = process.env.PORT
const DATA_FILE = './database/notes.json'

app.use(cors())
app.use(express.json())

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2))
}

app.get('/tasks', (req, res) => {
  const tasks = readTasks()
  res.json(tasks)
})

app.post('/tasks', (req, res) => {
  const { title, priority } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const newTask = {
    id: uuidv4(),
    title,
    priority: priority || 'Low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCompleted: false,
  }

  const tasks = readTasks()
  tasks.push(newTask)
  writeTasks(tasks)

  res.status(201).json(newTask)
})

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params
  const { title, isCompleted, priority } = req.body

  const tasks = readTasks()
  const task = tasks.find((t) => t.id === id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

  if (title !== undefined) task.title = title
  if (priority !== undefined) task.priority = priority
  if (isCompleted !== undefined) task.isCompleted = isCompleted
  task.updatedAt = new Date().toISOString()

  writeTasks(tasks)
  res.json(task)
})

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params
  const tasks = readTasks()
  const updated = tasks.filter((t) => t.id !== id)
  writeTasks(updated)
  res.json({ message: 'Task deleted' })
})

app.delete('/tasks', (req, res) => {
  writeTasks([])
  res.json({ message: 'All tasks cleared' })
})

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
)
