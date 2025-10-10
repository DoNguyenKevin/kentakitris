# Hướng dẫn viết code "learnable" cho học sinh lớp 7

## 🎯 Mục tiêu

Mã nguồn này được thiết kế để **dạy học** cho học sinh lớp 7 (12 tuổi).  
Khi đóng góp code, hãy viết theo phong cách **dễ đọc, dễ hiểu, có tính giáo dục**.

---

## ✨ Nguyên tắc chung

### 1. Ngôn ngữ đơn giản
- ✅ Dùng từ ngữ dễ hiểu
- ✅ Giải thích thuật ngữ khi lần đầu xuất hiện
- ❌ Tránh thuật ngữ phức tạp hoặc tiếng Anh khó

**Ví dụ:**
```javascript
// ❌ Không tốt
// Asynchronous operation with promise-based API

// ✅ Tốt
// Chờ dữ liệu từ Firebase (chạy không đồng bộ)
```

### 2. Comment mang tính giáo dục
Mỗi hàm nên có:
- **Mục tiêu**: Hàm này làm gì?
- **Giải thích**: Cách hoạt động đơn giản
- **Ví dụ**: Ví dụ sử dụng cụ thể
- **Try it**: Hướng dẫn thử nghiệm

**Ví dụ:**
```javascript
/**
 * ✅ Lấy ngày hôm nay dạng "YYYY-MM-DD"
 * 
 * Mục tiêu: Trả về ngày hiện tại để so sánh hoặc lưu trữ
 * 
 * Cách hoạt động:
 * - Lấy thời gian hiện tại (Date)
 * - Chuyển thành chuỗi ISO (toISOString)
 * - Cắt bỏ phần giờ, chỉ giữ ngày
 * 
 * Ví dụ: "2025-10-10"
 * 
 * Try it: console.log(getTodayString());
 */
function getTodayString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}
```

### 3. Sử dụng emoji
Dùng emoji nhẹ nhàng để làm nổi bật:
- ✅ Mục tiêu/điều đúng
- ❌ Lỗi/điều sai
- ❓ Câu hỏi
- 💡 Gợi ý/trả lời
- ⚠️ Cảnh báo
- 🎮 Liên quan đến game
- 📊 Dữ liệu/thống kê

**Ví dụ:**
```javascript
// ✅ Mục tiêu: Di chuyển mảnh sang trái
// ❌ Lưu ý: Không dùng hàm này khi game đã dừng
// ❓ Thắc mắc: Tại sao cần kiểm tra va chạm?
// 💡 Trả lời: Để mảnh không đi xuyên tường!
```

---

## 📝 Template cho các phần tử code

### Template cho file

```javascript
// js/helpers/example-utils.js
// ======================================================
// ✅ Mô tả ngắn: File này làm gì?
// Giải thích chi tiết hơn về mục đích của file
// Liên kết với các file khác (nếu có)
// ======================================================

// Import (nếu cần)
import { CONSTANT } from './other-file.js';

// Code của file...
```

### Template cho hàm đơn giản

```javascript
/**
 * ✅ Mục tiêu: [Mô tả ngắn gọn]
 * 
 * Ví dụ: [Ví dụ cụ thể]
 * 
 * Try it: [Lệnh để thử nghiệm]
 */
export function simpleFunction(param) {
    // Implementation
}
```

### Template cho hàm phức tạp

```javascript
/**
 * ✅ Mục tiêu: [Mô tả ngắn gọn]
 * 
 * Cách hoạt động:
 * 1. [Bước 1]
 * 2. [Bước 2]
 * 3. [Bước 3]
 * 
 * Ví dụ: 
 * ```
 * const result = complexFunction(5, 10);
 * // result = 15
 * ```
 * 
 * Lưu ý: [Điều cần chú ý đặc biệt]
 * 
 * Try it: [Lệnh thử nghiệm]
 * 
 * @param {type} param1 - Mô tả tham số 1
 * @param {type} param2 - Mô tả tham số 2
 * @returns {type} Mô tả giá trị trả về
 */
export function complexFunction(param1, param2) {
    // Step 1: [Comment giải thích]
    const step1 = ...;
    
    // Step 2: [Comment giải thích]
    const step2 = ...;
    
    return result;
}
```

### Template cho constant

```javascript
// ✅ Mô tả: Giá trị này dùng để làm gì
// Ví dụ: BOARD_WIDTH = 10 → bàn chơi rộng 10 ô
// Try it: Thử đổi thành 15 để có bàn rộng hơn!
export const CONSTANT_NAME = value;
```

---

## 🎯 Ví dụ cụ thể

### Ví dụ 1: Helper function

```javascript
/**
 * ✅ Kiểm tra 1 số có chẵn không
 * 
 * Mục tiêu: Trả về true nếu số chẵn, false nếu số lẻ
 * 
 * Cách hoạt động:
 * - Dùng phép chia lấy dư (%)
 * - Nếu chia 2 dư 0 → chẵn
 * - Nếu chia 2 dư 1 → lẻ
 * 
 * Ví dụ:
 * - isEven(4) → true
 * - isEven(7) → false
 * 
 * Try it: console.log(isEven(10));
 */
export function isEven(number) {
    return number % 2 === 0;
}
```

