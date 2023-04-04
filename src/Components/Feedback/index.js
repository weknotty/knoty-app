import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setNewFeeback } from "../../firebase";
import { setToast } from "../../Utils";
import "./Feedback.css";
const Feedback = () => {
  window.history.pushState({ appState: "0" }, "pushManageStore", "");
  const userID = useSelector((state) => state.user.userID);

  const [feedback, setFeedback] = useState("");
  const [submit, setSubmit] = useState(false);
  useEffect(() => {
    if (submit) {
      if (feedback.length < 10) {
        setToast({ state: "warning", text: "Please make your feedback a bit longer." });
        setSubmit(false);
        return;
      }
      setNewFeeback(feedback, userID).then(res=>{
        setToast({ state: "success", text: "Thank you for your feedback!" });
        setSubmit(false)
        return
      })
    }

    return () => {};
  }, [submit]);

  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-start justify-content-start align-items-center align-self-end profileContainer position-relative">
      <span className="fs-3">Feedback</span>
      <span className="text-center">You have had 7 logins to Knoty. Please give us your feedback </span>
      <textarea type="text" onInput={(e) => setFeedback(e.target.value)} placeholder="Your message" className="form-control border-0 greyBtn feedbackInput" />
      <div
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mt-5 midFont pointer"
        onClick={() => setSubmit(true)}
      >
        SUBMIT
      </div>
    </div>
  );
};

export default Feedback;
