# Bài 4: Board và Mảng 2 chiều

## 🎯 Mục tiêu bài học
- Hiểu Board (bàn chơi) là gì
- Làm quen với mảng 2 chiều (2D Array)
- Hiểu cách truy cập ô trên board
- Tìm hiểu về va chạm (collision)

---

## 🎮 Board là gì?

**Board** (bàn chơi) = khung chơi game Tetris!

Tưởng tượng board như một **tờ giấy ô li**:
- 10 cột (ngang) 
- 20 hàng (dọc)
- Tổng cộng: 10 × 20 = **200 ô**

```
Cột → 0  1  2  3  4  5  6  7  8  9
Hàng ↓
  0   [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
  1   [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
  2   [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
  ...
 19   [█][█][ ][█][█][█][ ][█][█][█]  ← Hàng cuối (đã có màu)
```

---

## 📊 Mảng 2 chiều

Trong code, board là **mảng 2 chiều**:

```javascript
// Board = mảng của mảng
board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // Hàng 0
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // Hàng 1
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // Hàng 2
  // ... 17 hàng nữa
  [1, 1, 0, 1, 1, 1, 0, 1, 1, 1]   // Hàng 19 (có màu)
];
```

Giá trị trong mỗi ô:
- `0` = ô trống (chưa có mảnh)
- `1-7` = ô có màu (index màu từ COLORS)

### Tạo board trống

File: `js/game-state.js`

```javascript
export function createBoard() {
    board = Array.from(
        { length: BOARD_HEIGHT },           // 20 hàng
        () => Array(BOARD_WIDTH).fill(0)    // Mỗi hàng 10 ô, giá trị 0
    );
}

// Kết quả: board[20][10] toàn số 0
```

---

## 🔍 Truy cập ô trên board

Để đọc/ghi giá trị của 1 ô, dùng cú pháp:

```javascript
board[hàng][cột]
```

### Ví dụ

```javascript
// Đọc giá trị ô hàng 5, cột 3
const value = board[5][3];

// Ghi giá trị 2 (màu cyan) vào ô hàng 10, cột 7
board[10][7] = 2;

// Kiểm tra ô có trống không
if (board[15][4] === 0) {
    console.log("Ô này trống!");
}
```

### Lưu ý quan trọng

⚠️ **Hàng trước, cột sau!** (không phải cột trước, hàng sau)

```javascript
✅ Đúng:  board[y][x]  // y = hàng (dọc), x = cột (ngang)
❌ Sai:   board[x][y]  // Sai thứ tự!
```

Lý do: Trong toán học và lập trình, mảng 2 chiều thường viết `[hàng][cột]`.

---

## 💥 Va chạm (Collision)

**Va chạm** = mảnh đụng vào tường, đáy, hoặc ô đã có màu

Cần kiểm tra va chạm khi:
- Di chuyển mảnh (trái/phải/xuống)
- Xoay mảnh
- Tạo mảnh mới

### Hàm kiểm tra va chạm

File: `js/game-pieces.js`

```javascript
export function checkCollision(piece) {
    // Duyệt qua từng ô của mảnh
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            // Chỉ kiểm tra ô có màu
            if (piece.shape[r][c] !== 0) {
                const newY = piece.y + r;  // Vị trí hàng trên board
                const newX = piece.x + c;  // Vị trí cột trên board

                // Kiểm tra 3 điều kiện:
                
                // 1. Ra ngoài biên trái/phải?
                if (newX < 0 || newX >= BOARD_WIDTH) {
                    return true; // Va chạm!
                }
                
                // 2. Ra ngoài đáy?
                if (newY >= BOARD_HEIGHT) {
                    return true; // Va chạm!
                }

                // 3. Đụng ô đã có màu?
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return true; // Va chạm!
                }
            }
        }
    }
    return false; // An toàn!
}
```

### Giải thích

**Bước 1**: Duyệt qua từng ô của mảnh
- Mảnh cũng là mảng 2 chiều (ví dụ: 3×3)
- Chỉ quan tâm ô có giá trị (`!== 0`)

**Bước 2**: Tính vị trí thực trên board
- `newY = piece.y + r` (hàng)
- `newX = piece.x + c` (cột)

**Bước 3**: Kiểm tra 3 điều kiện
1. Biên trái/phải: `newX < 0` hoặc `newX >= 10`
2. Biên đáy: `newY >= 20`
3. Ô đã có màu: `board[newY][newX] !== 0`

---

## 🔒 Khóa mảnh vào board