### Ví dụ 2: Game logic

```javascript
/**
 * ✅ Di chuyển mảnh theo hướng cho trước
 * 
 * Mục tiêu: Thay đổi vị trí mảnh (trái/phải/xuống)
 * 
 * Cách hoạt động:
 * 1. Tạo bản sao mảnh với vị trí mới
 * 2. Kiểm tra va chạm (đụng tường/đáy/mảnh khác)
 * 3. Nếu an toàn → cập nhật vị trí
 * 4. Nếu va chạm → giữ nguyên, báo lỗi
 * 
 * Ví dụ:
 * - movePiece(-1, 0) → sang trái
 * - movePiece(1, 0)  → sang phải
 * - movePiece(0, 1)  → xuống dưới
 * 
 * Try it: Trong game, nhấn phím mũi tên!
 * 
 * @param {number} dx - Dịch chuyển ngang (-1=trái, 1=phải, 0=không đổi)
 * @param {number} dy - Dịch chuyển dọc (1=xuống, 0=không đổi)
 * @returns {boolean} true nếu di chuyển thành công, false nếu bị chặn
 */
export function movePiece(dx, dy) {
    // Kiểm tra có mảnh không
    if (!currentPiece) return false;
    
    // Tạo mảnh mới với vị trí dịch chuyển
    const newPiece = { 
        ...currentPiece, 
        x: currentPiece.x + dx, 
        y: currentPiece.y + dy 
    };

    // Kiểm tra va chạm
    if (!checkCollision(newPiece)) {
        setCurrentPiece(newPiece);  // Cập nhật
        drawBoard();                 // Vẽ lại
        return true;                 // Thành công
    }
    
    return false; // Va chạm, không di chuyển được
}
```

---

## 🎓 Câu hỏi và trả lời trong code

Thêm câu hỏi giáo dục ở cuối file hoặc sau các đoạn phức tạp:

```javascript
// ❓ Câu hỏi: Tại sao cần kiểm tra va chạm?
// 💡 Trả lời: Để mảnh không đi xuyên tường hoặc mảnh khác!
//            Giống như trong đời thực, vật thể không thể đi xuyên nhau.

// ❓ Câu hỏi: Tại sao dùng mảng 2 chiều cho board?
// 💡 Trả lời: Vì board có hàng và cột, giống như bàn cờ!
//            Mảng 2 chiều dễ biểu diễn lưới ô vuông.

// ❓ Thử nghiệm: Thay đổi BOARD_WIDTH từ 10 thành 15
// 💡 Kết quả: Bàn chơi sẽ rộng hơn, game dễ hơn!
```

---

## ❌ Những điều cần tránh

### 1. Tránh thuật ngữ phức tạp

```javascript
// ❌ Không tốt
// Implements polymorphic dispatch pattern

// ✅ Tốt
// Gọi hàm tương ứng dựa trên loại mảnh
```

### 2. Tránh code quá ngắn gọn không có comment

```javascript
// ❌ Không tốt
export const f = (x, y) => x % 2 === 0 && y % 2 === 0;

// ✅ Tốt
/**
 * ✅ Kiểm tra cả x và y có chẵn không
 */
export function areBothEven(x, y) {
    return x % 2 === 0 && y % 2 === 0;
}
```

### 3. Tránh giải thích quá dài dòng

```javascript
// ❌ Không tốt (quá dài)
/**
 * This function performs a modulo operation which is a mathematical
 * operation that finds the remainder after division of one number by another.
 * In this specific case, we're using modulo 2 to determine if a number
 * is divisible by 2 with no remainder, which is the definition of an even number.
 * [50 dòng nữa...]
 */

// ✅ Tốt (vừa đủ)
/**
 * ✅ Kiểm tra số chẵn
 * Dùng phép chia lấy dư (%). Số chia 2 dư 0 = chẵn.
 */
```

---

## 📚 Tài liệu tham khảo

Khi viết code mới, tham khảo:
- `js/helpers/name-utils.js` - Ví dụ chuẩn
- `js/game-constants.js` - Comment cho constants
- `js/game-pieces.js` - Comment cho logic phức tạp
- `docs/lesson/` - Các bài học mẫu

---

## ✅ Checklist trước khi commit

- [ ] Mọi hàm có comment giải thích mục tiêu
- [ ] Các thuật ngữ khó đã được giải thích
- [ ] Có ít nhất 1 ví dụ sử dụng
- [ ] Có "Try it" để học sinh thử nghiệm
- [ ] Dùng emoji phù hợp (✅❌❓💡)
- [ ] Ngôn ngữ đơn giản, dễ hiểu
- [ ] Tên biến/hàm rõ ràng (không viết tắt quá)
- [ ] Code vẫn chạy đúng (test trước khi commit)

---

## 🎉 Cảm ơn!

Cảm ơn bạn đã đóng góp vào dự án giáo dục này!  
Mỗi dòng code bạn viết sẽ giúp học sinh hiểu lập trình tốt hơn. 💪
