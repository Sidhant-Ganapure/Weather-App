import { weatherConditions } from "../weatherConditions";
import { getName as getCountryNameLib } from "country-list"; 

function resolveCountryName(code) {
  if (!code) return "";
  const cc = String(code).toUpperCase();

  try {
    if (typeof Intl !== "undefined" && Intl.DisplayNames) {
      const dn = new Intl.DisplayNames(["en"], { type: "region" });
      const v = dn.of(cc);
      if (v) return v;
    }
  } catch {
    // ignore
  }

  let raw = "";
  try {
    raw = getCountryNameLib?.(cc) || "";
  } catch {
    // ignore
  }

  return (raw || cc)
    .replace(/\s*KATEX_INLINE_OPENtheKATEX_INLINE_CLOSE\s*/gi, "") 
    .replace(/^(the)\s+/i, "")      
    .trim();
}

const CurrentWeather = ({ weatherData }) => {
  if (!weatherData) return null;

  const { main, weather, sys, name, wind } = weatherData;
  const condition = weather[0].main;
  const description = weather[0].description;

  const conditionInfo =
    weatherConditions[condition] ||
    weatherConditions[description] || {
      icon: "❓",
      description: "Unknown",
      class: "condition-clear",
    };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const countryFull = resolveCountryName(sys?.country);

  return (
    <div className="weather-display" style={{ display: "block" }}>
      <div className="location">
        {name}, {countryFull}
      </div>
      <div className="date">{today}</div>
      <div className="weather-icon" style={{ fontSize: "5rem" }}>
        {conditionInfo.icon}
      </div>
      <div className="temperature">{Math.round(main.temp)}°C</div>
      <div className="weather-condition">{description.charAt(0).toUpperCase() + description.slice(1)}</div>
      <div className="details">
        <div className="detail-item">
          <div className="detail-label">Humidity</div>
          <div className="detail-value">{main.humidity}%</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Wind</div>
          <div className="detail-value">{Math.round(wind.speed)} km/h</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Feels Like</div>
          <div className="detail-value">{Math.round(main.feels_like)}°C</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;