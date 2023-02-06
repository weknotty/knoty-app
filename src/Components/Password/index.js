import { useState } from "react";
import { handleFieldValidation, validatePassword } from "../../Utils";

const Password = ({ setvalue, value, customValidation, message,placeholder }) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="col-12 d-flex flex-row justify-content-center align-items-center position-relative">
      <input
        type={showPass ? "text" : "password"}
        value={value}
        onChange={(e) => setvalue(e.target.value)}
        className="form-control mt-3 rounded-1 greyBtn pss border-0"
        placeholder={placeholder}
        onBlur={(e) => {
          handleFieldValidation(e.target.value, customValidation, message, setvalue);
          return;
        }}
      />
      <img
        src={showPass ? "/assets/icons/eyeOn.svg" : "/assets/icons/eyeOff.svg"}
        onClick={() => setShowPass((prev) => !prev)}
        className="centerAbs"
        height="18"
        width="18"
      />
    </div>
  );
};
export default Password;
