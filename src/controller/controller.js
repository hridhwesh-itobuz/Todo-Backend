import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const DATA_FILE = './database/notes.json'

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFile(DATA_FILE, '[]')
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2))
}

export async function getTasks(req, res, next) {
  try {
    const { search, status = 'all', priority } = req.query
    const data = await readTasks()
    let tasks = data

    if (search && typeof search === 'string') {
      const searchText = search.toLowerCase()

      tasks = tasks.filter((task) => {
        return (
          task.title?.toLowerCase().includes(searchText) ||
          task.priority?.toLowerCase().includes(searchText) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(searchText))
        )
      })
    }

    if (status === 'completed') {
      tasks = tasks.filter((task) => task.isCompleted === true)
    } else if (status === 'pending') {
      tasks = tasks.filter((task) => task.isCompleted === false)
    }

    if (priority && priority != 'all' && typeof priority === 'string') {
      tasks = tasks.filter(
        (task) => task.priority?.toLowerCase() === priority.toLowerCase()
      )
    } else if (priority == 'all') {
      tasks = tasks.filter(
        (task) =>
          task.priority === 'low' ||
          task.priority === 'medium' ||
          task.priority === 'high'
      )
    }

    if (tasks == []) {
      throw new Error('Task list empty.')
    }
    tasks.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

    res.json(tasks)
  } catch (err) {
    next(err)
  }
}

export async function addTask(req, res, next) {
  try {
    const { title, priority, tags } = req.body

    if (!title) {
      res.status(400)
      throw new Error('Title is Required!')
    }

    const newTask = {
      id: uuidv4(),
      title,
      tags,
      priority: priority || 'Low',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCompleted: false,
    }

    const tasks = readTasks()
    tasks.push(newTask)
    writeTasks(tasks)

    res.status(201).json(newTask)
  } catch (e) {
    next(e)
  }
}

export async function deleteAllTasks(req, res, next) {
  try {
    writeTasks([])

    res.json({ message: 'All tasks cleared' })
  } catch (e) {
    next(e)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params
    const tasks = readTasks()

    const indexToRemove = tasks.findIndex((task) => task.id === id)
    console.log('Deleted at: ', indexToRemove)

    if (indexToRemove !== -1) {
      tasks.splice(indexToRemove, 1)

      writeTasks(tasks)
    } else {
      res.status(400)
      throw new Error("Task couldn't be found")
    }
    res.json({ message: 'Task deleted' })
  } catch (e) {
    next(e)
  }
}

export async function updateTask(req, res, next) {
  try {
    const { id } = req.params
    const { title, isCompleted, priority, tags } = req.body

    const tasks = readTasks()
    const task = tasks.find((t) => t.id === id)
    if (!task) {
      res.status(400)
      throw new Error('Task not found')
    }

    if (title && typeof title === 'string') {
      task.title = title
    }
    if (priority && typeof priority === 'string') {
      task.priority = priority
    }
    if (isCompleted !== undefined && typeof isCompleted === 'boolean') {
      task.isCompleted = isCompleted
    }
    if (tags && Array.isArray(tags)) {
      task.tags = tags
    }
    task.updatedAt = new Date().toISOString()

    writeTasks(tasks)
    res.json(task)
  } catch (e) {
    next(e)
  }
}
