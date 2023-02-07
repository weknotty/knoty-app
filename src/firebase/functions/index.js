const moment = require("moment");
const axios = require("axios").default;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


exports.helloWorld = functions.pubsub.schedule("* * * * *").onRun((context) => {
  let db = admin.firestore();
  db.collection("users")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let currentUserData = doc.data();
        
      });
    });

  return "alright";
});
