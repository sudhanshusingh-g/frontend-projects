import React from "react";
import { motion } from "framer-motion";

interface ForecastItemData {
  datetime: string;
  temp: number;
  windspeed: number;
  precipprob: number;
  conditions?: string;
  description?: string;
  hour?: number;
}

interface ForecastItemProps {
  hour: ForecastItemData;
  index: number;
  isCelsius: boolean;
}

export const ForecastItem: React.FC<ForecastItemProps> = ({
  hour,
  index,
  isCelsius,
}) => {
  const temp = isCelsius ? hour.temp : (hour.temp * 9) / 5 + 32;
  const unitDisplay = isCelsius ? "°C" : "°F";
  const windUnit = isCelsius ? "km/h" : "mph";

  let timeText = "N/A";
  if (hour.datetime && hour.hour !== undefined) {
    timeText = `${String(hour.hour).padStart(2, "0")}:00`;
  } else if (hour.datetime) {
    const timeStr = hour.datetime;
    timeText = timeStr.includes("T")
      ? timeStr.split("T")[1].substring(0, 5)
      : "N/A";
  }

  const condition = hour.conditions || hour.description || "Unknown";
  const windSpeed = Math.round(hour.windspeed || 0);
  const rainProb = Math.round(hour.precipprob || 0);

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.05,
      },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="forecast-item"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.div className="forecast-time">{timeText}</motion.div>
      <motion.div
        className="forecast-temp"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 + index * 0.05 }}
      >
        {Math.round(temp)}
        {unitDisplay}
      </motion.div>
      <div className="forecast-condition">{condition}</div>
      <motion.div
        className="forecast-rain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.05 }}
      >
        🌧️ {rainProb}%
      </motion.div>
      <motion.div
        className="forecast-wind"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 + index * 0.05 }}
      >
        💨 {windSpeed} {windUnit}
      </motion.div>
    </motion.div>
  );
};
