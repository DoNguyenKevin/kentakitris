// src/game/services/FirebaseService.ts
// ======================================================
// ✅ Firebase Service - Dịch vụ Firebase cho Phaser Game
// 
// Module này cung cấp các chức năng:
// - Kết nối với Firebase Realtime Database
// - Đăng nhập ẩn danh (Anonymous Authentication)
// - Lưu và đọc điểm số từ leaderboard
// - Realtime updates (cập nhật tự động)
// 
// 🔥 Firebase = Nền tảng backend của Google
//    Cho phép lưu dữ liệu online, không mất khi tắt máy!
// ======================================================

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, Auth, User } from 'firebase/auth';
import { 
    getDatabase, 
    ref, 
    set, 
    query, 
    orderByChild, 
    limitToLast, 
    onValue, 
    get,
    Database 
} from 'firebase/database';

// 🔧 Hằng số (Constants)
// ======================================================
const LEADERBOARD_PATH = 'leaderboards/global';  // Đường dẫn trong database
const MAX_LEADERBOARD_ENTRIES = 100;  // Số entry tối đa hiển thị

// 🏆 Cấu trúc dữ liệu cho 1 entry trong leaderboard
// ======================================================
export interface LeaderboardEntry {
    name: string;        // Tên người chơi
    score: number;       // Điểm số
    updatedAt: number;   // Thời gian cập nhật (milliseconds)
}

// 📦 Dữ liệu Firebase từ database
// ======================================================
interface FirebaseLeaderboardData {
    [uid: string]: LeaderboardEntry;
}

/**
 * ✅ FirebaseService - Singleton class quản lý Firebase
 * 
 * Singleton = Chỉ có 1 instance duy nhất trong toàn bộ app
 * Giống như chỉ có 1 người quản lý kho dữ liệu!
 * 
 * Các chức năng:
 * - initialize(): Khởi tạo Firebase
 * - saveScore(): Lưu điểm lên server
 * - getLeaderboard(): Lấy top điểm
 * - subscribeToLeaderboard(): Nhận updates realtime
 * 
 * ❓ Câu hỏi: Tại sao dùng Singleton pattern?
 * 💡 Trả lời: Để tránh tạo nhiều kết nối Firebase!
 *            Chỉ cần 1 kết nối dùng chung cho cả game.
 */
class FirebaseService {
    // 🔒 Private properties (chỉ dùng trong class)
    private static instance: FirebaseService;
    private app: FirebaseApp | null = null;
    private auth: Auth | null = null;
    private database: Database | null = null;
    private currentUser: User | null = null;
    private initialized: boolean = false;

    // 🔒 Private constructor (không cho tạo instance từ bên ngoài)
    private constructor() {}

    /**
     * ✅ getInstance() - Lấy instance duy nhất
     * 
     * Static method để lấy hoặc tạo instance
     * 
     * Cách hoạt động:
     * 1. Nếu chưa có instance → tạo mới
     * 2. Nếu đã có → trả về instance cũ
     * 
     * Ví dụ: const firebase = FirebaseService.getInstance();
     * 
     * Try it: Gọi getInstance() nhiều lần → luôn nhận cùng 1 object!
     */
    static getInstance(): FirebaseService {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }

    /**
     * ✅ initialize() - Khởi tạo Firebase
     * 
     * Thiết lập kết nối với Firebase và đăng nhập
     * 
     * Cách hoạt động:
     * 1. Kiểm tra nếu đã khởi tạo → skip
     * 2. Tạo Firebase App với config
     * 3. Thiết lập Authentication
     * 4. Thiết lập Realtime Database
     * 5. Đăng nhập ẩn danh (Anonymous)
     * 
     * Try it: Gọi hàm này trong Game scene trước khi dùng Firebase
     * 
     * ❓ Câu hỏi: Tại sao đăng nhập ẩn danh?
     * 💡 Trả lời: Để người chơi không cần tạo tài khoản!
     *            Firebase tự động tạo ID riêng cho mỗi người.
     */
    async initialize(): Promise<void> {
        // Nếu đã khởi tạo rồi → không làm gì
        if (this.initialized) {
            console.log('🔥 Firebase đã được khởi tạo');
            return;
        }

        try {
            // 🔧 Firebase configuration
            // Thông tin kết nối đến project Firebase
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

            // 🚀 Khởi tạo Firebase App
            console.log('🔥 Đang khởi tạo Firebase...');
            this.app = initializeApp(firebaseConfig);

            // 🔐 Thiết lập Authentication (Xác thực)
            this.auth = getAuth(this.app);

            // 💾 Thiết lập Realtime Database
            this.database = getDatabase(this.app);

            // 👤 Đăng nhập ẩn danh
            console.log('👤 Đang đăng nhập ẩn danh...');
            const userCredential = await signInAnonymously(this.auth);
            this.currentUser = userCredential.user;

            this.initialized = true;
            console.log('✅ Firebase khởi tạo thành công! User ID:', this.currentUser.uid);

        } catch (error) {
            console.error('❌ Lỗi khi khởi tạo Firebase:', error);
            throw error;
        }
    }

