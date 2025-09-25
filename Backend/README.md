# AutoGo Backend

The backend API server for AutoGo - a modern ride-booking platform built with Node.js and Express.

## 🚀 Features

- **RESTful API**: Well-structured REST endpoints for user and ride management
- **Real-time Communication**: Socket.IO integration for live ride updates
- **Authentication**: JWT-based secure authentication system
- **Database Integration**: MongoDB with Mongoose ODM
- **File Upload**: Support for image uploads with Multer
- **Security**: Password hashing, input validation, and CORS protection

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🏃‍♂️ Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Start with auto-reload (development)**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 📁 Project Structure

```
├── controllers/     # Route controllers
├── models/         # MongoDB models
├── routes/         # API routes
├── middlewares/    # Custom middlewares
├── services/       # Business logic services
├── db/            # Database configuration
├── app.js         # Express app configuration
├── server.js      # Server entry point
└── socket.js      # Socket.IO configuration
```

## 🔧 API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile
- `GET /users/logout` - User logout

### Captain Management
- `POST /captains/register` - Captain registration
- `POST /captains/login` - Captain login
- `GET /captains/profile` - Get captain profile

### Ride Management
- `GET /rides/get-fare` - Calculate ride fare
- `POST /rides/create` - Create new ride
- `POST /rides/confirm` - Confirm ride
- `POST /rides/start` - Start ride
- `POST /rides/end` - End ride

### Maps Integration
- `GET /maps/get-suggestions` - Get location suggestions
- `GET /maps/get-coordinates` - Get coordinates for location
- `GET /maps/get-distance-time` - Get distance and time between locations

## 🔧 Configuration

- **MongoDB**: Set up connection string in MONGODB_URI
- **JWT Secret**: Use a strong secret key for JWT token signing
- **Google Maps API**: Required for location services and directions
- **Port**: Default port is 3000, configurable via PORT environment variable

## 🚀 Deployment

The backend is designed to work with platforms like Railway, Render, or Heroku for easy deployment.
