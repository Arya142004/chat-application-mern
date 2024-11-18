# Real-Time MERN Chat Application

A feature-rich chat application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack with real-time messaging capabilities powered by Socket.io.

## 🌟 Features

- **User Authentication**
  - Secure JWT (JSON Web Token) based authentication
  - Password hashing for enhanced security
  - Input validation for all user data

- **Real-Time Communication**
  - Instant messaging using Socket.io
  - Real-time user online/offline status
  - Automatic chat window scrolling for new messages
  - Live user typing indicators

- **Chat Features**
  - Persistent chat history stored in MongoDB
  - One-on-one private messaging
  - Display of online users
  - User status indicators (online/offline)
  - Auto-scroll to latest messages

## 🛠️ Technical Stack

### Frontend
- React.js
- Socket.io-client
- Axios for API calls
- Modern UI/UX design principles

### Backend
- Node.js
- Express.js
- MongoDB for database
- Socket.io for real-time communication
- JWT for authentication
- Bcrypt for password hashing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14+ recommended)
- MongoDB
- npm or yarn

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Arya142004/chat-application-mern.git
```

2. Install dependencies for backend:
```bash
cd backend
npm install
```

3. Install dependencies for frontend:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=4000
CLIENT_URL=your_frontend_url
```

## 🚀 Running the Application

1. Start the backend server:
```bash
cd api
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

The application should now be running on `http://localhost:3000`

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Input validation and sanitization
- Secure socket connections
- Protected API routes

## 🗄️ Database Structure

The application uses MongoDB with the following main collections:
- Users: Stores user information and authentication details
- Messages: Stores chat history and message data


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
