# FileTelus - Premium File Management Platform

A luxurious, fully-animated frontend-only demo website built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

✨ **Premium Dark Luxury Theme**
- Dark background with neon blue accents
- Glassmorphism UI elements
- Smooth 0.5s transitions on all interactions
- Glowing buttons and hover animations

🔐 **Authentication System (localStorage-based)**
- User registration with automatic approval request
- Secure login with status validation
- Session management
- Admin account with special privileges

📊 **Admin Panel**
- User management dashboard
- Approval/rejection of registrations
- Real-time status updates
- Animated status badges

📁 **User Dashboard**
- Welcome message with user details
- Three premium glass cards (Files, Videos, Notes)
- Quick stats section
- Hover lift and neon border effects

🎥 **Video Library**
- Embedded YouTube videos
- Responsive grid layout
- Staggered entrance animations
- Dark blue themed glass cards

🌐 **Portfolio Page**
- Responsive iframe of external portfolio
- Smooth route transition animation

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **localStorage** - Data persistence

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation with dropdown
│   └── ProtectedRoute.jsx  # Route protection logic
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Home.jsx            # Dashboard
│   ├── Videos.jsx          # Video library
│   ├── Portfolio.jsx       # Portfolio page
│   └── Admin.jsx           # Admin panel
├── utils/
│   └── auth.js             # Authentication utilities
├── App.jsx                 # Main app component
├── main.jsx                # Entry point
└── index.css               # Global styles and custom utilities
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build

```bash
npm run build
```

## Pre-configured Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123

## Features Overview

### Authentication Flow
1. Users register with name, email, and password
2. New users have status `pending` and cannot login initially
3. Admin reviews registrations in the Admin Panel
4. Admin can approve or reject users
5. Approved users can login and access the platform

### Protected Routes
- Home, Videos, Portfolio require login
- Admin panel requires admin role
- Non-admin users redirected to home if accessing /admin
- Session stored in localStorage

### Animations
- Fade in on route transitions
- Staggered entrance animations for cards
- Hover lift effects on interactive elements
- Glowing button effects
- Smooth dropdown animations
- Status badge pulse animations

### Design System
- Primary Dark: #0A1F44
- Neon Blue: #00D9FF
- Glass Effect: rgba(255, 255, 255, 0.05) with backdrop blur
- Font: Inter
- All transitions: 0.5s duration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lightweight bundle (~200kb gzipped)
- Responsive design
- Optimized animations
- Lazy loading for images and iframes

## Notes

- This is a frontend-only demo application
- All data is stored in browser's localStorage
- No backend server or database required
- Data persists across browser sessions
- Clear localStorage to reset the application

## License

MIT

## Author

Created as a premium demo website template.