    /**
     * ✅ isInitialized() - Kiểm tra Firebase đã sẵn sàng chưa
     * 
     * Trả về true nếu Firebase đã được khởi tạo và đăng nhập
     */
    isInitialized(): boolean {
        return this.initialized && this.currentUser !== null;
    }

    /**
     * ✅ getUserId() - Lấy ID của người chơi hiện tại
     * 
     * Trả về: User ID (string) hoặc null nếu chưa đăng nhập
     * 
     * Ví dụ: "AbC123XyZ456" (ID duy nhất cho mỗi người chơi)
     */
    getUserId(): string | null {
        return this.currentUser?.uid || null;
    }

    /**
     * ✅ saveScore() - Lưu điểm lên Firebase
     * 
     * Lưu hoặc cập nhật điểm số của người chơi
     * 
     * Tham số:
     * - score: Điểm số mới
     * - playerName: Tên người chơi (tùy chọn)
     * 
     * Cách hoạt động:
     * 1. Kiểm tra Firebase đã khởi tạo chưa
     * 2. Lấy User ID hiện tại
     * 3. Tạo object dữ liệu
     * 4. Lưu vào path: leaderboards/global/{userId}
     * 5. Firebase tự động cập nhật hoặc tạo mới
     * 
     * Database structure:
     * leaderboards/
     *   global/
     *     {userId1}/
     *       name: "KHOI"
     *       score: 5000
     *       updatedAt: 1760620514283
     *     {userId2}/
     *       ...
     * 
     * Try it: Sau khi game over, gọi hàm này với điểm số
     * 
     * ❓ Câu hỏi: Tại sao dùng userId làm key?
     * 💡 Trả lời: Để mỗi người chỉ có 1 high score!
     *            Nếu chơi lại và đạt điểm cao hơn → tự động update.
     */
    async saveScore(score: number, playerName: string = 'Anonymous'): Promise<void> {
        if (!this.isInitialized() || !this.database || !this.currentUser) {
            console.error('❌ Firebase chưa được khởi tạo!');
            return;
        }

        try {
            // 📍 Tạo reference đến vị trí lưu dữ liệu
            // ref() = tạo con trỏ đến đường dẫn trong database
            const userScoreRef = ref(this.database, `${LEADERBOARD_PATH}/${this.currentUser.uid}`);

            // 📦 Dữ liệu cần lưu
            const scoreData: LeaderboardEntry = {
                name: playerName,
                score: score,
                updatedAt: Date.now()  // Thời gian hiện tại
            };

            // 💾 Lưu lên Firebase
            // set() = ghi dữ liệu (overwrite nếu đã tồn tại)
            await set(userScoreRef, scoreData);

            console.log('✅ Đã lưu điểm lên Firebase:', scoreData);

        } catch (error) {
            console.error('❌ Lỗi khi lưu điểm:', error);
            throw error;
        }
    }

