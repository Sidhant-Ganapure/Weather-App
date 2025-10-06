import { weatherConditions } from "../weatherConditions";
import { getName as getCountryNameLib } from "country-list"; 

// 🔹 Utility function to resolve full country names from ISO codes (e.g., "IN" → "India")
function resolveCountryName(code) {
  if (!code) return "";
  const cc = String(code).toUpperCase();

  try {
    // ✅ First try: use modern browser API (Intl.DisplayNames)
    if (typeof Intl !== "undefined" && Intl.DisplayNames) {
      const dn = new Intl.DisplayNames(["en"], { type: "region" });
      const v = dn.of(cc);
      if (v) return v;
    }
  } catch {
    // Ignore errors if Intl.DisplayNames not supported
  }

  let raw = "";
  try {
    // ✅ Fallback: use the "country-list" library
    raw = getCountryNameLib?.(cc) || "";
  } catch {
    // Ignore any errors during lookup
  }

  // 🧹 Clean and format the result
  return (raw || cc)
    .replace(/\s*KATEX_INLINE_OPENtheKATEX_INLINE_CLOSE\s*/gi, "") // remove formatting artifacts
    .replace(/^(the)\s+/i, "") // remove leading "the"
    .trim();
}

// 🔸 Component: Displays the current weather section
const CurrentWeather = ({ weatherData }) => {
  // If no data yet, don't render anything
  if (!weatherData) return null;

  // Destructure required properties from weather API response
  const { main, weather, sys, name, wind } = weatherData;
  const condition = weather[0].main;          // e.g., "Clouds"
  const description = weather[0].description; // e.g., "overcast clouds"

  // Determine icon and style based on weather condition
  const conditionInfo =
    weatherConditions[condition] ||
    weatherConditions[description] || {
      icon: "❓",
      description: "Unknown",
      class: "condition-clear",
    };

  // Format today's date (e.g., "Monday, October 6, 2025")
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get full country name from country code
  const countryFull = resolveCountryName(sys?.country);

  // 🔹 Render current weather details
  return (
    <div className="weather-display" style={{ display: "block" }}>
      {/* City and Country */}
      <div className="location">
        {name}, {countryFull}
      </div>

      {/* Current Date */}
      <div className="date">{today}</div>

      {/* Weather Icon */}
      <div className="weather-icon" style={{ fontSize: "5rem" }}>
        {conditionInfo.icon}
      </div>

      {/* Temperature */}
      <div className="temperature">{Math.round(main.temp)}°C</div>

      {/* Weather Description (first letter capitalized) */}
      <div className="weather-condition">
        {description.charAt(0).toUpperCase() + description.slice(1)}
      </div>

      {/* Additional Details */}
      <div className="details">
        {/* Humidity */}
        <div className="detail-item">
          <div className="detail-label">Humidity</div>
          <div className="detail-value">{main.humidity}%</div>
        </div>

        {/* Wind Speed */}
        <div className="detail-item">
          <div className="detail-label">Wind</div>
          <div className="detail-value">{Math.round(wind.speed)} km/h</div>
        </div>

        {/* Feels Like Temperature */}
        <div className="detail-item">
          <div className="detail-label">Feels Like</div>
          <div className="detail-value">{Math.round(main.feels_like)}°C</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
