const db = require('../config/db'); // Ensure the correct path to db.js

// Get all tasks
exports.getAllTasks = (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
    res.status(200).json(results);
  });
};

// Create a new task
exports.createTask = (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }
  db.query('INSERT INTO tasks (name, description) VALUES (?, ?)', [name, description], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating task', error: err.message });
    }
    res.status(201).json({ id: results.insertId, name, description });
  });
};

// Update a task
exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }
  db.query('UPDATE tasks SET name = ?, description = ? WHERE id = ?', [name, description, taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating task', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: `Task with ID ${taskId} not found` });
    }
    res.status(200).json({ message: 'Task updated successfully', id: taskId, name, description });
  });
};

// Delete a task
exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: `Task with ID ${taskId} not found` });
    }
    res.status(200).json({ message: 'Task deleted successfully', id: taskId });
  });
};
