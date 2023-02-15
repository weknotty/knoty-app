import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkPendingMatches, FindMatch, profileRef, turnOffActivePartner, turnOffPendingMatch, turnOnActivePartner } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import {
  setHasPendingMatch,
  setPartnerImage,
  setPendingMatchStatus,
  setSecretCode,
  setActivePartner,
  setMatchSiganture,
  setInteractedCards,
  setHasActiveGame,
  setGameSignature,
  setAcceptedManual,
  setPartnerID,
} from "../Redux/Utils";
import { changeViewState } from "../Utils";

const Manager = () => {
  const dispatch = useDispatch();
  const hasPendingMatch = useSelector((state) => state.user.hasPendingMatch);
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);
  const matchSignature = useSelector((state) => state.user.matchSignature);
  const profileFull = useSelector((state) => state.user.profileFull);
  const userID = useSelector((state) => state.user.userID);
  

  useEffect(() => {
    if ((!hasPendingMatch && !hasActivePartner) || !matchSignature) {
      return;
    }

    const unsubscribe = onSnapshot(FindMatch(matchSignature), async (doc) => {
      try {
        const docData = doc.docs[0].data();
        if (docData.matchStatus == "rejected" || docData.matchStatus == "done") {
          await turnOffPendingMatch(userID, docData.partner.id);
          await turnOffActivePartner(userID, docData.partner.id);
        }
        if (docData.matchStatus == "approved" && !hasActivePartner) {
          await turnOnActivePartner(userID, docData.partner.id);
        }
      } catch (err) {
        console.log(err);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [hasPendingMatch, hasActivePartner, matchSignature]);

  useEffect(() => {
    if (!profileFull) {
      return;
    }
    const unsubscribe = onSnapshot(profileRef(userID), (doc) => {
      const docData = doc.data();
      const hasPendingMatchUpdate = docData.hasPendingMatch;
      const hasActivePartner = docData.hasActivePartner;
      const matchSignature = docData.matchSignature;
      const hasActiveGame = docData.hasActiveGame;
      const gameSignature = docData.gameSignature;
      const acceptedManual = docData?.acceptedManual || false;
      const cards = docData.cards;
      setHasPendingMatch(dispatch, hasPendingMatchUpdate);
      setActivePartner(dispatch, hasActivePartner);
      setMatchSiganture(dispatch, matchSignature);
      setInteractedCards(dispatch, cards);
      setHasActiveGame(dispatch, hasActiveGame);
      setGameSignature(dispatch, gameSignature);
      setAcceptedManual(dispatch, acceptedManual);
    });
    return () => {
      unsubscribe();
    };
  }, [profileFull]);

  useEffect(() => {
    if (matchSignature) {
      checkPendingMatches(userID, matchSignature).then((res) => {
        if (!res) {
          return;
        }
        setSecretCode(dispatch, res.secretCode);
        setPartnerImage(dispatch, res.profileImageUrl);
        setPendingMatchStatus(dispatch, res.matchStatus);
      });
    }
  }, [matchSignature]);

  return null;
};
export default Manager;
