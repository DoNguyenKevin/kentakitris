# 🎮 Hướng dẫn nhanh - Gắn Leaderboard vào Game

## ✅ Đã làm xong gì?

Đã chuyển từ **Firestore** sang **Realtime Database** với:

1. ✅ Code trong `index.html` đã update xong
2. ✅ Tự động lưu high score khi game over
3. ✅ Leaderboard realtime (tự động cập nhật)
4. ✅ Chỉ lưu điểm cao hơn điểm cũ
5. ✅ Security rules chặt chẽ

## 🚀 3 bước setup (5 phút)

### Bước 1: Vào Firebase Console

Link: https://console.firebase.google.com/project/kentakitris

### Bước 2: Tạo Realtime Database

1. Menu bên trái → **Realtime Database**
2. Click **Create Database**
3. Location: Chọn **asia-southeast1** (Singapore - gần VN)
4. Security rules: Chọn **Start in test mode** (tạm thời)
5. Click **Enable**

### Bước 3: Copy Rules

1. Trong **Realtime Database**, tab **Rules**
2. Mở file `database.rules.clean.json` trong VS Code
3. Copy toàn bộ nội dung
4. Paste vào editor trong Firebase Console
5. Click **Publish**

**✅ XONG!** Game đã có leaderboard.

## 🧪 Test ngay

### Cách 1: Dùng tool test
```
Mở file: test-leaderboard.html
```
- Nhập tên và điểm
- Click Submit
- Xem leaderboard realtime

### Cách 2: Chơi game
```
Mở file: index.html
```
- Chơi game
- Khi game over → điểm tự động lưu
- Xem leaderboard bên phải

## 🔍 Kiểm tra dữ liệu

**Firebase Console** → **Realtime Database** → Tab **Data**

Sẽ thấy cấu trúc:
```
leaderboards/
  global/
    abc123xyz:
      name: "KHOI"
      score: 12345
      updatedAt: 1739162212345
```

## 🎯 Rules đang bảo vệ gì?

1. ✅ Chỉ người chơi được ghi điểm của mình
2. ✅ Điểm mới phải >= điểm cũ (không cho gian lận điểm thấp)
3. ✅ Tên: 1-20 ký tự
4. ✅ Điểm: phải >= 0
5. ✅ Chặn fields lạ

## 📱 Deploy

Khi muốn host online:

```bash
# Nếu dùng Firebase Hosting
firebase init hosting
firebase deploy --only hosting

# Hoặc upload lên Netlify/Vercel/GitHub Pages
# → Firebase config trong HTML sẽ tự động hoạt động
```

## 🐛 Nếu gặp lỗi

### "Permission denied"
- Check đã enable **Anonymous Authentication** chưa
  - Firebase Console → Authentication → Sign-in method → Anonymous → Enable

### Leaderboard trống
- Chơi thử một game để tạo dữ liệu
- Mở `test-leaderboard.html` để submit điểm thử

### Score không lưu
- Mở Console (F12) xem log
- Có thể điểm mới thấp hơn điểm cũ nên không lưu
- Check Firebase Console → Data có thấy entries không

## 📚 Files tham khảo

| File | Dùng để làm gì |
|------|---------------|
| `index.html` | Game chính (đã tích hợp sẵn) |
| `test-leaderboard.html` | Test leaderboard riêng |
| `database.rules.clean.json` | Copy vào Firebase Console |
| `REALTIME-DATABASE-SETUP.md` | Hướng dẫn chi tiết hơn |
| `README-LEADERBOARD.md` | Tổng quan tính năng |

## 🎉 Done!

Bây giờ:
- ✅ Chơi game
- ✅ Xem điểm tự động lên leaderboard
- ✅ Mở nhiều tab để thấy realtime update
- ✅ Vào Firebase Console xem data

**Enjoy!** 🚀
