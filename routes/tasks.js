const express = require("express");
const router = express.Router();
const db = require("../config/db");

/** 
 * GET      http://localhost:3000/api/todos/ -> all todos
 * GET      http://localhost:3000/api/todos/:id -> single todo
 * POST     http://localhost:3000/api/todos/ -> create new todo
 * PATCH    http://localhost:3000/api/todos/:id -> update todo
 * DELETE   http://localhost:3000/api/todos/:id -> delete todo
 * DELETE   http://localhost:3000/api/todos/ -> delete all todos
 */

// GET all tasks
router.get('/', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
});

// GET a single task by ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        return res.status(200).json(results[0]);
    });
});

// POST a new task
router.post('/', (req, res) => {
    const { title, description, deadline } = req.body;
    db.query('INSERT INTO tasks (title, description, deadline) VALUES (?, ?, ?)', [title, description, deadline], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ message: 'Todo created successfully', id: results.insertId });
    });
});

// PATCH an existing todo by ID
router.patch('/:id', (req, res) => {
    const id = req.params.id;

    let updateFields = Object.keys(req.body).map(field => `${field} = ?`).join(', ');
    let updateValues = Object.values(req.body);

    db.query(`UPDATE tasks SET ${updateFields} WHERE id = ?`, [...updateValues, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        return res.status(200).json({ message: 'Todo updated successfully' });
    });
});

// DELETE a todo by ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        return res.status(200).json({ message: 'Todo deleted successfully' });
    });
});

// DELETE all todos
router.delete('/', (req, res) => {
    db.query('DELETE FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({ message: 'All todos deleted successfully' });
    });
});

module.exports = router;