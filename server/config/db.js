import admin from 'firebase-admin';

const getDb = () => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized. Call admin.initializeApp() first.');
  }
  return admin.firestore();
};

export default getDb;
