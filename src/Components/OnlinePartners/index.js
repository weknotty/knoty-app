import { useEffect, useState } from "react";
import { getUsersStatus } from "../../firebase";
const UserStatus = ({ userID }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (userID) {
      getUsersStatus(userID).then((res) => {
        setIsOnline(res.userActive)
      });
    }
  }, [userID]);

  return <span className={`${isOnline ? "indicatorLg" : "bg-danger"} me-2 rounded-circle`} style={{ height: "30px", width: "30px" }} />;
};

const OnlinePartners = ({ partnersList }) => {
  return (
    <div className="col-12 d-flex flex-column justify-content-start align-items-center greyBtn friendsList">
      {/* added users list */}
      {partnersList.map((el, idx) => {
        return (
          <div
            // onClick={() => handleUserClick(el.partnerID)}
            className="col-11 d-flex flex-row justify-content-center align-items-center mt-2 border-bottom mb-1"
          >
            <span className="col">{el?.profile?.username}</span>
            <div className="col d-flex flex-row justify-content-end align-items-center">
              {/* <UserStatus userID={el.partnerID} key={el.parnterID} /> */}
              <img src={el?.profileImageUrl} className="profileImageSm mb-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default OnlinePartners;
