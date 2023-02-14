import TopBar from "../TopBar";
import BottomBar from "../BottomBar";
import EditProfile from "../EditProfile";
import ChoosePartner from "../ChoosePartner";
import UserProfile from "../UserProfile";

import ContactingPartner from "../ContactingPartner";
import Feedback from "../Feedback";
import CardsSelect from "../CardsSelect";
import UserManual from "../UserManual";
import SpecificCard from "../SpecificCard";
import { useEffect, useState } from "react";
import KnotyTimer from "../KnotyTimer";
import { useDispatch, useSelector } from "react-redux";
import { auth, getUserID, updateUserStatus } from "../../firebase";
import { setIsUserActive, setUserID } from "../../Redux/Utils";
import { changeViewState } from "../../Utils";
import Favourites from "../Favourites";

const View = ({ state }) => {
  if (state == 0) {
    return <EditProfile />;
  }
  if (state == 1) {
    return <ChoosePartner />;
  }
  if (state == 2) {
    return <ContactingPartner />;
  }
  if (state == 3) {
    return <Feedback />;
  }
  if (state == 4) {
    return <CardsSelect />;
  }
  if (state == 5) {
    return <UserProfile />;
  }
  if (state == 6) {
    return <UserManual />;
  }
  if (state == 7) {
    return <SpecificCard />;
  }
  if (state == 8) {
    return <KnotyTimer />;
  }
  if (state == 9) {
    return <Favourites />;
  }
};

const App = () => {
  const [appState, setAppState] = useState(0);
  const dispatch = useDispatch();
  const userID = useSelector((state) => state.user.userID);
  const hasActiveGame = useSelector((state) => state.user.hasActiveGame);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // setIsUserActive(dispatch, false);
        // await updateUserStatus(user.uid, false);

        window.location.href = "/";
        return;
      }
      await updateUserStatus(user.uid, true);
      // setIsUserActive(dispatch, true);
      if (!userID) {
        setUserID(dispatch, user.uid);
      }
      return;
    });
  }, []);
  useEffect(() => {
    window.$(window).on("unload", function(e) {
      updateUserStatus(userID, false).then(()=>null)
      // Do Something
  });

   
  }, [userID]);
  useEffect(() => {
    if (hasActiveGame) {
      changeViewState(8);
      return;
    }

  }, [hasActiveGame]);

  useEffect(() => {
    document.addEventListener("changeState", (e) => {
      setAppState(e.detail);
    });
  }, []);

  return (
    <div className="col-12 d-flex flex-column justify-content-between align-items-center  fullHeight">
      {/* <div onClick={()=>updateUserStatus(userID, false).then(()=>null)} >CLICK</div> */}
      <TopBar />
      <View state={appState} />
      {/* <EditProfile/>
      <ChoosePartner/>
      <ContactingPartner/>
      <Feedback/>
      <UserProfile/>
      <CardsSelect/>
      <UserManual/>
             
      <KnotyTimer/> */}
      <BottomBar />
    </div>
  );
};

export default App;
