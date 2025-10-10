# ✅ CHECKLIST - Setup Leaderboard

## 📝 Trước khi bắt đầu
- [x] Code đã chuyển sang Realtime Database
- [x] Files hướng dẫn đã tạo
- [x] Test tool đã sẵn sàng

## 🔧 Firebase Setup (5 phút)

### Step 1: Realtime Database
- [ ] Mở https://console.firebase.google.com/project/kentakitris
- [ ] Click **Realtime Database** (menu bên trái)
- [ ] Click **Create Database**
- [ ] Chọn location: **asia-southeast1**
- [ ] Chọn mode: **Start in test mode**
- [ ] Click **Enable**
- [ ] Đợi database được tạo (~30s)

### Step 2: Authentication
- [ ] Click **Authentication** (menu bên trái)
- [ ] Tab **Sign-in method**
- [ ] Tìm **Anonymous**
- [ ] Click vào Anonymous
- [ ] Toggle **Enable**
- [ ] Click **Save**

### Step 3: Security Rules
- [ ] Quay lại **Realtime Database**
- [ ] Click tab **Rules**
- [ ] Mở file `database.rules.clean.json` trong VS Code
- [ ] Copy toàn bộ (Ctrl+A, Ctrl+C)
- [ ] Paste vào Firebase Console (xóa nội dung cũ)
- [ ] Click **Publish**
- [ ] Confirm khi có popup warning

### Step 4: Verify Setup
- [ ] Tab **Data** - xem structure (đang trống)
- [ ] Tab **Rules** - xem rules đã publish
- [ ] Tab **Usage** - confirm database active

## 🧪 Testing (10 phút)

### Test 1: Chơi game
- [ ] Mở file `index.html` trong browser
- [ ] Check **User ID display** hiện Player name hoặc ID
- [ ] Chơi game và đạt một số điểm
- [ ] Khi game over, nhập tên (nếu chưa có)
- [ ] Click **SAVE SCORE**
- [ ] Check **Leaderboard** bên phải hiển thị score của bạn

### Test 2: Firebase Console
- [ ] Mở Firebase Console → Realtime Database → Data
- [ ] Thấy: `leaderboards/global/{uid}`
- [ ] Click vào uid → xem name, score, updatedAt
- [ ] Values match với test tool

### Test 3: Chơi lại với score cao hơn
- [ ] Chơi game lại và đạt điểm cao hơn
- [ ] Click Submit
- [ ] Check status = 🎉 New high score! 2000 (Previous: 1000)
- [ ] Leaderboard update tự động
- [ ] Firebase Console data updated

### Test 4: Thử score thấp hơn (anti-cheat)
- [ ] Nhập score: `500`
- [ ] Click Submit
- [ ] Check status = ⚠️ Score not higher than your best
- [ ] Score trong DB vẫn là 2000 (không đổi)

### Test 5: Realtime sync
- [ ] Mở test tool ở 2 tabs
- [ ] Tab 1: submit score mới
- [ ] Tab 2: leaderboard tự động update (không cần refresh!)

### Test 6: Game thật
- [ ] Mở `index.html` trong browser
- [ ] Check leaderboard bên phải hiển thị scores từ test
- [ ] Click **START**
- [ ] Chơi game
- [ ] Game over
- [ ] Score tự động lên leaderboard
- [ ] Highlight màu vàng (current user)

## 🔍 Validation

### Data Structure
```
leaderboards/
  global/
    <uid1>:
      name: "TEST1"
      score: 2000
      updatedAt: 1739162212345
    <uid2>:
      ...
```

### Rules Work?
- [ ] Không ghi được vào UID người khác
- [ ] Score thấp không ghi đè score cao
- [ ] Name > 20 ký tự bị reject
- [ ] Score âm bị reject

### UI/UX
- [ ] Leaderboard top 10
- [ ] Sorted by score descending
- [ ] Current user highlighted (vàng)
- [ ] Realtime updates
- [ ] Responsive (mobile/desktop)

## 🐛 Troubleshooting

### ❌ "Permission denied"
- [ ] Check Anonymous auth enabled?
- [ ] Check rules published?
- [ ] Check auth state: console.log(window.userId)
- [ ] Try clear browser cache

### ❌ Leaderboard không hiển thị
- [ ] F12 → Console có errors?
- [ ] Firebase Console → Data có entries?
- [ ] Check internet connection
- [ ] Try reload page

### ❌ Score không lưu
- [ ] Console.log trong saveScore()?
- [ ] Điểm mới có > điểm cũ?
- [ ] Firebase Console → Data update?
- [ ] Check rules trong Firebase

### ❌ Realtime không hoạt động
- [ ] Test tool: submit ở tab khác
- [ ] Check Network tab (WebSocket connection)
- [ ] Firebase Console → Usage có activity?

## 📊 Performance Check

### Firebase Usage (Console → Realtime Database → Usage)
- [ ] Connections: 1-10 (normal)
- [ ] Bandwidth: < 100KB (normal)
- [ ] Storage: < 1MB (normal)

### Browser Performance (F12 → Network)
- [ ] Initial load: < 2s
- [ ] Firebase script: loaded
- [ ] WebSocket: connected

## 🎉 Final Verification

### Functional
- [x] Auth works (Anonymous)
- [ ] Save score works
- [ ] High score only
- [ ] Realtime updates
- [ ] Top 10 display
- [ ] Current user highlight

### Security
- [ ] Rules block unauthorized writes
- [ ] Rules validate data
- [ ] Rules enforce score increase
- [ ] No one can write to others' data

### UX
- [ ] Fast (<2s load)
- [ ] Responsive
- [ ] Visual feedback
- [ ] Error handling

## 🚀 Ready for Production?

### Before deploy:
- [ ] Test trên nhiều browsers (Chrome, Firefox, Safari)
- [ ] Test trên mobile
- [ ] Test với nhiều users đồng thời
- [ ] Check Firebase quotas (should be well under free tier)
- [ ] (Optional) Enable App Check
- [ ] (Optional) Add analytics

### Deploy:
```bash
# Option 1: Firebase Hosting
firebase init hosting
firebase deploy --only hosting

# Option 2: Other hosting
# Just upload files - Firebase config works from anywhere
```

### Post-deploy:
- [ ] Test production URL
- [ ] Monitor Firebase Console → Usage
- [ ] Check for errors in Console logs
- [ ] Get feedback from users

## 📈 Next Level (Optional)

- [ ] Enable App Check (chống bot)
- [ ] Add Cloud Functions (validate game logic)
- [ ] Rate limiting (1 submit/minute)
- [ ] Player profiles & avatars
- [ ] Multiple leaderboards (daily/weekly/monthly)
- [ ] Achievements system
- [ ] Social features (share scores)

---

## ✅ ALL DONE?

Nếu tất cả checked:
1. 🎉 **Chúc mừng! Leaderboard đã hoạt động!**
2. 🚀 Deploy và share game với bạn bè
3. 📊 Monitor usage trong Firebase Console
4. 💬 Thu thập feedback để improve

**Have fun!** 🎮
