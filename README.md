# Mii_to_you Blog - Full-Stack Application

A cozy pixel art blog with complete backend functionality!

## 🚀 Quick Start

### Installation

1. Navigate to the project directory:
```bash
cd pixel-blog
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser:
- **Reader View**: http://localhost:3000
- **Writer Login**: http://localhost:3000/login.html

### Default Credentials

- **Username**: `mitra`
- **Password**: `changeme123`

⚠️ **Important**: Change the password after first login!

## 📁 Project Structure

```
pixel-blog/
├── server/
│   ├── server.js          # Main Express server
│   ├── database.js        # SQLite database setup
│   ├── auth.js            # JWT authentication
│   ├── routes/            # API endpoints
│   │   ├── posts.js
│   │   ├── comments.js
│   │   ├── likes.js
│   │   ├── subscribers.js
│   │   └── contact.js
│   └── uploads/           # Uploaded images
├── public/
│   ├── index.html         # Reader view
│   ├── login.html         # Writer login
│   └── writer.html        # Writer dashboard
├── package.json
└── blog.db                # SQLite database (created on first run)
```

## 🎨 Features

### Reader Features
- ✅ View all published blog posts
- ✅ Search posts by title/content
- ✅ Filter posts by category
- ✅ Add comments to posts
- ✅ Like posts (IP-based)
- ✅ Share posts on social media
- ✅ Subscribe to newsletter
- ✅ Send contact messages

### Writer Features
- ✅ Secure login with JWT
- ✅ Create, edit, and delete posts
- ✅ Upload images for posts
- ✅ Publish/unpublish posts (drafts)
- ✅ Moderate comments (approve/delete)
- ✅ View subscribers list
- ✅ Read contact messages
- ✅ View post analytics (likes, comments)

## 🔌 API Endpoints

### Public Endpoints

#### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get single post
- `GET /api/posts/category/:category` - Filter by category

#### Comments
- `GET /api/comments/:postId` - Get post comments
- `POST /api/comments/:postId` - Add comment

#### Likes
- `GET /api/likes/:postId/count` - Get like count
- `POST /api/likes/:postId` - Like a post

#### Other
- `POST /api/subscribe` - Subscribe to newsletter
- `POST /api/contact` - Send contact message

### Protected Endpoints (Require JWT Token)

#### Authentication
- `POST /api/auth/login` - Login

#### Post Management
- `GET /api/posts/admin/all` - Get all posts (including drafts)
- `POST /api/posts/admin/create` - Create post
- `PUT /api/posts/admin/:id` - Update post
- `DELETE /api/posts/admin/:id` - Delete post

#### Comment Moderation
- `GET /api/comments/admin/all` - Get all comments
- `PUT /api/comments/admin/:id/approve` - Approve comment
- `DELETE /api/comments/admin/:id` - Delete comment

#### Other Admin
- `GET /api/subscribe/admin/all` - Get subscribers
- `GET /api/contact/admin/all` - Get contact messages
- `POST /api/admin/upload` - Upload image

## 🗄️ Database Schema

### Tables
- **users** - Writer accounts
- **posts** - Blog posts
- **comments** - Post comments
- **likes** - Post likes (IP-based)
- **subscribers** - Newsletter subscribers
- **contact_messages** - Contact form submissions

## 🔒 Security

- Passwords hashed with bcrypt
- JWT token authentication
- SQL injection prevention (parameterized queries)
- Input validation
- File upload restrictions (images only, 5MB max)

## 🛠️ Development

### Adding a New Post (via API)

```javascript
const response = await fetch('/api/posts/admin/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        title: 'My New Post',
        content: 'Full post content...',
        excerpt: 'Short preview...',
        category: 'lifestyle',
        published: true
    })
});
```

### Uploading an Image

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
});
```

## 📝 Notes

- The database file (`blog.db`) is created automatically on first run
- Uploaded images are stored in `server/uploads/`
- Comments require approval before appearing publicly
- Likes are limited to one per IP address per post

## 🎯 Next Steps

1. Change default password after first login
2. Create your first blog post
3. Customize the design to match your brand
4. Add more categories as needed
5. Set up email notifications (optional)

## 💖 Made with pixels and love!

Enjoy your new blog! ✨
