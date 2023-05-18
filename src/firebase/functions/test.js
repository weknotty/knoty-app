const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { cert } = require("firebase-admin/app");

const fb = require("../../../dbKey.json");
admin.initializeApp({ credential: cert(fb) });

let db = admin.firestore();
const auth = admin.auth();

const fire = async () => {
  const tenMinutesAgo = new Date(new Date().getTime() - 1000 * 60 * 10);

  const statusQuerySnapshot = await db.collection("statuses").get();

  statusQuerySnapshot.forEach(async (doc) => {
    const updatedAt = doc.updateTime.seconds;
    if (updatedAt < tenMinutesAgo) {
      await db.collection("statuses").doc(doc.id).update({
        userActive: false,
      });
      console.log("not him",doc.data())
    }
  });
};
fire()
// async function deleteAllUsers() {
//   try {
//     const listUsersResult = await admin.auth().listUsers();

//     if (listUsersResult.users.length === 0) {
//       console.log('No users to delete.');
//       return;
//     }

//     const deletePromises = listUsersResult.users.map(user => {
//       return admin.auth().deleteUser(user.uid);
//     });

//     await Promise.all(deletePromises);

//     console.log('All users have been deleted successfully.');
//   } catch (error) {
//     console.error('Error deleting users:', error);
//   }
// }

// // Call the function to delete all users
// deleteAllUsers();
