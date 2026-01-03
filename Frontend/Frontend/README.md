# LuxStay - Luxury Room Rental Platform

A production-ready, premium Airbnb-style room rental web app frontend built with React, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Premium Design System** - Muted pastel palette, generous white space, luxury aesthetics
- **Fully Responsive** - Mobile-first design that works beautifully on all devices
- **Smooth Animations** - Framer Motion powered micro-interactions and scroll reveals
- **Dark Mode Support** - Complete dark theme with seamless transitions
- **Accessibility First** - WCAG compliant with keyboard navigation and ARIA labels
- **Optimized Performance** - Code splitting, lazy loading, and Vercel-ready deployment

## 🚀 Pages

- **Landing Page** - Cinematic hero section with floating search bar
- **Listings Page** - Responsive grid with advanced filters
- **Property Details** - Full-width image gallery with sticky booking card
- **Booking Flow** - Step-by-step booking process with progress indicators
- **Login/Signup** - Split-screen layouts with soft glowing inputs
- **User Dashboard** - Manage bookings, saved properties, and settings
- **Host Dashboard** - Property management, analytics, and booking requests

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design Principles

### Layout
- Grid-based system with perfect alignment
- Generous white space and consistent spacing rhythm
- One primary focus per screen
- F-pattern and Z-pattern scanning logic
- Sticky navigation bars
- Edge-to-edge imagery with soft overlays

### Color System
- Muted pastel/monochrome palette (max 3-5 colors)
- High contrast only for primary CTAs
- Soft gradients, no harsh solids
- Off-white backgrounds (never pure white)
- Green accent for nature/resorts theme

### Typography
- Sans-serif font family (Inter)
- Large hero headings with wide letter spacing
- Soft gray text (never pure black)
- Emphasis using weight, not color
- Modular typographic scale

### Interactions
- Smooth micro-interactions with soft easing
- Subtle hover transitions and opacity fades
- Shimmer loading states
- Cinematic scroll reveals
- No spring overshoot, elegant cubic-bezier easing

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── properties/      # PropertyCard, PropertyGrid
│   └── ui/              # Button, Card, Input, Shimmer
├── pages/               # All page components
├── animations/          # Centralized motion configs
├── utils/               # Data and utilities
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🚢 Deployment

This app is optimized for Vercel deployment. Simply:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy automatically

Or use the Vercel CLI:

```bash
vercel
```

## 🎯 Brand Inspiration

Inspired by:
- **Vercel** - Clean, modern aesthetics
- **Apple** - Premium, minimal design
- **CRED** - Soft, elegant UI
- **Aman Resorts** - Luxury, calm atmosphere
- **Stripe** - Confident, trustworthy feel
- **Linear** - Smooth animations
- **Nothing Tech** - Minimal, purposeful design

## 📝 License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ for premium experiences

