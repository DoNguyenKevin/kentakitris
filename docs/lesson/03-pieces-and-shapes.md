# Bài 3: Các mảnh Tetris - Shapes and Pieces

## 🎯 Mục tiêu bài học
- Hiểu 7 loại mảnh Tetris
- Hiểu cách biểu diễn mảnh bằng mảng 2 chiều
- Tìm hiểu cách tạo mảnh ngẫu nhiên
- Hiểu cách xoay mảnh 90 độ

---

## 🧩 7 loại mảnh Tetris

Trong game Tetris cổ điển, có **7 loại mảnh** (gọi là **Tetromino**):

```
T-shape:  I-shape:    J-shape:   L-shape:
  █        ████         █          █
 ███                   ███        ███

O-shape:  S-shape:    Z-shape:
 ██         ██        ██
 ██        ██          ██
```

Mỗi mảnh có **tên** và **màu sắc** riêng:

| Tên | Hình dạng | Màu sắc | Mô tả |
|-----|-----------|---------|-------|
| T | ⊤ | Hồng | Chữ T ngược |
| I | ▌ | Xanh lơ | Que dài |
| J | ⌐ | Xanh lá | Chữ J ngược |
| L | ⌙ | Cam | Chữ L |
| O | ▣ | Vàng | Hình vuông |
| S | ∽ | Đỏ | Chữ S |
| Z | ∼ | Tím | Chữ Z |

---

## 📊 Biểu diễn mảnh bằng mảng 2 chiều

Trong code, mỗi mảnh là **mảng 2 chiều** (giống bàn cờ mini):
- `1` = có ô
- `0` = không có ô

### Ví dụ: Hình T

```javascript
// Hình T trong code
[
  [0, 1, 0],  // Hàng trên:    █
  [1, 1, 1],  // Hàng giữa:   ███
  [0, 0, 0]   // Hàng dưới:   
]
```

Đọc theo hàng:
- Hàng 1: `[0, 1, 0]` → Trống, Có, Trống
- Hàng 2: `[1, 1, 1]` → Có, Có, Có
- Hàng 3: `[0, 0, 0]` → Trống hết

### Ví dụ: Hình I

```javascript
// Hình I (que dài)
[
  [0, 0, 0, 0],  //
  [1, 1, 1, 1],  // ████
  [0, 0, 0, 0],  //
  [0, 0, 0, 0]   //
]
```

### Ví dụ: Hình O

```javascript
// Hình O (vuông)
[
  [1, 1],  // ██
  [1, 1]   // ██
]
```

---

## 🎲 Tạo mảnh ngẫu nhiên

File: `js/game-pieces.js`

```javascript
export function getRandomPiece() {
    // 1. Chọn ngẫu nhiên từ 0 đến 6
    const index = Math.floor(Math.random() * SHAPES.length);
    
    // 2. Lấy hình dạng tương ứng
    const shape = SHAPES[index];
    
    // 3. Lấy màu (index + 1 vì màu bắt đầu từ 1)
    const color = index + 1;
    
    // 4. Tính vị trí xuất hiện (giữa bàn chơi, phía trên)
    const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);

    return {
        shape: shape,   // Hình dạng
        color: color,   // Màu sắc (1-7)
        x: startX,      // Vị trí ngang
        y: 0            // Vị trí dọc (trên cùng)
    };
}
```

### Giải thích `Math.random()`

```javascript
Math.random()               // Số thập phân 0.0 đến 1.0
                           // Ví dụ: 0.6372819

Math.random() * 7          // Nhân với 7
                           // Ví dụ: 0.6372819 * 7 = 4.460973

Math.floor(4.460973)       // Làm tròn xuống
                           // Kết quả: 4

// Vậy: chọn mảnh thứ 4 (hình L)
```

Kết quả: Mỗi lần chạy, ta được 1 số ngẫu nhiên từ 0 đến 6!

---

## 🔄 Xoay mảnh 90 độ

### Công thức toán học

Để xoay mảng 2 chiều 90 độ theo chiều kim đồng hồ:

```
newShape[c][size-1-r] = oldShape[r][c]
```

Nghe khó? Hãy xem ví dụ!

### Ví dụ: Xoay hình T

**Trước khi xoay:**
```
[0, 1, 0]   Index:  [0][0] [0][1] [0][2]
[1, 1, 1]           [1][0] [1][1] [1][2]
[0, 0, 0]           [2][0] [2][1] [2][2]
```

**Sau khi xoay:**
```
[0, 1, 0]
[0, 1, 1]
[0, 1, 0]
```

Hình minh họa:
```
Trước:    Sau:
  █         █
 ███       ██
           █
```

### Code xoay

