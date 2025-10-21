# ⚡ Energy Blocks Feature

## 📖 Tổng quan

Energy Blocks (Khối năng lượng) là tính năng đặc biệt xuất hiện ở độ khó **Hard** và **Impossible**. Đây là những khối nguy hiểm rơi từ trên xuống, nếu chạm vào hoặc để chúng chạm đáy sẽ **GAME OVER** ngay lập tức!

## 🎮 Tính năng theo độ khó

### 🟠 Hard Mode
- **Tỷ lệ xuất hiện**: 10% mỗi khi spawn mảnh mới
- **Tốc độ rơi**: 3 giây/ô (chậm)
- **Màu sắc**: Cyan sáng (0x00FFFF)
- **Đặc điểm**: 
  - Chỉ cần tránh không cho chạm đáy
  - Không có hiệu ứng nổ
  - Dễ quản lý hơn

### 🔴 Impossible Mode
- **Tỷ lệ xuất hiện**: 20% mỗi khi spawn mảnh mới
- **Tốc độ rơi**: 0.8 giây/ô (rất nhanh!)
- **Màu sắc**: Magenta/Hồng tím (0xFF00FF)
- **Đặc điểm**:
  - ⚠️ **CÓ THỂ NỔ** khi chuột đến gần (100 pixels)
  - 💥 Nổ → Đóng băng chuột 3 giây!
  - Có dấu X đỏ ở giữa để cảnh báo
  - CỰC KỲ NGUY HIỂM!

## 🔧 Chi tiết kỹ thuật

### Cấu trúc dữ liệu

```typescript
interface EnergyBlock {
    x: number;              // Vị trí cột (0-9)
    y: number;              // Vị trí hàng (0-19)
    color: number;          // Màu sắc (hex)
    dropSpeed: number;      // Tốc độ rơi (ms/ô)
    lastDropTime: number;   // Lần rơi cuối (timestamp)
    canExplode: boolean;    // Có thể nổ không?
    explosionDistance?: number;  // Khoảng cách nổ (pixels)
    freezeDuration?: number;     // Thời gian đóng băng (ms)
}
```

### Các phương thức chính

1. **shouldSpawnEnergyBlock()**: Kiểm tra có nên spawn không (dựa vào spawnChance)
2. **createEnergyBlock()**: Tạo energy block mới với config từ difficulty
3. **trySpawnEnergyBlock()**: Gọi khi spawn mảnh mới để thử tạo energy block
4. **updateEnergyBlocks()**: Cập nhật vị trí và kiểm tra va chạm
5. **initMouseTracking()**: Theo dõi vị trí chuột (Impossible mode)
6. **checkMouseProximity()**: Tính khoảng cách chuột-block, trigger explosion
7. **explodeEnergyBlock()**: Hiệu ứng nổ + đóng băng chuột
8. **freezeMouse()**: Đóng băng chuột trong thời gian nhất định

### Game Over Conditions

Energy blocks gây game over khi:
1. ❌ Chạm đáy board (y >= BOARD_HEIGHT)
2. ❌ Va chạm với mảnh đã khóa trên board

## 🎨 Hiệu ứng đồ họa

### Rendering
- Energy blocks được vẽ với độ trong suốt 0.8
- Viền sáng (glow) màu trắng
- Khối có thể nổ (Impossible) có dấu X đỏ cảnh báo

### Explosion Animation
- Vòng tròn mở rộng từ 5px → 50px
- 3 lớp: màu block, màu trắng, hiệu ứng sóng
- Mờ dần theo thời gian (alpha: 1 → 0)
- Thời gian: 500ms

### Mouse Frozen Effect
- Text "🧊 MOUSE FROZEN! 🧊" xuất hiện giữa màn hình
- Nhấp nháy liên tục (alpha: 1 ↔ 0.3)
- Tự động biến mất sau khi hết thời gian

## 📚 Tham khảo

### Files liên quan
- `src/game/constants/DifficultyConstants.ts`: Cấu hình energy blocks
- `src/game/scenes/Game.ts`: Implementation chính
- `src/js/energy-blocks.js`: Logic gốc (HTML version)

### Công thức tính khoảng cách (Pythagoras)
```
distance = √((mouseX - blockX)² + (mouseY - blockY)²)
```

## 🎯 Tips cho người chơi

### Hard Mode
- Quan sát energy blocks xuất hiện ở đâu
- Xếp mảnh để tránh cột có energy blocks
- Ưu tiên xóa hàng nhanh để giảm nguy cơ va chạm

### Impossible Mode
- ⚠️ GIỮ CHUỘT XA KHỎI ENERGY BLOCKS!
- Nếu bị đóng băng → Dùng bàn phím để điều khiển
- Đừng để nhiều energy blocks cùng lúc
- Chơi cực kỳ cẩn thận!

## ✅ Testing Checklist

- [x] Energy blocks xuất hiện ở Hard mode (10% chance)
- [x] Energy blocks xuất hiện ở Impossible mode (20% chance)
- [x] Energy blocks rơi xuống đúng tốc độ
- [x] Chạm đáy → Game Over
- [x] Va chạm với mảnh → Game Over
- [x] Mouse proximity detection (Impossible)
- [x] Explosion animation hoạt động
- [x] Mouse freeze effect hoạt động
- [x] Rendering đúng màu sắc và hiệu ứng

## 🐛 Known Issues

Không có issue nào được phát hiện trong implementation hiện tại.

## 📝 Notes

- Energy blocks không bị ảnh hưởng bởi gravity của mảnh Tetris
- Chúng có hệ thống rơi riêng biệt (dropSpeed độc lập)
- Có thể có nhiều energy blocks cùng lúc
- Không giới hạn số lượng energy blocks trên board
