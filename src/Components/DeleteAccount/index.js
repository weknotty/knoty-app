import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteAccountFromDB } from "../../firebase";
import { setToast } from "../../Utils";
import ButtonLoader from "../ButtonLoader";

const DeleteAccount = () => {
  const [isReady, setisReady] = useState(false);
  const [deleteAccount, setdeleteAccount] = useState(false);
  const hasActiveGame = useSelector((state) => state.user.hasActiveGame);
  useEffect(() => {
    if (isReady) {
      if (hasActiveGame) {
        setToast({ state: "warning", text: "Before closing your account please, end your current game." });
        setisReady(false);
        return;
      }
    }
  }, [isReady]);

  useEffect(() => {
    if (deleteAccount) {
      if (hasActiveGame) {
        setToast({ state: "warning", text: "Before closing your account please, end your current game." });
        setdeleteAccount(false);
        return;
      }
      deleteAccountFromDB();
    }
  }, [deleteAccount]);
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
      {isReady ? (
        <div className="col-12 d-flex flex-column justify-content-center align-items-center  rounded mt-2">
          <span className="mb-2">Are you sure you want to delete your account?</span>
          {deleteAccount ? (
            <ButtonLoader state={true} />
          ) : (
            <div className="col-10 d-flex flex-row justify-content-center align-items-center m-2">
              <div
                className="col me-2 d-flex flex-column justify-content-center align-items-center bg-danger text-white btnShadow rounded rounded-pill smFont pointer p-1"
                onClick={() => setdeleteAccount(true)}
              >
                YES,DELETE
              </div>
              <div
                className="col d-flex flex-column justify-content-center align-items-center bg-white btnShadow rounded rounded-pill smFont pointer p-1"
                onClick={() => setisReady(false)}
              >
                NOT NOW
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="col-12 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 mt-3 text-muted mb-3 midFont pointer"
          onClick={() => setisReady((prev) => !prev)}
        >
          DELETE ACCOUNT
        </div>
      )}
    </div>
  );
};
export default DeleteAccount;
