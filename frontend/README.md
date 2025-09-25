# AutoGo Frontend

The frontend application for AutoGo - a modern ride-booking platform built with React and Vite.

## 🚀 Features

- **Modern React Architecture**: Built with React 18 and Vite for optimal performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Communication**: Socket.IO integration for live updates
- **Interactive Maps**: Google Maps integration for location services
- **Theme Support**: Dark and light mode toggle
- **Smooth Animations**: GSAP animations for enhanced UX

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Google Maps React API** - Map integration
- **GSAP** - Animation library
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🏃‍♂️ Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_BASE_URL=http://localhost:3000
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── pages/         # Page components
├── assets/        # Static assets
└── ...
```

## 🔧 Configuration

- **Google Maps API**: Requires API key with Maps JavaScript API, Geocoding API, Directions API, and Places API enabled
- **Backend URL**: Configure VITE_BASE_URL to point to your backend server
