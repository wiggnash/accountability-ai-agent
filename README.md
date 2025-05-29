# 🤖 AI LinkedIn Post Generator

An AI-powered accountability assistant that helps developers and learners build their personal brand on LinkedIn by automating daily progress posts for public learning challenges like `#100DaysOfCode`, `#BuildInPublic`, and more.

## 🚀 Features

### Core MVP Features
- 🔐 **User Authentication** - Secure JWT-based login/registration
- ✍️ **Daily Progress Input** - Simple textarea to log what you learned/built
- 🤖 **AI-Powered Post Generation** - Transform bullet points into engaging LinkedIn posts
- 👀 **Preview & Edit Posts** - Review and customize AI-generated content
- 💾 **Post History** - Save and view all your previous entries
- 📅 **Challenge Tracking** - Track your progress in learning challenges
- 📋 **One-Click Copy** - Easy copy-to-clipboard for posting

### Future Features
- 📆 **Automated Scheduling** - Schedule posts directly to LinkedIn
- 🎨 **Custom Templates** - Different tones and styles for posts
- 📊 **Analytics Dashboard** - Track engagement and consistency
- 🔔 **Daily Reminders** - Email/SMS notifications to maintain streaks
- 👥 **Team Challenges** - Collaborate with learning cohorts

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Backend
- **Django** + **Django REST Framework** - RESTful API server
- **PostgreSQL** - Primary database
- **Simple JWT** - Token-based authentication
- **Claude AI API** - AI post generation

### Infrastructure
- **Celery + Redis** - Background task processing
- **Nginx + Gunicorn** - Production web server
- **Docker** - Containerized deployment

## 🏗️ Project Structure

```
ai-linkedin-generator/
├── backend/                 # Django REST API
│   ├── config/             # Django settings
│   ├── apps/               # Django applications
│   │   ├── authentication/ # User auth
│   │   ├── challenges/     # Challenge management
│   │   ├── posts/          # Post generation & history
│   │   └── core/           # Shared utilities
│   ├── requirements.txt    # Python dependencies
│   └── manage.py
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API integration
│   │   └── utils/          # Helper functions
│   ├── package.json
│   └── tailwind.config.js
├── docker-compose.yml      # Local development setup
├── .gitignore
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Redis (for background tasks)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-linkedin-generator.git
   cd ai-linkedin-generator
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend `.env`:**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
CLAUDE_API_KEY=your-claude-api-key
REDIS_URL=redis://localhost:6379/0
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🎯 Usage

### For Developers in #100DaysOfCode

1. **Sign up** and create your account
2. **Join a challenge** like "100 Days of Code"
3. **Daily check-in**: Enter what you learned/built today
   - "Learned React hooks and built a todo app"
   - "Debugged API integration issues"
   - "Completed LeetCode problems on binary trees"
4. **Generate post**: AI creates an engaging LinkedIn post
5. **Edit & copy**: Customize the post and copy to LinkedIn
6. **Track progress**: View your streak and post history

### Sample AI-Generated Post

**Input:** "Learned about React useEffect hook and built a weather app"

**AI Output:**
> 🚀 Day 15 of #100DaysOfCode!
> 
> Today I dove deep into React's useEffect hook and built my first weather app! The concepts of dependency arrays and cleanup functions finally clicked. 
> 
> Key takeaways:
> ✅ Understanding component lifecycle
> ✅ Managing side effects properly  
> ✅ API integration with useEffect
> 
> The journey continues! What's your favorite React hook?
> 
> #ReactJS #WebDevelopment #BuildInPublic #DevJourney

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh

### Posts
- `GET /api/posts/` - List user's posts
- `POST /api/posts/` - Create new post
- `POST /api/posts/generate/` - Generate AI post
- `GET /api/posts/{id}/` - Get specific post
- `PUT /api/posts/{id}/` - Update post

### Challenges
- `GET /api/challenges/` - List available challenges
- `POST /api/challenges/join/` - Join a challenge
- `GET /api/challenges/my/` - User's active challenges

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Using Docker
```bash
docker-compose up --build
```

### Manual Deployment
1. Configure production settings
2. Set up PostgreSQL and Redis
3. Deploy backend to your preferred platform
4. Build and deploy frontend to static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Claude AI](https://claude.ai) for powering the post generation
- [Django REST Framework](https://www.django-rest-framework.org/) for the robust API foundation
- [React](https://reactjs.org/) for the dynamic frontend
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/ai-linkedin-generator](https://github.com/yourusername/ai-linkedin-generator)

---

⭐ **Star this repo if it helped you build your LinkedIn presence!** ⭐
