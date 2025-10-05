const SearchBar = ({ city, setCity, handleSearch, handleKeyPress }) => (
  <div className="search-container">
    <input
      type="text"
      id="city-input"
      placeholder="Enter city name..."
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onKeyPress={handleKeyPress}
      list="cities"
    />
    <datalist id="cities">
      <option value="New York" />
      <option value="London" />
      <option value="Hydrabad" />
      <option value="Tokyo" />
      <option value="Paris" />
      <option value="Banglore" />
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
    <button id="search-btn" onClick={handleSearch}>
      <i className="fas fa-search"></i>
    </button>
  </div>
);

export default SearchBar;