const ButtonLoader = ({ state, text,className }) => {
  if (state) {
    return (
      <div className={`col-12 d-flex justify-content-center align-items-center ${className}`}>
        <div className="spinner-border text-muted" role="status"></div>
      </div>
    );
  }
  return text;
};

export default ButtonLoader