const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { authenticateToken } = require('../auth');

// GET comments for a post (public, only approved)
router.get('/:postId', (req, res) => {
    db.all(
        `SELECT id, author_name, content, created_at 
         FROM comments 
         WHERE post_id = ? AND approved = 1 
         ORDER BY created_at DESC`,
        [req.params.postId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// POST new comment (public)
router.post('/:postId', (req, res) => {
    const { author_name, author_email, content } = req.body;

    if (!author_name || !author_email || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(author_email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    db.run(
        'INSERT INTO comments (post_id, author_name, author_email, content) VALUES (?, ?, ?, ?)',
        [req.params.postId, author_name, author_email, content],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                id: this.lastID,
                message: 'Comment submitted! It will appear after approval.'
            });
        }
    );
});

// GET all comments (admin only)
router.get('/admin/all', authenticateToken, (req, res) => {
    db.all(
        `SELECT c.*, p.title as post_title 
         FROM comments c 
         JOIN posts p ON c.post_id = p.id 
         ORDER BY c.created_at DESC`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// APPROVE comment (admin only)
router.put('/admin/:id/approve', authenticateToken, (req, res) => {
    db.run(
        'UPDATE comments SET approved = 1 WHERE id = ?',
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Comment approved' });
        }
    );
});

// DELETE comment (admin only)
router.delete('/admin/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM comments WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Comment deleted' });
    });
});

module.exports = router;
