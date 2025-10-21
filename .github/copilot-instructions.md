# GitHub Copilot Instructions - Learnable Repository

## 🎓 Repository Purpose

Kentakitris là một **repository giáo dục (Learnable Repository)** được thiết kế đặc biệt để dạy lập trình cho học sinh lớp 7 (12 tuổi). Mục tiêu chính là giữ nguyên tất cả chức năng của game, nhưng làm cho code dễ đọc, dễ hiểu và có tính dạy học.

## 🎯 Core Principles

Khi tạo code hoặc gợi ý code trong repository này, hãy tuân thủ các nguyên tắc sau:

### 1. **Ngôn ngữ đơn giản**
- ✅ Sử dụng tiếng Việt cho tất cả comment
- ✅ Giải thích thuật ngữ khó khi lần đầu xuất hiện
- ✅ Tránh thuật ngữ kỹ thuật phức tạp
- ✅ Dùng ví dụ đời thường để minh họa

**Ví dụ tốt:**
```typescript
// ✅ Kiểm tra va chạm (collision)
// Collision = mảnh chạm tường hoặc chạm mảnh khác
// Giống như khi bạn đẩy hộp đến tường, nó không đi xuyên được!
```

**Ví dụ không tốt:**
```typescript
// ❌ Check collision using AABB algorithm
```

### 2. **Comment mang tính giáo dục**

Mỗi hàm nên có cấu trúc comment đầy đủ:
- **Mục tiêu**: Hàm này làm gì?
- **Cách hoạt động**: Giải thích từng bước đơn giản
- **Ví dụ**: Ví dụ cụ thể
- **Try it**: Hướng dẫn thử nghiệm

**Template chuẩn:**
```typescript
/**
 * ✅ Mục tiêu: [Mô tả ngắn gọn]
 * 
 * Cách hoạt động:
 * 1. [Bước 1]
 * 2. [Bước 2]
 * 3. [Bước 3]
 * 
 * Ví dụ: [Ví dụ cụ thể]
 * 
 * Try it: [Lệnh để thử nghiệm]
 * 
 * ❓ Câu hỏi: [Câu hỏi để suy nghĩ]
 * 💡 Trả lời: [Câu trả lời]
 */
```

### 3. **Sử dụng emoji để làm nổi bật**
- ✅ Mục tiêu/điều đúng
- ❌ Lỗi/điều sai/cảnh báo
- ❓ Câu hỏi
- 💡 Gợi ý/trả lời
- 🎮 Liên quan đến game
- 📊 Dữ liệu
- 🔄 Vòng lặp
- 🎨 Hiển thị/render

### 4. **Chia nhỏ logic phức tạp**

Thay vì viết một hàm dài, chia thành nhiều hàm nhỏ với tên rõ ràng:

```typescript
// ❌ Không tốt: Hàm dài, khó hiểu
function doEverything() {
    // 50 dòng code...
}

// ✅ Tốt: Chia nhỏ, dễ hiểu
function kiemTraVaCham() { ... }
function diChuyenManh() { ... }
function capNhatDiem() { ... }
```

### 5. **Tên biến/hàm rõ ràng**

- ✅ Dùng tên dài, mô tả rõ ràng
- ✅ Tiếng Anh hoặc Tiếng Việt không dấu đều được
- ❌ Tránh viết tắt khó hiểu

```typescript
// ✅ Tốt
const currentPiecePosition = { x: 5, y: 0 };
const isGameOver = false;

// ❌ Không tốt
const cp = { x: 5, y: 0 };
const go = false;
```

### 6. **Thêm câu hỏi giáo dục**

Sau các đoạn code phức tạp, thêm câu hỏi để học sinh suy nghĩ:

```typescript
// ❓ Câu hỏi: Tại sao cần kiểm tra `y >= 0`?
// 💡 Trả lời: Vì mảnh có thể spawn ở trên board (y âm),
//            chỉ vẽ phần nhìn thấy!
```

## 📝 Template cho Phaser Code

### File Header Template
```typescript
// src/game/scenes/Example.ts
// ======================================================
// ✅ Scene này làm gì trong game?
// Giải thích chi tiết về vai trò của scene
// Liên kết với các scene khác (nếu có)
// ======================================================

import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Example extends Scene {
    // Code...
}
```

### Phaser Scene Method Template
```typescript
/**
 * ✅ Mục tiêu: [Mô tả phương thức]
 * 
 * Phương thức này được Phaser tự động gọi khi [điều kiện]
 * 
 * Cách hoạt động:
 * 1. [Bước 1]
 * 2. [Bước 2]
 * 
 * Try it: [Cách test]
 */
```

### Game Constants Template
```typescript
// 🎮 Hằng số game (Game Constants)
// Những con số này định nghĩa kích thước và quy tắc của game

// 📏 Kích thước board
const BOARD_WIDTH = 10;  // 10 cột (giống Tetris gốc)
const BOARD_HEIGHT = 20; // 20 hàng

// ❓ Thử thay đổi: BOARD_WIDTH = 15 → board rộng hơn!
```

## 🎮 Phaser-Specific Guidelines

### 1. **Giải thích Phaser Concepts**

Khi dùng các khái niệm Phaser, luôn giải thích đơn giản:

```typescript
// 🎮 Scene = Màn hình trong game
// Mỗi scene là 1 màn hình khác nhau: Menu, Game, GameOver...
// Phaser tự động chuyển đổi giữa các scene

export class Game extends Scene {
    // 🎨 Graphics = Công cụ vẽ của Phaser
    // Dùng để vẽ hình chữ nhật, đường, tô màu...
    boardGraphics: Phaser.GameObjects.Graphics;
}
```

