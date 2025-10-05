import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import.meta.env;

import { weatherConditions } from "./weatherConditions";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("condition-clear");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setCity(savedCity);
      fetchWeatherData(savedCity);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => city.trim() && fetchWeatherData(city);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Clear error when user types a new city
  const handleCityChange = (newCity) => {
    setCity(newCity);
    if (error) setError("");
  };

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError("");

    try {
      const currentResponse = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const currentData = await currentResponse.json();
      if (!currentResponse.ok || currentData.cod === "404") throw new Error("City not found");

      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastJson = await forecastResponse.json();
      if (!forecastResponse.ok || forecastJson.cod === "404") throw new Error("City not found");

      localStorage.setItem("lastCity", cityName);

      setWeatherData(currentData);
      setForecastData(forecastJson);

      const condition = currentData.weather[0].main;
      const conditionInfo =
        weatherConditions[condition] ||
        weatherConditions[Object.keys(weatherConditions)[0]];

      setBackgroundClass(conditionInfo.class);
    } catch {
      setError("City not found. Please try again.");
      setWeatherData(null);
      setForecastData(null);
      setBackgroundClass("condition-clear");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${backgroundClass}`}>
      <Header />
      <SearchBar
        city={city}
        setCity={handleCityChange}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
      />
      <Loading loading={loading} />
      <ErrorMessage error={error} />
      <CurrentWeather weatherData={weatherData} />
      <Forecast forecastData={forecastData} />
    </div>
  );
};

export default WeatherApp;
