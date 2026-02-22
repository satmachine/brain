/**
 * Firebase Configuration
 *
 * This file contains Firebase project configuration for the Focus Games app.
 * We use Firebase REST APIs (no SDK) to maintain zero dependencies.
 *
 * Project: focus-ffa3a
 * Authentication: Google Sign-In
 * Database: Firestore
 */

const FIREBASE_CONFIG = {
  // Firebase project identifiers
  apiKey: 'AIzaSyBJaNVjUvGW_YLCHjcTiiacXWG-U6icBY8',
  authDomain: 'focus-ffa3a.firebaseapp.com',
  projectId: 'focus-ffa3a',
  storageBucket: 'focus-ffa3a.firebasestorage.app',
  messagingSenderId: '406913517518',
  appId: '1:406913517518:web:46784071ecd4c409060d9f',

  // API endpoints (REST API)
  identityToolkitUrl: 'https://identitytoolkit.googleapis.com/v1',
  firestoreUrl: 'https://firestore.googleapis.com/v1',

  // Google OAuth Client ID (for Google Sign-In)
  googleClientId: '406913517518-h569rfa0bt60cmh0ffund7g11ststd8e.apps.googleusercontent.com'
};

// Helper function to get Firestore document path
function getFirestoreDocPath(collection, documentId) {
  return `projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/${collection}/${documentId}`;
}

// Helper function to get user document path
function getUserDocPath(userId) {
  return getFirestoreDocPath('users', userId);
}
