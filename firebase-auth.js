/**
 * Firebase Authentication Module
 *
 * Handles Google Sign-In using Google Identity Services and Firebase Auth REST API.
 * No Firebase SDK - pure fetch() calls for zero dependencies.
 *
 * Authentication Flow:
 * 1. User clicks "Sign in with Google"
 * 2. Google Identity Services shows One Tap or popup
 * 3. User authenticates with Google
 * 4. Receive Google ID token
 * 5. Exchange for Firebase auth token
 * 6. Store token in sessionStorage
 * 7. Update UI based on auth state
 */

// Current user state
let currentUser = null;
let authStateCallback = null;

/**
 * Initialize authentication on page load
 * Checks for existing session and restores auth state
 */
async function initAuth() {
  const token = sessionStorage.getItem('firebaseToken');
  const userId = sessionStorage.getItem('userId');
  const email = sessionStorage.getItem('userEmail');
  const displayName = sessionStorage.getItem('userDisplayName');
  const photoURL = sessionStorage.getItem('userPhotoURL');

  if (token && userId) {
    try {
      // Verify token is still valid
      await verifyToken(token);

      // Restore user state
      currentUser = {
        uid: userId,
        email: email,
        displayName: displayName,
        photoURL: photoURL
      };

      notifyAuthStateChange(currentUser);
    } catch (error) {
      console.error('Token validation failed:', error);
      // Token expired, clear session
      signOut();
    }
  } else {
    notifyAuthStateChange(null);
  }
}

/**
 * Load Google Identity Services script
 * @returns {Promise} Resolves when script is loaded
 */
function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Initialize Google Sign-In button
 * @param {string} elementId - ID of button container element
 */
async function initGoogleSignIn(elementId) {
  try {
    await loadGoogleIdentityScript();

    window.google.accounts.id.initialize({
      client_id: FIREBASE_CONFIG.googleClientId,
      callback: handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Render sign-in button
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'filled_black',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 250
      }
    );
  } catch (error) {
    console.error('Failed to initialize Google Sign-In:', error);
    throw new Error('Google Sign-In initialization failed. Please check your internet connection.');
  }
}

/**
 * Show Google One Tap UI
 */
async function showOneTap() {
  try {
    await loadGoogleIdentityScript();

    window.google.accounts.id.initialize({
      client_id: FIREBASE_CONFIG.googleClientId,
      callback: handleGoogleSignIn,
      auto_select: true
    });

    window.google.accounts.id.prompt();
  } catch (error) {
    console.error('Failed to show One Tap:', error);
  }
}

/**
 * Handle Google Sign-In response
 * @param {Object} response - Google credential response
 */
async function handleGoogleSignIn(response) {
  try {
    const googleIdToken = response.credential;

    // Show loading state
    showAuthLoading();

    // Exchange Google ID token for Firebase token
    const firebaseAuth = await signInWithGoogleCredential(googleIdToken);

    // Store auth data in sessionStorage
    sessionStorage.setItem('firebaseToken', firebaseAuth.idToken);
    sessionStorage.setItem('refreshToken', firebaseAuth.refreshToken);
    sessionStorage.setItem('userId', firebaseAuth.localId);
    sessionStorage.setItem('userEmail', firebaseAuth.email);
    sessionStorage.setItem('userDisplayName', firebaseAuth.displayName || '');
    sessionStorage.setItem('userPhotoURL', firebaseAuth.photoUrl || '');

    // Update current user
    currentUser = {
      uid: firebaseAuth.localId,
      email: firebaseAuth.email,
      displayName: firebaseAuth.displayName || '',
      photoURL: firebaseAuth.photoUrl || ''
    };

    hideAuthLoading();
    notifyAuthStateChange(currentUser);

  } catch (error) {
    console.error('Sign-in failed:', error);
    hideAuthLoading();
    showAuthError('Sign-in failed. Please try again.');
  }
}

/**
 * Exchange Google ID token for Firebase auth token
 * @param {string} googleIdToken - Google ID token from Sign-In
 * @returns {Promise<Object>} Firebase auth response
 */
async function signInWithGoogleCredential(googleIdToken) {
  const url = `${FIREBASE_CONFIG.identityToolkitUrl}/accounts:signInWithIdp?key=${FIREBASE_CONFIG.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postBody: `id_token=${googleIdToken}&providerId=google.com`,
      requestUri: window.location.origin,
      returnSecureToken: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to sign in with Firebase');
  }

  return await response.json();
}

/**
 * Verify that auth token is still valid
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} User data
 */
async function verifyToken(idToken) {
  const url = `${FIREBASE_CONFIG.identityToolkitUrl}/accounts:lookup?key=${FIREBASE_CONFIG.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idToken })
  });

  if (!response.ok) {
    throw new Error('Token validation failed');
  }

  const data = await response.json();
  return data.users[0];
}

/**
 * Refresh auth token if expired
 * @returns {Promise<string>} New ID token
 */
async function refreshAuthToken() {
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const url = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_CONFIG.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();

  // Update stored token
  sessionStorage.setItem('firebaseToken', data.id_token);
  sessionStorage.setItem('refreshToken', data.refresh_token);

  return data.id_token;
}

/**
 * Sign out current user
 */
function signOut() {
  // Clear session storage
  sessionStorage.removeItem('firebaseToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userDisplayName');
  sessionStorage.removeItem('userPhotoURL');

  // Clear current user
  currentUser = null;

  // Notify state change
  notifyAuthStateChange(null);
}

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
function getCurrentUser() {
  return currentUser;
}

/**
 * Get current auth token
 * @returns {string|null} Firebase ID token
 */
function getAuthToken() {
  return sessionStorage.getItem('firebaseToken');
}

/**
 * Set callback for auth state changes
 * @param {Function} callback - Called with user object or null
 */
function onAuthStateChanged(callback) {
  authStateCallback = callback;
}

/**
 * Notify listeners of auth state change
 * @param {Object|null} user - Current user or null
 */
function notifyAuthStateChange(user) {
  if (authStateCallback) {
    authStateCallback(user);
  }
}

/**
 * Show loading state during auth
 */
function showAuthLoading() {
  const event = new CustomEvent('auth-loading', { detail: { loading: true } });
  window.dispatchEvent(event);
}

/**
 * Hide loading state
 */
function hideAuthLoading() {
  const event = new CustomEvent('auth-loading', { detail: { loading: false } });
  window.dispatchEvent(event);
}

/**
 * Show auth error message
 * @param {string} message - Error message
 */
function showAuthError(message) {
  const event = new CustomEvent('auth-error', { detail: { message } });
  window.dispatchEvent(event);
}

/**
 * Check if user is currently signed in
 * @returns {boolean}
 */
function isSignedIn() {
  return currentUser !== null;
}
