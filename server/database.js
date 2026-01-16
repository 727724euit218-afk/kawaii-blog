const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'blog.db');
const db = new sqlite3.Database(DB_PATH);

// Initialize database with tables
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Posts table
            db.run(`
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    excerpt TEXT NOT NULL,
                    category TEXT NOT NULL,
                    image_url TEXT,
                    author_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    published BOOLEAN DEFAULT 0,
                    FOREIGN KEY (author_id) REFERENCES users(id)
                )
            `);

            // Comments table
            db.run(`
                CREATE TABLE IF NOT EXISTS comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    post_id INTEGER NOT NULL,
                    author_name TEXT NOT NULL,
                    author_email TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    approved BOOLEAN DEFAULT 0,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
                )
            `);

            // Likes table
            db.run(`
                CREATE TABLE IF NOT EXISTS likes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    post_id INTEGER NOT NULL,
                    ip_address TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    UNIQUE(post_id, ip_address)
                )
            `);

            // Subscribers table
            db.run(`
                CREATE TABLE IF NOT EXISTS subscribers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    active BOOLEAN DEFAULT 1
                )
            `);

            // Contact messages table
            db.run(`
                CREATE TABLE IF NOT EXISTS contact_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    subject TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    read BOOLEAN DEFAULT 0
                )
            `, (err) => {
                if (err) {
                    reject(err);
                } else {
                    // Create default user if not exists
                    createDefaultUser().then(resolve).catch(reject);
                }
            });
        });
    });
}

// Create default writer account
async function createDefaultUser() {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE username = ?', ['mitra'], async (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (!row) {
                const hashedPassword = await bcrypt.hash('changeme123', 10);
                db.run(
                    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                    ['mitra', hashedPassword, 'mitra@miitoyou.blog'],
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('✅ Default user created: username=mitra, password=changeme123');
                            resolve();
                        }
                    }
                );
            } else {
                console.log('✅ Database initialized');
                resolve();
            }
        });
    });
}

module.exports = { db, initializeDatabase };
