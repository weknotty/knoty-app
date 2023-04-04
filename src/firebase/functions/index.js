const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const auth = admin.auth();


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

