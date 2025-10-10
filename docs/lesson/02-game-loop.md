# Bài 2: Game Loop - Vòng lặp game

## 🎯 Mục tiêu bài học
- Hiểu vòng lặp (loop) là gì
- Hiểu game chạy như thế nào mỗi giây
- Tìm hiểu về `gameTick()` - nhịp đập của game
- Hiểu về tốc độ game và level

---

## 🔄 Vòng lặp là gì?

**Vòng lặp (Loop)** = làm đi làm lại một việc nhiều lần!

### Ví dụ trong cuộc sống

Khi bạn hít thở:
1. Hít vào
2. Thở ra
3. Lặp lại bước 1

Khi đi bộ:
1. Bước chân trái
2. Bước chân phải
3. Lặp lại bước 1

### Ví dụ trong code

```javascript
// Vòng lặp đơn giản
for (let i = 0; i < 5; i++) {
    console.log("Lần thứ " + i);
}

// Kết quả:
// Lần thứ 0
// Lần thứ 1
// Lần thứ 2
// Lần thứ 3
// Lần thứ 4
```

---

## 🎮 Game Loop trong Tetris

Game Tetris cũng có vòng lặp! Mỗi giây, game làm những việc này:

```
1. Kiểm tra: Đang chơi không?
2. Kiểm tra: Có tạm dừng không?
3. Di chuyển mảnh xuống 1 ô
4. Kiểm tra: Mảnh có chạm đáy không?
   - Nếu CHẠM → Khóa mảnh, xóa hàng đầy, tạo mảnh mới
   - Nếu CHƯA CHẠM → Vẽ lại màn hình
5. Chờ một chút (1000ms = 1 giây)
6. Quay lại bước 1
```

### Hình minh họa

```
┌─────────────────┐
│  Game đang chạy │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Di chuyển xuống │ ←────┐
└────────┬────────┘       │
         │                │
         ▼                │
┌─────────────────┐       │
│ Chạm đáy chưa?  │       │
└────┬───────┬────┘       │
     │       │            │
   Có│       │Chưa        │
     │       └────────────┘
     ▼
┌─────────────────┐
│ Khóa mảnh,      │
│ Xóa hàng,       │
│ Tạo mảnh mới    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Chờ 1 giây      │
└────────┬────────┘
         │
         └──────────────────┐
                            │
                          Lặp lại
```

---

## 🕐 Hàm `gameTick()` - Nhịp đập của game

File: `js/game-controls.js`

```javascript
export function gameTick(forceLock = false) {
    // 1. Kiểm tra game có đang chạy không
    if (!isPlaying || isPaused) return;

    // 2. Thử di chuyển mảnh xuống 1 ô
    const moved = movePiece(0, 1);

    // 3. Nếu không di chuyển được → chạm đáy!
    if (!moved || forceLock) {
        lockPiece(currentPiece);     // Khóa mảnh vào board
        clearLines();                 // Xóa hàng đầy (nếu có)
        
        // Tạo mảnh mới
        const canContinue = spawnNextPiece();
        
        // Nếu mảnh mới bị chặn → Game Over
        if (!canContinue) {
            endGameCallback();
            return;
        }
        
        drawBoard();      // Vẽ lại màn hình
        drawNextPiece();  // Vẽ mảnh tiếp theo
    }
}
```

### Giải thích từng bước

**Bước 1**: Kiểm tra điều kiện
- `isPlaying` = game đang chạy không?
- `isPaused` = game đang tạm dừng không?
- Nếu không chạy hoặc đang dừng → thoát hàm

**Bước 2**: Di chuyển xuống
- `movePiece(0, 1)` = di chuyển mảnh xuống 1 ô
- Trả về `true` nếu thành công, `false` nếu chạm đáy

**Bước 3**: Xử lý khi chạm đáy
- Khóa mảnh vào board
- Xóa các hàng đã đầy
- Tạo mảnh mới
- Kiểm tra Game Over

---

## ⏱️ Tốc độ game

Game gọi `gameTick()` định kỳ bằng `setInterval()`:

```javascript
// Tạo bộ đếm thời gian
export function startDropInterval() {
    if (dropIntervalId) {
        clearInterval(dropIntervalId); // Xóa bộ đếm cũ
    }
    
    // Tính thời gian chờ dựa trên level
    // Level 1 = 1000ms (1 giây)
    // Level 2 = 1000ms / 2 = 500ms (0.5 giây) → Nhanh gấp đôi!
    const delay = INITIAL_DROP_DELAY / level;
    
    dropIntervalId = setInterval(() => {
        gameTick();
    }, delay);
}
```

