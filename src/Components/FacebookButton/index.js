import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleNewEntry, loginWithFacebook, loginWithGoogle } from "../../firebase";

const FacebookButton = ({ text }) => {
  const [facebookLogin, setFacebookLogin] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (facebookLogin) {
      const fireAsync = async () => {
        const isLogged = await loginWithFacebook();
        if (isLogged) {
          const fireAsync = async () => {
            await handleNewEntry(isLogged.user.uid, dispatch);
            window.location.href = "/app";
          };
          fireAsync();
        }
      };
      fireAsync();
      setFacebookLogin(false);
    }
  }, [facebookLogin]);
  return (
    <div
      className="col-10 d-flex flex-row justify-content-evenly align-items-center greyBtn text-dark rounded-pill p-2 btnShadow mt-3 pointer"
      onClick={() => setFacebookLogin(true)}
    >
      <span className="col-8 text-start w-4">{text}</span>
      <img src="/assets/icons/facebook.svg" height="30" width="30" />
    </div>
  );
};
export default FacebookButton;
