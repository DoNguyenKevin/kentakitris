import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    setLogLevel 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Set Firebase log level to debug for development purposes (can be removed later)
setLogLevel('Debug');

// Global variables provided by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let app, db, auth, userId = null;

/**
 * Initialize Firebase and authentication
 * @returns {Promise<object>} Object containing db, auth, userId, and appId
 */
export async function initializeFirebase() {
    return new Promise((resolve) => {
        if (Object.keys(firebaseConfig).length > 0) {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
            window.db = db; // Attach to window for game logic access
            window.auth = auth; // Attach to window for game logic access

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    userId = user.uid;
                    console.log("User authenticated:", userId);
                } else {
                    console.log("No user authenticated, attempting anonymous sign-in...");
                    try {
                        const credential = await signInAnonymously(auth);
                        userId = credential.user.uid;
                        console.log("Anonymous sign-in successful:", userId);
                    } catch (error) {
                        console.error("Anonymous sign-in failed:", error);
                    }
                }
                window.userId = userId; // Attach to window for game logic access
                document.getElementById('user-id-display').textContent = userId ? `Player ID: ${userId}` : 'Authenticating...';
                
                // Resolve with Firebase instances
                resolve({ db, auth, userId, appId });
            });

            // Try to sign in with custom token if available
            if (initialAuthToken) {
                signInWithCustomToken(auth, initialAuthToken).catch(error => {
                    console.error("Custom token sign-in failed:", error);
                    signInAnonymously(auth);
                });
            } else {
                signInAnonymously(auth);
            }
        } else {
            // Fallback if Firebase config is missing
            console.warn("Firebase configuration is missing. Leaderboard functionality is disabled.");
            document.getElementById('leaderboard-container').innerHTML = '<p class="text-red-400 text-sm">Leaderboard disabled (Missing Firebase config).</p>';
            window.db = null;
            window.auth = null;
            userId = crypto.randomUUID(); // Mock user ID for local use
            window.userId = userId;
            document.getElementById('user-id-display').textContent = `Mock ID: ${userId}`;
            
            resolve({ db: null, auth: null, userId, appId: 'local' });
        }
    });
}

export function getFirebaseInstances() {
    return { db, auth, userId, appId };
}
