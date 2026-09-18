import React from "react";
import { motion } from "framer-motion";
import { useWeather } from "../context/WeatherContext";

export const WeatherCard: React.FC = () => {
  const { currentLocation, isCelsius, isLoading, error } = useWeather();

  if (isLoading) {
    return (
      <div className="weather-card">
        <motion.div
          className="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="spinner"></div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading weather data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card">
        <motion.div
          className="error-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="weather-card">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center" }}
        >
          <p>Enter a location to get started</p>
        </motion.div>
      </div>
    );
  }

  const { currentConditions } = currentLocation;
  const temp = isCelsius
    ? currentConditions.temp
    : (currentConditions.temp * 9) / 5 + 32;
  const feelsLike = isCelsius
    ? currentConditions.feelslike
    : (currentConditions.feelslike * 9) / 5 + 32;
  const unitDisplay = isCelsius ? "°C" : "°F";
  const windUnit = isCelsius ? "km/h" : "mph";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="weather-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="location-name" variants={itemVariants}>
        {currentLocation.address ||
          currentLocation.resolvedAddress ||
          "Unknown Location"}
      </motion.div>

      <motion.div className="current-temp-section" variants={itemVariants}>
        <div className="temperature">
          <motion.span
            className="temp-value"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            {Math.round(temp)}
          </motion.span>
          <span className="temp-unit">{unitDisplay}</span>
        </div>
        <motion.div
          className="weather-condition"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {currentConditions.conditions ||
            currentConditions.description ||
            "Unknown"}
        </motion.div>
      </motion.div>

      <motion.div
        className="weather-details"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="detail-item" variants={itemVariants}>
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">
            {Math.round(currentConditions.windspeed)} {windUnit}
          </span>
        </motion.div>

        <motion.div className="detail-item" variants={itemVariants}>
          <span className="detail-label">Rain Probability</span>
          <span className="detail-value">
            {Math.round(currentConditions.precipprob || 0)}%
          </span>
        </motion.div>

        <motion.div className="detail-item" variants={itemVariants}>
          <span className="detail-label">Humidity</span>
          <span className="detail-value">
            {Math.round(currentConditions.humidity || 0)}%
          </span>
        </motion.div>

        <motion.div className="detail-item" variants={itemVariants}>
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">
            {Math.round(feelsLike)} {unitDisplay}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
