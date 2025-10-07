import { Router } from 'express'
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from '../controller/controller.js'

const router = Router()

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`)
  next()
})

router.get('/tasks', getTasks)
router.post('/tasks', addTask)
router.put('/tasks/:id', updateTask)
router.delete('/tasks/:id', deleteTask)
router.delete('/tasks', deleteAllTasks)

export default router
