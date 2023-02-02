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
};

const App = () => {
  const [appState, setAppState] = useState(0);
  useEffect(() => {
    document.addEventListener("changeState", (e) => {
      setAppState(e.detail);
    });
  }, []);
  return (
    <div className="col-12 d-flex flex-column justify-content-between align-items-center  fullHeight">
      <TopBar />
      {/* <View state={appState}/> */}
      <EditProfile/>
      <ChoosePartner/>
      <ContactingPartner/>
      <Feedback/>
      <UserProfile/>
      <CardsSelect/>
      <UserManual/>
      <SpecificCard/>        
      <KnotyTimer/>
      <BottomBar />
    </div>
  );
};

export default App;
