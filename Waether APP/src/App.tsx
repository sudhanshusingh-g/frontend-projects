import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WeatherProvider,
  useWeather,
  WeatherData,
} from "./context/WeatherContext";
import { WeatherCard } from "./components/WeatherCard";
import { ForecastItem } from "./components/ForecastItem";

// Configuration
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

const AppContent: React.FC = () => {
  const {
    currentLocation,
    isCelsius,
    isLoading,
    error,
    setCurrentLocation,
    setIsCelsius,
    setIsLoading,
    setError,
  } = useWeather();

  const [locationInput, setLocationInput] = useState("");
  const [lastSearchLocation, setLastSearchLocation] = useState("");
  const [forecastHours, setForecastHours] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize app and try to get user's location
  useEffect(() => {
    if (!API_KEY) {
      setError(
        "⚠️ API key not found. Please add VITE_WEATHER_API_KEY to your .env file",
      );
      return;
    }

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(`${latitude},${longitude}`);
        },
        () => {
          setError(null);
        },
      );
    }
  }, []);

  const fetchWeatherData = async (location: string) => {
    if (!location.trim()) {
      setError("Please enter a location");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!API_KEY) {
        throw new Error(
          "API key not configured. Add VITE_WEATHER_API_KEY to your .env file",
        );
      }

      const unitGroup = isCelsius ? "metric" : "us";
      const url = new URL(`${API_BASE_URL}/${location}`);
      url.searchParams.append("unitGroup", unitGroup);
      url.searchParams.append("key", API_KEY);
      url.searchParams.append("contentType", "json");
      url.searchParams.append("include", "hours");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.days) {
        throw new Error("Location not found. Please try another search.");
      }

      // Transform API response to match WeatherData interface
      const current = data.currentConditions || {};
      const firstDay = data.days?.[0] || {};

      const transformedData: WeatherData = {
        address: data.address || data.resolvedAddress,
        resolvedAddress: data.resolvedAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        temp: current.temp ?? firstDay.temp,
        feelslike: current.feelslike ?? firstDay.feelslike,
        humidity: current.humidity ?? firstDay.humidity,
        windspeed: current.windspeed ?? firstDay.windspeed,
        precipprob: current.precipprob ?? firstDay.precipprob,
        conditions: current.conditions || firstDay.conditions,
        description: current.description || firstDay.description,
        // Use currentConditions from API response
        currentConditions: {
          temp: current.temp ?? firstDay.temp ?? 0,
          feelslike: current.feelslike ?? firstDay.feelslike ?? 0,
          humidity: current.humidity ?? firstDay.humidity ?? 0,
          windspeed: current.windspeed ?? firstDay.windspeed ?? 0,
          precipprob: current.precipprob ?? firstDay.precipprob ?? 0,
          conditions: current.conditions || firstDay.conditions || "Unknown",
          description: current.description || firstDay.description || "Unknown",
        },
        days: data.days || [],
      };

      setCurrentLocation(transformedData);
      setLocationInput(transformedData.address || location);
      setLastSearchLocation(location);
      setError(null);

      // Process forecast data - get hours from first day
      const days = transformedData.days || [];
      let hours: any[] = [];

      if (days.length > 0 && days[0].hours && Array.isArray(days[0].hours)) {
        hours = days[0].hours.map((hour, idx) => {
          // Extract hour from datetime if available (format: "HH:MM:SS")
          let timeStr = hour.datetime || "";
          let hourNum = idx;
          if (timeStr.includes(":")) {
            hourNum = parseInt(timeStr.split(":")[0]) || idx;
          }

          return {
            ...hour,
            hour: hourNum,
            temp: hour.temp ?? 0,
            windspeed: hour.windspeed ?? 0,
            precipprob: hour.precipprob ?? 0,
            conditions: hour.conditions || "Unknown",
            description: hour.description || "Unknown",
          };
        });
      }

      // If no hours available, create fallback data
      if (hours.length === 0 && days.length > 0) {
        hours = [
          {
            datetime: days[0].datetime,
            hour: 0,
            temp: days[0].temp ?? 0,
            windspeed: days[0].windspeed ?? 0,
            precipprob: days[0].precipprob ?? 0,
            conditions: days[0].conditions || "Unknown",
            description: days[0].description || "Unknown",
          },
        ];
      }

      setForecastHours(hours.slice(0, 24));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      console.error("Error fetching weather:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (locationInput.trim()) {
      fetchWeatherData(locationInput);
    }
  };

  const handleRefresh = () => {
    if (lastSearchLocation) {
      setIsRefreshing(true);
      fetchWeatherData(lastSearchLocation).then(() => {
        setTimeout(() => setIsRefreshing(false), 1000);
      });
    } else {
      setError("Please search for a location first");
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(`${latitude},${longitude}`);
      },
      (error) => {
        setIsLoading(false);
        setError(`Location error: ${error.message}`);
      },
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="weather-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Weather App
        </motion.h1>
        <div className="search-section">
          <input
            type="text"
            className="location-input"
            placeholder="Enter location..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            autoComplete="off"
          />
          <motion.button
            className="search-btn"
            onClick={handleSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
          <motion.button
            className="refresh-btn"
            onClick={handleRefresh}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1 }}
            title="Refresh weather"
          >
            🔄
          </motion.button>
        </div>
      </motion.header>

      {/* Current Weather */}
      <motion.section
        className="current-weather"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="weather-card">
          <WeatherCard />
        </div>
      </motion.section>

      {/* Forecast Section */}
      <motion.section
        className="forecast-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2>24-Hour Forecast</h2>
        <div className="forecast-container">
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                className="loading"
                key="forecast-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="spinner"></div>
              </motion.div>
            ) : (
              <motion.div
                className="forecast-grid"
                key="forecast-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {forecastHours.length > 0 ? (
                  forecastHours.map((hour, index) => (
                    <ForecastItem
                      key={`${hour.datetime}-${index}`}
                      hour={hour}
                      index={index}
                      isCelsius={isCelsius}
                    />
                  ))
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ gridColumn: "1 / -1", textAlign: "center" }}
                  >
                    No forecast data available
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Settings */}
      <motion.section
        className="settings-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="celsius-toggle">
          <input
            type="checkbox"
            checked={isCelsius}
            onChange={(e) => setIsCelsius(e.target.checked)}
          />
          <span>{isCelsius ? "Celsius (°C)" : "Fahrenheit (°F)"}</span>
        </label>
        <motion.button
          className="location-btn"
          onClick={handleUseLocation}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Use My Location
        </motion.button>
      </motion.section>
    </motion.div>
  );
};

function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}

export default App;
