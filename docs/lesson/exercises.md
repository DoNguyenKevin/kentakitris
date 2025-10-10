# Bài tập tổng hợp - Keltris

Các bài tập để thực hành kiến thức từ 5 bài học.

---

## 📚 Bài tập theo chủ đề

### 🎯 Bài 1: Code cơ bản

#### Ex 1.1: Biến và Console

Viết code trong Console:

```javascript
// 1. Tạo biến lưu tên của bạn
let myName = "...";

// 2. Tạo biến lưu điểm số
let myScore = 0;

// 3. In ra màn hình
console.log("Tên:", myName);
console.log("Điểm:", myScore);

// 4. Cộng điểm
myScore = myScore + 100;
console.log("Điểm mới:", myScore);
```

#### Ex 1.2: Tìm file

Mở các file sau và đọc 5 dòng đầu tiên:
- `js/game-constants.js`
- `js/game-state.js`
- `js/game-pieces.js`

**Câu hỏi**: Mỗi file làm việc gì?

---

### 🔄 Bài 2: Vòng lặp

#### Ex 2.1: Vòng lặp for

```javascript
// In ra số từ 1 đến 10
for (let i = 1; i <= 10; i++) {
    console.log(i);
}

// In ra số chẵn từ 0 đến 20
for (let i = 0; i <= 20; i += 2) {
    console.log(i);
}
```

**Thử nghiệm**: Sửa code để in số lẻ từ 1 đến 19.

#### Ex 2.2: Thay đổi tốc độ game

Mở file `js/game-constants.js`:

```javascript
// Thay đổi giá trị này
export const INITIAL_DROP_DELAY = 1000;
```

**Thử nghiệm**:
1. Đổi thành `2000` → Chơi lại → Cảm nhận gì?
2. Đổi thành `500` → Chơi lại → Cảm nhận gì?
3. Tốc độ nào thoải mái nhất?

#### Ex 2.3: Tính tốc độ

Viết hàm tính tốc độ theo level:

```javascript
function calculateSpeed(level) {
    return 1000 / level;
}

// Thử nghiệm
for (let lv = 1; lv <= 10; lv++) {
    console.log(`Level ${lv}: ${calculateSpeed(lv)}ms`);
}
```

---

### 🧩 Bài 3: Mảnh Tetris

#### Ex 3.1: Vẽ hình trên giấy

Trên giấy ô li, vẽ:
1. Hình T ban đầu
2. Hình T xoay 90°
3. Hình T xoay 180°
4. Hình T xoay 270°

#### Ex 3.2: Đếm ô

Đếm số ô (số ô có giá trị 1) trong mỗi hình:

```javascript
function countBlocks(shape) {
    let count = 0;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                count++;
            }
        }
    }
    return count;
}

// Thử với hình T
console.log("Hình T có:", countBlocks(SHAPES[0]), "ô"); // Kết quả: 4

// Thử với hình I
console.log("Hình I có:", countBlocks(SHAPES[1]), "ô"); // Kết quả: 4
```

**Câu hỏi**: Tất cả hình Tetris đều có 4 ô phải không?

#### Ex 3.3: Tạo hình mới

Tạo hình chữ U:

```
█ █
███
```

Viết mảng 2 chiều:

```javascript
const uShape = [
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
];
```

**Thử nghiệm**: Thêm hình này vào `SHAPES` và chơi game!

---

### 📊 Bài 4: Board và mảng 2D

#### Ex 4.1: Truy cập ô

```javascript
// Xem giá trị các ô
console.log("Ô [0][0]:", board[0][0]);
console.log("Ô [10][5]:", board[10][5]);
console.log("Ô [19][9]:", board[19][9]);

// Tô màu 1 ô
board[10][5] = 3;
drawBoard();
```

#### Ex 4.2: Đếm ô có màu

