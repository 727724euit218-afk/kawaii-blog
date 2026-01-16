# ✨ Mii_to_you - Kawaii Pixel Art Blog

A cozy, full-stack blog application with a nostalgic pixel art aesthetic. Built with Node.js, Express, and SQLite, featuring a complete content management system for writers and an engaging reading experience.

**Live Demo**: [https://kawaii-blog.onrender.com](https://kawaii-blog.onrender.com)

![Blog Screenshot](https://img.shields.io/badge/status-live-success)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎨 Features

### For Readers
- **📖 Blog Posts**: Browse posts with search and category filtering
- **🔍 Full Post View**: Dedicated pages for each blog post
- **💬 Comments**: Leave comments on posts (moderated by writer)
- **📧 Newsletter**: Subscribe with email and optional phone number
- **🎵 Sound Effects**: Interactive pixel sounds and ambient music
- **✨ Pixel Art Design**: Cozy kawaii aesthetic with pastel gradients

### For Writers
- **🔐 Secure Login**: JWT-based authentication
- **✍️ Post Management**: Create, edit, delete, and publish posts
- **🖼️ Image Upload**: Add featured images to posts (up to 5MB)
- **💬 Comment Moderation**: Approve or delete reader comments
- **📊 Subscriber Management**: View newsletter subscribers
- **📬 Contact Messages**: Manage reader inquiries

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (≥18.0.0)
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **CORS**: cors middleware

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom pixel art styling
- **JavaScript**: Vanilla JS (no frameworks)
- **Font**: Press Start 2P (Google Fonts)
- **Audio**: Web Audio API

---

## 📁 Project Structure

```
pixel-blog/
├── server/
│   ├── database.js          # SQLite database setup
│   ├── auth.js              # JWT authentication
│   ├── seed.js              # Auto-populate default posts
│   ├── server.js            # Main Express server
│   ├── routes/
│   │   ├── posts.js         # Post CRUD endpoints
│   │   ├── comments.js      # Comment endpoints
│   │   ├── likes.js         # Like system
│   │   ├── subscribers.js   # Newsletter subscriptions
│   │   └── contact.js       # Contact messages
│   └── uploads/             # Uploaded images
├── public/
│   ├── index.html           # Reader homepage
│   ├── post.html            # Full post view
│   ├── login.html           # Writer login
│   └── writer.html          # Writer dashboard
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/727724euit218-afk/kawaii-blog.git
   cd kawaii-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your JWT secret:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-random-key
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   - Reader view: http://localhost:3000
   - Writer login: http://localhost:3000/login.html

### Default Credentials
- **Username**: `mitra`
- **Password**: `changeme123`

⚠️ **Change these in production!**

---

## 📚 API Documentation

### Public Endpoints

#### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get single post
- `GET /api/posts/category/:category` - Get posts by category

#### Comments
- `POST /api/comments` - Submit a comment
- `GET /api/comments/post/:id` - Get approved comments for a post

#### Subscriptions
- `POST /api/subscribe` - Subscribe to newsletter

#### Likes
- `POST /api/likes` - Like a post
- `GET /api/likes/:postId` - Get like count
- `GET /api/likes/:postId/status` - Check if IP has liked

### Admin Endpoints (Require Authentication)

#### Posts
- `GET /api/posts/admin/all` - Get all posts (including drafts)
- `POST /api/posts/admin/create` - Create new post
- `PUT /api/posts/admin/:id` - Update post
- `DELETE /api/posts/admin/:id` - Delete post
- `PUT /api/posts/admin/:id/publish` - Toggle publish status

#### Comments
- `GET /api/comments/admin/all` - Get all comments
- `PUT /api/comments/admin/:id/approve` - Approve comment
- `DELETE /api/comments/admin/:id` - Delete comment

#### Subscribers
- `GET /api/subscribe/admin/all` - Get all subscribers
- `DELETE /api/subscribe/admin/:id` - Remove subscriber

#### Contact
- `GET /api/contact/admin/all` - Get all messages
- `DELETE /api/contact/admin/:id` - Delete message

#### Upload
- `POST /api/admin/upload` - Upload image (multipart/form-data)

---

## 🌐 Deployment

### Deploy to Render (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select your repository
   - Configure:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variable**: `JWT_SECRET` = (random string)

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Your blog is live! 🎉

### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select repository
5. Add environment variable: `JWT_SECRET`
6. Deploy!

---

## 🎨 Customization

### Change Colors
Edit the gradient in `public/index.html`:
```css
background: linear-gradient(to bottom, #B8A5D8 0%, #E8B4D4 50%, #F5C6AA 100%);
```

### Add Categories
Update category options in:
- `public/writer.html` (line 250-254)
- `public/index.html` (filter buttons)

### Modify Default Posts
Edit `server/seed.js` to change the auto-populated posts.

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured CORS middleware
- **Input Validation**: Server-side validation
- **File Upload Limits**: 5MB max, image types only
- **IP-based Rate Limiting**: For likes

---

## 📊 Database Schema

### Tables

**users**
- id, username, email, password, created_at

**posts**
- id, title, content, excerpt, category, image_url, author_id, published, created_at, updated_at

**comments**
- id, post_id, author_name, author_email, content, approved, created_at

**likes**
- id, post_id, ip_address, created_at

**subscribers**
- id, name, email, phone, subscribed_at

**contact_messages**
- id, name, email, message, created_at

---

## 🐛 Troubleshooting

### Posts not showing on deployed site
- Database resets on free tier (ephemeral storage)
- Auto-seed script populates default posts on startup
- Or manually add posts via writer dashboard

### Can't login to writer dashboard
- Check JWT_SECRET environment variable is set
- Verify default credentials haven't been changed
- Clear browser cache and cookies

### Images not uploading
- Check file size (max 5MB)
- Verify file type (jpg, png, gif, webp only)
- Ensure `server/uploads/` directory exists

---

## 📝 License

MIT License - feel free to use this project for learning or personal use!

---

## 👩‍💻 Author

**Mitra** (Sangamitra Pugal)
- GitHub: [@727724euit218-afk](https://github.com/727724euit218-afk)

---

## 🙏 Acknowledgments

- Pixel art design inspired by retro gaming aesthetics
- Press Start 2P font by CodeMan38
- Built with ❤️ and pixels

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [API Documentation](#-api-documentation)
3. Open an issue on GitHub

---

**Made with 💖 and pixels** ✨