### Công thức tốc độ

```
Tốc độ = INITIAL_DROP_DELAY / level
```

| Level | Tính toán | Tốc độ (ms) | Tốc độ (giây) |
|-------|-----------|-------------|---------------|
| 1 | 1000 / 1 | 1000 | 1.0 |
| 2 | 1000 / 2 | 500 | 0.5 |
| 3 | 1000 / 3 | 333 | 0.33 |
| 5 | 1000 / 5 | 200 | 0.2 |
| 10 | 1000 / 10 | 100 | 0.1 |

**Càng level cao → thời gian chờ càng ngắn → mảnh rơi càng nhanh!**

---

## 🎮 Thử nghiệm

### Bước 1: Xem tốc độ hiện tại

Mở Console và gõ:

```javascript
// Xem level hiện tại
console.log("Level:", level);

// Tính tốc độ hiện tại
const currentSpeed = 1000 / level;
console.log("Tốc độ (ms):", currentSpeed);
```

### Bước 2: Thay đổi tốc độ

Thử thay đổi `INITIAL_DROP_DELAY` trong file `game-constants.js`:

```javascript
// Chậm hơn
export const INITIAL_DROP_DELAY = 2000; // 2 giây

// Nhanh hơn
export const INITIAL_DROP_DELAY = 500;  // 0.5 giây
```

Chơi lại game và cảm nhận sự khác biệt!

### Bước 3: Theo dõi gameTick

Thêm dòng này vào đầu hàm `gameTick()`:

```javascript
console.log("Tick! Mảnh đang ở:", currentPiece.y);
```

Bạn sẽ thấy mỗi giây có 1 dòng "Tick!" hiện ra!

---

## ❓ Câu hỏi kiểm tra

1. **Vòng lặp là gì?**
   - A. Làm 1 việc 1 lần
   - B. Làm đi làm lại nhiều lần ✅
   - C. Không làm gì cả

2. **Hàm nào là "nhịp đập" của game?**
   - A. `movePiece()`
   - B. `gameTick()` ✅
   - C. `drawBoard()`

3. **Khi level tăng, game sẽ?**
   - A. Chậm hơn
   - B. Nhanh hơn ✅
   - C. Không đổi

4. **`setInterval()` làm gì?**
   - A. Dừng game
   - B. Gọi hàm định kỳ ✅
   - C. Tạo mảnh mới

5. **Level 5, mảnh rơi mất bao lâu?**
   - A. 1000ms
   - B. 500ms
   - C. 200ms ✅

---

## 🏠 Bài tập về nhà

### Bài 1: Tìm hiểu `setInterval()`

```javascript
// Thử nghiệm trong Console
let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log("Đếm:", count);
    
    // Dừng sau 5 lần
    if (count >= 5) {
        clearInterval(intervalId);
        console.log("Dừng!");
    }
}, 1000); // Mỗi 1 giây
```

**Câu hỏi**: Chương trình này làm gì?

### Bài 2: Thay đổi công thức tốc độ

Thử thay đổi công thức tính tốc độ:

```javascript
// Công thức cũ
const delay = INITIAL_DROP_DELAY / level;

// Công thức mới (thử nghiệm)
const delay = INITIAL_DROP_DELAY - (level * 50);
```

**Câu hỏi**: 
- Sự khác biệt là gì?
- Cách nào tốt hơn? Tại sao?

### Bài 3: Vẽ sơ đồ

Vẽ sơ đồ game loop bằng tay, có các bước:
1. Kiểm tra game đang chạy
2. Di chuyển mảnh xuống
3. Kiểm tra chạm đáy
4. Xử lý (khóa mảnh, xóa hàng)
5. Quay lại bước 1

---

## 🎓 Tóm tắt

- **Vòng lặp** = làm đi làm lại
- **Game Loop** = vòng lặp chính của game
- **gameTick()** = nhịp đập, chạy mỗi giây
- **setInterval()** = gọi hàm định kỳ
- **Tốc độ** = 1000ms / level (càng cao càng nhanh)

---

## 📚 Bài tiếp theo

[Bài 3: Các mảnh Tetris - Shapes and Pieces](03-pieces-and-shapes.md)

Trong bài tiếp theo, chúng ta sẽ học:
- 7 loại mảnh Tetris là gì?
- Mảnh được biểu diễn trong code như thế nào?
- Làm sao xoay mảnh 90 độ?
