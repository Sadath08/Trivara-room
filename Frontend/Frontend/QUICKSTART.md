# Quick Start Guide

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Key Features

### Pages Available

- `/` - Landing page with hero section and featured properties
- `/listings` - Browse all properties with filters
- `/property/:id` - Property details with image gallery
- `/property/:id/booking` - Booking flow with step-by-step process
- `/login` - User login page
- `/signup` - User signup page
- `/dashboard` - User dashboard (bookings, saved properties, settings)
- `/host` - Host dashboard (property management, analytics)

### Design Tokens

The app uses a carefully curated color palette:
- **Primary**: Soft green (#349f6a) for CTAs and accents
- **Neutral**: Gray scale for text and backgrounds
- **Accent**: Soft red (#f5574d) for warnings/important items

### Customization

To customize colors, edit `tailwind.config.js`:
```js
colors: {
  primary: { /* your colors */ },
  neutral: { /* your colors */ },
  accent: { /* your colors */ }
}
```

To customize animations, edit `src/animations/motion.js`:
- All animations use soft cubic-bezier easing
- Duration: 0.3s - 0.6s
- No spring overshoot for luxury feel

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/       # Navbar, Footer
│   ├── properties/   # PropertyCard, PropertyGrid
│   └── ui/           # Button, Card, Input, Shimmer
├── pages/            # Page components
├── animations/       # Framer Motion configs
├── utils/            # Data and utilities
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Best Practices

1. **No inline styles** - All styles use Tailwind classes
2. **Reusable components** - DRY principle throughout
3. **Accessibility** - ARIA labels and keyboard navigation
4. **Performance** - Lazy loading and code splitting
5. **Dark mode** - Fully supported with seamless transitions

## Deployment

Deploy to Vercel in one click:
1. Push to GitHub
2. Import in Vercel
3. Deploy automatically

Or use CLI:
```bash
vercel
```

The `vercel.json` is already configured for optimal deployment.

## Troubleshooting

**Images not loading?**
- Check image URLs in `src/utils/data.js`
- Images use Unsplash placeholder URLs

**Animations not working?**
- Ensure Framer Motion is installed
- Check browser console for errors

**Dark mode not working?**
- Check localStorage for 'darkMode' setting
- Verify dark mode classes in Tailwind config

## Next Steps

1. Replace mock data with real API calls
2. Add authentication flow
3. Implement search functionality
4. Add payment integration
5. Set up proper image hosting
6. Add unit tests
7. Set up CI/CD pipeline

---

Happy coding! 🚀

