import Lottie from "lottie-react";
import { Fragment } from "react";
import animation from "../../viki3.json";
const Welcome = () => {
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg fullHeight animated">
      <Lottie animationData={animation} loop={true} style={{ maxWidth: "200px" }} />
    </div>
  );
};
export default Welcome;
