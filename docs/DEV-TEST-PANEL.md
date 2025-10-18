# Dev Test Panel - Power-ups Testing

## 🧪 Tổng quan

Dev Test Panel là công cụ dành cho developer để test các chức năng Power-ups một cách dễ dàng trong quá trình phát triển.

## 🎯 Cách sử dụng

### Mở Dev Test Panel

Trong khi đang chơi game (Game scene), nhấn phím **D** để mở/đóng Dev Test Panel.

### Giao diện Panel

Panel hiển thị 5 power-ups:

1. **💣 Bom (Bomb)** - Nổ tung 3x3 khi đặt mảnh
2. **✨ Khối Ma Thuật (Magic Block)** - Lấp đầy khoảng trống
3. **🔺 Đảo Trọng Lực (Reverse Gravity)** - Mảnh bay lên thay vì rơi
4. **🌀 Dịch Chuyển (Teleport)** - Click để dịch chuyển mảnh
5. **📏 Mở Rộng (Wide Mode)** - Tăng chiều rộng board

### Các tính năng

#### Activate Button
- Click nút **Activate** để kích hoạt power-up ngay lập tức
- Power-up sẽ hoạt động với số uses/duration đã cấu hình

#### Uses Control (Bomb, Magic Block, Teleport)
- Hiển thị "Uses: [số]"
- Nút **-**: Giảm số lần sử dụng
- Nút **+**: Tăng số lần sử dụng
- Phạm vi: 1 đến 10 lần

#### Duration Control (Reverse Gravity, Wide Mode)
- Hiển thị "Sec: [số giây]"
- Nút **-**: Giảm thời gian hoạt động
- Nút **+**: Tăng thời gian hoạt động
- Phạm vi: 1 đến 60 giây

#### Reset All Button
- Nút **🔄 Reset All Power-ups**
- Tắt tất cả power-ups đang hoạt động
- Hữu ích khi muốn bắt đầu test lại từ đầu

#### Close Button
- Nút **✕** ở góc trên bên phải
- Đóng panel (hoặc nhấn D lần nữa)

## 🎮 Ví dụ sử dụng

### Test Bomb với 3 lần sử dụng
1. Mở panel (nhấn D)
2. Tại hàng "💣 Bom", click nút **+** ở "Uses" để tăng lên 3
3. Click nút **Activate**
4. Đặt 3 mảnh xuống để thấy hiệu ứng nổ 3 lần

### Test Reverse Gravity với 30 giây
1. Mở panel (nhấn D)
2. Tại hàng "🔺 Đảo Trọng Lực", click nút **+** ở "Sec" nhiều lần để tăng lên 30
3. Click nút **Activate**
4. Quan sát mảnh bay lên trong 30 giây

### Test nhiều power-ups cùng lúc
1. Activate Teleport (1 lần)
2. Activate Wide Mode (20 giây)
3. Sử dụng cả hai cùng lúc để test tương tác

## 💡 Tips

- Panel có depth cao (1000) nên luôn hiển thị trên cùng
- Không ảnh hưởng đến gameplay khi panel đóng
- Có thể mở panel bất cứ lúc nào trong game
- Keyboard shortcuts (1-5) vẫn hoạt động song song với panel

## 🔧 Technical Details

### Files
- **DevTestPanel.ts**: Component chính
- **Game.ts**: Tích hợp vào Game scene
- **PowerUpManager.ts**: Xử lý logic power-ups

### Keyboard Shortcuts

Panel sử dụng phím **D** (không conflict với các phím điều khiển game):
- ← → : Di chuyển mảnh
- ↑ : Xoay mảnh
- Space: Thả nhanh
- 1-5: Phím tắt power-ups (vẫn hoạt động)
- **D: Toggle Dev Panel** ✨ (MỚI)

## 🎨 Customization

Để thay đổi phím mở panel, sửa trong `Game.ts`:

```typescript
// Thay D bằng phím khác (ví dụ: F1)
this.input.keyboard!.on('keydown-F1', () => this.devTestPanel.toggle());
```

Để thay đổi giá trị min/max của Uses/Duration, sửa trong `DevTestPanel.ts`:

```typescript
// Trong createNumberControl()
step: number,      // Bước tăng/giảm (1 hoặc 1000ms)
max: number,       // Giá trị tối đa
```

## 📊 Default Values

| Power-up | Type | Default Uses | Default Duration |
|----------|------|--------------|------------------|
| Bomb | Uses | 1 | - |
| Magic Block | Uses | 1 | - |
| Reverse Gravity | Duration | - | 15s |
| Teleport | Uses | 1 | - |
| Wide Mode | Duration | - | 20s |

## 🐛 Troubleshooting

**Panel không mở?**
- Đảm bảo đang ở Game scene (không phải MainMenu)
- Thử nhấn D lại
- Check console có lỗi không

**Activate không hoạt động?**
- Kiểm tra console log (có message "💣 Bom activated!" ...)
- Đảm bảo PowerUpManager đã được khởi tạo

**Giá trị Uses/Duration không thay đổi?**
- Click chính xác vào nút +/-
- Đã đạt min (1) hoặc max (10/60)

---

**Tác giả**: Copilot  
**Ngày tạo**: 2025-01  
**Phiên bản**: 1.0
