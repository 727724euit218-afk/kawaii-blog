const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { authenticateToken } = require('../auth');

// GET all published posts (public)
router.get('/', (req, res) => {
    const { category, search, limit = 10, offset = 0 } = req.query;

    let query = 'SELECT id, title, content, excerpt, category, image_url, created_at FROM posts WHERE published = 1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (search) {
        query += ' AND (title LIKE ? OR content LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET single post with full content (public)
router.get('/:id', (req, res) => {
    db.get(
        'SELECT * FROM posts WHERE id = ? AND published = 1',
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(row);
        }
    );
});

// GET posts by category (public)
router.get('/category/:category', (req, res) => {
    db.all(
        'SELECT id, title, content, excerpt, category, image_url, created_at FROM posts WHERE category = ? AND published = 1 ORDER BY created_at DESC',
        [req.params.category],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// GET all posts including drafts (admin only)
router.get('/admin/all', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM posts ORDER BY created_at DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// CREATE new post (admin only)
router.post('/admin/create', authenticateToken, (req, res) => {
    const { title, content, excerpt, category, image_url, published } = req.body;

    if (!title || !content || !excerpt || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
        `INSERT INTO posts (title, content, excerpt, category, image_url, author_id, published) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, content, excerpt, category, image_url || null, req.user.id, published ? 1 : 0],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, message: 'Post created successfully' });
        }
    );
});

// UPDATE post (admin only)
router.put('/admin/:id', authenticateToken, (req, res) => {
    const { title, content, excerpt, category, image_url, published } = req.body;

    db.run(
        `UPDATE posts 
         SET title = ?, content = ?, excerpt = ?, category = ?, image_url = ?, 
             published = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [title, content, excerpt, category, image_url || null, published ? 1 : 0, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json({ message: 'Post updated successfully' });
        }
    );
});

// DELETE post (admin only)
router.delete('/admin/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM posts WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    });
});

// TOGGLE publish status (admin only)
router.put('/admin/:id/publish', authenticateToken, (req, res) => {
    db.run(
        'UPDATE posts SET published = NOT published WHERE id = ?',
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Publish status toggled' });
        }
    );
});

module.exports = router;
