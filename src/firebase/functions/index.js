const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const auth = admin.auth();
const cors = require('cors');

const corsHandler = cors({ origin: true });


exports.handleUsersStatus = functions.pubsub.schedule("every 10 minutes").onRun(async (context) => {
  const tenMinutesAgo = new Date(new Date().getTime() - 1000 * 60 * 10);

  const statusQuerySnapshot = await db.collection("statuses").get()

  statusQuerySnapshot.forEach(async (doc) => {
    const updatedAt = doc.updateTime.seconds;
    if (updatedAt < tenMinutesAgo) {
      await db.collection("statuses").doc(doc.id).update({
        userActive: false,
      });
      console.log("not him",doc.data())
    }
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