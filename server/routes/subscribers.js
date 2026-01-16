const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { authenticateToken } = require('../auth');

// POST subscribe (public)
router.post('/', (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    db.run(
        'INSERT INTO subscribers (email, name) VALUES (?, ?)',
        [email, name],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already subscribed' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Successfully subscribed!' });
        }
    );
});

// GET all subscribers (admin only)
router.get('/admin/all', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM subscribers ORDER BY subscribed_at DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// DELETE subscriber (admin only)
router.delete('/admin/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM subscribers WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Subscriber removed' });
    });
});

module.exports = router;
