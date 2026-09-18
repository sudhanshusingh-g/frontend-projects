// ==========================================
// WEATHER APP CONFIGURATION
// ==========================================
// Replace 'YOUR_API_KEY_HERE' with your Visual Crossing Weather API key
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY ;
const API_BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast";

// ==========================================
// STATE MANAGEMENT
// ==========================================
const state = {
  currentLocation: null,
  currentWeather: null,
  forecastData: null,
  isCelsius: true,
  lastSearchLocation: null,
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const useLocationBtn = document.getElementById("useLocationBtn");
const tempToggle = document.getElementById("tempToggle");
const tempUnitLabel = document.getElementById("tempUnitLabel");
const weatherContent = document.getElementById("weatherContent");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
const currentWeatherSection = document.getElementById("currentWeather");
const forecastGrid = document.getElementById("forecastGrid");
const forecastLoading = document.getElementById("forecastLoading");
const forecastContainer = document.getElementById("forecastContainer");

// ==========================================
// EVENT LISTENERS
// ==========================================
searchBtn.addEventListener("click", handleSearch);
locationInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});
refreshBtn.addEventListener("click", handleRefresh);
useLocationBtn.addEventListener("click", handleUseLocation);
tempToggle.addEventListener("change", handleTemperatureToggle);

// ==========================================
// MAIN FUNCTIONS
// ==========================================

/**
 * Handle search button click
 */
function handleSearch() {
  const location = locationInput.value.trim();
  if (!location) {
    showError("Please enter a location");
    return;
  }
  state.lastSearchLocation = location;
  getWeatherData(location);
}

/**
 * Handle refresh button click
 */
function handleRefresh() {
  if (state.lastSearchLocation) {
    refreshBtn.classList.add("rotate");
    getWeatherData(state.lastSearchLocation);
    setTimeout(() => refreshBtn.classList.remove("rotate"), 1000);
  } else {
    showError("Please search for a location first");
  }
}

/**
 * Handle "Use My Location" button
 */
function handleUseLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser");
    return;
  }

  useLocationBtn.disabled = true;
  useLocationBtn.textContent = "Getting location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherData(`${latitude},${longitude}`);
      useLocationBtn.disabled = false;
      useLocationBtn.textContent = "Use My Location";
    },
    (error) => {
      useLocationBtn.disabled = false;
      useLocationBtn.textContent = "Use My Location";
      showError(`Location error: ${error.message}`);
    },
  );
}

/**
 * Handle temperature unit toggle
 */
