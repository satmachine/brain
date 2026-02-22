/**
 * Firebase Firestore Database Module
 *
 * Handles all Firestore operations using REST API (no SDK).
 * Stores user game data including personal bests and session history.
 *
 * Data Structure:
 * users/{userId}/
 *   ├─ profile: { email, displayName, photoURL, createdAt }
 *   ├─ typing: { personalBests, sessions[] }
 *   ├─ dualNBack: { personalBests, sessions[] }
 *   ├─ mathGame: { personalBests, sessions[] }
 *   ├─ speedProcessing: { personalBests, sessions[] }
 *   ├─ stroop: { personalBests, sessions[] }
 *   ├─ cpt: { personalBests, sessions[] }
 *   └─ taskSwitching: { personalBests, sessions[] }
 */

/**
 * Read entire user document from Firestore
 * @returns {Promise<Object>} User data with all game stats
 */
async function readUserData() {
  const userId = sessionStorage.getItem('userId');
  const token = getAuthToken();

  if (!userId || !token) {
    throw new Error('User not authenticated');
  }

  const docPath = getUserDocPath(userId);
  const url = `${FIREBASE_CONFIG.firestoreUrl}/${docPath}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 404) {
      // User document doesn't exist yet, create it
      return await createUserDocument();
    }

    if (!response.ok) {
      // Try to refresh token and retry
      if (response.status === 401) {
        const newToken = await refreshAuthToken();
        return await readUserDataWithToken(newToken);
      }
      throw new Error('Failed to read user data');
    }

    const firestoreDoc = await response.json();
    return parseFirestoreDocument(firestoreDoc);

  } catch (error) {
    console.error('Error reading user data:', error);
    throw error;
  }
}

/**
 * Read user data with specific token (used after refresh)
 * @param {string} token - Auth token
 * @returns {Promise<Object>} User data
 */
async function readUserDataWithToken(token) {
  const userId = sessionStorage.getItem('userId');
  const docPath = getUserDocPath(userId);
  const url = `${FIREBASE_CONFIG.firestoreUrl}/${docPath}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to read user data after token refresh');
  }

  const firestoreDoc = await response.json();
  return parseFirestoreDocument(firestoreDoc);
}

/**
 * Create initial user document (first sign-in)
 * @returns {Promise<Object>} Created user data
 */
async function createUserDocument() {
  const userId = sessionStorage.getItem('userId');
  const token = getAuthToken();
  const user = getCurrentUser();

  const docPath = getUserDocPath(userId);
  const url = `${FIREBASE_CONFIG.firestoreUrl}/${docPath}`;

  const initialData = {
    fields: {
      profile: {
        mapValue: {
          fields: {
            email: { stringValue: user.email || '' },
            displayName: { stringValue: user.displayName || '' },
            photoURL: { stringValue: user.photoURL || '' },
            createdAt: { timestampValue: new Date().toISOString() }
          }
        }
      },
      typing: { mapValue: { fields: getDefaultGameFields() } },
      dualNBack: { mapValue: { fields: getDefaultGameFields() } },
      mathGame: { mapValue: { fields: getDefaultGameFields() } },
      speedProcessing: { mapValue: { fields: getDefaultGameFields() } },
      stroop: { mapValue: { fields: getDefaultGameFields() } },
      cpt: { mapValue: { fields: getDefaultGameFields() } },
      taskSwitching: { mapValue: { fields: getDefaultGameFields() } }
    }
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(initialData)
    });

    if (!response.ok) {
      throw new Error('Failed to create user document');
    }

    const firestoreDoc = await response.json();
    return parseFirestoreDocument(firestoreDoc);

  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

/**
 * Update game data after session completion
 * @param {string} gameName - Name of game (typing, stroop, etc.)
 * @param {Object} sessionData - Session statistics
 * @param {Object} personalBests - Updated personal bests
 * @returns {Promise<void>}
 */
