import Lottie from "lottie-react";
import { Fragment } from "react";
import animation from "../../viki3.json";
const Welcome = () => {
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg fullHeight animated">
      <Lottie animationData={animation} loop={true}>
        <img src="/assets/icons/logo.svg" height="300" width="300" />
      </Lottie>
    </div>
  );
};
export default Welcome;
