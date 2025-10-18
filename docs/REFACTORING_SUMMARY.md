# 📋 Tài liệu Refactoring Game.ts

## 🎯 Mục tiêu

File `Game.ts` ban đầu có **1206 dòng code**, quá dài và khó maintain. Mục tiêu của refactoring này là chia nhỏ thành các module độc lập, dễ đọc và dễ bảo trì.

## ✅ Kết quả

### Trước refactoring:
- `Game.ts`: **1206 dòng** - chứa tất cả logic

### Sau refactoring:
- `Game.ts`: **677 dòng** (giảm 44% ↓)
- `GameConstants.ts`: **113 dòng** - Constants và interfaces
- `EnergyBlockManager.ts`: **451 dòng** - Quản lý energy blocks
- `GameRenderer.ts`: **190 dòng** - Quản lý rendering

**Tổng kết:** Code được chia thành 4 file rõ ràng, mỗi file có trách nhiệm riêng!

## 📁 Cấu trúc mới

```
src/game/
├── scenes/
│   └── Game.ts          (677 dòng) - Scene chính, điều phối game
├── constants/
│   ├── DifficultyConstants.ts  (đã có) - Độ khó
│   └── GameConstants.ts        (MỚI) - Constants game
├── managers/
│   └── EnergyBlockManager.ts   (MỚI) - Quản lý energy blocks
└── helpers/
    └── GameRenderer.ts         (MỚI) - Vẽ game lên màn hình
```

## 📝 Chi tiết các file mới

### 1. GameConstants.ts
**Mục đích:** Chứa tất cả constants và type definitions của game

**Nội dung:**
- `BOARD_WIDTH`, `BOARD_HEIGHT`, `BLOCK_SIZE` - Kích thước board
- `COLORS` - Màu sắc các mảnh Tetris
- `SHAPES` - Hình dạng 7 loại mảnh
- `FROZEN_TEXT_BLINK_CYCLE` - Chu kỳ nhấp nháy
- `interface Piece` - Cấu trúc mảnh Tetris
- `interface EnergyBlock` - Cấu trúc energy block

**Lợi ích:**
- ✅ Dễ thay đổi constants (không cần sửa Game.ts)
- ✅ Có thể import vào nhiều file khác
- ✅ Tất cả constants ở 1 chỗ, dễ tìm

### 2. EnergyBlockManager.ts
**Mục đích:** Quản lý tất cả logic liên quan đến Energy Blocks

**Chức năng:**
- Spawn energy blocks (random theo difficulty)
- Cập nhật vị trí (tự động rơi)
- Kiểm tra va chạm (chạm đáy, chạm mảnh → game over)
- Theo dõi chuột (Impossible mode)
- Tạo hiệu ứng nổ
- Đóng băng chuột

**Phương thức chính:**
- `trySpawnEnergyBlock()` - Thử spawn block mới
- `update()` - Cập nhật tất cả blocks
- `render()` - Vẽ blocks lên màn hình
- `init()` - Khởi tạo mouse tracking

**Lợi ích:**
- ✅ Tách logic phức tạp ra khỏi Game.ts
- ✅ Dễ test riêng energy blocks
- ✅ Có thể tái sử dụng trong các scene khác

### 3. GameRenderer.ts
**Mục đích:** Quản lý việc vẽ game lên màn hình

**Chức năng:**
- Vẽ board (viền, lưới, mảnh đã khóa)
- Vẽ mảnh hiện tại (current piece)
- Vẽ mảnh tiếp theo (next piece preview)

**Phương thức chính:**
- `render(board, currentPiece, nextPiece)` - Vẽ toàn bộ
- `renderBoard(board)` - Vẽ board
- `renderCurrentPiece(piece)` - Vẽ mảnh hiện tại
- `renderNextPiece(piece)` - Vẽ mảnh tiếp theo

**Lợi ích:**
- ✅ Tách logic rendering ra khỏi game logic
- ✅ Dễ thay đổi cách vẽ (VD: thêm hiệu ứng)
- ✅ Code Game.ts ngắn gọn hơn

## 🔄 Thay đổi trong Game.ts

