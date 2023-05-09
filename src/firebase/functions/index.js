const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const auth = admin.auth();
const cors = require('cors');

const corsHandler = cors({ origin: true });


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

exports.deleteUser = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to delete a user.');
  }

  // Extract the user UID from the data
  const { uid } = data;

  try {
    await admin.auth().deleteUser(uid);
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError('internal', 'Error deleting user');
  }
});