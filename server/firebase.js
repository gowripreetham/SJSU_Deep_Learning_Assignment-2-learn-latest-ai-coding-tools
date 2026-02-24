const admin = require('firebase-admin');

function initializeFirebase() {
  if (admin.apps.length > 0) return admin.firestore();

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    try {
      const cred = JSON.parse(serviceAccountJson);
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    } catch (e) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON: ' + e.message);
    }
  } else if (serviceAccountPath) {
    const path = require('path');
    const resolved = path.resolve(process.cwd(), serviceAccountPath);
    const serviceAccount = require(resolved);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    return null; // Demo mode: use in-memory store
  }

  return admin.firestore();
}

let db = null;
try {
  db = initializeFirebase();
} catch (e) {
  console.warn('Firebase init failed:', e.message);
  db = null;
}

module.exports = { db, admin };
