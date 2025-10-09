import Task from '../schema/model.js';

export default class ControllerFunctions {
  getTasks = async (req, res, next) => {
    try {
      const { search, status, priority } = req.query;

      const filter = {};

      if (search) {
        const regex = new RegExp(search, 'i');

        filter.$or = [
          { title: { $regex: regex } },
          { priority: { $regex: regex } },
          { tags: { $regex: regex } },
        ];
      }

      if (status === 'completed') {
        filter.isCompleted = true;
      } else if (status === 'pending') {
        filter.isCompleted = false;
      }

      if (priority && priority !== 'all') {
        filter.priority = priority.toLowerCase();
      }

      if (priority === 'all') {
        filter.priority = { $in: ['low', 'medium', 'high'] };
      }

      const tasks = await Task.find(filter).sort({ updatedAt: -1 });

      if (tasks.length === 0) {
        return res.status(200).json([]);
      }

      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  };

  addTask = async (req, res, next) => {
    try {
      //const { title, priority, tags } = req.body
      const { title } = req.body;
      if (!title) {
        res.status(400);
        throw new Error('Title is Required!');
      }

      const newTask = await Task.create(req.body);
      res.status(201).json(newTask);
    } catch (e) {
      res.status(500).json({ error: e.message });
      next(e);
    }
  };

  deleteAllTasks = async (req, res, next) => {
    try {
      await Task.deleteMany({});

      res.json({ message: 'All tasks cleared' });
    } catch (e) {
      next(e);
    }
  };

  deleteTask = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const deletedTask = await Task.findByIdAndDelete(id);

      if (!deletedTask) {
        res.status(400);
        throw new Error('Task not found');
      }

      res.status(200).send({ success: true, data: deletedTask });
    } catch (e) {
      next(e);
    }
  };

  updateTask = async (req, res, next) => {
    const id = req.params.id;
    const { title, tags, priority, isCompleted } = req.body;
    try {
      console.log('Updating task with id:', id);
      const newData = { title, tags, priority };

      if (typeof isCompleted === 'boolean') {
        newData.isCompleted = isCompleted;
      }
      console.log('New data to update:', newData);

      const result = await Task.findByIdAndUpdate(
        id,
        { $set: newData },
        { new: true }
      );

      if (!result) {
        res.status(400);
        throw new Error('Document not found.');
      }

      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
