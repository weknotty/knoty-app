import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FindMatch } from "../firebase";

const Manager = () => {
  const pendingMatchStatus = useSelector((state) => state.user.pendingMatchStatus);
  const userID = useSelector((state) => state.user.userID);

  useEffect(() => {
    if (pendingMatchStatus) {
      //   console.log("set document listener");
      const fireAsync = async () => {
        const listener = await FindMatch(userID);
        console.log(listener);
      };
      fireAsync();
    }
  }, [pendingMatchStatus]);

  return null;
};
export default Manager;
