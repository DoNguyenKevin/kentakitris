# 🧪 Firebase Leaderboard Testing Guide

## Hướng dẫn kiểm tra Firebase Leaderboard

### ✅ Checklist kiểm tra

#### 1. Build & Compilation
- [x] TypeScript compilation thành công
- [x] Next.js build không có lỗi
- [x] Firebase SDK được cài đặt đúng cách
- [x] No type errors

#### 2. Firebase Service Module
- [x] File `src/game/services/FirebaseService.ts` tồn tại
- [x] Singleton pattern implemented correctly
- [x] Methods exported properly:
  - `initialize()` - Khởi tạo Firebase
  - `saveScore()` - Lưu điểm
  - `getLeaderboard()` - Lấy top điểm
  - `subscribeToLeaderboard()` - Realtime updates
- [x] Educational comments bằng tiếng Việt

#### 3. Leaderboard Scene Updates
- [x] Import FirebaseService thành công
- [x] Thay thế localStorage bằng Firebase
- [x] Realtime updates được implement
- [x] Cleanup listener khi scene shutdown
- [x] Error handling cho Firebase connection

#### 4. Game Scene Updates
- [x] saveScore() được gọi với đúng parameters
- [x] Firebase integration trong endGame()

### 🔬 Manual Testing Steps

#### Bước 1: Khởi động ứng dụng
```bash
npm run dev-nolog
```
- Truy cập: http://localhost:8080
- Kiểm tra console không có lỗi

#### Bước 2: Test Leaderboard Scene
1. Click "🏆 Leaderboard" button từ Main Menu
2. Kiểm tra:
   - ✅ Hiển thị "🔄 Đang kết nối Firebase..."
   - ✅ Firebase initialization thành công
   - ✅ Console log: "✅ Firebase khởi tạo thành công! User ID: ..."
   - ✅ Hiển thị leaderboard (hoặc "No scores yet!")

#### Bước 3: Test Save Score
1. Chơi game và đạt điểm
2. Khi game over:
   - ✅ Console log: "✅ Đã lưu điểm lên Firebase: ..."
   - ✅ Điểm được lưu vào Firebase Realtime Database

#### Bước 4: Test Realtime Updates
1. Mở 2 tabs/browsers cùng lúc
2. Tab 1: Mở Leaderboard scene
3. Tab 2: Chơi game và lưu điểm
4. Kiểm tra:
   - ✅ Tab 1 tự động update leaderboard (không cần refresh)
   - ✅ Console log: "🔄 Leaderboard update received: ..."

#### Bước 5: Test Cleanup
1. Mở Leaderboard scene
2. Click "Back to Menu"
3. Kiểm tra:
   - ✅ Console log: "🔌 Đã ngắt kết nối Firebase listener"
   - ✅ Không có memory leak

### 📊 Firebase Database Structure

Kiểm tra trong Firebase Console:

**Path:** `/leaderboards/global/{userId}`

**Expected structure:**
```json
{
  "leaderboards": {
    "global": {
      "AbC123XyZ456": {
        "name": "Anonymous",
        "score": 1000,
        "updatedAt": 1760620514283
      },
      "XyZ789AbC012": {
        "name": "Player2",
        "score": 2000,
        "updatedAt": 1760620520000
      }
    }
  }
}
```

### 🔒 Security Rules Verification

Kiểm tra Firebase Rules tại `database.rules.json`:
- [x] Mọi người có thể đọc (`.read: true`)
- [x] Chỉ authenticated user có thể ghi vào UID của họ
- [x] Validate data structure (name, score, updatedAt)
- [x] Score chỉ có thể tăng (không giảm)

### 🐛 Common Issues & Solutions

#### Issue 1: "Firebase chưa được khởi tạo"
**Solution:** 
- Đảm bảo `firebaseService.initialize()` được gọi trong scene
- Kiểm tra async/await được sử dụng đúng

#### Issue 2: "Không thể kết nối Firebase"
**Solution:**
- Kiểm tra internet connection
- Verify Firebase config (apiKey, databaseURL, etc.)
- Check Firebase Console: Database enabled?

#### Issue 3: Realtime updates không hoạt động
**Solution:**
- Kiểm tra `subscribeToLeaderboard()` được gọi
- Verify callback function được implement
- Check console for subscription errors

#### Issue 4: Memory leak
**Solution:**
- Đảm bảo `unsubscribe()` được gọi khi scene shutdown
- Check events listener: `this.events.once('shutdown', ...)`

### ✅ Expected Console Output

**Khi khởi động game:**
```
🔥 Đang khởi tạo Firebase...
👤 Đang đăng nhập ẩn danh...
✅ Firebase khởi tạo thành công! User ID: AbC123XyZ456
```

**Khi mở Leaderboard:**
```
📊 Đã load 5 entries từ Firebase
🔄 Leaderboard update received: 5 entries
```

**Khi lưu điểm:**
```
✅ Đã lưu điểm lên Firebase: {name: "Anonymous", score: 1000, updatedAt: 1760620514283}
✅ Đã lưu điểm vào Firebase leaderboard: {score: 1000, playerName: "Anonymous"}
```

**Khi đóng Leaderboard:**
```
🔌 Đã ngắt kết nối Firebase listener
```

### 📝 Notes

- Firebase sử dụng Anonymous Authentication (không cần đăng ký)
- Mỗi user có 1 entry duy nhất (theo UID)
- Điểm chỉ update nếu cao hơn điểm cũ (theo Firebase Rules)
- Realtime updates sử dụng WebSocket
- Data persist trên cloud, không mất khi clear cache

### 🎯 Success Criteria

Tất cả các điều kiện sau phải đạt:
- ✅ Build thành công không có lỗi
- ✅ Firebase khởi tạo thành công
- ✅ Lưu điểm lên Firebase được
- ✅ Hiển thị leaderboard từ Firebase
- ✅ Realtime updates hoạt động
- ✅ Cleanup listener khi scene change
- ✅ Error handling đầy đủ
- ✅ Educational comments đầy đủ bằng tiếng Việt
