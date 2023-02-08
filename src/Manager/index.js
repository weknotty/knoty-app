import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkPendingMatches, FindMatch, profileRef, turnOffActivePartner, turnOffPendingMatch, turnOnActivePartner } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { setHasPendingMatch, setPartnerImage, setPendingMatchStatus, setSecretCode, setActivePartner, setMatchSiganture } from "../Redux/Utils";

const Manager = () => {
  const dispatch = useDispatch();

  const hasPendingMatch = useSelector((state) => state.user.hasPendingMatch);
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);
  const partnerID = useSelector((state) => state.user.partnerID);
  const matchSignature = useSelector((state) => state.user.matchSignature);

  const profileFull = useSelector((state) => state.user.profileFull);
  const userID = useSelector((state) => state.user.userID);

  useEffect(() => {
    console.log("hasPendingMatch", hasPendingMatch);
    console.log("hasActivePartner", hasActivePartner);

    if ((!hasPendingMatch && !hasActivePartner) || !matchSignature) {
      return;
    }

    // console.log("adding match doc listener");
    const unsubscribe = onSnapshot(FindMatch(matchSignature), async (doc) => {
      try {
        const docData = doc.docs[0].data();
        console.log(docData);
        if (docData.matchStatus == "rejected" || docData.matchStatus == "done") {
          console.log("change state of pending in db to false");
          await turnOffPendingMatch(userID, docData.partner.id);
          await turnOffActivePartner(userID, docData.partner.id);
        }
        if (docData.matchStatus == "approved" && !hasActivePartner) {
          console.log("making both partners active partner");
          await turnOnActivePartner(userID, docData.partner.id);
        }
      } catch (err) {
        console.log(err);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [hasPendingMatch, hasActivePartner,matchSignature]);

  // if profile filled listen to doc
  useEffect(() => {
    if (!profileFull) {
      return;
    }
    // console.log("adding profile doc listener");
    const unsubscribe = onSnapshot(profileRef(userID), (doc) => {
      const docData = doc.data();
      console.log(docData);
      const hasPendingMatchUpdate = docData.hasPendingMatch;
      const hasActivePartner = docData.hasActivePartner;
      const matchSignature = docData.matchSignature;

      console.log("settin pending match to", hasPendingMatchUpdate);
      setHasPendingMatch(dispatch, hasPendingMatchUpdate);
      setActivePartner(dispatch, hasActivePartner);
      setMatchSiganture(dispatch,matchSignature)
    });
    return () => {
      unsubscribe();
    };
  }, [profileFull]);

  useEffect(() => {
    const fireAsync = async () => {
      const res = await checkPendingMatches(userID,matchSignature);
      if (!res) {
        return;
      }
      console.log("res", res);
      setSecretCode(dispatch, res.secretCode);
      setPartnerImage(dispatch, res.profileImageUrl);
      setPendingMatchStatus(dispatch, res.matchStatus);
    };
    if (userID || (userID && hasPendingMatch)) {
      console.log("hasPendingMatch", hasPendingMatch);

      fireAsync();
    }
  }, [userID, hasPendingMatch]);

  return null;
};
export default Manager;
