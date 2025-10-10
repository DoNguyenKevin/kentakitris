# Bài 5: Leaderboard và Firebase

## 🎯 Mục tiêu bài học
- Hiểu Leaderboard (bảng xếp hạng) là gì
- Hiểu Firebase là gì và tại sao dùng nó
- Tìm hiểu cách lưu điểm lên internet
- Hiểu cách hiển thị top 10 người chơi

---

## 🏆 Leaderboard là gì?

**Leaderboard** (bảng xếp hạng) = danh sách người chơi giỏi nhất!

Giống như bảng thành tích trong trường:
- Top 1: Người điểm cao nhất
- Top 2: Người điểm cao thứ hai
- ...
- Top 10: Người điểm cao thứ mười

### Ví dụ Leaderboard

```
🏆 TOP 10 - KELTRIS

#1  KHOI    5000 điểm  ⭐
#2  MINH    4500 điểm
#3  AN      4200 điểm
#4  LINH    3800 điểm
#5  NAM     3500 điểm
...
```

---

## ☁️ Firebase là gì?

**Firebase** = dịch vụ lưu trữ dữ liệu trên internet (của Google)

Tưởng tượng Firebase như **kho chứa đồ trên mây**:
- Bạn gửi dữ liệu lên → Firebase lưu giữ
- Bạn muốn lấy dữ liệu → Firebase gửi về
- Ai cũng có thể xem (nếu được phép)

### Tại sao dùng Firebase?

**Không có Firebase:**
- Điểm chỉ lưu trên máy bạn (localStorage)
- Bạn bè không thấy điểm của bạn
- Xóa cache → mất điểm

**Có Firebase:**
- Điểm lưu trên internet
- Mọi người đều thấy bảng xếp hạng chung
- Không bao giờ mất (trừ khi xóa)

---

## 📤 Lưu điểm lên Firebase

File: `js/index-game.js` (hoặc `js/leaderboard.js`)

### Bước 1: Chuẩn bị dữ liệu

```javascript
// Dữ liệu cần lưu
const playerData = {
    playerName: "KHOI",           // Tên người chơi
    score: 5000,                   // Điểm số
    lines: 50,                     // Số hàng đã xóa
    level: 6,                      // Cấp độ đạt được
    timestamp: Date.now()          // Thời gian (milliseconds)
};
```

### Bước 2: Gửi lên Firebase

```javascript
async function saveScore(playerData) {
    try {
        // 1. Lấy reference đến Realtime Database
        const db = firebase.database();
        
        // 2. Chọn vị trí lưu: leaderboards/global/{userId}
        const ref = db.ref(`leaderboards/global/${userId}`);
        
        // 3. Gửi dữ liệu lên (set = ghi đè)
        await ref.set(playerData);
        
        console.log("✅ Lưu điểm thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi lưu:", error);
    }
}
```

### Giải thích

**`firebase.database()`**: Kết nối đến kho dữ liệu
**`ref(...)`**: Chọn "ngăn tủ" để lưu
**`set(...)`**: Ghi dữ liệu vào ngăn tủ đó
**`await`**: Chờ cho đến khi xong (vì mạng chậm)

---

## 📥 Lấy dữ liệu từ Firebase

### Lấy Top 10

```javascript
async function loadLeaderboard() {
    try {
        // 1. Kết nối đến database
        const db = firebase.database();
        const ref = db.ref('leaderboards/global');
        
        // 2. Sắp xếp theo điểm, lấy 10 người cao nhất
        const snapshot = await ref
            .orderByChild('score')  // Sắp xếp theo điểm
            .limitToLast(10)        // Lấy 10 người cuối (điểm cao nhất)
            .once('value');         // Đọc 1 lần
        
        // 3. Chuyển dữ liệu thành mảng
        const data = snapshot.val();
        const leaderboard = [];
        
        for (let userId in data) {
            leaderboard.push({
                userId: userId,
                name: data[userId].playerName,
                score: data[userId].score,
                lines: data[userId].lines,
                level: data[userId].level
            });
        }
        
        // 4. Đảo ngược (cao nhất lên đầu)
        leaderboard.reverse();
        
        return leaderboard;
    } catch (error) {
        console.error("❌ Lỗi khi tải:", error);
        return [];
    }
}
```

---

## 🎨 Hiển thị Leaderboard

File: `js/leaderboard.js`

```javascript
function renderLeaderboard(data) {
    const container = document.getElementById('leaderboard-list');
    container.innerHTML = ''; // Xóa nội dung cũ
    
    data.forEach((entry, index) => {
        // Tạo 1 hàng trong bảng
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        
        // Thêm icon cho top 3
        let medal = '';
        if (index === 0) medal = '🥇';
        else if (index === 1) medal = '🥈';
        else if (index === 2) medal = '🥉';
        
        // Nội dung hàng
        row.innerHTML = `
            <span class="rank">#${index + 1} ${medal}</span>
            <span class="name">${entry.name}</span>
            <span class="score">${entry.score}</span>
        `;
        
        // Tô vàng nếu là người chơi hiện tại
        if (entry.userId === currentUserId) {
            row.classList.add('highlight');
        }
        
        container.appendChild(row);
    });
}
```