```javascript
function countColoredCells() {
    let count = 0;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] !== 0) {
                count++;
            }
        }
    }
    return count;
}

console.log("Số ô có màu:", countColoredCells());
```

#### Ex 4.3: Tô hàng đầy

Viết hàm tô đầy 1 hàng:

```javascript
function fillRow(rowIndex, color) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        board[rowIndex][x] = color;
    }
}

// Thử nghiệm
fillRow(19, 5);  // Tô hàng cuối màu vàng
fillRow(18, 2);  // Tô hàng 18 màu xanh lơ
drawBoard();
```

#### Ex 4.4: Kiểm tra hàng đầy

```javascript
function isRowFull(rowIndex) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[rowIndex][x] === 0) {
            return false;
        }
    }
    return true;
}

// Thử nghiệm
console.log("Hàng 19 đầy?", isRowFull(19));
```

---

### 🏆 Bài 5: Firebase và Leaderboard

#### Ex 5.1: Xem dữ liệu

Mở Console:

```javascript
// Xem userId của bạn
console.log("My ID:", window.userId);

// Xem tên đã lưu
console.log("Tên:", localStorage.getItem('playerName'));
```

#### Ex 5.2: Lưu điểm thử nghiệm

```javascript
// Tạo dữ liệu giả
const testData = {
    playerName: "TEST",
    score: 9999,
    lines: 99,
    level: 10,
    timestamp: Date.now()
};

// Lưu lên Firebase (nếu có hàm saveScore)
saveScore(testData);
```

#### Ex 5.3: Tính điểm trung bình

Viết hàm tính điểm trung bình của top 10:

```javascript
function calculateAverageScore(leaderboard) {
    let total = 0;
    for (let i = 0; i < leaderboard.length; i++) {
        total += leaderboard[i].score;
    }
    return total / leaderboard.length;
}

// Thử nghiệm (giả sử đã có leaderboard)
console.log("Điểm TB:", calculateAverageScore(leaderboard));
```

---

## 🚀 Mini-Projects

### Project 1: Chế độ chơi chậm

**Mục tiêu**: Tạo chế độ "slow mode" cho người mới chơi

**Yêu cầu**:
1. Thêm nút "Slow Mode" trên UI
2. Khi bật, đổi `INITIAL_DROP_DELAY` thành 2000ms
3. Hiển thị text "SLOW MODE ON" trên màn hình

**Gợi ý**:
```javascript
let isSlowMode = false;

function toggleSlowMode() {
    isSlowMode = !isSlowMode;
    if (isSlowMode) {
        // Tăng thời gian chờ
    } else {
        // Về bình thường
    }
}
```

---

### Project 2: Đếm mảnh đã rơi

**Mục tiêu**: Hiển thị số mảnh đã rơi

**Yêu cầu**:
1. Tạo biến `piecesDropped = 0`
2. Mỗi khi lock mảnh, tăng biến này
3. Hiển thị trên UI: "Pieces: 15"

**Gợi ý**:
```javascript
let piecesDropped = 0;

function lockPiece(piece) {
    // Code cũ...
    
    piecesDropped++;
    updatePiecesDisplay();
}

function updatePiecesDisplay() {
    document.getElementById('pieces-count').textContent = piecesDropped;
}
```

---

### Project 3: Thống kê hình đã dùng

**Mục tiêu**: Đếm số lần mỗi hình xuất hiện

**Yêu cầu**:
1. Tạo object đếm: `{ T: 0, I: 0, J: 0, ... }`
2. Mỗi khi tạo mảnh mới, tăng counter tương ứng
3. Hiển thị bảng thống kê

**Gợi ý**:
```javascript
const pieceStats = {
    T: 0, I: 0, J: 0, L: 0, O: 0, S: 0, Z: 0
};

function getRandomPiece() {
    const index = Math.floor(Math.random() * SHAPES.length);
    const names = ['T', 'I', 'J', 'L', 'O', 'S', 'Z'];
    
    pieceStats[names[index]]++;
    
    // Code cũ...
}
```

