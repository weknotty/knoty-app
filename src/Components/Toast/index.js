import { useEffect, useState } from "react";
import "./Toast.css";
const handleBorderState = (state) => {
  if (state == "success") {
    return "success";
  }
  if (state == "warning") {
    return "warning";
  }
  if (state == "failed") {
    return "failed";
  }
};
const Toast = () => {
  const [localState, setLocalState] = useState("");
  const [localtext, setLocaltext] = useState("");

  useEffect(() => {
    document.addEventListener("setToast", (e) => {
      e.stopImmediatePropagation();
      setLocalState(e.detail.state);
      setLocaltext(e.detail.text);
      setTimeout(() => {
        setLocalState("");
      }, 5000);
    });

    return () => {
      document.removeEventListener("setToast", (e) => {});
    };
  }, []);

  useEffect(() => {
    if (localState) {
      window.$(document).one("click", function (e) {
        setLocalState("");
      });
    }
  }, [localState]);

  if (!localState) {
    return null;
  }
  return (
    <div className="col-12 d-flex flex-row justify-content-center align-items-center position-absolute top-0" style={{ zIndex: "9999" }}>
      <div
        className={`toastContainer d-flex flex-column justify-content-center align-items-center rounded-2 mt-1 btnShadow slide-bottom border-bottom border-${handleBorderState(
          localState
        )} border-3`}
      >
        <img
          src="/assets/icons/close.svg"
          height="15"
          width="15"
          className=" position-absolute top-0 end-0 m-2"
          style={{ opacity: "0.5" }}
          onClick={() => setLocalState("")}
        />

        <img src="/assets/icons/openCard.svg" height="30" width="30" className="" />
        <span className="text-dark text-center smFont">{localtext}</span>
      </div>
    </div>
  );
};
export default Toast;
