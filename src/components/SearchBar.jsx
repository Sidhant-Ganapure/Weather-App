const SearchBar = ({ city, setCity, handleSearch, handleKeyPress }) => (
  <div className="search-container">
    {/* Input field for entering the city name */}
    <input
      type="text"
      id="city-input"
      placeholder="Enter city name..." // Placeholder text
      value={city}                     // Controlled input: city value from state
      onChange={(e) => setCity(e.target.value)} // Update state when input changes
      onKeyPress={handleKeyPress}       // Trigger search on Enter key
    />

    {/* Search button with icon */}
    <button id="search-btn" onClick={handleSearch}>
      <i className="fas fa-search"></i> {/* Font Awesome search icon */}
    </button>
  </div>
);

// Export component so it can be used in other files
export default SearchBar;