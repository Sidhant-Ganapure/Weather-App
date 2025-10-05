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

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError("");

    try {
      localStorage.setItem("lastCity", cityName);

      const currentResponse = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!currentResponse.ok) throw new Error("City not found");
      const currentData = await currentResponse.json();

      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastJson = await forecastResponse.json();

      setWeatherData(currentData);
      setForecastData(forecastJson);

      const condition = currentData.weather[0].main;
      const conditionInfo =
        weatherConditions[condition] ||
        weatherConditions[Object.keys(weatherConditions)[0]];

      setBackgroundClass(conditionInfo.class);
    } catch {
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${backgroundClass}`}>
      <Header />
      <SearchBar
        city={city}
        setCity={setCity}
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