async function updateGameData(gameName, sessionData, personalBests) {
  const userId = sessionStorage.getItem('userId');
  const token = getAuthToken();

  if (!userId || !token) {
    throw new Error('User not authenticated');
  }

  try {
    // Get current user data
    const userData = await readUserData();
    const gameData = userData[gameName] || { sessions: [], personalBests: {} };

    // Add new session to beginning of array
    gameData.sessions.unshift(sessionData);

    // Keep only last 30 sessions
    if (gameData.sessions.length > 30) {
      gameData.sessions = gameData.sessions.slice(0, 30);
    }

    // Update personal bests
    gameData.personalBests = personalBests;

    // Convert to Firestore format
    const firestoreUpdate = {
      fields: {
        [gameName]: {
          mapValue: {
            fields: {
              personalBests: {
                mapValue: {
                  fields: objectToFirestoreFields(personalBests)
                }
              },
              sessions: {
                arrayValue: {
                  values: gameData.sessions.map(session => ({
                    mapValue: {
                      fields: objectToFirestoreFields(session)
                    }
                  }))
                }
              }
            }
          }
        }
      }
    };

    // Update document
    const docPath = getUserDocPath(userId);
    const url = `${FIREBASE_CONFIG.firestoreUrl}/${docPath}?updateMask.fieldPaths=${gameName}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(firestoreUpdate)
    });

    if (!response.ok) {
      throw new Error('Failed to update game data');
    }

    return await response.json();

  } catch (error) {
    console.error('Error updating game data:', error);
    throw error;
  }
}

/**
 * Get default game data structure
 * @returns {Object} Firestore fields for new game data
 */
function getDefaultGameFields() {
  return {
    personalBests: {
      mapValue: {
        fields: {
          sessionsPlayed: { doubleValue: 0 },
          lastPlayed: { timestampValue: new Date().toISOString() }
        }
      }
    },
    sessions: {
      arrayValue: {
        values: []
      }
    }
  };
}

/**
 * Convert JavaScript object to Firestore field format
 * @param {Object} obj - JavaScript object
 * @returns {Object} Firestore fields
 */
function objectToFirestoreFields(obj) {
  const fields = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof value === 'number') {
      fields[key] = { doubleValue: value };
    } else if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (value instanceof Date) {
      fields[key] = { timestampValue: value.toISOString() };
    } else if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map(item => {
            if (typeof item === 'object') {
              return { mapValue: { fields: objectToFirestoreFields(item) } };
            }
            return objectToFirestoreFields({ val: item }).val;
          })
        }
      };
    } else if (typeof value === 'object') {
      fields[key] = {
        mapValue: {
          fields: objectToFirestoreFields(value)
        }
      };
    }
  }

  return fields;
}

/**
 * Parse Firestore document to JavaScript object
 * @param {Object} firestoreDoc - Firestore document
 * @returns {Object} JavaScript object
 */
function parseFirestoreDocument(firestoreDoc) {
  if (!firestoreDoc || !firestoreDoc.fields) {
    return {};
  }

  const data = {};
  for (const [key, value] of Object.entries(firestoreDoc.fields)) {
    data[key] = parseFirestoreValue(value);
  }

  return data;
}

/**
 * Parse Firestore value to JavaScript value
 * @param {Object} value - Firestore value
 * @returns {*} JavaScript value
 */
function parseFirestoreValue(value) {
  if (value.stringValue !== undefined) {
    return value.stringValue;
  }
  if (value.doubleValue !== undefined) {
    return value.doubleValue;
  }
  if (value.integerValue !== undefined) {
    return parseInt(value.integerValue);
  }
  if (value.booleanValue !== undefined) {
    return value.booleanValue;
  }
  if (value.timestampValue !== undefined) {
    return new Date(value.timestampValue);
  }
  if (value.nullValue !== undefined) {
    return null;
  }
  if (value.mapValue) {
    const obj = {};
    const fields = value.mapValue.fields || {};
    for (const [key, val] of Object.entries(fields)) {
      obj[key] = parseFirestoreValue(val);
    }
    return obj;
  }
  if (value.arrayValue) {
    const values = value.arrayValue.values || [];
    return values.map(parseFirestoreValue);
  }

  return null;
}

/**
 * Migrate localStorage data to Firestore (one-time migration)
 * @param {string} gameName - Name of game
 * @param {string} localStorageKey - localStorage key
 * @returns {Promise<boolean>} True if migration successful
 */
async function migrateLocalStorage(gameName, localStorageKey) {
  try {
    const localData = localStorage.getItem(localStorageKey);
    if (!localData) {
      return false; // No data to migrate
    }

    const parsedData = JSON.parse(localData);

    // Create session from localStorage data
    const session = {
      timestamp: parsedData.lastPlayed || new Date().toISOString(),
      ...parsedData
    };

    // Remove localStorage-specific fields
    delete session.lastPlayed;

    // Update Firestore with migrated data
    await updateGameData(gameName, session, parsedData);

    // Clear localStorage after successful migration
    localStorage.removeItem(localStorageKey);

    return true;

  } catch (error) {
    console.error(`Failed to migrate localStorage for ${gameName}:`, error);
    return false;
  }
}

/**
 * Check if user has localStorage data that can be migrated
 * @returns {Array} List of games with localStorage data
 */
function checkLocalStorageData() {
  const gamesWithData = [];
  const localStorageKeys = {
    speedProcessing: 'focus-games-speed-processing',
    stroop: 'focus-games-stroop',
    cpt: 'focus-games-cpt',
    taskSwitching: 'focus-games-task-switching'
  };

  for (const [gameName, key] of Object.entries(localStorageKeys)) {
    if (localStorage.getItem(key)) {
      gamesWithData.push({ gameName, key });
    }
  }

  return gamesWithData;
}
