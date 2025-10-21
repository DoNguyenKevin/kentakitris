import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getDatabase, ref, set, query, orderByChild, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB20BwcVcwBBLQc8p-hPH6v2dd1Ag8uvgk",
    authDomain: "kentakitris.firebaseapp.com",
    databaseURL: "https://kentakitris-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kentakitris",
    storageBucket: "kentakitris.firebasestorage.app",
    messagingSenderId: "813070706725",
    appId: "1:813070706725:web:50bdddc7bdfa897ab877cc",
    measurementId: "G-DMJSY5GMQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Global variables
let userId = null;
let playerName = localStorage.getItem('playerName') || null;

// Attach to window for game logic access
window.db = db;
window.auth = auth;

// Authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
        window.userId = userId;
        
        // Display user info
        const shortId = userId.substring(0, 8);
        const displayName = playerName || shortId;
        document.getElementById('user-id-display').textContent = `Player: ${displayName}`;
        
        // Start listening to leaderboard once authenticated
        if (window.loadLeaderboard) {
            window.loadLeaderboard();
        }
    } else {
        // Sign in anonymously
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Anonymous sign-in failed:", error);
            document.getElementById('user-id-display').textContent = 'Auth failed';
        }
    }
});

// Start authentication
signInAnonymously(auth).catch(error => {
    console.error("Initial sign-in failed:", error);
});
