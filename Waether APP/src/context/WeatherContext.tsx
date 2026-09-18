import React, { createContext, useContext, useState, ReactNode } from "react";

export interface WeatherData {
  address?: string;
  resolvedAddress?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  temp?: number;
  feelslike?: number;
  humidity?: number;
  windspeed?: number;
  precipprob?: number;
  conditions?: string;
  description?: string;
  currentConditions?: {
    temp: number;
    feelslike: number;
    humidity: number;
    windspeed: number;
    precipprob: number;
    conditions?: string;
    description?: string;
  };
  days: Array<{
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    tempmin: number;
    tempmax: number;
    feelslike?: number;
    windspeed: number;
    precipprob: number;
    humidity?: number;
    conditions?: string;
    description?: string;
    icon?: string;
    hours?: Array<{
      datetime: string;
      datetimeEpoch?: number;
      temp: number;
      feelslike?: number;
      windspeed: number;
      precipprob: number;
      humidity?: number;
      conditions?: string;
      description?: string;
      icon?: string;
    }>;
  }>;
}

interface WeatherContextType {
  currentLocation: WeatherData | null;
  isCelsius: boolean;
  isLoading: boolean;
  error: string | null;
  setCurrentLocation: (data: WeatherData | null) => void;
  setIsCelsius: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentLocation, setCurrentLocation] = useState<WeatherData | null>(
    null,
  );
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value: WeatherContextType = {
    currentLocation,
    isCelsius,
    isLoading,
    error,
    setCurrentLocation,
    setIsCelsius,
    setIsLoading,
    setError,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within WeatherProvider");
  }
  return context;
};
