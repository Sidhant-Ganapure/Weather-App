import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import.meta.env;

import { weatherConditions } from "./weatherConditions";

// Main Weather Application Component
const WeatherApp = () => {
  // ----- State Management -----
  const [city, setCity] = useState(""); // Stores user-entered city name
  const [weatherData, setWeatherData] = useState(null); // Stores current weather data
  const [forecastData, setForecastData] = useState(null); // Stores 5-day forecast data
  const [loading, setLoading] = useState(false); // Loading spinner control
  const [error, setError] = useState(""); // Error message state
  const [backgroundClass, setBackgroundClass] = useState("condition-clear"); // Dynamic background based on weather

  // ----- API Config -----
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  // ----- Load last searched city on mount -----
  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setCity(savedCity);
      fetchWeatherData(savedCity);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Handles search button click -----
  const handleSearch = () => city.trim() && fetchWeatherData(city);

  // ----- Handles Enter key press -----
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ----- Clear error when user types a new city -----
  const handleCityChange = (newCity) => {
    setCity(newCity);
    if (error) setError("");
  };

  // ----- Fetch Weather and Forecast Data -----
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError("");

    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const currentData = await currentResponse.json();
      if (!currentResponse.ok || currentData.cod === "404")
        throw new Error("City not found");

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastJson = await forecastResponse.json();
      if (!forecastResponse.ok || forecastJson.cod === "404")
        throw new Error("City not found");

      // Save last searched city
      localStorage.setItem("lastCity", cityName);

      // Update states with new data
      setWeatherData(currentData);
      setForecastData(forecastJson);

      // ----- Set background dynamically based on weather -----
      const condition = currentData.weather[0].main;
      const conditionInfo =
        weatherConditions[condition] ||
        weatherConditions[Object.keys(weatherConditions)[0]];

      setBackgroundClass(conditionInfo.class);

    } catch {
      // Handle any API or network errors gracefully
      setError("City not found. Please try again.");
      setWeatherData(null);
      setForecastData(null);
      setBackgroundClass("condition-clear");
    } finally {
      setLoading(false);
    }
  };

  // ----- UI Rendering -----
  return (
    <div className={`container ${backgroundClass}`}>
      {/* App Header */}
      <Header />

      {/* Search bar for entering city name */}
      <SearchBar
        city={city}
        setCity={handleCityChange}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
      />

      {/* Loading spinner while fetching data */}
      <Loading loading={loading} />

      {/* Display error message when city not found */}
      <ErrorMessage error={error} />

      {/* Current weather details */}
      <CurrentWeather weatherData={weatherData} />

      {/* 5-day weather forecast */}
      <Forecast forecastData={forecastData} />
    </div>
  );
};

export default WeatherApp;
