# 🎮 Keltris - Tetris với Firebase Realtime Database Leaderboard

## 🚀 Quick Start

### 1. Setup Firebase (5 phút)

1. Vào [Firebase Console](https://console.firebase.google.com)
2. Project: **kentakitris**
3. **Realtime Database** → Create DB → Region: **asia-southeast1** → Test mode
4. **Authentication** → Sign-in method → Enable **Anonymous**
5. **Realtime Database** → Tab **Rules** → Copy từ `database.rules.clean.json` → Publish

### 2. Chạy Game

Mở file: **`index.html`**

- Chơi game → Game over → Score tự động lưu
- Leaderboard tự động cập nhật
- Xem leaderboard realtime updates

## 📁 Files

| File | Mô tả |
|------|-------|
| `index.html` | Game chính (đã tích hợp Realtime DB) |
| `database.rules.json` | Security Rules (có comments) |
| `database.rules.clean.json` | Security Rules (clean, copy vào Firebase) |
| `REALTIME-DATABASE-SETUP.md` | Hướng dẫn chi tiết đầy đủ |

## 🔒 Bảo mật

### Rules đã implement:
- ✅ Chỉ user được ghi vào doc của mình (`auth.uid === $uid`)
- ✅ Score mới phải >= score cũ (chống fake điểm thấp)
- ✅ Validate: name (1-20 ký tự), score >= 0
- ✅ Chặn fields không hợp lệ

### Cấu trúc dữ liệu:
```
leaderboards/global/{uid}/
  ├── name: string (1-20 chars)
  ├── score: number (>= 0)
  └── updatedAt: timestamp
```

## 🎯 Tính năng

- [x] **Realtime updates** - Leaderboard tự động cập nhật
- [x] **Top 10 high scores** - Sắp xếp theo điểm
- [x] **Personal best** - Chỉ lưu điểm cao nhất
- [x] **Highlight current user** - Tô vàng người chơi hiện tại
- [x] **Anonymous auth** - Không cần đăng ký
- [x] **Player names** - Lưu trong localStorage

## 📊 Test Cases

### Test 1: Submit điểm mới (lần đầu)
```
Input: name="TEST", score=1000
Expected: ✅ Saved
Result in DB: { name: "TEST", score: 1000, updatedAt: ... }
```

### Test 2: Submit điểm cao hơn
```
Current: score=1000
Input: score=2000
Expected: ✅ Updated to 2000
```

### Test 3: Submit điểm thấp hơn
```
Current: score=2000
Input: score=500
Expected: ⚠️ Not saved (current best: 2000)
```

### Test 4: Ghi vào UID người khác (hacker)
```
Try: write to /leaderboards/global/{otherUID}
Expected: ❌ Permission denied (rules blocked)
```

## 🐛 Debug

### Check auth:
```javascript
console.log(window.userId);
console.log(window.auth.currentUser);
```

### Manual submit:
```javascript
await window.saveScore(12345);
```

### Check Firebase Console:
1. Realtime Database → Data tab
2. Path: `leaderboards/global`
3. Xem entries đã lưu

## 🔧 Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| "Permission denied" | Check Anonymous auth đã enable + Rules đã publish |
| Leaderboard không hiện | F12 → Console xem errors, check Firebase Data có entries không |
| Score không lưu | Check điểm mới có > điểm cũ không, xem console.log |

## 📈 Next Steps (Optional)

- [ ] **App Check** - Chặn bot/script ngoài
- [ ] **Cloud Functions** - Validate logic game (thời gian, level...)
- [ ] **Rate limiting** - Giới hạn submit/phút trong rules
- [ ] **Player profiles** - Avatar, stats, history
- [ ] **Seasons/Events** - Leaderboard theo tuần/tháng

## 📚 Documentation

Đọc hướng dẫn đầy đủ: **`REALTIME-DATABASE-SETUP.md`**

## ✅ Checklist

- [ ] Tạo Realtime Database (asia-southeast1)
- [ ] Enable Anonymous Authentication
- [ ] Publish Security Rules
- [ ] Test `index.html` (chơi game và kiểm tra leaderboard)
- [ ] Check Firebase Console → Data
- [ ] (Optional) Enable App Check
- [ ] Deploy

## 🎉 Demo

- Game chính: `index.html`
- Phiên bản modular (thay thế): `index-modular.html`

## 📞 Support

Nếu gặp vấn đề:
1. Check browser Console (F12)
2. Check Firebase Console → Realtime Database → Data
3. Check Firebase Console → Realtime Database → Rules
4. Xem logs trong Console tab của Firebase

---

**Made with ❤️ using Firebase Realtime Database**
