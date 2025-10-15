# Bài 6: Giới thiệu Phaser Game Engine

## 🎮 Phaser là gì?

**Phaser** là một game engine (công cụ làm game) chuyên nghiệp cho HTML5.

### Game Engine = Bộ công cụ làm game

Giống như:
- **Word** = Công cụ viết văn bản
- **Photoshop** = Công cụ chỉnh ảnh
- **Phaser** = Công cụ làm game

### Tại sao dùng Phaser?

❌ **Không dùng Phaser:**
```javascript
// Phải viết code vẽ từng ô, xử lý input, tính toán va chạm...
// Rất nhiều code phức tạp! (hàng ngàn dòng)
```

✅ **Dùng Phaser:**
```javascript
// Phaser làm sẵn mọi thứ, ta chỉ cần gọi!
this.add.text(100, 100, 'Hello!'); // Dễ dàng!
```

---

## 🏗️ Cấu trúc Phaser Game

### 1. Game Config (Cấu hình)

File: `src/game/main.ts`

```typescript
const config = {
    width: 1024,      // Chiều rộng game
    height: 768,      // Chiều cao game
    parent: 'game-container', // Vị trí render
    scene: [Boot, Preloader, MainMenu, Game, GameOver]
};
```

**Giải thích:**
- `width`, `height` = Kích thước cửa sổ game
- `parent` = ID của HTML element chứa game
- `scene` = Danh sách các màn hình (scenes)

### 2. Scenes (Màn hình)

**Scene = Màn hình trong game**

Kentakitris có 5 scenes:

| Scene | Mô tả |
|-------|-------|
| `Boot` | Khởi động game (chạy đầu tiên) |
| `Preloader` | Hiển thị loading bar |
| `MainMenu` | Menu chính (Click to Start) |
| `Game` | Gameplay chính (chơi Tetris) |
| `GameOver` | Màn hình kết thúc |

**Sơ đồ chuyển scene:**

```
Boot → Preloader → MainMenu → Game → GameOver → MainMenu
                                 ↑                    ↓
                                 └────────────────────┘
```

---

## 📝 Lifecycle của Phaser Scene

Mỗi scene có 4 phương thức quan trọng:

### 1. `constructor()`
```typescript
constructor() {
    super('MyScene'); // Đặt tên scene
}
```
- Chạy khi tạo scene lần đầu
- Dùng để khởi tạo

### 2. `init(data)`
```typescript
init(data) {
    // Nhận dữ liệu từ scene trước
}
```
- Chạy trước `preload()`
- Nhận dữ liệu từ scene khác

### 3. `preload()`
```typescript
preload() {
    this.load.image('logo', 'assets/logo.png');
}
```
- Load assets (ảnh, âm thanh...)
- Kentakitris: Không cần load gì!

### 4. `create()`
```typescript
create() {
    // Tạo game objects
    this.add.text(100, 100, 'Hello!');
}
```
- Chạy sau `preload()`
- Tạo các đối tượng game

### 5. `update()`
```typescript
update() {
    // Chạy 60 lần/giây
    // Xử lý input, di chuyển...
}
```
- Chạy liên tục (60 FPS)
- Game loop chính

**Timeline:**

```
constructor → init → preload → create → update (lặp mãi)
```

---

## 🎨 Phaser Graphics

Kentakitris dùng **Graphics API** để vẽ (không dùng ảnh):

### Tạo Graphics Object

```typescript
const graphics = this.add.graphics();
```

### Vẽ hình chữ nhật

```typescript
// Vẽ hình đặc (filled)
graphics.fillStyle(0xFF0000, 1);  // Màu đỏ, không trong suốt
graphics.fillRect(100, 100, 50, 50); // x, y, width, height

// Vẽ viền (stroke)
graphics.lineStyle(2, 0x00FF00);  // Độ dày 2, màu xanh lá
graphics.strokeRect(200, 100, 50, 50);
```

### Ví dụ: Vẽ ô Tetris

```typescript
// 1 ô = 30x30 pixels, màu hồng
graphics.fillStyle(0xFF6B9D, 1);
graphics.fillRect(x * 30, y * 30, 30, 30);
```

**❓ Câu hỏi:** Tại sao nhân với 30?  
**💡 Trả lời:** Vì mỗi ô = 30x30 pixels! (BLOCK_SIZE = 30)

---

## 📝 Phaser Text

### Tạo Text Object

```typescript
const text = this.add.text(x, y, 'Hello!', {
    fontFamily: 'Arial',
    fontSize: '32px',
    color: '#FFFFFF'
});
```

### Căn giữa Text

```typescript
text.setOrigin(0.5); // 0.5 = giữa (0 = trái, 1 = phải)
```

### Cập nhật Text

```typescript
scoreText.setText('Score: 100'); // Thay đổi nội dung
```

---

## ⌨️ Phaser Input

### Keyboard (Bàn phím)

