# 🔧 Tài Liệu Kỹ Thuật - Skills Implementation

## 📁 Cấu Trúc File (File Structure)

```
js/
├── index-game.js           # File chính chứa game logic
└── powerups/               # Thư mục chứa các module skill
    ├── bomb-skill.js           # Kỹ năng Bomb 💣
    ├── magic-block-skill.js    # Kỹ năng Magic Block ✨
    ├── teleport-skill.js       # Kỹ năng Teleport 🌀
    ├── reverse-gravity-skill.js # Kỹ năng Reverse Gravity 🔺
    └── wide-mode-skill.js      # Kỹ năng Wide Mode 📏
```

## 🎯 Kiến Trúc Module (Modular Architecture)

Mỗi skill được tách thành **module riêng biệt** với các lý do sau:

### Ưu Điểm:
1. **Dễ Bảo Trì**: Mỗi skill có logic riêng, dễ debug
2. **Tái Sử Dụng**: Có thể import vào file khác
3. **Dễ Mở Rộng**: Thêm skill mới không ảnh hưởng code cũ
4. **Giáo Dục**: Học sinh dễ hiểu từng phần riêng biệt
5. **Testing**: Test từng skill độc lập

### Module Pattern:
```javascript
// Mỗi file export các hàm cần thiết
export function activateSkill() { ... }
export function deactivateSkill() { ... }
export function checkStatus() { ... }
```

---

## 💣 Bomb Skill - Kỹ Năng Bom

### File: `js/powerups/bomb-skill.js`

### Các Hàm Chính:

#### `activateBombEffect(board, piece, BOARD_WIDTH, BOARD_HEIGHT)`
**Mục đích**: Tạo vụ nổ 3x3 xung quanh vị trí mảnh ghép

**Tham số**:
- `board`: Mảng 2D đại diện cho bảng game
- `piece`: Object chứa thông tin mảnh ghép {x, y, shape, color}
- `BOARD_WIDTH`, `BOARD_HEIGHT`: Kích thước bảng

**Thuật toán**:
1. Tìm tâm của mảnh ghép (trung bình tọa độ các ô)
2. Duyệt vòng 3x3 xung quanh tâm
3. Xóa các ô (đặt = 0)
4. Kiểm tra biên để tránh lỗi out of bounds

**Code Example**:
```javascript
// Trong lockPiece()
if (BombSkill.hasBombPending(activePowerups)) {
    BombSkill.activateBombEffect(board, currentPiece, BOARD_WIDTH, BOARD_HEIGHT);
    activePowerups = BombSkill.consumeBombUse(activePowerups);
}
```

**Độ phức tạp**: O(1) - chỉ duyệt 9 ô cố định

---

## ✨ Magic Block Skill - Kỹ Năng Khối Ma Thuật

### File: `js/powerups/magic-block-skill.js`

### Các Hàm Chính:

#### `activateMagicBlockEffect(board, piece, BOARD_WIDTH, BOARD_HEIGHT)`
**Mục đích**: Tự động lấp đầy các khoảng trống (gaps)

**Thuật toán**:
1. Tìm hàng thấp nhất của mảnh ghép
2. Gọi `findGaps()` để tìm tất cả gaps từ hàng đó trở xuống
3. Sắp xếp gaps theo độ ưu tiên (gap sâu nhất trước)
4. Lấp đầy tối đa 5 gaps bằng màu của mảnh

#### `findGaps(board, startRow, BOARD_WIDTH, BOARD_HEIGHT)`
**Mục đích**: Tìm các ô trống có ô không trống bên dưới

**Thuật toán**:
```
Gap = ô trống (0) có ít nhất 1 ô không trống bên dưới

Ví dụ:
  X   ← Không phải gap (không có gì bên dưới)
  □   ← GAP! (có X bên dưới)
  X
```

**Code Example**:
```javascript
// Tìm gap
for (let y = startRow; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x] === 0) {
            if (hasBlockBelow(board, x, y)) {
                gaps.push({x, y, priority: BOARD_HEIGHT - y});
            }
        }
    }
}
```

