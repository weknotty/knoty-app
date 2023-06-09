import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkCardsMatch,
  checkPendingMatches,
  FindMatch,
  FindMatchPartner,
  getCurrentGame,
  getUnApprovedGames,
  handleCanceledGame,
  handleFinishGame,
  profileRef,
  turnOffActivePartner,
  turnOffPendingMatch,
  turnOnActivePartner,
  updateProfileProp,
} from "../firebase";
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
  setGameID,
  setDoneGame,
  setPoints,
  setMatchID,
  setPartnerName,
} from "../Redux/Utils";
import { changeViewState, setToast } from "../Utils";

const Manager = () => {
  const dispatch = useDispatch();
  const hasPendingMatch = useSelector((state) => state.user.hasPendingMatch);
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);
  const matchSignature = useSelector((state) => state.user.matchSignature);
  const gameSignature = useSelector((state) => state.user.gameSignature);
  const gameID = useSelector((state) => state.user.gameID);
  const profileFull = useSelector((state) => state.user.profileFull);
  const userID = useSelector((state) => state.user.userID);
  const partnerID = useSelector((state) => state.user.partnerID);
  const hasActiveGame = useSelector((state) => state.user.hasActiveGame);
  const interactedCards = useSelector((state) => state.user.interactedCards);
  const [partnerCards, setPartnersCards] = useState([]);
  const [userPoints, setuserPoints] = useState(0);
  const [partnerPoints, setPartnersPoints] = useState(0);
  const [firstLoad, setfirstLoad] = useState(true);
  const matchID = useSelector((state) => state.user.matchID);
  const [gavePoints, setgavePoints] = useState(false);

  // listen to changes on game object on DB
  useEffect(() => {
    if (!hasActiveGame || !gameSignature) {
      return;
    }
    const asyncFire = async () => {
      const partnerRef = await getCurrentGame(gameSignature);
      if (!partnerRef) {
        return;
      }

      unsubscribe = onSnapshot(partnerRef, async (doc) => {
        const game = doc.data();
        const status = game.status;
        const id = doc.id;
        const cardID = game.cardID;
        const points = game.points;
        setGameID(dispatch, id);

        console.log("game", game);

        if (status === "start") {
          setDoneGame(dispatch, false);

          return;
        }
        if (status === "canceled") {
          handleCanceledGame(cardID, interactedCards, partnerCards, userID, partnerID, matchID).then(async (res) => {
            setGameID(dispatch, "");
            setDoneGame(dispatch, false);
            changeViewState(0);
            setHasActiveGame(dispatch, false);

            const all = [
              updateProfileProp(userID, "gameSignature", ""),
              updateProfileProp(partnerID, "gameSignature", ""),
              updateProfileProp(partnerID, "hasActiveGame", false),
              updateProfileProp(userID, "hasActiveGame", false),
            ];
            await Promise.all(all);
          });
          return;
        }
        if (status === "done") {
          handleFinishGame(interactedCards, partnerCards, cardID, userID, partnerID, points, userPoints, partnerPoints, matchID).then((res) => {
            setDoneGame(dispatch, true);
            setGameID(dispatch, "");
          });
          return;
        }
      });
    };
    asyncFire();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [hasActiveGame, gameSignature, matchSignature]);

  // check card matches
  useEffect(() => {
    let timeouter;
    if (hasActiveGame || gameSignature || gameID) {
      return;
    }
    setfirstLoad(false);

    if (hasActivePartner && matchSignature && partnerID && !gameSignature && !firstLoad) {
      checkCardsMatch(interactedCards, partnerCards, matchSignature, userID, partnerID).then((res) => {
        return;
      });
    }

    return () => {
      clearTimeout(timeouter);
    };
  }, [partnerCards]);

  // listen to changes on parnter object on DB
  useEffect(() => {
    let unsubscribe;
    if (hasActivePartner && matchSignature) {
      const asyncFire = async () => {
        const partnerRef = await FindMatchPartner(matchSignature);
        unsubscribe = onSnapshot(partnerRef, async (doc) => {
          const partner = doc.data();
          const idLocal = doc.id;
          setPartnerID(dispatch, idLocal);
          setPartnersPoints(partner.points);
          if (hasActivePartner) {
            setPartnerImage(dispatch, partner.profileImageUrl);
            setPartnerName(dispatch, partner.profile.username);
          }
        });
      };
      asyncFire();
    } else {
      setPartnerImage(dispatch, "");
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [hasActivePartner, matchSignature]);

  // listen to changes on match object on DB
  useEffect(() => {
    if ((!hasPendingMatch && !hasActivePartner) || !matchSignature) {
      setPartnerName(dispatch, "");
      return;
    }
    const unsubscribe = onSnapshot(FindMatch(matchSignature), async (doc) => {
      try {
        const docData = doc.docs[0].data();
        if (docData.matchStatus == "rejected" || docData.matchStatus == "done") {
          await turnOffPendingMatch(userID, docData.partner.id);
          await turnOffActivePartner(userID, docData.partner.id);
          setPartnerImage(dispatch, "");
          setPartnerName(dispatch, "");
        }
        if (docData.matchStatus == "approved") {
          setMatchID(dispatch, doc.docs[0].id);
          const userCards = docData.cards.filter((el) => el.cardOwner == userID);
          const partnerCards = docData.cards.filter((el) => el.cardOwner != userID);
          setPartnersCards(partnerCards);
          setInteractedCards(dispatch, userCards);
          await turnOnActivePartner(userID, docData.partner.id);
        }
      } catch (err) {
        setHasPendingMatch(dispatch, false);
        setMatchSiganture(dispatch, "");
        setPartnerName(dispatch, "");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [hasPendingMatch, hasActivePartner, matchSignature]);

  // listen to changes on user object on DB
  useEffect(() => {
    if (!profileFull) {
      return;
    }
    const unsubscribe = onSnapshot(profileRef(userID), (doc) => {
      const docData = doc.data();
      console.log("docData", docData);
      const hasPendingMatchUpdate = docData.hasPendingMatch;
      const hasActivePartner = docData.hasActivePartner;
      const matchSignature = docData.matchSignature;
      const hasActiveGame = docData.hasActiveGame;
      const gameSignature = docData.gameSignature;
      const acceptedManual = docData?.acceptedManual || false;
      const points = docData.points;
      console.log(doc.id);
      setHasPendingMatch(dispatch, hasPendingMatchUpdate);
      setActivePartner(dispatch, hasActivePartner);
      setMatchSiganture(dispatch, matchSignature);
      setHasActiveGame(dispatch, hasActiveGame);
      setGameSignature(dispatch, gameSignature);
      setAcceptedManual(dispatch, acceptedManual);
      setuserPoints(points);
      setPoints(dispatch, points);

      window.sessionStorage.setItem("myscs", docData.secretCode);
    });
    return () => {
      unsubscribe();
    };
  }, [profileFull]);

  // check pending matches while there is no ongoing connection
  useEffect(() => {
    if (matchSignature && !hasActivePartner) {
      checkPendingMatches(userID, matchSignature).then((res) => {
        if (!res) {
          return;
        }
        setSecretCode(dispatch, res.secretCode);
        setPartnerImage(dispatch, res.profileImageUrl);
        setPendingMatchStatus(dispatch, res.matchStatus);
        setToast({ state: "pending", text: "You have a new match waiting for you!" });
      });
    }
  }, [matchSignature]);

  return null;
};
export default Manager;
