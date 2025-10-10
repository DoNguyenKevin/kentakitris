# Bài 1: Giới thiệu về Code (Lập trình)

## 🎯 Mục tiêu bài học
- Hiểu code (lập trình) là gì
- Hiểu cách máy tính "đọc" và thực thi code
- Làm quen với cấu trúc file của game Keltris
- Hiểu tại sao phải chia code thành nhiều file

---

## 📖 Code là gì?

**Code (lập trình)** = Cách chúng ta nói chuyện với máy tính!

Giống như bạn nói tiếng Việt với bạn bè, lập trình viên viết code để "nói" với máy tính:
- "Hãy hiển thị chữ 'Xin chào' lên màn hình"
- "Nếu người chơi nhấn phím mũi tên trái, hãy di chuyển mảnh sang trái"
- "Khi xóa được 1 hàng, cộng thêm 10 điểm"

### Ví dụ đơn giản

```javascript
// Đây là code JavaScript
console.log("Xin chào các bạn!");
```

Khi chạy, máy tính sẽ hiển thị: `Xin chào các bạn!`

---

## 🗂️ Cấu trúc Game Keltris

Game này được chia thành nhiều file nhỏ. Tại sao?

**Lý do**: Giống như tủ sách! 
- Sách toán để ở ngăn toán
- Sách văn để ở ngăn văn
- Dễ tìm kiếm và sửa chữa hơn!

### Sơ đồ cấu trúc

```
keltris/
├── index.html              ← Trang web chính
├── index.css               ← Trang trí (màu sắc, kích thước)
├── js/                     ← Thư mục chứa code
│   ├── game-constants.js   ← Con số không đổi (10 cột, 20 hàng...)
│   ├── game-state.js       ← Trạng thái game (điểm, level, board...)
│   ├── game-pieces.js      ← Các mảnh Tetris (T, I, L, J, O, S, Z)
│   ├── game-logic.js       ← Cách game hoạt động (di chuyển, xoay...)
│   ├── game-controls.js    ← Điều khiển (phím, chuột...)
│   ├── game-board.js       ← Vẽ bàn chơi lên màn hình
│   └── helpers/            ← Hàm trợ giúp
│       ├── name-utils.js   ← Quản lý tên người chơi
│       ├── date-utils.js   ← Làm việc với ngày tháng
│       ├── storage-utils.js← Lưu dữ liệu vào máy
│       └── dom-utils.js    ← Điều khiển trang web
└── docs/                   ← Tài liệu, hướng dẫn
    └── lesson/             ← Các bài học này!
```

---

## 💡 Hiểu từng file

### 1. **game-constants.js** - Con số không đổi

Chứa những con số quan trọng:
- `BOARD_WIDTH = 10` → Bàn chơi rộng 10 ô
- `BOARD_HEIGHT = 20` → Bàn chơi cao 20 ô
- `SCORE_PER_LINE = 10` → Xóa 1 hàng được 10 điểm

**Tại sao tách riêng?**
- Dễ thay đổi! Muốn bàn chơi rộng hơn? Chỉ cần đổi 1 số!
- Không phải tìm kiếm trong cả ngàn dòng code

### 2. **game-state.js** - Trạng thái game

Lưu thông tin hiện tại của game:
- `score = 0` → Điểm số hiện tại
- `level = 1` → Cấp độ hiện tại
- `board = []` → Bàn chơi (mảng 2 chiều)

**Giống như bảng điều khiển của game!**

### 3. **game-pieces.js** - Các mảnh

Tạo và quản lý 7 loại mảnh Tetris:
- Hình T, I, L, J, O, S, Z
- Màu sắc cho từng hình
- Xoay mảnh 90 độ

### 4. **game-logic.js** - Logic game

Các quy tắc game:
- Mảnh rơi xuống như thế nào?
- Khi nào xóa hàng?
- Tính điểm ra sao?

---

## 🎮 Thử nghiệm

### Bước 1: Mở Console

1. Mở game trong trình duyệt (Chrome/Firefox)
2. Nhấn **F12** hoặc **Ctrl + Shift + I**
3. Chọn tab **Console**

### Bước 2: Thử viết code đơn giản

Gõ vào Console:

```javascript
console.log("Xin chào từ bài học 1!");
```

Nhấn Enter. Bạn sẽ thấy chữ hiện ra!

### Bước 3: Xem các giá trị trong game

Gõ vào Console:

```javascript
// Xem chiều rộng bàn chơi
console.log(BOARD_WIDTH);  // Sẽ hiện: 10

// Xem điểm hiện tại
console.log(score);         // Sẽ hiện điểm của bạn
```

---

## ❓ Câu hỏi kiểm tra

1. **Code là gì?**
   - A. Một loại bài hát
   - B. Cách nói chuyện với máy tính ✅
   - C. Một loại game

2. **Tại sao chia code thành nhiều file?**
   - A. Để trông đẹp hơn
   - B. Để dễ tìm kiếm và sửa chữa ✅
   - C. Vì bắt buộc phải làm vậy

3. **File nào chứa con số không đổi?**
   - A. game-state.js
   - B. game-constants.js ✅
   - C. game-logic.js

4. **Bàn chơi Tetris rộng bao nhiêu ô?**
   - A. 5 ô
   - B. 10 ô ✅
   - C. 20 ô

---

## 🏠 Bài tập về nhà

### Bài 1: Tìm và đọc file

1. Mở file `js/game-constants.js`
2. Tìm dòng: `export const BOARD_HEIGHT = 20;`
3. Đọc comment (chú thích) phía trên dòng đó

**Câu hỏi**: Comment giải thích gì?

### Bài 2: Thay đổi và quan sát

1. Mở file `js/game-constants.js`
2. Thử đổi `SCORE_PER_LINE = 10` thành `SCORE_PER_LINE = 100`
3. Lưu file và chơi game
4. Xóa 1 hàng và quan sát điểm số

**Câu hỏi**: Điều gì đã thay đổi?

### Bài 3: Vẽ sơ đồ

Trên giấy, vẽ 1 sơ đồ đơn giản:
- Hộp 1: "Người chơi nhấn phím mũi tên trái"
- Hộp 2: "Code nhận tín hiệu"
- Hộp 3: "Mảnh di chuyển sang trái"
- Vẽ mũi tên nối 3 hộp

---

## 🎓 Tóm tắt

- **Code** = cách nói chuyện với máy tính
- **File** = ngăn chứa code, giống như tủ sách
- **game-constants.js** = con số không đổi
- **game-state.js** = trạng thái hiện tại
- **game-logic.js** = quy tắc game
- **Console** = nơi để thử nghiệm code

---

## 📚 Bài tiếp theo

[Bài 2: Game Loop - Vòng lặp game](02-game-loop.md)

Trong bài tiếp theo, chúng ta sẽ học:
- Game chạy như thế nào mỗi giây?
- Vòng lặp (loop) là gì?
- Tại sao mảnh Tetris tự động rơi xuống?
