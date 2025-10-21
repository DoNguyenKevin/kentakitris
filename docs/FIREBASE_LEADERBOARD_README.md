# 🔥 Firebase Leaderboard Implementation

## Tổng quan

Phaser game Kentakitris đã được tích hợp Firebase Realtime Database để quản lý leaderboard global. Thay vì lưu điểm cục bộ trong localStorage, giờ đây tất cả điểm số được lưu trên cloud và chia sẻ giữa mọi người chơi!

## 🎯 Tính năng

### ✅ Đã triển khai:
- **Firebase Realtime Database** - Lưu trữ điểm số trên cloud
- **Anonymous Authentication** - Đăng nhập tự động không cần tài khoản
- **Realtime Updates** - Leaderboard tự động cập nhật khi có điểm mới
- **Global Leaderboard** - Xem top người chơi từ khắp nơi
- **Educational Comments** - Code có comments đầy đủ bằng tiếng Việt

### 🔒 Bảo mật:
- Mỗi user chỉ có thể ghi vào UID của mình
- Điểm số chỉ có thể tăng (không thể giảm)
- Data validation đầy đủ
- Public read (mọi người đọc được leaderboard)

## 📁 Cấu trúc Code

### 1. Firebase Service (`src/game/services/FirebaseService.ts`)

Module chính quản lý Firebase:

```typescript
// Singleton service
export const firebaseService = FirebaseService.getInstance();

// Methods
- initialize(): Promise<void>           // Khởi tạo Firebase
- saveScore(score, name): Promise<void> // Lưu điểm
- getLeaderboard(): Promise<Entry[]>    // Lấy top điểm
- subscribeToLeaderboard(callback)      // Realtime updates
```

**Key Features:**
- Singleton pattern (1 instance duy nhất)
- Async/await cho operations
- Error handling đầy đủ
- Educational comments

### 2. Leaderboard Scene (`src/game/scenes/Leaderboard.ts`)

Scene hiển thị bảng xếp hạng:

**Changes from localStorage:**
- ❌ Removed: `loadLeaderboard()` from localStorage
- ❌ Removed: `saveScore()` static method (localStorage version)
- ✅ Added: `initializeFirebase()` - Khởi tạo và subscribe
- ✅ Added: `cleanupFirebase()` - Dọn dẹp listener
- ✅ Updated: `renderLeaderboard()` - Support realtime updates
- ✅ Updated: `saveScore()` - Sử dụng Firebase

**Realtime Updates:**
```typescript
// Subscribe to realtime updates
this.unsubscribe = firebaseService.subscribeToLeaderboard(
    (entries) => {
        this.leaderboardData = entries;
        this.renderLeaderboard(); // Tự động render lại
    },
    10  // Top 10
);
```

### 3. Game Scene (`src/game/scenes/Game.ts`)

**Changes:**
```typescript
// Old (localStorage):
Leaderboard.saveScore(this.score, this.lines, this.level);

// New (Firebase):
const playerName = localStorage.getItem('playerName') || 'Anonymous';
Leaderboard.saveScore(this.score, playerName);
```

## 🗄️ Database Structure

### Firebase Path
```
/leaderboards/global/{userId}/
```

### Data Schema
```json
{
  "name": "string",       // Tên người chơi (max 20 chars)
  "score": "number",      // Điểm số (>= 0)
  "updatedAt": "number"   // Timestamp (milliseconds)
}
```

### Example Data
```json
{
  "leaderboards": {
    "global": {
      "AbC123XyZ456": {
        "name": "KHOI",
        "score": 5000,
        "updatedAt": 1760620514283
      },
      "XyZ789AbC012": {
        "name": "Anonymous", 
        "score": 3000,
        "updatedAt": 1760620520000
      }
    }
  }
}
```

## 🔐 Firebase Security Rules

File: `database.rules.json`

```json
{
  "rules": {
    "leaderboards": {
      "global": {
        "$uid": {
          ".read": true,  // Mọi người đọc được
          ".write": "auth != null && auth.uid === $uid",  // Chỉ ghi vào UID của mình
          ".validate": "newData.hasChildren(['name', 'score', 'updatedAt']) && 
                        newData.child('score').val() >= 0 &&
                        (!data.exists() || newData.child('score').val() >= data.child('score').val())"
        }
      }
    }
  }
}
```

**Giải thích:**
- `.read: true` - Tất cả có thể đọc leaderboard
- `.write` - Chỉ authenticated user ghi vào UID của họ
- `.validate` - Validate cấu trúc data và score chỉ tăng

## 🚀 Cách sử dụng

### 1. Khởi động game
```bash
npm install
npm run dev-nolog
```

