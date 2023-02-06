import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleNewEntry, loginWithGoogle } from "../../firebase";

const GoogleButton = ({ text }) => {
  const [googleSignin, setGoogleSignin] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (googleSignin) {
      const fireAsync = async () => {
        const isLogged = await loginWithGoogle();
        if (isLogged) {
          const fireAsync = async () => {
            await handleNewEntry(isLogged.user.uid, dispatch);
            window.location.href = "/app";
          };
          fireAsync();
        }
      };
      fireAsync();
      setGoogleSignin(false);
    }
  }, [googleSignin]);
  return (
    <div
      className="col-10 d-flex flex-row justify-content-evenly align-items-center greyBtn text-dark rounded-pill p-2 btnShadow mt-3 pointer"
      onClick={() => setGoogleSignin(true)}
    >
      <span className="col-8 text-start w-4">{text}</span>
      <img src="/assets/icons/google.svg" height="30" width="30" />
    </div>
  );
};
export default GoogleButton;
