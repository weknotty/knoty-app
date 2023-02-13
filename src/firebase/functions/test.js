const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { cert } = require("firebase-admin/app");
const fb = require("../../../dbKey.json");
const { v4 } = require("uuid");
admin.initializeApp({ credential: cert(fb) });

let db = admin.firestore();

const createNewGame = async ({ gameSignature, duration, imageUrl, cardID, cardName, db }) => {
  const payload = {
    duration: duration,
    status: "start",
    signature: gameSignature,
    imageUrl: imageUrl,
    cardID: cardID,
    cardName: cardName,
  };
  await db.collection("games").add(payload);
};

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
        for (let cardA of userA.cards) {
          for (let cardB of userB.cards) {
            if (cardA.isLiked && cardB.isLiked) {
              console.log(match.docs[0].id);
              console.log(cardA);
              const cardData = await db.collection("cards").where("id", "==", cardA.card).get();
              if (cardData.empty) {
                return;
              }
              const gameSignature = userA.matchSignature;
              // console.log(gameSignature)
              const card = cardData.docs[0].data();
              batch.update(db.collection("users").doc(match.docs[0].id), { hasActiveGame: true, gameSignature: gameSignature });
              batch.update(db.collection("users").doc(match.docs[1].id), { hasActiveGame: true, gameSignature: gameSignature });
              console.log("match");
              await createNewGame({
                gameSignature: gameSignature,
                cardID: cardA.card,
                duration: card.duration,
                imageUrl: card.imageUrl,
                db: db,
                cardName: card.name,
              });
              await batch.commit();
              return;
            }
          }
        }
        // check if users have mututal cardlike
        // update their status to haveActive game
        // set time stamp of game
        // create new game object
        // write another function to check whether game is one
      }
    });
  });

return "alright";
