const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const auth = admin.auth();

const createNewGame = async ({ gameSignature, duration, imageUrl, cardID, cardName, db, points }) => {
  const now = new Date().getTime() / 1000;
  const payload = {
    duration: duration,
    status: "start",
    signature: gameSignature,
    imageUrl: imageUrl,
    cardID: cardID,
    cardName: cardName,
    points: points,
    startedIn: now,
  };
  await db.collection("games").add(payload);
};

exports.handleUsersStatus = functions.pubsub.schedule("* * * * *").onRun((context) => {
  auth.listUsers().then(async (res) => {
    const batch = db.batch();
    const statuses = await db.collection("statuses").get();
    res.users.forEach((user) => {
      const loggedInLast = new Date(user.metadata.lastSignInTime);
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
          return;
        }

        batch.update(db.collection("statuses").doc(item[0].id), { userActive: false });
      }
    });
    await batch.commit();
  });
});

exports.FindMatchingGame = functions.pubsub.schedule("* * * * *").onRun((context) => {
  let db = admin.firestore();
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
          if (userA.gameSignature) {
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

  return "alright";
});
