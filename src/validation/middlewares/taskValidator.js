import {
  taskCreateSchema,
  taskUpdateSchema,
} from '../schema/validationSchema.js'

export default class ToDoValidations {
  validateCreation = async (req, res, next) => {
    try {
      await taskCreateSchema.validate(req.body, {
        abortEarly: false, // return all validation errors
        stripUnknown: true, // remove unexpected fields
      })

      next()
    } catch (err) {
      if (err.name === 'ValidationError') {
        err.status = 400
        next(new Error(err.errors.join(', ')))
      }
      next(err)
    }
  }
  validateUpdate = async (req, res, next) => {
    try {
      await taskUpdateSchema.validate(req.body, {
        abortEarly: false, // return all validation errors
        stripUnknown: true, // remove unexpected fields
      })

      next()
    } catch (err) {
      if (err.name === 'ValidationError') {
        err.status = 400
        next(new Error(err.errors.join(', ')))
      }
      next(err)
    }
  }
}