**Độ phức tạp**: O(W × H) trong trường hợp xấu nhất

---

## 🌀 Teleport Skill - Kỹ Năng Dịch Chuyển

### File: `js/powerups/teleport-skill.js`

### Các Hàm Chính:

#### `activateTeleportMode(boardElement, onTeleport)`
**Mục đích**: Kích hoạt chế độ click-to-place

**Cách hoạt động**:
1. Thêm class `teleport-mode` vào board (CSS effect)
2. Đăng ký event listener cho sự kiện click
3. Khi click, tính toán tọa độ cell từ pixel
4. Gọi callback `onTeleport(cellX, cellY)`
5. Trả về hàm để deactivate

**Tính toán tọa độ**:
```javascript
const rect = boardElement.getBoundingClientRect();
const clickX = event.clientX - rect.left;
const clickY = event.clientY - rect.top;

const blockWidth = rect.width / BOARD_WIDTH;
const blockHeight = rect.height / BOARD_HEIGHT;

const cellX = Math.floor(clickX / blockWidth);
const cellY = Math.floor(clickY / blockHeight);
```

#### `tryTeleport(currentPiece, targetX, targetY, checkCollision)`
**Mục đích**: Kiểm tra và thực hiện teleport

**Thuật toán**:
1. Tạo mảnh mới với vị trí mục tiêu
2. Kiểm tra va chạm
3. Nếu không va chạm → return mảnh mới
4. Nếu va chạm → return null

**Integration**:
```javascript
case 'TELEPORT':
    teleportDeactivator = TeleportSkill.activateTeleportMode(
        boardEl,
        (cellX, cellY) => {
            const newPiece = TeleportSkill.tryTeleport(
                currentPiece, cellX, cellY, checkCollision
            );
            if (newPiece) {
                currentPiece = newPiece;
                drawBoard();
                teleportDeactivator();
            }
        }
    );
    break;
```

---

## 🔺 Reverse Gravity Skill - Kỹ Năng Đảo Trọng Lực

### File: `js/powerups/reverse-gravity-skill.js`

### Các Hàm Chính:

#### `getGravityDirection()`
**Mục đích**: Trả về hướng di chuyển (-1 = lên, +1 = xuống)

#### `moveWithGravity(currentPiece, movePiece)`
**Mục đích**: Di chuyển mảnh theo hướng trọng lực hiện tại

#### `adjustSpawnPosition(piece, BOARD_WIDTH, BOARD_HEIGHT)`
**Mục đích**: Đặt mảnh mới ở vị trí phù hợp

**Logic**:
- **Bình thường**: Spawn ở trên cùng (y = 0)
- **Reverse Gravity**: Spawn ở dưới cùng (y = BOARD_HEIGHT - piece.shape.length)

**Thay Đổi Trong Game Logic**:

```javascript
// gameTick() - thay đổi hướng di chuyển
if (ReverseGravitySkill.isReverseGravityActive()) {
    moved = ReverseGravitySkill.moveWithGravity(currentPiece, movePiece);
} else {
    moved = movePiece(0, 1); // Bình thường: xuống
}

// Spawn mảnh mới
if (ReverseGravitySkill.isReverseGravityActive()) {
    currentPiece = ReverseGravitySkill.adjustSpawnPosition(
        currentPiece, BOARD_WIDTH, BOARD_HEIGHT
    );
}
```

**Challenges**:
- Hard drop cần đảo ngược (đẩy lên trần thay vì xuống đáy)
- Collision check cần xem xét trần thay vì sàn
- Rendering vẫn như cũ (không cần đổi)

---

## 📏 Wide Mode Skill - Kỹ Năng Mở Rộng Bảng

### File: `js/powerups/wide-mode-skill.js`

### Các Hàm Chính:

#### `activateWideMode(board, BOARD_HEIGHT, newWidth = 12)`
**Mục đích**: Mở rộng bảng từ 10 → 12 cột