    /**
     * ✅ getLeaderboard() - Lấy top điểm từ Firebase
     * 
     * Đọc và trả về danh sách người chơi có điểm cao nhất
     * 
     * Tham số:
     * - limit: Số lượng entries tối đa (mặc định 100)
     * 
     * Trả về: Promise<LeaderboardEntry[]> - Mảng điểm số đã sắp xếp
     * 
     * Cách hoạt động:
     * 1. Tạo query để lấy dữ liệu
     * 2. Sắp xếp theo score (orderByChild)
     * 3. Lấy top N entries (limitToLast)
     * 4. Chuyển đổi snapshot thành array
     * 5. Đảo ngược để điểm cao nhất lên đầu
     * 
     * Try it: const topScores = await firebase.getLeaderboard(10);
     * 
     * ❓ Câu hỏi: Tại sao dùng limitToLast thay vì limitToFirst?
     * 💡 Trả lời: Vì orderByChild sắp xếp tăng dần (low → high)!
     *            limitToLast lấy N entries cuối = N entries cao nhất.
     *            Sau đó đảo ngược để high → low.
     */
    async getLeaderboard(limit: number = MAX_LEADERBOARD_ENTRIES): Promise<LeaderboardEntry[]> {
        if (!this.isInitialized() || !this.database) {
            console.error('❌ Firebase chưa được khởi tạo!');
            return [];
        }

        try {
            // 📍 Tạo reference đến leaderboard
            const leaderboardRef = ref(this.database, LEADERBOARD_PATH);

            // 🔍 Tạo query để lấy top scores
            // orderByChild('score') = sắp xếp theo field 'score'
            // limitToLast(limit) = lấy N entries cuối (điểm cao nhất)
            const topScoresQuery = query(
                leaderboardRef,
                orderByChild('score'),
                limitToLast(limit)
            );

            // 📖 Đọc dữ liệu
            const snapshot = await get(topScoresQuery);

            // 📊 Chuyển đổi snapshot thành array
            const entries: LeaderboardEntry[] = [];
            
            if (snapshot.exists()) {
                const data = snapshot.val() as FirebaseLeaderboardData;
                
                // Duyệt qua từng entry
                Object.values(data).forEach((entry) => {
                    entries.push(entry);
                });

                // ⬇️ Đảo ngược để điểm cao nhất lên đầu
                // reverse() = đảo ngược mảng
                entries.reverse();
            }

            console.log(`📊 Đã load ${entries.length} entries từ Firebase`);
            return entries;

        } catch (error) {
            console.error('❌ Lỗi khi đọc leaderboard:', error);
            return [];
        }
    }

    /**
     * ✅ subscribeToLeaderboard() - Lắng nghe thay đổi realtime
     * 
     * Đăng ký nhận updates tự động khi có người lưu điểm mới
     * 
     * Tham số:
     * - callback: Function được gọi khi có update
     * - limit: Số lượng entries tối đa
     * 
     * Trả về: Function để hủy đăng ký (unsubscribe)
     * 
     * Cách hoạt động:
     * 1. Tạo query như getLeaderboard()
     * 2. Dùng onValue() để lắng nghe thay đổi
     * 3. Mỗi khi database thay đổi → gọi callback
     * 4. Callback nhận mảng entries mới
     * 
     * Ví dụ:
     * const unsubscribe = firebase.subscribeToLeaderboard((scores) => {
     *     console.log('Leaderboard updated!', scores);
     *     // Update UI với scores mới
     * });
     * 
     * // Khi không cần nữa:
     * unsubscribe();
     * 
     * Try it: Subscribe trong Leaderboard scene để tự động update!
     * 
     * ❓ Câu hỏi: Realtime update hoạt động như thế nào?
     * 💡 Trả lời: Firebase dùng WebSocket để gửi thông báo!
     *            Khi ai đó lưu điểm → server gửi update ngay lập tức.
     *            Giống như chat app, không cần refresh!
     */
    subscribeToLeaderboard(
        callback: (entries: LeaderboardEntry[]) => void,
        limit: number = MAX_LEADERBOARD_ENTRIES
    ): () => void {
        if (!this.isInitialized() || !this.database) {
            console.error('❌ Firebase chưa được khởi tạo!');
            return () => {};
        }

        try {
            // 📍 Tạo reference và query
            const leaderboardRef = ref(this.database, LEADERBOARD_PATH);
            const topScoresQuery = query(
                leaderboardRef,
                orderByChild('score'),
                limitToLast(limit)
            );

            // 👂 Lắng nghe thay đổi
            // onValue() = đăng ký listener cho realtime updates
            const unsubscribe = onValue(topScoresQuery, (snapshot) => {
                const entries: LeaderboardEntry[] = [];

                if (snapshot.exists()) {
                    const data = snapshot.val() as FirebaseLeaderboardData;
                    
                    Object.values(data).forEach((entry) => {
                        entries.push(entry);
                    });

                    entries.reverse();
                }

                console.log('🔄 Leaderboard update received:', entries.length, 'entries');
                
                // 📢 Gọi callback với dữ liệu mới
                callback(entries);
            }, (error) => {
                console.error('❌ Lỗi khi lắng nghe leaderboard:', error);
            });

            // Trả về function để hủy đăng ký
            return unsubscribe;

        } catch (error) {
            console.error('❌ Lỗi khi subscribe leaderboard:', error);
            return () => {};
        }
    }
}

// 📤 Export singleton instance
// ======================================================
// Người dùng chỉ cần: import { firebaseService } from './FirebaseService';
export const firebaseService = FirebaseService.getInstance();
