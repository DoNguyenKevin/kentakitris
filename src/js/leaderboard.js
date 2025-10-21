import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    onSnapshot, 
    getDocs, 
    where, 
    doc, 
    setDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const LEADERBOARD_COLLECTION = 'leaderboard';
const leaderboardListEl = document.getElementById('leaderboard-list');

// Global variables will be set from firebase-config.js
let appId, db, userId;

/**
 * Initialize leaderboard module with Firebase instances
 */
export function initLeaderboard(firebaseAppId, firebaseDb, firebaseUserId) {
    appId = firebaseAppId;
    db = firebaseDb;
    userId = firebaseUserId;
}

/**
 * Saves the current score to the public leaderboard.
 */
export async function saveScore(finalScore) {
    if (!db || !userId) {
        console.log("Cannot save score: Firebase or User ID not initialized.");
        return;
    }

    const username = userId.substring(0, 8); // Use first 8 chars of ID as username
    const docId = crypto.randomUUID(); // Unique ID for the score entry
    const leaderboardPath = `/artifacts/${appId}/public/data/${LEADERBOARD_COLLECTION}`;
    const userDocRef = doc(db, leaderboardPath, docId);

    try {
        // Check if the user already has a high score document
        const q = query(collection(db, leaderboardPath), where("userId", "==", userId), limit(1));
        const existingDocs = await getDocs(q);
        
        if (!existingDocs.empty) {
            // Update existing document if new score is higher
            const existingDoc = existingDocs.docs[0];
            const existingScore = existingDoc.data().score;
            
            if (finalScore > existingScore) {
                await updateDoc(existingDoc.ref, {
                    score: finalScore,
                    timestamp: Date.now()
                });
                console.log("High score updated:", finalScore);
            } else {
                console.log("Score not higher than existing high score.");
            }
        } else {
            // Create a new document for first-time users
            await setDoc(userDocRef, {
                userId: userId,
                username: username,
                score: finalScore,
                timestamp: Date.now()
            });
            console.log("Score saved to Firestore:", finalScore);
        }
    } catch (error) {
        console.error("Error saving score to Firestore:", error);
    }
}

/**
 * Loads and displays the leaderboard in real-time.
 */
export function loadLeaderboard() {
    if (!db) return;

    const leaderboardPath = `/artifacts/${appId}/public/data/${LEADERBOARD_COLLECTION}`;
    const q = query(collection(db, leaderboardPath), orderBy("score", "desc"), limit(10));

    onSnapshot(q, (snapshot) => {
        leaderboardListEl.innerHTML = '';
        if (snapshot.empty) {
            leaderboardListEl.innerHTML = '<p class="text-gray-400 text-sm">No scores yet. Be the first!</p>';
            return;
        }

        snapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            const entry = document.createElement('div');
            entry.className = 'flex justify-between items-center text-sm py-1 px-2 rounded';
            
            if (data.userId === userId) {
                entry.classList.add('bg-yellow-900', 'bg-opacity-30');
            }
            
            entry.innerHTML = `
                <span class="text-gray-400">#${index + 1}</span>
                <span class="text-white truncate mx-2 flex-1">${data.username || 'Anonymous'}</span>
                <span class="text-yellow-400 font-bold">${data.score}</span>
            `;
            leaderboardListEl.appendChild(entry);
        });
    }, (error) => {
        console.error("Error listening to leaderboard:", error);
        leaderboardListEl.innerHTML = '<p class="text-red-400 text-sm">Error loading leaderboard.</p>';
    });
}
