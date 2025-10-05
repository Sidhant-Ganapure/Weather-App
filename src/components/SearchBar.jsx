const SearchBar = ({ city, setCity, handleSearch, handleKeyPress }) => (
  <div className="search-container">
    <input
      type="text"
      id="city-input"
      placeholder="Enter city name..."
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onKeyPress={handleKeyPress}
    />
    <button id="search-btn" onClick={handleSearch}>
      <i className="fas fa-search"></i>
    </button>
  </div>
);

export default SearchBar;