**Thuật toán**:
1. Tính số cột cần thêm: `addColumns = newWidth - originalWidth = 2`
2. Phân bổ: `leftPadding = 1`, `rightPadding = 1`
3. Tạo bảng mới:
   ```javascript
   newRow = [
       ...Array(1).fill(0),  // 1 cột trống bên trái
       ...oldRow,             // 10 cột gốc
       ...Array(1).fill(0)    // 1 cột trống bên phải
   ]
   ```

**Ví dụ**:
```
Before (10 cột):          After (12 cột):
██████████                █░██████████░█
██████████        →       █░██████████░█
██████████                █░██████████░█
                          (█ = viền, ░ = cột mới)
```

#### `deactivateWideMode(board, BOARD_HEIGHT)`
**Mục đích**: Thu hẹp bảng về 10 cột

**Thuật toán**:
1. Tính vị trí cắt: `leftCut = 1`, `rightBound = 11`
2. Cắt mỗi hàng: `newRow = row.slice(1, 11)`
3. **LƯU Ý**: Các ô ngoài biên sẽ BỊ MẤT!

#### `updateBoardDisplay(boardElement, width)`
**Mục đích**: Cập nhật CSS để hiển thị đúng số cột

```javascript
boardElement.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
```

**Thay Đổi Trong Game Logic**:
- `BOARD_WIDTH` phải là **biến** (let) thay vì const
- Tất cả collision check phải dùng `board[0].length` (chiều rộng động)
- Spawn position phải điều chỉnh cho bảng rộng

---

## 🔄 Integration Flow - Luồng Tích Hợp

### 1. Khi Chọn Skill (activatePowerup)

```javascript
function activatePowerup(powerup) {
    switch (powerup.type) {
        case 'instant':
            activateInstantPowerup(powerup);  // TELEPORT
            break;
        case 'duration':
            activateDurationPowerup(powerup); // REVERSE_GRAVITY, WIDE_PIECE
            break;
        case 'nextPiece':
            activateNextPiecePowerup(powerup); // BOMB, MAGIC_BLOCK
            break;
    }
}
```

### 2. Khi Mảnh Được Đặt (lockPiece)

```javascript
function lockPiece() {
    // 1. Khóa mảnh vào board
    currentPiece.shape.forEach(...);
    
    // 2. Kích hoạt nextPiece effects
    if (BombSkill.hasBombPending(activePowerups)) {
        BombSkill.activateBombEffect(...);
    }
    
    if (MagicBlockSkill.hasMagicBlockPending(activePowerups)) {
        MagicBlockSkill.activateMagicBlockEffect(...);
    }
}
```

### 3. Mỗi Tick (gameTick)

```javascript
function gameTick() {
    // 1. Di chuyển theo trọng lực
    if (ReverseGravitySkill.isReverseGravityActive()) {
        moved = ReverseGravitySkill.moveWithGravity(...);
    } else {
        moved = movePiece(0, 1);
    }
    
    // 2. Nếu không di chuyển được, lock và spawn mới
    if (!moved) {
        lockPiece();
        spawnNextPiece();
        
        // 3. Điều chỉnh vị trí spawn
        if (ReverseGravitySkill.isReverseGravityActive()) {
            currentPiece = ReverseGravitySkill.adjustSpawnPosition(...);
        }
        if (WideModeSkill.isWideModeActive()) {
            currentPiece = WideModeSkill.adjustPieceForWideMode(...);
        }
    }
}
```

### 4. Khi Skill Hết Hạn (removePowerup)

```javascript
function removePowerup(powerupId) {
    // 1. Xóa khỏi danh sách active
    activePowerups = activePowerups.filter(p => p.id !== powerupId);
    
    // 2. Hoàn nguyên hiệu ứng
    switch (powerupId) {
        case 'REVERSE_GRAVITY':
            ReverseGravitySkill.deactivateReverseGravity();
            break;
        case 'WIDE_PIECE':
            board = WideModeSkill.deactivateWideMode(board, BOARD_HEIGHT);
            BOARD_WIDTH = ORIGINAL_BOARD_WIDTH;
            break;
    }
}
```

---

## 🎨 CSS Styling