---

### Project 4: Personal best

**Mục tiêu**: Lưu điểm cao nhất của cá nhân

**Yêu cầu**:
1. Lưu `highScore` vào localStorage
2. So sánh với điểm hiện tại
3. Nếu phá kỷ lục, hiển thị "NEW RECORD!"

**Gợi ý**:
```javascript
function saveHighScore(currentScore) {
    const oldHigh = localStorage.getItem('highScore') || 0;
    if (currentScore > oldHigh) {
        localStorage.setItem('highScore', currentScore);
        showNewRecordMessage();
    }
}
```

---

### Project 5: Combo meter

**Mục tiêu**: Thêm hệ thống combo khi xóa nhiều hàng liên tiếp

**Yêu cầu**:
1. Biến `combo = 0`
2. Mỗi lần xóa hàng, tăng combo
3. Nếu không xóa hàng nào, reset combo về 0
4. Hiển thị "COMBO x3!" trên màn hình

**Gợi ý**:
```javascript
let combo = 0;

function clearLines() {
    const linesCleared = // ... tính số hàng xóa
    
    if (linesCleared > 0) {
        combo++;
        showComboMessage(combo);
    } else {
        combo = 0;
    }
}
```

---

## 🏅 Thử thách nâng cao

### Challenge 1: Ghost piece

Hiển thị "bóng ma" của mảnh ở vị trí nó sẽ rơi xuống

### Challenge 2: Next 3 pieces

Hiển thị 3 mảnh tiếp theo thay vì 1

### Challenge 3: Hold piece

Cho phép giữ 1 mảnh để dùng sau

### Challenge 4: Hard drop animation

Thêm hiệu ứng khi hard drop

### Challenge 5: Custom themes

Cho phép người chơi đổi màu sắc các mảnh

---

## ✅ Checklist hoàn thành

### Bài 1: Code cơ bản
- [ ] Ex 1.1: Biến và Console
- [ ] Ex 1.2: Tìm file

### Bài 2: Vòng lặp
- [ ] Ex 2.1: Vòng lặp for
- [ ] Ex 2.2: Thay đổi tốc độ
- [ ] Ex 2.3: Tính tốc độ

### Bài 3: Mảnh Tetris
- [ ] Ex 3.1: Vẽ hình
- [ ] Ex 3.2: Đếm ô
- [ ] Ex 3.3: Tạo hình mới

### Bài 4: Board
- [ ] Ex 4.1: Truy cập ô
- [ ] Ex 4.2: Đếm ô có màu
- [ ] Ex 4.3: Tô hàng
- [ ] Ex 4.4: Kiểm tra hàng đầy

### Bài 5: Firebase
- [ ] Ex 5.1: Xem dữ liệu
- [ ] Ex 5.2: Lưu điểm
- [ ] Ex 5.3: Tính điểm TB

### Mini-Projects
- [ ] Project 1: Slow mode
- [ ] Project 2: Đếm mảnh
- [ ] Project 3: Thống kê
- [ ] Project 4: Personal best
- [ ] Project 5: Combo meter

### Thử thách
- [ ] Challenge 1: Ghost piece
- [ ] Challenge 2: Next 3 pieces
- [ ] Challenge 3: Hold piece
- [ ] Challenge 4: Hard drop animation
- [ ] Challenge 5: Custom themes

---

## 🎓 Hoàn thành khóa học!

Chúc mừng bạn đã hoàn thành tất cả bài học!

**Điều gì tiếp theo?**
1. Thử làm các mini-projects
2. Tạo thêm tính năng mới cho game
3. Chia sẻ game với bạn bè
4. Học thêm về JavaScript nâng cao

**Tài nguyên học tiếp:**
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [JavaScript.info](https://javascript.info/)
- [W3Schools](https://www.w3schools.com/js/)

**Chúc bạn học vui!** 🎉
