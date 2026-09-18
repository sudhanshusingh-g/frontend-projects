# Weather App with Framer Motion

A beautiful, responsive weather application built with React, TypeScript, Vite, and Framer Motion animations.

## ✨ Features

### Core Requirements
- 🔍 **Location Search** - Enter any location to get weather data
- 🌡️ **Current Weather Display** - Temperature, wind speed, rain probability, humidity, and "feels like" temperature
- 📊 **24-Hour Forecast** - Hourly weather data with smooth animations
- 🔄 **Refresh Button** - Quickly update weather for current location
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop

### Bonus Features
- 🎬 **Framer Motion Animations** - Smooth, delightful animations for loading, cards, and transitions
- 🌍 **Geolocation Support** - "Use My Location" button for automatic location detection
- 🌡️ **Temperature Toggle** - Switch between Celsius and Fahrenheit
- ⚡ **Beautiful Loading States** - Animated spinners and transitions
- 🎨 **Modern UI** - Gradient backgrounds, blur effects, and smooth hover animations
- 🛡️ **Error Handling** - User-friendly error messages with animations

## 🎬 Animations Included

- **Page Load**: Staggered fade-in animations for all sections
- **Weather Cards**: Spring animations for temperature values
- **Forecast Items**: Cascading entrance animations with index-based delays
- **Hover Effects**: Scale and lift animations on interactive elements
- **Button Interactions**: Tap and hover feedback with scale transforms
- **Refresh Spinner**: Rotating refresh button during data fetch
- **Error Messages**: Zoom and fade animations for error display

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Visual Crossing Weather API key (free tier available)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your Visual Crossing Weather API key:
   - Check the `.env` file in your project root
   - Ensure `VITE_WEATHER_API_KEY=your_api_key_here` is present
   - If the `.env` file doesn't exist, create it and add the line above
   - Get a free API key: https://www.visualcrossing.com/weather-api
   - Replace `your_api_key_here` with your actual API key
   - **Note:** Do NOT commit the `.env` file to git if using version control

### Development

Run the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is in use).

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📋 Project Structure

```
src/
├── App.tsx                 # Main app component with state management
├── main.tsx               # React entry point
├── index.css              # Global styles
├── context/
│   └── WeatherContext.tsx # Weather state management
└── components/
    ├── WeatherCard.tsx    # Current weather display with animations
    └── ForecastItem.tsx   # Individual forecast item component
```

## 🔧 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **CSS 3** - Styling with gradients and transitions
- **Visual Crossing Weather API** - Weather data

## 🎨 Customization

### Colors
Edit `src/index.css` to change:
- Primary color: `#667eea`
- Secondary color: `#764ba2`
- Background gradient

### Animation Timing
Modify animation properties in:
- `src/components/WeatherCard.tsx` - Weather card animations
- `src/components/ForecastItem.tsx` - Forecast item animations
- `src/App.tsx` - Container and header animations

### API Configuration

Your API key is read from the `.env` file:
- `VITE_WEATHER_API_KEY` - Your Visual Crossing API key
- Add this to your `.env` file: `VITE_WEATHER_API_KEY=your_api_key_here`
- The app automatically loads it at runtime

To use a different API provider, modify:
- `API_BASE_URL` variable in `src/App.tsx` - Change the API endpoint

## 📱 Responsive Breakpoints

- Desktop: 900px max-width container
- Tablet: 600px - 900px
- Mobile: < 600px (single column layout)

## 🐛 Troubleshooting

### "API key not configured" error
- Make sure you've added your Visual Crossing API key to line 11 in `src/App.tsx`
- Check that the key is valid and not expired

### Weather not loading
- Check browser console for API errors
- Verify your API key has correct permissions
- Ensure the location name is valid

### Animations not smooth
- Make sure you're not using an older browser
- Check that GPU acceleration is enabled in your browser settings
- Disable browser extensions that might interfere with animations

## 📦 Dependencies

- `react` - UI library
- `react-dom` - React rendering
- `framer-motion` - Animation engine
- `typescript` - Type system
- `vite` - Build tool
- `eslint` & `@vitejs/plugin-react` - Development tools

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