### Teleport Mode:
```css
#game-board.teleport-mode {
    cursor: crosshair;
    box-shadow: 0 0 20px 5px rgba(138, 43, 226, 0.6);
    animation: teleport-pulse 1s ease-in-out infinite;
}
```

### Wide Mode:
```css
#game-board.wide-mode {
    border-color: #4169e1;
    box-shadow: 0 0 15px 3px rgba(65, 105, 225, 0.5);
}
```

---

## 🧪 Testing Checklist

### Bomb Skill:
- [ ] Nổ đúng vùng 3x3
- [ ] Không bị lỗi ở biên bảng
- [ ] Tự động tắt sau khi dùng
- [ ] Visual effect rõ ràng

### Magic Block:
- [ ] Tìm được tất cả gaps
- [ ] Lấp đầy gaps sâu nhất trước
- [ ] Không lấp đầy quá 5 ô
- [ ] Màu ô lấp đúng với mảnh

### Teleport:
- [ ] Click được vào board
- [ ] Tính toán tọa độ chính xác
- [ ] Không teleport vào vị trí va chạm
- [ ] Tắt mode sau khi dùng
- [ ] CSS effect hiển thị đúng

### Reverse Gravity:
- [ ] Mảnh bay lên thay vì rơi
- [ ] Spawn ở đáy
- [ ] Hard drop đẩy lên trần
- [ ] Tắt đúng sau 15s
- [ ] Không ảnh hưởng logic khác

### Wide Mode:
- [ ] Mở rộng đúng 12 cột
- [ ] Các ô cũ ở giữa
- [ ] Thu hẹp đúng sau 25s
- [ ] Ô ngoài biên bị xóa
- [ ] CSS grid update đúng

---

## 📚 Học Tập & Giáo Dục

### Concepts Học Sinh Học Được:

1. **Module Pattern**: Tách code thành các module nhỏ
2. **Callbacks**: Teleport dùng callback function
3. **State Management**: Quản lý trạng thái skill
4. **Event Handling**: Click events trong Teleport
5. **Array Manipulation**: Mở rộng/thu hẹp bảng
6. **Algorithm Design**: Tìm gaps, tính tâm vụ nổ
7. **CSS Animations**: Hiệu ứng visual

### Bài Tập:

1. **Dễ**: Thêm console.log vào mỗi hàm để hiểu flow
2. **Trung Bình**: Tạo skill mới "Shuffle" - xáo trộn ngẫu nhiên
3. **Khó**: Implement "Undo" - hoàn tác bước vừa đi

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot read property of undefined"
**Cause**: board hoặc piece là null/undefined  
**Fix**: Kiểm tra null trước khi dùng
```javascript
if (!board || !currentPiece) return;
```

### Issue 2: Wide Mode không thu hẹp đúng
**Cause**: Quên reset BOARD_WIDTH  
**Fix**: Luôn reset trong deactivateWideMode
```javascript
BOARD_WIDTH = ORIGINAL_BOARD_WIDTH;
```

### Issue 3: Teleport click không hoạt động
**Cause**: Event listener chưa được thêm  
**Fix**: Kiểm tra boardElement có tồn tại không

### Issue 4: Reverse Gravity spawn sai vị trí
**Cause**: Quên điều chỉnh y position  
**Fix**: Dùng adjustSpawnPosition()

---

## 🚀 Future Enhancements

### Có Thể Thêm:
1. **Sound Effects**: Tiếng nổ cho Bomb, âm thanh teleport
2. **Particle Effects**: Hiệu ứng hạt khi skill activate
3. **Skill Combos**: Bonus khi dùng 2 skill cùng lúc
4. **Skill Cooldowns**: Thời gian chờ giữa các lần dùng
5. **Skill Shop**: Mua skill bằng điểm

### Optimization:
1. **Debounce**: Giảm số lần update khi Wide Mode active
2. **Lazy Loading**: Chỉ load module khi cần
3. **Memoization**: Cache các tính toán phức tạp

---

*Tài liệu này dành cho giáo viên và học sinh lớn hơn muốn hiểu sâu về code.*
