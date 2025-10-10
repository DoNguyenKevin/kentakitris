# 🧪 Test Tính năng Nhập tên

## Quick Test Steps

### Test 1: Lần đầu chơi (3 phút)

1. **Xóa localStorage** (để test như user mới)
   ```javascript
   // F12 Console:
   localStorage.clear();
   ```

2. **Chơi game**
   - Mở `index.html`
   - Click START
   - Chơi đến Game Over (hoặc để rơi nhanh)

3. **Kiểm tra Modal**
   - ✅ Modal hiện ra
   - ✅ Hiển thị score
   - ✅ Input field cho phép nhập
   - ✅ Placeholder text "Your name (max 20 chars)"
   - ✅ Message: "* Chỉ được đổi tên 1 lần/ngày"

4. **Nhập tên**
   - Nhập: `KHOI`
   - Click "💾 SAVE SCORE"
   - ✅ Loading: "⏳ Saving..."
   - ✅ Success: "✅ Score saved: ..."
   - ✅ Modal tự động đóng sau 2s

5. **Verify localStorage**
   ```javascript
   // F12 Console:
   localStorage.getItem('playerName')        // → "KHOI"
   localStorage.getItem('lastNameChangeDate') // → "2025-10-10"
   ```

6. **Check Firebase**
   - Firebase Console → Realtime Database → Data
   - Tìm uid của bạn
   - ✅ name = "KHOI"
   - ✅ score = điểm vừa chơi

---

### Test 2: Chơi lại ngay (2 phút)

1. **Chơi game lần 2**
   - Click RESTART hoặc refresh page
   - Click START → Chơi → Game Over

2. **Kiểm tra Modal**
   - ✅ Modal hiện ra
   - ✅ Hiển thị score
   - ✅ **Input field KHÔNG hiện** (bị hide)
   - ✅ Hiện "Playing as: KHOI"
   - ✅ Hiện "🔒 Bạn đã đặt tên hôm nay..."
   - ✅ Không cho phép sửa tên

3. **Save score**
   - Click "💾 SAVE SCORE"
   - ✅ Score saved với tên "KHOI" (không đổi)
   - Modal đóng

4. **Check Firebase**
   - Score có thể update nếu cao hơn
   - Name vẫn là "KHOI"

---

### Test 3: Ngày mới (simulate) (3 phút)

1. **Fake ngày cũ**
   ```javascript
   // F12 Console:
   localStorage.setItem('lastNameChangeDate', '2025-10-09');
   ```

2. **Refresh page và chơi**
   - Refresh `index.html`
   - Chơi → Game Over

3. **Kiểm tra Modal**
   - ✅ Input field lại hiện ra!
   - ✅ Pre-fill với "KHOI"
   - ✅ Cho phép sửa

4. **Đổi tên mới**
   - Sửa thành: `KEVIN`
   - Click "💾 SAVE SCORE"
   - ✅ Success message
   - Modal đóng

5. **Verify**
   ```javascript
   localStorage.getItem('playerName')        // → "KEVIN"
   localStorage.getItem('lastNameChangeDate') // → "2025-10-10" (hôm nay)
   ```

6. **Check Firebase**
   - name = "KEVIN" (đã update)

---

### Test 4: Validation (2 phút)

1. **Tên quá dài**
   - Clear localStorage
   - Chơi → Game Over
   - Nhập tên: `THISNAMEISWAYTOOOLONG123456789`
   - Click Save
   - ✅ Error: "❌ Name too long (max 20 characters)"
   - ✅ Modal KHÔNG đóng

2. **Tên rỗng**
   - Để trống input
   - Click Save
   - ✅ Score vẫn được lưu
   - ✅ Dùng fallback name (short UID)

3. **Tên hợp lệ**
   - Nhập: `ABC`
   - Click Save
   - ✅ Success

---

### Test 5: Skip Save (1 phút)

1. **Chơi game**
   - Chơi → Game Over

2. **Click SKIP**
   - Click nút "SKIP"
   - ✅ Modal đóng ngay
   - ✅ Score KHÔNG được lưu vào Firebase

3. **Verify**
   - Firebase không có entry mới

---

### Test 6: Click Outside (30s)

1. **Chơi game**
   - Chơi → Game Over
   - Modal hiện ra

2. **Click nền đen (outside modal)**
   - Click vào vùng đen bên ngoài modal
   - ✅ Modal đóng

---

### Test 7: Responsive (Mobile) (2 phút)

1. **Chrome DevTools**
   - F12 → Toggle device toolbar (Ctrl+Shift+M)
   - Chọn iPhone/Android

2. **Chơi game**
   - Dùng touch controls
   - Game Over

3. **Check Modal**
   - ✅ Modal responsive, không bị overflow
   - ✅ Font size nhỏ hơn (readable)
   - ✅ Buttons vừa với màn hình
   - ✅ Input field dễ tap

---

### Test 8: Firebase Rules (Advanced)

1. **Try hack (Console)**
   ```javascript
   // F12 Console - Try ghi vào UID khác
   import("https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js")
     .then(async ({ ref, set }) => {
       const fakeUid = 'otherUserUID123';
       await set(ref(window.db, `leaderboards/global/${fakeUid}`), {
         name: "HACKER",
         score: 999999,
         updatedAt: Date.now()
       });
     });
   ```

2. **Expected**
   - ✅ Error: "Permission denied"
   - ✅ Firebase rules block write to other UIDs

---

## 🎯 Expected Behavior Summary

| Scenario | Input Visible? | Can Edit? | Name Used |
|----------|---------------|-----------|-----------|
| First time | ✅ | ✅ | New name |
| Same day | ❌ | ❌ | Locked name |
| Next day | ✅ | ✅ | Can change |
| Skip save | N/A | N/A | Not saved |

## 🐛 Common Issues

### Modal không hiện
- Check console có errors?
- Check `nameModal` element exists?
- Try: `document.getElementById('name-modal').classList`

### Tên không lưu
- Check localStorage: `localStorage.getItem('playerName')`
- Check Firebase Console → Data
- Check console logs

### Vẫn cho đổi tên (không lock)
- Check `lastNameChangeDate`: `localStorage.getItem('lastNameChangeDate')`
- Compare với today: `new Date().toISOString().split('T')[0]`
- If different → allowed (expected)

### Date logic sai
- localStorage stores YYYY-MM-DD format
- Compare as string (works correctly)
- Timezone không ảnh hưởng (chỉ compare date string)

---

## ✅ Success Criteria

Nếu tất cả tests pass:
- ✅ Modal hiện sau game over
- ✅ Chỉ đổi tên 1 lần/ngày
- ✅ Validation hoạt động (max 20 chars)
- ✅ Save vào Firebase với tên đúng
- ✅ Skip button hoạt động
- ✅ Click outside đóng modal
- ✅ Responsive trên mobile
- ✅ Firebase rules bảo vệ

**🎉 Feature hoàn chỉnh!**

---

## 🔄 Reset để test lại

```javascript
// F12 Console:

// Reset localStorage
localStorage.clear();

// Hoặc chỉ reset name
localStorage.removeItem('playerName');
localStorage.removeItem('lastNameChangeDate');

// Reset ngày (để test ngày mới)
localStorage.setItem('lastNameChangeDate', '2025-01-01');
```

---

**Happy Testing!** 🚀
