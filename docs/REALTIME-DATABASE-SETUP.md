# 🎮 Hướng dẫn Setup Leaderboard với Realtime Database

## ✅ Đã làm gì?

1. **Chuyển từ Firestore sang Realtime Database**
   - Sử dụng Firebase Realtime Database SDK
   - Cấu trúc dữ liệu: `leaderboards/global/{uid}`
   - Mỗi user có 1 document duy nhất (tránh spam)

2. **Tính năng**
   - ✅ Chỉ lưu điểm cao nhất (so sánh với điểm cũ)
   - ✅ Real-time updates (leaderboard tự động cập nhật)
   - ✅ Top 10 high scores
   - ✅ Highlight user hiện tại
   - ✅ Anonymous Authentication
   - ✅ Player name từ localStorage (hoặc short UID)

## 📋 Các bước setup trên Firebase Console

### Bước 1: Bật Realtime Database

1. Vào [Firebase Console](https://console.firebase.google.com)
2. Chọn project **kentakitris**
3. Sidebar → **Build** → **Realtime Database**
4. Click **Create Database**
5. Chọn location: **asia-southeast1** (Singapore - gần VN nhất)
6. Chọn mode: **Start in test mode** (tạm thời)
7. Click **Enable**

### Bước 2: Bật Anonymous Authentication

1. Sidebar → **Build** → **Authentication**
2. Tab **Sign-in method**
3. Click **Anonymous**
4. Toggle **Enable**
5. Click **Save**

### Bước 3: Cấu hình Security Rules

1. Trong **Realtime Database**
2. Tab **Rules**
3. Copy toàn bộ nội dung từ file `database.rules.json`
4. Paste vào editor
5. Click **Publish**

**Rules này sẽ:**
- ✅ Chỉ cho phép user ghi vào document của chính mình (bảo mật theo `auth.uid`)
- ✅ Validate dữ liệu (name, score, updatedAt hợp lệ)
- ✅ **Chỉ cho phép cập nhật nếu score mới >= score cũ** (chống gian lận cơ bản)
- ✅ Giới hạn tên người chơi: 1-20 ký tự
- ✅ Score phải >= 0

### Bước 4: (Tùy chọn) Bật App Check - Chống bot/hack

1. Sidebar → **Build** → **App Check**
2. Click **Get started**
3. Chọn **reCAPTCHA Enterprise** (hoặc reCAPTCHA v3)
4. Register site → nhập domain của bạn
5. Copy site key và secret key
6. Enable enforcement cho **Realtime Database**

## 🎯 Cấu trúc dữ liệu

```
leaderboards/
  global/
    <uid-1>:
      name: "KHOI"
      score: 12345
      updatedAt: 1739162212345
    <uid-2>:
      name: "PLAYER2"
      score: 9876
      updatedAt: 1739162212346
    ...
```

### Ưu điểm cấu trúc này:
- **1 user = 1 document** → tránh spam nhiều điểm
- **Key = uid** → dễ query, dễ update
- **updatedAt** → track thời gian (có thể dùng để rate-limit)

## 🔒 Bảo mật đã implement

### 1. ✅ Rules validation
- Chỉ user mới được ghi vào doc của mình
- Score mới phải >= score cũ (chống fake điểm thấp)
- Validate data type và giới hạn

### 2. ✅ Client-side checks
```javascript
// Trong saveScore()
if (!existingData || finalScore > existingData.score) {
    // Chỉ lưu nếu điểm cao hơn
}
```

### 3. 🔸 Cần thêm (optional)
- **App Check**: Chặn request từ ngoài app
- **Cloud Functions**: Validate logic game (thời gian chơi, level...)
- **Rate limiting**: Giới hạn số lần submit/phút

## 🎮 Cách sử dụng trong game

### Tự động
- Khi game over → tự động gọi `window.saveScore(score)`
- Leaderboard tự động cập nhật real-time

### Thêm tính năng tên người chơi

Thêm vào HTML (trước game board):

```html
<div class="pixel-border p-4 mb-4">
  <label class="text-yellow-500 text-sm">YOUR NAME</label>
  <input 
    id="player-name-input" 
    type="text" 
    maxlength="20" 
    placeholder="Enter name..."
    class="w-full p-2 mt-2 bg-gray-900 border-2 border-gray-600 text-white"
  />
</div>
```

Thêm script lưu tên:

```javascript
const nameInput = document.getElementById('player-name-input');
nameInput.value = localStorage.getItem('playerName') || '';
nameInput.addEventListener('change', (e) => {
  localStorage.setItem('playerName', e.target.value);
});
```

## 📊 Test & Debug

### Test rules trong Firebase Console
1. Tab **Rules** → **Rules Playground**
2. Test scenarios:
   - Read: location `/leaderboards/global` → Authenticated ✅
   - Write: location `/leaderboards/global/{myUid}` → Authenticated ✅
   - Write: location `/leaderboards/global/{otherUid}` → ❌

### Check data
1. Tab **Data**
2. Xem structure: `leaderboards/global`
3. Xem scores đã lưu

### Browser console
```javascript
// Check auth
console.log(window.userId);

// Manual save score
await window.saveScore(99999);

// Check database reference
console.log(window.db);
```

## 🚀 Deployment

Khi deploy lên hosting:

1. **Firebase Hosting**:
   ```bash
   firebase init hosting
   firebase deploy --only hosting
   ```

2. **Hoặc hosting khác** (Netlify, Vercel...):
   - Upload files
   - Firebase config trong HTML sẽ tự động hoạt động

## 🐛 Troubleshooting

### Lỗi "Permission denied"
- ✅ Check đã bật Anonymous Auth
- ✅ Check rules đã publish đúng
- ✅ Check auth state: `console.log(window.auth.currentUser)`

### Leaderboard không hiện
- ✅ Check browser console có errors
- ✅ Check Firebase Console → Data có entries không
- ✅ Thử refresh page

### Score không lưu
- ✅ Check console.log trong `saveScore()`
- ✅ Check rules validation message
- ✅ Check điểm mới có > điểm cũ không

## 📈 Tối ưu thêm (optional)

### 1. Cloud Function để validate score
```javascript
// functions/index.js
exports.submitScore = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  const { score, playTime, level } = data;
  
  // Validate logic
  if (score / playTime > 100) {
    throw new functions.https.HttpsError('invalid-argument', 'Score too high for time');
  }
  
  // Save to database
  await admin.database().ref(`leaderboards/global/${uid}`).set({
    name: data.name,
    score: score,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  });
});
```

### 2. Rate limiting trong rules
```json
{
  "rules": {
    "leaderboards": {
      "global": {
        "$uid": {
          ".write": "auth != null && auth.uid === $uid && (!data.exists() || data.child('updatedAt').val() + 60000 < now)"
        }
      }
    }
  }
}
```
(Chỉ cho phép update sau 60 giây)

### 3. Thêm metadata
```javascript
{
  name: "KHOI",
  score: 12345,
  updatedAt: Date.now(),
  level: 10,           // Level đạt được
  lines: 50,           // Số dòng xóa
  playTime: 180000     // Thời gian chơi (ms)
}
```

## ✅ Checklist triển khai

- [x] Tạo Firebase project
- [ ] Bật Realtime Database (asia-southeast1)
- [ ] Bật Anonymous Authentication
- [ ] Copy & publish Security Rules từ `database.rules.json`
- [ ] Test game → game over → check console
- [ ] Check Firebase Console → Data → xem score đã lưu
- [ ] Test leaderboard realtime (mở 2 tab)
- [ ] (Optional) Bật App Check
- [ ] (Optional) Deploy Cloud Functions
- [ ] Deploy lên hosting

## 🎉 Done!

Game đã có leaderboard với:
- ✅ Realtime updates
- ✅ Bảo mật cơ bản
- ✅ Chống spam
- ✅ Top 10 high scores
- ✅ Highlight current user

Chơi thử và kiểm tra Firebase Console để xem dữ liệu!