### 2. Chơi game
1. Nhấn "Click to Start" để bắt đầu
2. Chơi Tetris và đạt điểm cao
3. Khi Game Over → Điểm tự động lưu lên Firebase

### 3. Xem Leaderboard
1. Click "🏆 Leaderboard" từ Main Menu
2. Xem top 10 người chơi
3. Leaderboard tự động update realtime!

### 4. Player Name (Optional)
Tên người chơi lấy từ `localStorage.playerName`:
```javascript
// Trong browser console hoặc index.html
localStorage.setItem('playerName', 'YOUR_NAME');
```

## 📊 Flow Chart

```
┌─────────────┐
│   Game      │
│   Scene     │
└──────┬──────┘
       │ Game Over
       ▼
┌─────────────────────┐
│ Leaderboard.       │
│ saveScore()        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ FirebaseService.   │
│ saveScore()        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   Firebase         │
│   Realtime DB      │
└──────┬──────────────┘
       │ Realtime Update
       ▼
┌─────────────────────┐
│ All Leaderboard    │
│ Scenes Update!     │
└─────────────────────┘
```

## 🧪 Testing

Xem chi tiết tại: [FIREBASE_LEADERBOARD_TESTING.md](./FIREBASE_LEADERBOARD_TESTING.md)

### Quick Test:
```bash
# 1. Build
npm run build-nolog

# 2. Start dev server
npm run dev-nolog

# 3. Open browser
# http://localhost:8080

# 4. Check console
# Nên thấy: "✅ Firebase khởi tạo thành công! User ID: ..."
```

## 🔧 Configuration

### Firebase Config
File: `src/game/services/FirebaseService.ts`

```typescript
const firebaseConfig = {
    apiKey: "...",
    authDomain: "kentakitris.firebaseapp.com",
    databaseURL: "https://kentakitris-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kentakitris",
    // ...
};
```

**Lưu ý:** Config đã được hardcode. Trong production, nên dùng environment variables.

## 📚 Educational Comments

Tất cả code đều có comments giáo dục đầy đủ:

```typescript
/**
 * ✅ Mục tiêu: [Mô tả ngắn gọn]
 * 
 * Cách hoạt động:
 * 1. [Bước 1]
 * 2. [Bước 2]
 * 
 * Ví dụ: [Ví dụ cụ thể]
 * 
 * Try it: [Cách thử nghiệm]
 * 
 * ❓ Câu hỏi: [Câu hỏi suy nghĩ]
 * 💡 Trả lời: [Câu trả lời]
 */
```

### Emojis được sử dụng:
- ✅ Mục tiêu/đúng
- ❌ Lỗi/sai/cảnh báo
- ❓ Câu hỏi
- 💡 Gợi ý/trả lời
- 🔥 Firebase
- 📊 Dữ liệu
- 🏆 Leaderboard
- 🔒 Bảo mật
- 🔄 Realtime updates

## 🐛 Troubleshooting

### Lỗi: "Firebase chưa được khởi tạo"
**Nguyên nhân:** `initialize()` chưa được gọi hoặc chưa hoàn thành

**Giải pháp:**
```typescript
// Đảm bảo dùng async/await
async create() {
    await firebaseService.initialize();
    // ... tiếp tục code
}
```

### Lỗi: Realtime updates không hoạt động
**Nguyên nhân:** Listener không được subscribe hoặc bị cleanup sớm

**Giải pháp:**
```typescript
// Subscribe trong create()
this.unsubscribe = firebaseService.subscribeToLeaderboard(...);

// Cleanup trong shutdown event
this.events.once('shutdown', () => {
    if (this.unsubscribe) this.unsubscribe();
});
```

### Lỗi: Permission denied
**Nguyên nhân:** Firebase Rules hoặc authentication issue

**Giải pháp:**
1. Kiểm tra `database.rules.json`
2. Verify anonymous auth enabled trong Firebase Console
3. Check user đã authenticated: `firebaseService.getUserId()`

## 📈 Future Enhancements

### Có thể thêm:
1. **Player Names Input UI** - UI để người chơi nhập tên
2. **Filtering** - Lọc theo ngày/tuần/tháng
3. **Achievements** - Thành tích và badges
4. **Social Features** - Share điểm lên social media
5. **Offline Support** - Cache leaderboard khi offline

## 🙏 Credits

- Firebase SDK: v11.6.1
- Phaser: v3.90.0
- Next.js: v15.5.5

---

**Made with ❤️ for educational purposes**

Dự án này được thiết kế để dạy lập trình cho học sinh lớp 7. Mọi code đều có comments giải thích chi tiết bằng tiếng Việt!
