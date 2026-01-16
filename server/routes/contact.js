const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { authenticateToken } = require('../auth');

// POST contact message (public)
router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    db.run(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Message sent successfully!' });
        }
    );
});

// GET all contact messages (admin only)
router.get('/admin/all', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM contact_messages ORDER BY created_at DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// MARK message as read (admin only)
router.put('/admin/:id/read', authenticateToken, (req, res) => {
    db.run(
        'UPDATE contact_messages SET read = 1 WHERE id = ?',
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Message marked as read' });
        }
    );
});

// DELETE contact message (admin only)
router.delete('/admin/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM contact_messages WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Message deleted' });
    });
});

module.exports = router;