### Trước:
```typescript
// Game.ts chứa mọi thứ
const BOARD_WIDTH = 10;
const COLORS = [...];
const SHAPES = [...];

class Game {
    energyBlocks: EnergyBlock[];
    boardGraphics: Graphics;
    pieceGraphics: Graphics;
    
    update() {
        this.updateEnergyBlocks(); // 50+ dòng
        this.render();             // 100+ dòng
    }
    
    updateEnergyBlocks() { /* 50 dòng */ }
    render() { /* 100 dòng */ }
    // ... 10 phương thức energy block khác
}
```

### Sau:
```typescript
// Game.ts giờ ngắn gọn
import { BOARD_WIDTH, SHAPES, Piece } from '../constants/GameConstants';
import { EnergyBlockManager } from '../managers/EnergyBlockManager';
import { GameRenderer } from '../helpers/GameRenderer';

class Game {
    energyBlockManager: EnergyBlockManager;
    gameRenderer: GameRenderer;
    
    create() {
        this.gameRenderer = new GameRenderer(this, 200, 50);
        this.energyBlockManager = new EnergyBlockManager(
            this, this.difficulty, 200, 50, this.board, 
            () => this.endGame()
        );
        this.energyBlockManager.init();
    }
    
    update() {
        this.energyBlockManager.update(); // 1 dòng!
        this.render();
    }
    
    render() {
        this.gameRenderer.render(this.board, this.currentPiece, this.nextPiece);
        this.energyBlockManager.render();
    }
}
```

## 📊 So sánh trước và sau

| Aspect | Trước | Sau | Cải thiện |
|--------|-------|-----|-----------|
| **Số dòng Game.ts** | 1206 | 677 | ↓ 44% |
| **Số file** | 1 | 4 | Tách module rõ ràng |
| **Logic Energy Blocks** | Trong Game.ts | EnergyBlockManager.ts | Dễ maintain |
| **Rendering** | Trong Game.ts | GameRenderer.ts | Tách biệt |
| **Constants** | Trong Game.ts | GameConstants.ts | Dễ tìm và sửa |
| **Khả năng test** | Khó | Dễ | Mỗi module độc lập |
| **Khả năng tái sử dụng** | Không | Có | Các helper dùng được ở nhiều nơi |

## 🎓 Bài học cho học sinh

### 1. **Nguyên tắc Single Responsibility (Trách nhiệm duy nhất)**
Mỗi class/file chỉ nên làm 1 việc:
- `GameConstants.ts` → Chỉ chứa constants
- `EnergyBlockManager.ts` → Chỉ quản lý energy blocks
- `GameRenderer.ts` → Chỉ vẽ game
- `Game.ts` → Điều phối chính

### 2. **Tách logic phức tạp thành module riêng**
Khi 1 class quá dài (>500-1000 dòng):
- Tìm phần code có logic riêng biệt
- Tách thành class/helper mới
- Import và sử dụng

### 3. **Constants nên để ở file riêng**
Lợi ích:
- Dễ thay đổi giá trị
- Nhiều file có thể dùng chung
- Tránh "magic numbers" (số bí ẩn) trong code

### 4. **Manager Pattern**
Khi có logic phức tạp (VD: energy blocks):
- Tạo 1 Manager class
- Manager quản lý state và logic
- Scene chỉ cần gọi manager

## ✅ Checklist khi refactoring

- [x] Tách constants ra file riêng
- [x] Tách logic phức tạp thành manager
- [x] Tách rendering logic
- [x] Cập nhật import statements
- [x] Test build thành công
- [ ] Test game chạy bình thường
- [ ] Code review
- [ ] Security check

## 🚀 Tương lai

### Có thể refactor thêm:
1. **PieceManager** - Quản lý spawn, move, rotate pieces
2. **ScoreManager** - Quản lý điểm, level, lines
3. **CollisionDetector** - Kiểm tra va chạm
4. **InputHandler** - Xử lý keyboard input

### Khi nào nên refactor?
- ❗ File > 500-1000 dòng
- ❗ Có logic phức tạp riêng biệt
- ❗ Code khó đọc, khó maintain
- ❗ Muốn tái sử dụng code

## 📚 Tài liệu tham khảo

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code by Robert Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring by Martin Fowler](https://refactoring.com/)

---

**Tác giả:** GitHub Copilot Agent  
**Ngày:** 2025-10-17  
**Version:** 1.0