Khi mảnh chạm đáy, ta **khóa** (lock) nó vào board:

File: `js/game-pieces.js`

```javascript
export function lockPiece(piece) {
    piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell !== 0) {
                const boardY = piece.y + r;
                const boardX = piece.x + c;
                
                // Chỉ tô màu nếu trong phạm vi board
                if (boardY >= 0 && boardY < BOARD_HEIGHT && 
                    boardX >= 0 && boardX < BOARD_WIDTH) {
                    board[boardY][boardX] = piece.color;
                }
            }
        });
    });
}
```

### Ví dụ minh họa

Giả sử hình T (màu 1) ở vị trí (x=3, y=18):

**Trước khi lock:**
```
board[18] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
board[19] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

**Sau khi lock:**
```
board[18] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]  ← Điểm giữa của T
board[19] = [0, 0, 0, 1, 1, 1, 0, 0, 0, 0]  ← Đáy của T
```

---

## 🎮 Thử nghiệm

### Thử nghiệm 1: Xem board

Mở Console và gõ:

```javascript
// Xem toàn bộ board
console.log(board);

// Xem hàng cuối (hàng 19)
console.log("Hàng cuối:", board[19]);

// Xem ô cụ thể (hàng 10, cột 5)
console.log("Ô [10][5]:", board[10][5]);
```

### Thử nghiệm 2: Tô màu thủ công

```javascript
// Tô màu vàng (color 5) vào hàng cuối
for (let x = 0; x < 10; x++) {
    board[19][x] = 5;
}

// Vẽ lại board để thấy thay đổi
drawBoard();
```

### Thử nghiệm 3: Tạo pattern

```javascript
// Tạo pattern cờ đen trắng
for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
        if ((x + y) % 2 === 0) {
            board[y][x] = 1;  // Màu 1
        } else {
            board[y][x] = 2;  // Màu 2
        }
    }
}
drawBoard();
```

---

## ❓ Câu hỏi kiểm tra

1. **Board có kích thước bao nhiêu?**
   - A. 10 × 10
   - B. 10 × 20 ✅
   - C. 20 × 20

2. **Cú pháp truy cập ô trên board?**
   - A. `board[x][y]`
   - B. `board[y][x]` ✅
   - C. `board(x, y)`

3. **Giá trị 0 nghĩa là gì?**
   - A. Ô có màu đen
   - B. Ô trống ✅
   - C. Ô có lỗi

4. **Khi nào xảy ra va chạm?**
   - A. Mảnh ra ngoài biên ✅
   - B. Mảnh ở giữa board
   - C. Mảnh đang rơi

5. **Sau khi lock, mảnh có di chuyển được nữa không?**
   - A. Có
   - B. Không ✅
   - C. Tùy trường hợp

---

## 🏠 Bài tập về nhà

### Bài 1: Đếm ô trống

Viết code đếm số ô trống trên board:

```javascript
let emptyCount = 0;
for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x] === 0) {
            emptyCount++;
        }
    }
}
console.log("Số ô trống:", emptyCount);
```

### Bài 2: Tô màu hàng

Viết hàm tô màu cả 1 hàng:

```javascript
function fillRow(rowIndex, color) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        board[rowIndex][x] = color;
    }
}

// Thử nghiệm
fillRow(19, 3);  // Tô hàng cuối màu xanh lá
drawBoard();
```

### Bài 3: Kiểm tra hàng đầy

Viết hàm kiểm tra 1 hàng có đầy không:

```javascript
function isRowFull(rowIndex) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[rowIndex][x] === 0) {
            return false;  // Có ô trống → chưa đầy
        }
    }
    return true;  // Không có ô trống → đầy rồi!
}

// Thử nghiệm
console.log("Hàng 19 đầy chưa?", isRowFull(19));
```

---

## 🎓 Tóm tắt

- **Board** = bàn chơi 10×20 ô
- **Mảng 2 chiều** = mảng của mảng
- **Truy cập ô**: `board[hàng][cột]`
- **Va chạm** = đụng tường/đáy/ô có màu
- **Lock** = khóa mảnh vào board, không di chuyển được nữa

---

## 📚 Bài tiếp theo

[Bài 5: Leaderboard và Firebase](05-leaderboard-firebase.md)

Trong bài tiếp theo, chúng ta sẽ học:
- Leaderboard (bảng xếp hạng) là gì?
- Firebase là gì?
- Làm sao lưu điểm lên internet?
- Làm sao hiển thị top 10 người chơi?
