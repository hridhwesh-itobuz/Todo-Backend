import fs from 'fs'
//import { v4 as uuidv4 } from 'uuid'
import { validateRequest } from '../../validation/validator.js'
import { taskCreateSchema, taskUpdateSchema } from '../../schema/schema.js'
import Task from '../../schema/mongoschema.js'

const DATA_FILE = './database/notes.json'

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFile(DATA_FILE, '[]')
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2))
}

export const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority } = req.query

    const filter = {}

    if (search && typeof search === 'string') {
      const regex = new RegExp(search, 'i')

      filter.$or = [
        { title: { $regex: regex } },
        { priority: { $regex: regex } },
        { tags: { $regex: regex } },
      ]
    }

    if (status === 'completed') {
      filter.isCompleted = true
    } else if (status === 'pending') {
      filter.isCompleted = false
    }

    if (priority && priority !== 'all') {
      filter.priority = priority.toLowerCase()
    }

    if (priority === 'all') {
      filter.priority = { $in: ['low', 'medium', 'high'] }
    }

    const tasks = await Task.find(filter).sort({ updatedAt: -1 })

    if (tasks.length === 0) {
      return res.status(200).json([])
    }

    res.status(200).json(tasks)
  } catch (err) {
    next(err)
  }
}

export async function addTask(req, res, next) {
  const validatedData = await validateRequest(taskCreateSchema, req.body, next)
  if (!validatedData) return

  try {
    //const { title, priority, tags } = req.body
    const { title } = req.body
    if (!title) {
      res.status(400)
      throw new Error('Title is Required!')
    }

    const newTask = await Task.create(req.body)
    res.status(201).json(newTask)
  } catch (e) {
    res.status(500).json({ error: e.message })
    next(e)
  }
}

export async function deleteAllTasks(req, res, next) {
  try {
    await Task.deleteMany({})

    res.json({ message: 'All tasks cleared' })
  } catch (e) {
    next(e)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params
    console.log(id)
    const deletedTask = await Task.findByIdAndDelete(id)

    if (!deletedTask) {
      res.status(400)
      throw new Error('Task not found')
    }

    res.status(200).send({ success: true, data: deletedTask })
  } catch (e) {
    next(e)
  }
}

export async function updateTask(req, res, next) {
  const { id } = req.params
  const validatedData = await validateRequest(taskUpdateSchema, req.body, next)
  if (!validatedData) return
  try {
    const tasks = readTasks()
    const task = tasks.find((t) => t.id === id)
    if (!task) {
      res.status(400)
      throw new Error('Task not found')
    }
    if (validatedData.title) {
      task.title = validatedData.title
    }
    if (validatedData.tags) {
      task.tags = validatedData.tags
    }
    if (validatedData.priority) {
      task.isImportant = validatedData.isImportant
    }
    if (typeof validatedData.isCompleted === 'boolean') {
      task.isCompleted = validatedData.isCompleted
    }

    task.updatedAt = new Date().toISOString()

    writeTasks(tasks)
    res.json(task)
  } catch (e) {
    next(e)
  }
}