---

## 🔄 Cập nhật Real-time

Firebase có thể tự động cập nhật khi có thay đổi!

```javascript
function listenToLeaderboard() {
    const db = firebase.database();
    const ref = db.ref('leaderboards/global');
    
    // Lắng nghe sự kiện 'value' (khi dữ liệu thay đổi)
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log("📊 Dữ liệu đã cập nhật!");
        
        // Xử lý và hiển thị dữ liệu mới
        const leaderboard = processData(data);
        renderLeaderboard(leaderboard);
    });
}
```

**Khi nào cập nhật?**
- Có người chơi mới lưu điểm
- Có người cập nhật điểm cũ
- Có người xóa dữ liệu

**Không cần refresh trang!** Firebase tự động gửi thông báo.

---

## 🎮 Thử nghiệm

### Thử nghiệm 1: Xem dữ liệu Firebase

1. Mở [Firebase Console](https://console.firebase.google.com/)
2. Chọn project "kentakitris"
3. Vào **Realtime Database**
4. Xem cấu trúc dữ liệu:

```
leaderboards/
  └─ global/
      ├─ user123/
      │   ├─ playerName: "KHOI"
      │   ├─ score: 5000
      │   └─ lines: 50
      ├─ user456/
      │   ├─ playerName: "MINH"
      │   ├─ score: 4500
      │   └─ lines: 45
      ...
```

### Thử nghiệm 2: Lưu điểm thủ công

Mở Console và gõ:

```javascript
// Lưu điểm thử nghiệm
saveScore({
    playerName: "TEST",
    score: 9999,
    lines: 99,
    level: 10,
    timestamp: Date.now()
});
```

Kiểm tra Firebase Console để thấy dữ liệu mới!

---

## ❓ Câu hỏi kiểm tra

1. **Leaderboard là gì?**
   - A. Bàn phím game
   - B. Bảng xếp hạng ✅
   - C. Màn hình game

2. **Firebase lưu dữ liệu ở đâu?**
   - A. Trên máy tính của bạn
   - B. Trên internet (cloud) ✅
   - C. Trong trình duyệt

3. **`set()` làm gì?**
   - A. Xóa dữ liệu
   - B. Ghi dữ liệu ✅
   - C. Đọc dữ liệu

4. **`on('value', ...)` làm gì?**
   - A. Đọc 1 lần rồi dừng
   - B. Lắng nghe thay đổi liên tục ✅
   - C. Xóa dữ liệu

5. **Top 1 là người nào?**
   - A. Người chơi đầu tiên
   - B. Người điểm cao nhất ✅
   - C. Người chơi gần đây nhất

---

## 🏠 Bài tập về nhà

### Bài 1: Vẽ sơ đồ

Vẽ sơ đồ luồng dữ liệu:
1. Người chơi game over
2. Code lưu điểm lên Firebase
3. Firebase lưu giữ
4. Người chơi khác tải leaderboard
5. Leaderboard hiển thị

### Bài 2: Tính toán

Nếu có 100 người chơi, nhưng chỉ hiển thị top 10:
- Có bao nhiêu người KHÔNG nằm trong top 10?
- Làm sao để vào top 10?

### Bài 3: Thử nghiệm (nâng cao)

Viết hàm tìm vị trí của mình trong leaderboard:

```javascript
function findMyRank(leaderboard, myUserId) {
    for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].userId === myUserId) {
            return i + 1; // Vị trí (bắt đầu từ 1)
        }
    }
    return -1; // Không tìm thấy
}

// Thử nghiệm
const rank = findMyRank(leaderboard, window.userId);
console.log("Tôi đang ở hạng:", rank);
```

---

## 🎓 Tóm tắt

- **Leaderboard** = bảng xếp hạng người chơi giỏi
- **Firebase** = dịch vụ lưu trữ dữ liệu trên cloud
- **Lưu điểm**: `ref.set(data)`
- **Lấy dữ liệu**: `ref.once('value')` hoặc `ref.on('value')`
- **Real-time**: Firebase tự động cập nhật khi có thay đổi
- **Top 10**: Sắp xếp theo điểm, lấy 10 người cao nhất

---

## 📚 Bài tiếp theo

[Exercises - Bài tập tổng hợp](exercises.md)

Trong phần tiếp theo:
- Bài tập thực hành cho từng bài học
- Mini-projects để áp dụng kiến thức
- Thử thách nâng cao