File: `js/game-pieces.js`

```javascript
export function rotatePieceShape(piece) {
    const shape = piece.shape;
    const size = shape.length;
    
    // Tạo mảng mới rỗng
    const newShape = Array.from({ length: size }, () => Array(size).fill(0));

    // Áp dụng công thức xoay
    for (let r = 0; r < size; r++) {           // Duyệt hàng
        for (let c = 0; c < size; c++) {       // Duyệt cột
            newShape[c][size - 1 - r] = shape[r][c];
        }
    }

    return { ...piece, shape: newShape };
}
```

---

## 🎮 Thử nghiệm

### Thử nghiệm 1: Xem hình dạng

Mở Console và gõ:

```javascript
// Xem tất cả hình dạng
console.log(SHAPES);

// Xem hình T (index 0)
console.log("Hình T:", SHAPES[0]);

// Xem hình I (index 1)
console.log("Hình I:", SHAPES[1]);
```

### Thử nghiệm 2: Tạo mảnh ngẫu nhiên

```javascript
// Tạo 5 mảnh ngẫu nhiên
for (let i = 0; i < 5; i++) {
    const piece = getRandomPiece();
    console.log("Mảnh", i, "- Màu:", piece.color, "Vị trí:", piece.x, piece.y);
}
```

### Thử nghiệm 3: Xoay mảnh

```javascript
// Tạo hình T
const tPiece = {
    shape: SHAPES[0],  // Hình T
    color: 1,
    x: 3,
    y: 0
};

// Xoay 4 lần
console.log("Ban đầu:", tPiece.shape);

const rotated1 = rotatePieceShape(tPiece);
console.log("Xoay 90°:", rotated1.shape);

const rotated2 = rotatePieceShape(rotated1);
console.log("Xoay 180°:", rotated2.shape);

const rotated3 = rotatePieceShape(rotated2);
console.log("Xoay 270°:", rotated3.shape);

const rotated4 = rotatePieceShape(rotated3);
console.log("Xoay 360° (giống ban đầu):", rotated4.shape);
```

---

## ❓ Câu hỏi kiểm tra

1. **Có bao nhiêu loại mảnh Tetris?**
   - A. 5
   - B. 7 ✅
   - C. 10

2. **Trong mảng 2 chiều, `1` nghĩa là gì?**
   - A. Trống
   - B. Có ô ✅
   - C. Màu vàng

3. **Hình nào KHÔNG thay đổi khi xoay?**
   - A. Hình T
   - B. Hình O (vuông) ✅
   - C. Hình I

4. **`Math.random()` trả về gì?**
   - A. Số nguyên ngẫu nhiên
   - B. Số thập phân từ 0 đến 1 ✅
   - C. Màu ngẫu nhiên

5. **Xoay mảnh bao nhiêu độ mỗi lần?**
   - A. 45°
   - B. 90° ✅
   - C. 180°

---

## 🏠 Bài tập về nhà

### Bài 1: Vẽ hình bằng tay

Trên giấy ô li, vẽ:
1. Hình T và 3 lần xoay của nó
2. Hình L và 3 lần xoay của nó
3. Hình I và 1 lần xoay của nó

### Bài 2: Tạo hình mới (nâng cao)

Thử tạo hình chữ X:
```
 █
███
 █
```

Viết mảng 2 chiều tương ứng:
```javascript
const xShape = [
  [?, ?, ?],
  [?, ?, ?],
  [?, ?, ?]
];
```

### Bài 3: Thử nghiệm màu

Trong file `game-constants.js`, thử thay đổi màu:

```javascript
export const COLORS = [
    null,
    'color-5',  // T: Đổi sang màu vàng
    'color-2',  // I: Giữ nguyên
    // ... tiếp tục
];
```

**Câu hỏi**: Điều gì xảy ra khi chơi game?

---

## 🎓 Tóm tắt

- Có **7 loại mảnh** Tetris (T, I, J, L, O, S, Z)
- Mảnh được biểu diễn bằng **mảng 2 chiều**
- `1` = có ô, `0` = không có ô
- **Tạo ngẫu nhiên**: `Math.random()` và `Math.floor()`
- **Xoay 90°**: Công thức `newShape[c][size-1-r] = oldShape[r][c]`
- Hình O (vuông) xoay vẫn giống cũ vì đối xứng

---

## 📚 Bài tiếp theo

[Bài 4: Board và mảng 2 chiều](04-board-and-arrays.md)

Trong bài tiếp theo, chúng ta sẽ học:
- Board (bàn chơi) là gì?
- Mảng 2 chiều hoạt động như thế nào?
- Làm sao kiểm tra va chạm?
- Làm sao khóa mảnh vào board?
