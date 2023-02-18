import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkCardsMatch,
  checkPendingMatches,
  FindMatch,
  FindMatchPartner,
  getCurrentGame,
  handleCanceledGame,
  handleFinishGame,
  profileRef,
  turnOffActivePartner,
  turnOffPendingMatch,
  turnOnActivePartner,
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
} from "../Redux/Utils";
import { changeViewState } from "../Utils";

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

  useEffect(() => {
    let unsubscribe;

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
        console.log("game", game);
        setGameID(dispatch, id);
        if (status === "start") {
          return;
        }
        if (status === "canceled") {
          handleCanceledGame(cardID, interactedCards, partnerCards, userID, partnerID).then((res) => {
            setGameID(dispatch, "");
            setDoneGame(dispatch, false);
            changeViewState(0);
          });
          return;
        }
        if (status === "done") {
          handleFinishGame(interactedCards, partnerCards, cardID, userID, partnerID, points, userPoints, partnerPoints).then((res) => {
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
  }, [hasActiveGame, gameSignature]);
  useEffect(() => {
    let timeouter;
    if (hasActiveGame || gameSignature) {
      return;
    }
    if (hasActivePartner && matchSignature && partnerID && !gameSignature) {
      timeouter = setTimeout(() => {
        checkCardsMatch(interactedCards, partnerCards, matchSignature, userID, partnerID);
      }, 2000);
      return;
    }

    return () => {
      clearTimeout(timeouter);
    };
  }, [partnerCards]);

  useEffect(() => {
    let unsubscribe;
    if (hasActivePartner && matchSignature) {
      const asyncFire = async () => {
        const partnerRef = await FindMatchPartner(matchSignature);
        unsubscribe = onSnapshot(partnerRef, async (doc) => {
          const partner = doc.data();
          // console.log("partner",partner)
          const partnercards = partner.cards;
          setPartnerImage(dispatch, partner.profileImageUrl);
          setPartnerID(dispatch, doc.id);
          setPartnersCards(partnercards);
          setPartnersPoints(partner.points);
        });
      };
      asyncFire();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [hasActivePartner, matchSignature]);

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
        if (docData.matchStatus == "approved") {
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
      const points = docData.points;
      setHasPendingMatch(dispatch, hasPendingMatchUpdate);
      setActivePartner(dispatch, hasActivePartner);
      setMatchSiganture(dispatch, matchSignature);
      setInteractedCards(dispatch, cards);
      setHasActiveGame(dispatch, hasActiveGame);
      setGameSignature(dispatch, gameSignature);
      setAcceptedManual(dispatch, acceptedManual);
      setuserPoints(points);
    });
    return () => {
      unsubscribe();
    };
  }, [profileFull]);

  useEffect(() => {
    if (matchSignature && !hasActivePartner) {
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
