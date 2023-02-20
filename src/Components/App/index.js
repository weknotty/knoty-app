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
import { auth, getUserID, setPageView, updateUserStatus } from "../../firebase";
import { setIsUserActive, setUserID } from "../../Redux/Utils";
import { changeViewState, handleAnalyticsPath, pathObject } from "../../Utils";
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
        window.location.href = "/";
        return;
      }
      await updateUserStatus(user.uid, true, false, dispatch);
      if (!userID) {
        setUserID(dispatch, user.uid);
      }
      return;
    });
  }, []);

  useEffect(() => {
    window.addEventListener(
      "popstate",
      function (event) {
        const state = this.history.state.appState;
        changeViewState(state);
        // The popstate event is fired each time when the current history entry changes.
      },
      false
    );

    return () => {
      window.removeEventListener("popstate", function (event) {}, false);
    };
  }, []);

  useEffect(() => {
    if (hasActiveGame) {
      changeViewState(8);
      return;
    }
  }, [hasActiveGame]);

  //
  useEffect(() => {
    document.addEventListener("changeState", (e) => {
      const target = e.detail;
      handleAnalyticsPath(target);
      setAppState(e.detail);
    });

    return () => {
      document.removeEventListener("changeState", (e) => {});
    };
  }, []);

  return (
    <div className="col-12 d-flex flex-column justify-content-between align-items-center  fullHeight">
      <TopBar />
      <View state={appState} />
      <BottomBar />
    </div>
  );
};

export default App;
