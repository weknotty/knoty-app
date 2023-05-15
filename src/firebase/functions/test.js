const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { cert } = require("firebase-admin/app");

const fb = require("../../../dbKey.json");
admin.initializeApp({ credential: cert(fb) });

let db = admin.firestore();
const auth = admin.auth();

async function deleteAllUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers();

    if (listUsersResult.users.length === 0) {
      console.log('No users to delete.');
      return;
    }

    const deletePromises = listUsersResult.users.map(user => {
      return admin.auth().deleteUser(user.uid);
    });

    await Promise.all(deletePromises);

    console.log('All users have been deleted successfully.');
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}

// Call the function to delete all users
deleteAllUsers();