const ErrorMessage = ({ error }) =>
  error ? (
    <div className="error">
      <p>{error}</p>
    </div>
  ) : null;

export default ErrorMessage;