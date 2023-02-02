const Button = ({ sizeClass, text, onClick }) => {
  return (
    <div className={`${sizeClass} d-flex flex-row justify-content-evenly align-items-center bg-white text-dark rounded-pill p-2 btnShadow mt-3`}>
      <span className="midFont" style={{ fontWeight: "500" }}>
        {text}
      </span>
    </div>
  );
};
export default Button;
