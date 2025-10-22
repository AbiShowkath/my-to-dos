# MyTodo Application

A modern, full-stack todo list application built with React frontend and FastAPI backend, featuring user authentication, Redis caching, and Docker containerization.

## Features

- **User Authentication**: Registration and login system
- **Todo Management**: Create, read, update, delete todos
- **Date Management**: Set due dates with quick options (today, tomorrow, custom date)
- **Filtering**: View open, completed, or all todos
- **Real-time Updates**: Instant UI updates with backend synchronization
- **Caching**: Redis integration for improved performance
- **Modern UI**: Clean, responsive design with Tailwind CSS and Heroicons
- **Containerized**: Full Docker setup for easy deployment

## Technology Stack

### Backend (`/api`)
- **FastAPI**: Modern, fast web framework for APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **MySQL**: Production-ready database with proper schema
- **Redis**: In-memory caching for performance
- **JWT Authentication**: Secure token-based auth
- **Pydantic**: Data validation using Python type annotations
- **Bootstrap Script**: Automated database initialization with sample data

### Frontend (`/app`)
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful hand-crafted SVG icons
- **React DatePicker**: Date selection component
- **React Modal**: Accessible modal dialogs

## Project Structure

```
todo_list/
├── api/                    # Python FastAPI backend
│   ├── main.py            # FastAPI application
│   ├── database.py        # Database models and connection
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # Authentication logic
│   ├── redis_client.py    # Redis caching
│   ├── requirements.txt   # Python dependencies
│   ├── .env              # Environment variables
│   └── Dockerfile        # API container config
├── app/                   # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service layer
│   │   └── index.js       # App entry point
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── Dockerfile         # Frontend container config
└── docker-compose.yml     # Multi-container orchestration
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation and Setup

1. **Clone and navigate to the project:**
   ```bash
   cd /home/ubuntu/dev/devops-training/projects/todo_list
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Demo Accounts
The bootstrap script creates demo accounts with sample data:
- **Demo User**: username=`demo`, password=`demo123`
- **Admin User**: username=`admin`, password=`admin`

### Manual Setup (Development)

#### Backend Setup
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd app
npm install
npm start
```

#### Redis Setup
```bash
# Install and start Redis
redis-server
```

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /token` - User login (get JWT token)
- `GET /me` - Get current user info

### Todos
- `GET /todos` - Get todos (with optional completed filter)
- `POST /todos` - Create new todo
- `PUT /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo

## Usage

1. **Register a new account** or **login** with existing credentials
2. **Create todos** using the + button
3. **Set due dates** with quick options (today, tomorrow) or custom dates
4. **Mark todos as complete** by clicking the checkbox
5. **Filter todos** by status (open, completed, all)
6. **Edit or delete** todos using the action buttons

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your_secret_key
DATABASE_URL=mysql+pymysql://mytodo:mytodo123@mysql:3306/mytodo
REDIS_URL=redis://redis:6379
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Database Initialization
The application includes a comprehensive bootstrap script (`bootstrap.py`) that:
- Waits for MySQL to be ready
- Creates database tables automatically
- Loads initial demo data (users and todos)
- Handles duplicate data gracefully
- Provides demo credentials for immediate testing

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Remove volumes (reset data)
docker-compose down -v
```

## Features in Detail

### User Management
- Secure user registration with validation
- JWT-based authentication
- Protected routes and API endpoints
- User profile information storage

### Todo Management
- Create todos with title, description, and due date
- Mark todos as complete/incomplete
- Edit existing todos
- Delete todos with confirmation
- Filter by completion status

### Caching Strategy
- Redis caching for todo lists
- Automatic cache invalidation on updates
- Performance optimization for frequent queries

### UI/UX Features
- Responsive design for all devices
- Modern, clean interface
- Real-time status updates
- Visual indicators for overdue items
- Accessible modal dialogs
- Smooth transitions and hover effects

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.