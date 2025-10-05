const Loading = ({ loading }) =>
  loading ? (
    <div className="loading">
      <div className="spinner"></div>
      <p>Fetching weather data...</p>
    </div>
  ) : null;

export default Loading;