### 2. **Giải thích Game Loop**

```typescript
// 🔄 Game Loop = Vòng lặp game
// Phaser tự động gọi update() 60 lần/giây
// → Tạo hiệu ứng chuyển động mượt mà!

update() {
    // Code chạy mỗi frame (1/60 giây)
}
```

### 3. **Giải thích Event System**

```typescript
// 📡 Event System = Hệ thống sự kiện
// Cho phép các phần khác nhau của game "nói chuyện" với nhau
// Giống như gửi tin nhắn giữa các bạn!

EventBus.emit('game-over', { score: 100 });
// → Gửi tin "game over" với điểm số
```

## 📚 Educational Documentation

### Mỗi file code nên có:
1. **File header** giải thích mục đích
2. **Function comments** chi tiết
3. **Inline comments** cho logic phức tạp
4. **Questions & Answers** để học sinh suy nghĩ

### Liên kết với tài liệu học:
Khi thêm code mới, cân nhắc cập nhật:
- `docs/lesson/` - Các bài học
- `docs/CONTRIBUTING-EDU.md` - Hướng dẫn đóng góp
- `docs/CHECKLIST-EDU.md` - Checklist kiểm tra

## ✅ Checklist khi tạo code mới

- [ ] Comment bằng tiếng Việt dễ hiểu
- [ ] Mỗi hàm có comment đầy đủ (Mục tiêu, Cách hoạt động, Ví dụ, Try it)
- [ ] Thuật ngữ khó được giải thích
- [ ] Có ít nhất 1 câu hỏi giáo dục (❓ và 💡)
- [ ] Tên biến/hàm rõ ràng, không viết tắt khó hiểu
- [ ] Dùng emoji phù hợp (✅❌❓💡🎮)
- [ ] Logic phức tạp được chia nhỏ
- [ ] Code vẫn hoạt động đúng (không phá vỡ chức năng)

## 🎯 Examples

### Ví dụ 1: Comment cho hàm di chuyển
```typescript
/**
 * ✅ Mục tiêu: Di chuyển mảnh Tetris theo hướng cho trước
 * 
 * Cách hoạt động:
 * 1. Tạo vị trí mới = vị trí hiện tại + độ dịch chuyển (dx, dy)
 * 2. Kiểm tra va chạm tại vị trí mới
 * 3. Nếu không va chạm → di chuyển thành công
 * 4. Nếu va chạm → giữ nguyên vị trí cũ
 * 
 * Ví dụ: movePiece(1, 0) → di chuyển sang phải 1 ô
 *        movePiece(0, 1) → di chuyển xuống 1 ô
 * 
 * Try it: Trong game, nhấn phím ← hoặc → để thử!
 * 
 * ❓ Câu hỏi: Tại sao cần kiểm tra va chạm trước khi di chuyển?
 * 💡 Trả lời: Để mảnh không đi xuyên tường hoặc mảnh khác!
 *            Giống trong đời thực, vật thể không thể xuyên nhau.
 */
movePiece(dx: number, dy: number): boolean {
    if (!this.currentPiece) return false;
    
    // Tính toán vị trí mới
    this.currentPiece.x += dx;
    this.currentPiece.y += dy;
    
    // Kiểm tra va chạm
    if (this.checkCollision(this.currentPiece)) {
        // Va chạm! Quay lại vị trí cũ
        this.currentPiece.x -= dx;
        this.currentPiece.y -= dy;
        return false; // Thất bại
    }
    
    return true; // Thành công!
}
```

### Ví dụ 2: Comment cho constants
```typescript
// 🎮 Hằng số game - Định nghĩa kích thước board
// ======================================================

// 📏 Chiều rộng board = 10 cột
// Đây là kích thước chuẩn của Tetris gốc (1984)
const BOARD_WIDTH = 10;

// 📏 Chiều cao board = 20 hàng
// Người chơi nhìn thấy 20 hàng, nhưng có thêm vài hàng ẩn ở trên
const BOARD_HEIGHT = 20;

// 📐 Kích thước mỗi ô = 30 pixels
// Mỗi ô vuông trên board có kích thước 30x30 pixels
const BLOCK_SIZE = 30;

// ❓ Thử nghiệm: Thay đổi BLOCK_SIZE = 40 → Mỗi ô to hơn!
// ❓ Thử nghiệm: Thay đổi BOARD_WIDTH = 15 → Board rộng hơn!
```

## 🚀 Deployment Guidelines

Khi đề xuất thay đổi:
1. **Giữ nguyên chức năng** - Không phá vỡ game hiện tại
2. **Thêm giá trị giáo dục** - Mỗi thay đổi phải giúp học sinh hiểu rõ hơn
3. **Test kỹ lưỡng** - Đảm bảo code vẫn chạy đúng
4. **Cập nhật tài liệu** - Thêm vào docs/lesson/ nếu cần

## 📖 References

Tham khảo các file mẫu đã có:
- `src/js/helpers/name-utils.js` - Ví dụ helper functions
- `src/js/game-logic.js` - Ví dụ game logic
- `docs/CONTRIBUTING-EDU.md` - Hướng dẫn chi tiết
- `docs/lesson/` - Các bài học mẫu

---

**Ghi nhớ:** Mục tiêu chính là giúp học sinh lớp 7 hiểu code, không phải viết code ngắn gọn nhất! 🎓