```typescript
// Tạo cursor keys (mũi tên)
this.cursors = this.input.keyboard.createCursorKeys();

// Trong update()
if (this.cursors.left.isDown) {
    // Phím ← đang được giữ
}

if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
    // Phím ← vừa được bấm (không giữ)
}
```

### Mouse/Touch (Chuột/Chạm)

```typescript
// Click 1 lần
this.input.once('pointerdown', () => {
    console.log('Clicked!');
});

// Click nhiều lần
this.input.on('pointerdown', () => {
    console.log('Clicked again!');
});
```

---

## 🔄 Phaser Timer

### Tạo Timer

```typescript
this.time.addEvent({
    delay: 1000,              // 1000ms = 1 giây
    callback: () => {
        console.log('Tick!');
    },
    loop: true                // Lặp mãi
});
```

### Delay Call (Gọi sau X giây)

```typescript
this.time.delayedCall(2000, () => {
    console.log('After 2 seconds!');
});
```

---

## ✨ Phaser Tweens (Animation)

**Tween = Animation (hiệu ứng chuyển động)**

### Ví dụ: Nhấp nháy Text

```typescript
this.tweens.add({
    targets: text,      // Đối tượng muốn animate
    alpha: 0.3,         // Mờ xuống 30%
    duration: 1000,     // Trong 1 giây
    yoyo: true,         // Quay lại (mờ → sáng → mờ...)
    repeat: -1          // Lặp mãi (-1 = vô hạn)
});
```

### Ví dụ: Di chuyển Object

```typescript
this.tweens.add({
    targets: sprite,
    x: 500,             // Di chuyển đến x = 500
    duration: 2000,     // Trong 2 giây
    ease: 'Power2'      // Easing (chuyển động mượt)
});
```

---

## 📡 EventBus (Giao tiếp React ↔ Phaser)

### Gửi Event từ Phaser

```typescript
import { EventBus } from '../EventBus';

EventBus.emit('game-over', { score: 100 });
```

### Nhận Event trong React

```typescript
import { EventBus } from './game/EventBus';

EventBus.on('game-over', (data) => {
    console.log('Score:', data.score);
});
```

**Giống như gửi tin nhắn!**

---

## 🎯 Thử nghiệm

### Bài tập 1: Thêm Text

Mở `src/game/scenes/Game.ts`, thêm vào `create()`:

```typescript
this.add.text(400, 50, 'HELLO PHASER!', {
    fontSize: '24px',
    color: '#FF0000'
});
```

Chạy game → Thấy chữ màu đỏ!

### Bài tập 2: Vẽ hình vuông

Thêm vào `create()`:

```typescript
const graphics = this.add.graphics();
graphics.fillStyle(0x00FF00, 1);
graphics.fillRect(100, 100, 100, 100);
```

Chạy game → Thấy vuông xanh lá!

### Bài tập 3: Thay đổi màu board

Trong `Game.ts`, tìm dòng:

```typescript
this.camera.setBackgroundColor(0x0d0d1a);
```

Đổi thành:

```typescript
this.camera.setBackgroundColor(0xFF00FF); // Màu tím!
```

Chạy game → Board màu tím!

---

## 📚 Tài liệu tham khảo

### Official Docs
- [Phaser 3 Documentation](https://newdocs.phaser.io/)
- [Phaser Examples](https://labs.phaser.io/)

### Kentakitris Files
- `src/game/main.ts` - Game config
- `src/game/scenes/Game.ts` - Main gameplay
- `src/game/EventBus.ts` - Event system

---

## ❓ Câu hỏi ôn tập

### 1. Scene là gì?
**Trả lời:** Màn hình trong game (Menu, Game, GameOver...)

### 2. Phaser có mấy lifecycle methods chính?
**Trả lời:** 5 methods: constructor, init, preload, create, update

### 3. update() chạy bao nhiêu lần/giây?
**Trả lời:** 60 lần/giây (60 FPS)

### 4. Tween dùng để làm gì?
**Trả lời:** Tạo animation (hiệu ứng chuyển động)

### 5. EventBus dùng để làm gì?
**Trả lời:** Giao tiếp giữa React và Phaser

---

## 🎉 Tổng kết

Bạn đã học:
- ✅ Phaser là game engine chuyên nghiệp
- ✅ Cấu trúc: Config → Scenes → Lifecycle
- ✅ Vẽ bằng Graphics API (không cần ảnh)
- ✅ Xử lý input (keyboard, mouse)
- ✅ Tạo animation với Tweens
- ✅ Giao tiếp với EventBus

**Bài tiếp theo:** Tích hợp Firebase với Phaser!

---

## 💡 Tips

### Debugging
```typescript
// Log trong Console
console.log('Debug:', this.score);

// Hiển thị FPS
this.add.text(10, 10, 'FPS: ' + this.game.loop.actualFps);
```

### Best Practices
- ✅ Chia code thành nhiều files nhỏ
- ✅ Dùng comment để giải thích
- ✅ Test từng tính năng riêng
- ✅ Đọc Phaser docs khi cần

---

**Made with ❤️ for students!**
