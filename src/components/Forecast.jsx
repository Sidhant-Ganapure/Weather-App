import { weatherConditions } from "../weatherConditions";

// 🔸 Component: Displays the 5-day weather forecast
const Forecast = ({ forecastData }) => {
  // If forecast data isn't loaded yet, don't render anything
  if (!forecastData) return null;

  // ----- Timezone adjustment -----
  // OpenWeatherMap provides timezone offset (in seconds)
  const tz = forecastData?.city?.timezone ?? 0;

  // Utility functions for date/time formatting
  const pad = (n) => String(n).padStart(2, "0");

  // Convert Unix timestamp (with timezone) → JS Date object
  const toLocalDate = (unix) => new Date((unix + tz) * 1000);

  // Generate a YYYY-MM-DD key for grouping forecast data by day
  const dateKey = (unix) => {
    const d = toLocalDate(unix);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  };

  // Current date key (used to skip "today" from forecast list)
  const nowUnix = Math.floor(Date.now() / 1000);
  const todayKey = dateKey(nowUnix);

  // ----- Group forecast items by day -----
  // Each item in forecastData.list represents a 3-hour interval
  const groups = {};
  for (const item of forecastData.list || []) {
    const key = dateKey(item.dt);
    if (key === todayKey) continue; // Skip today's data (already shown elsewhere)
    (groups[key] ||= []).push(item);
  }

  // ----- Pick data point closest to noon for each day -----
  // This gives a representative "daytime" temperature and condition
  const pickClosestToNoon = (arr) => {
    let best = null;
    for (const it of arr) {
      const h = toLocalDate(it.dt).getUTCHours();
      const diff = Math.abs(h - 12);
      if (!best || diff < best.diff) best = { it, diff };
    }
    return best?.it || arr[0];
  };

  // ----- Select up to 5 upcoming days -----
  const daily = Object.keys(groups)
    .sort() // Sort days in ascending order
    .slice(0, 5) // Limit to 5 days
    .map((k) => pickClosestToNoon(groups[k]));

  // ----- Render forecast cards -----
  return (
    <div className="forecast" style={{ display: "block" }}>
      <div className="forecast-title">Next 5-Day Forecast</div>

      <div className="forecast-container">
        {daily.map((f, i) => {
          // Convert each forecast date to readable formats
          const d = toLocalDate(f.dt);
          const dayName = d.toLocaleDateString("en-US", {
            weekday: "short",
            timeZone: "UTC",
          });
          const shortDate = d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          });

          // Extract weather details
          const condition = f.weather[0].main;
          const description = f.weather[0].description;

          // Match the condition with corresponding icon and style
          const conditionInfo =
            weatherConditions[condition] ||
            weatherConditions[description] || {
              icon: "❓",
              description: "Unknown",
              class: "condition-clear",
            };

          // Render one forecast card for each day
          return (
            <div className="forecast-day" key={i}>
              <div className="forecast-date">
                {dayName}, {shortDate}
              </div>
              <div className="forecast-icon">{conditionInfo.icon}</div>
              <div className="forecast-temp">{Math.round(f.main.temp)}°C</div>
              <div className="forecast-condition">
                {description.charAt(0).toUpperCase() + description.slice(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
