const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { authenticateToken } = require('../auth');

// GET like count for a post (public)
router.get('/:postId/count', (req, res) => {
    db.get(
        'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
        [req.params.postId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ count: row.count });
        }
    );
});

// POST like a post (public, IP-based)
router.post('/:postId', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;

    db.run(
        'INSERT INTO likes (post_id, ip_address) VALUES (?, ?)',
        [req.params.postId, ip],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'You already liked this post' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Post liked!' });
        }
    );
});

// CHECK if user already liked (public)
router.get('/:postId/check', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;

    db.get(
        'SELECT id FROM likes WHERE post_id = ? AND ip_address = ?',
        [req.params.postId, ip],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ liked: !!row });
        }
    );
});

module.exports = router;
