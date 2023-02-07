
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


  let db = admin.firestore();
  db.collection("matches")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let currentUserData = doc.data();
        console.log(currentUserData)
      });
    });

  return "alright";
