const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { cert } = require("firebase-admin/app");

const fb = require("../../../dbKey.json");
admin.initializeApp({ credential: cert(fb) });

let db = admin.firestore();
const auth = admin.auth();

const createNewGame = async ({ gameSignature, duration, imageUrl, cardID, cardName, db, points }) => {
  const payload = {
    duration: duration,
    status: "start",
    signature: gameSignature,
    imageUrl: imageUrl,
    cardID: cardID,
    cardName: cardName,
    points: points,
  };
  await db.collection("games").add(payload);
};
const FindMatchingGame = () => {
  db.collection("matches")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        let currentMatchData = doc.data();
        if (currentMatchData.matchStatus == "approved") {
          const match = await db.collection("users").where("matchSignature", "==", currentMatchData.signature).get();
          if (match.empty) {
            return;
          }
          const batch = db.batch();
          const userA = match.docs[0].data();
          const userB = match.docs[1].data();
          if (userA.hasActiveGame) {
            return;
          }
          for (let cardA of userA.cards) {
            for (let cardB of userB.cards) {
              if (cardA.isLiked && cardB.isLiked) {
                const cardData = await db.collection("cards").where("id", "==", cardB.card).get();
                if (cardData.empty) {
                  return;
                }
                const gameSignature = userA.matchSignature;
                // console.log(gameSignature)
                const card = cardData.docs[0].data();
                console.log(card, "card");

                batch.update(db.collection("users").doc(match.docs[0].id), { hasActiveGame: true, gameSignature: gameSignature });
                batch.update(db.collection("users").doc(match.docs[1].id), { hasActiveGame: true, gameSignature: gameSignature });
                await createNewGame({
                  gameSignature: gameSignature,
                  cardID: card.id,
                  duration: card.duration,
                  imageUrl: card.imageUrl,
                  db: db,
                  cardName: card.name,
                  points: card.points,
                });
                await batch.commit();
                return;
              }
            }
          }
        }
      });
    });
};

const handleGameStatus = () => {
  db.collection("games")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        let currentGameData = doc.data();

        if (currentGameData.status != "start") {
          return;
        }
        const match = await db.collection("users").where("gameSignature", "==", currentGameData.signature).get();
        if (match.empty) {
          return;
        }
        const batch = db.batch();
        const madeIn = doc.createTime.seconds;
        const gameDuration = currentGameData.duration * 60 * 60;
        const madeInWithGametime = parseInt(madeIn) + parseInt(gameDuration);
        if (madeIn >= madeInWithGametime) {
          batch.update(db.collection("users").doc(match.docs[0].id), { hasActiveGame: false, gameSignature: "" });
          batch.update(db.collection("users").doc(match.docs[1].id), { hasActiveGame: false, gameSignature: "" });
        }
      });
    });
};

const getOnlineUsers = () => {
  auth.listUsers().then(async (res) => {
    const batch = db.batch();
    const statuses = await db.collection("statuses").get();
    res.users.forEach((user) => {
      const loggedInLast = new Date(user.metadata.lastSignInTime);
      console.log(user.metadata.lastRefreshTime);
      const seconds = Math.round(loggedInLast.getTime() / 1000);
      const maximumAlive = parseInt(seconds) + 300;

      const now = Math.round(new Date().getTime() / 1000);

      if (now < maximumAlive) {
        console.log("stay online");
        return;
      }
      if (now > maximumAlive) {
        const item = statuses.docs.filter((el) => {
          const data = el.data();
          if (data.userID == user.uid) {
            return el;
          }
        });
        if (item == false) {
          console.log("none");
          return;
        }

        batch.update(db.collection("statuses").doc(item[0].id), { userActive: false });
      }
    });
    await batch.commit();
  });
};
getOnlineUsers();
// FindMatchingGame();
// // handleGameStatus();
// return "alright";
