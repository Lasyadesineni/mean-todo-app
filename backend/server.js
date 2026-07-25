const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let isMongoConnected = false;

// Fallback in-memory store if local MongoDB is not running
let memoryTodos = [
  { _id: '1', title: 'Learn MEAN Stack', completed: false },
  { _id: '2', title: 'Build Todo App with CRUD', completed: true }
];

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/mean-todo-simple', {
  serverSelectionTimeoutMS: 2000
})
  .then(() => {
    isMongoConnected = true;
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    isMongoConnected = false;
    console.log('MongoDB not connected locally. Using active API memory store.');
  });

// Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// GET: Read all
app.get('/api/todos', async (req, res) => {
  if (isMongoConnected) {
    try {
      const todos = await Todo.find();
      return res.json(todos);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json(memoryTodos);
});

// POST: Create
app.post('/api/todos', async (req, res) => {
  if (isMongoConnected) {
    try {
      const todo = new Todo(req.body);
      await todo.save();
      return res.status(201).json(todo);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  const newTodo = {
    _id: Date.now().toString(),
    title: req.body.title,
    completed: req.body.completed || false
  };
  memoryTodos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT: Update
app.put('/api/todos/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!todo) return res.status(404).json({ error: 'Todo not found' });
      return res.json(todo);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  const index = memoryTodos.findIndex(t => t._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  memoryTodos[index] = { ...memoryTodos[index], ...req.body };
  res.json(memoryTodos[index]);
});

// DELETE: Delete
app.delete('/api/todos/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) return res.status(404).json({ error: 'Todo not found' });
      return res.json({ message: 'Todo deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  memoryTodos = memoryTodos.filter(t => t._id !== req.params.id);
  res.json({ message: 'Todo deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

