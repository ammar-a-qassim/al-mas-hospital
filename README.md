# Al-Mas Hospital Document Management System

A comprehensive document management system built for Al-Mas Hospital with features for document upload, categorization, search, and backup/restore functionality.

## Features

- 🔐 Secure authentication with JWT
- 📁 Document upload and management
- 🏥 Department and category organization
- 🔍 Advanced search and filtering
- 🎨 Multiple theme options (Light, Dark, Blue, Green, Purple, Teal)
- 🌐 Multi-language support (English & Arabic)
- 💾 Database backup and restore
- 👥 User and admin role management

## Tech Stack

**Frontend:**
- React + Vite
- React Router
- Axios
- Lucide Icons

**Backend:**
- Node.js + Express
- SQLite
- JWT Authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/al-mas-hospital.git
cd al-mas-hospital
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create environment files:
```bash
# Backend .env
cp .env.example .env

# Frontend .env
cp client/.env.example client/.env
```

5. Start the development servers:

Backend:
```bash
npm start
```

Frontend (in a new terminal):
```bash
cd client
npm run dev
```

6. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Default Admin Credentials
After first run, create an admin user through the registration endpoint or database.

## Deployment

See [deployment_guide.md](deployment_guide.md) for detailed instructions on deploying to Render.com.

## License

This project is licensed under the MIT License.
