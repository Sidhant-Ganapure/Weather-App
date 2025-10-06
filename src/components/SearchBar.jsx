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
      list="cities"                     // Links to datalist for suggestions
    />

    {/* Datalist for autocomplete suggestions */}
    <datalist id="cities">
      {/* Common city options for quick search */}
      <option value="New York" />
      <option value="London" />
      <option value="Hyderabad" /> 
      <option value="Tokyo" />
      <option value="Paris" />
      <option value="Bangalore" />
      <option value="Sydney" />
      <option value="Berlin" />
      <option value="Moscow" />
      <option value="Mumbai" />
      <option value="Beijing" />
      <option value="Cairo" />
      <option value="Rio de Janeiro" />
      <option value="Toronto" />
      <option value="Pune" />
      <option value="Dubai" />
      <option value="Singapore" />
      <option value="Los Angeles" />
      <option value="Chicago" />
      <option value="Madrid" />
      <option value="Rome" />
      <option value="Bangkok" />
    </datalist>

    {/* Search button with icon */}
    <button id="search-btn" onClick={handleSearch}>
      <i className="fas fa-search"></i> {/* Font Awesome search icon */}
    </button>
  </div>
);

// Export component so it can be used in other files
export default SearchBar;