function handleTemperatureToggle() {
  state.isCelsius = tempToggle.checked;
  tempUnitLabel.textContent = state.isCelsius
    ? "Celsius (°C)"
    : "Fahrenheit (°F)";

  // Refresh display with new temperature unit
  if (state.currentWeather) {
    updateWeatherDisplay(state.currentWeather);
  }
  if (state.forecastData) {
    updateForecastDisplay(state.forecastData);
  }
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Fetch weather data from Visual Crossing API
 */
async function getWeatherData(location) {
  showLoading(true);
  clearError();

  try {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      throw new Error(
        "API key not configured. Please add your Visual Crossing API key to the script.",
      );
    }

    // Build API URL
    const url = new URL(API_BASE_URL);
    url.searchParams.append("locations", location);
    url.searchParams.append("key", API_KEY);
    url.searchParams.append("contentType", "json");
    url.searchParams.append("include", "hours");

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if we got valid data
    if (!data.locations || Object.keys(data.locations).length === 0) {
      throw new Error("Location not found. Please try another search.");
    }

    const locationKey = Object.keys(data.locations)[0];
    const locationData = data.locations[locationKey];

    state.currentLocation = locationData;
    state.lastSearchLocation = location;

    // Update location input
    locationInput.value = locationData.address || location;

    // Process and display data
    processWeatherData(locationData);
    updateWeatherDisplay(locationData);
    updateForecastDisplay(locationData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showError(
      error.message || "Failed to fetch weather data. Please try again.",
    );
  } finally {
    showLoading(false);
  }
}

/**
 * Process weather data
 */
function processWeatherData(locationData) {
  state.currentWeather = locationData;
}

// ==========================================
// DISPLAY FUNCTIONS
// ==========================================

/**
 * Update current weather display
 */
function updateWeatherDisplay(locationData) {
  try {
    const currentConditions = locationData.currentConditions;

    // Location name
    document.getElementById("locationName").textContent =
      locationData.address ||
      locationData.resolvedAddress ||
      "Unknown Location";

    // Temperature
    const temp = state.isCelsius
      ? currentConditions.temp
      : (currentConditions.temp * 9) / 5 + 32;
    document.getElementById("tempValue").textContent = Math.round(temp);

    const unitDisplay = state.isCelsius ? "°C" : "°F";
    document.querySelector(".temp-unit").textContent = unitDisplay;

    // Weather condition
    document.getElementById("weatherCondition").textContent =
      currentConditions.conditions ||
      currentConditions.description ||
      "Unknown";

    // Wind speed
    const windSpeed = currentConditions.windspeed || 0;
    const windUnit = state.isCelsius ? "km/h" : "mph";
    document.getElementById("windSpeed").textContent =
      `${Math.round(windSpeed)} ${windUnit}`;

    // Rain probability
    document.getElementById("rainProbability").textContent =
      `${Math.round(currentConditions.precipprob || 0)}%`;

    // Humidity
    document.getElementById("humidity").textContent =
      `${Math.round(currentConditions.humidity || 0)}%`;

    // Feels like
    const feelsLike = state.isCelsius
      ? currentConditions.feelslike || currentConditions.temp
      : ((currentConditions.feelslike || currentConditions.temp) * 9) / 5 + 32;
    document.getElementById("feelsLike").textContent =
      `${Math.round(feelsLike)} ${unitDisplay}`;

    // Show content, hide loading
    weatherContent.style.display = "block";
    loadingSpinner.style.display = "none";
  } catch (error) {
    console.error("Error updating weather display:", error);
    showError("Error displaying weather data");
  }
}

/**
 * Update 24-hour forecast display
 */
function updateForecastDisplay(locationData) {
  try {
    const days = locationData.days || [];
    let forecastHours = [];

    // Collect all hourly data from all days
    days.forEach((day) => {
      if (day.hours && Array.isArray(day.hours)) {
        day.hours.forEach((hour) => {
          forecastHours.push({
            ...hour,
            datetime: day.datetime,
            datetimeEpoch: day.datetimeEpoch,
          });
        });
      }
    });

    // If we have hourly data, use it; otherwise create hourly entries from daily data
    if (forecastHours.length === 0) {
      forecastHours = days.slice(0, 2).flatMap((day, dayIndex) => {
        const times = [6, 12, 18, 0];
        return times.map((hour) => ({
          datetime: day.datetime,
          temp: day.temp,
          tempmin: day.tempmin,
          tempmax: day.tempmax,
          conditions: day.conditions,
          description: day.description,
          windspeed: day.windspeed,
          precipprob: day.precipprob,
          hour: hour,
        }));
      });
    }

    // Get 24 forecast items (or all available if less than 24)
    const next24Hours = forecastHours.slice(0, 24);

    forecastGrid.innerHTML = "";

    next24Hours.forEach((hour) => {
      const forecastItem = createForecastItem(hour);
      forecastGrid.appendChild(forecastItem);
    });

    // Show forecast, hide loading
    forecastGrid.style.display = "grid";
    forecastLoading.style.display = "none";
  } catch (error) {
    console.error("Error updating forecast display:", error);
    forecastLoading.innerHTML =
      '<p style="color: #c33;">Error loading forecast</p>';
  }
}

/**
 * Create a forecast item element
 */
function createForecastItem(hour) {
  const item = document.createElement("div");
  item.className = "forecast-item";

  // Format time
  let timeText = "N/A";
  if (hour.datetime && hour.hour !== undefined) {
    timeText = `${String(hour.hour).padStart(2, "0")}:00`;
  } else if (hour.datetime) {
    // Parse datetime string (YYYY-MM-DD format or YYYY-MM-DDTHH:mm:ss)
    const timeStr = hour.datetime;
    timeText = timeStr.includes("T")
      ? timeStr.split("T")[1].substring(0, 5)
      : "N/A";
  }

  // Temperature
  const temp = state.isCelsius
    ? hour.temp || 0
    : ((hour.temp || 0) * 9) / 5 + 32;
  const unitDisplay = state.isCelsius ? "°C" : "°F";

  // Condition
  const condition = hour.conditions || hour.description || "Unknown";

  // Wind speed
  const windSpeed = Math.round(hour.windspeed || 0);
  const windUnit = state.isCelsius ? "km/h" : "mph";

  // Rain probability
  const rainProb = Math.round(hour.precipprob || 0);

  item.innerHTML = `
        <div class="forecast-time">${timeText}</div>
        <div class="forecast-temp">${Math.round(temp)}${unitDisplay}</div>
        <div class="forecast-condition">${condition}</div>
        <div class="forecast-rain">🌧️ ${rainProb}%</div>
        <div class="forecast-wind">💨 ${windSpeed} ${windUnit}</div>
    `;

  return item;
}

// ==========================================
// UI HELPER FUNCTIONS
// ==========================================

/**
 * Show loading spinner
 */
function showLoading(isLoading) {
  if (isLoading) {
    loadingSpinner.style.display = "flex";
    weatherContent.style.display = "none";
    forecastLoading.style.display = "flex";
    forecastGrid.style.display = "none";
  } else {
    loadingSpinner.style.display = "none";
  }
}

/**
 * Show error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  weatherContent.style.display = "none";
  loadingSpinner.style.display = "none";
}

/**
 * Clear error message
 */
function clearError() {
  errorMessage.textContent = "";
  errorMessage.style.display = "none";
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize the app
 */
function initializeApp() {
  // Check if API key is configured
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    showError(
      "⚠️ Please configure your Visual Crossing Weather API key in script.js (line 5)",
    );
    loadingSpinner.style.display = "none";
    return;
  }

  // Try to get user's location on app load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherData(`${latitude},${longitude}`);
      },
      () => {
        // If geolocation fails, show default message
        clearError();
        loadingSpinner.style.display = "none";
        weatherContent.style.display = "block";
        document.getElementById("locationName").textContent =
          "Enter a location to get started";
      },
    );
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
