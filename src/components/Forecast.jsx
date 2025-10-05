import { weatherConditions } from "../weatherConditions";

const Forecast = ({ forecastData }) => {
  if (!forecastData) return null;

  const tz = forecastData?.city?.timezone ?? 0;

  const pad = (n) => String(n).padStart(2, "0");
  const toLocalDate = (unix) => new Date((unix + tz) * 1000);
  const dateKey = (unix) => {
    const d = toLocalDate(unix);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  };

  const nowUnix = Math.floor(Date.now() / 1000);
  const todayKey = dateKey(nowUnix);

  const groups = {};
  for (const item of forecastData.list || []) {
    const key = dateKey(item.dt);
    if (key === todayKey) continue; 
    (groups[key] ||= []).push(item);
  }

  const pickClosestToNoon = (arr) => {
    let best = null;
    for (const it of arr) {
      const h = toLocalDate(it.dt).getUTCHours();
      const diff = Math.abs(h - 12);
      if (!best || diff < best.diff) best = { it, diff };
    }
    return best?.it || arr[0];
  };

  const daily = Object.keys(groups)
    .sort() 
    .slice(0, 5)
    .map((k) => pickClosestToNoon(groups[k]));

  return (
    <div className="forecast" style={{ display: "block" }}>
      <div className="forecast-title">Next 5-Day Forecast</div>
      <div className="forecast-container">
        {daily.map((f, i) => {
          const d = toLocalDate(f.dt);
          const dayName = d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
          
          const shortDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

          const condition = f.weather[0].main;
          const description = f.weather[0].description;
          const conditionInfo =
            weatherConditions[condition] ||
            weatherConditions[description] || {
              icon: "❓",
              description: "Unknown",
              class: "condition-clear",
            };

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