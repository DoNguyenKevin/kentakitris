# 🎬 Demo - Tính năng Nhập tên

## 🎮 Live Demo Flow

### Scenario 1: Lần đầu chơi
```
Step 1: Mở game
┌──────────────────────┐
│   PIXEL TETRIS       │
│   [START]            │
└──────────────────────┘

Step 2: Chơi game
┌──────────────────────┐
│  ▓▓                  │
│  ▓▓                  │
│  ▓▓▓▓                │
│  SCORE: 450          │
│  LEVEL: 3            │
└──────────────────────┘

Step 3: Game Over → Modal tự động hiện
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗    │
│   ║  🎮 GAME OVER!           ║    │
│   ║                          ║    │
│   ║  Your Score: 450         ║    │
│   ║  ═══════════════════     ║    │
│   ║                          ║    │
│   ║  Enter Your Name:        ║    │
│   ║  ┌────────────────────┐  ║    │
│   ║  │ [KHOI_______]      │  ║    │ ← Typing...
│   ║  └────────────────────┘  ║    │
│   ║  * Chỉ được đổi tên     ║    │
│   ║    1 lần/ngày           ║    │
│   ║                          ║    │
│   ║  [💾 SAVE SCORE] [SKIP] ║    │
│   ╚═══════════════════════════╝    │
└─────────────────────────────────────┘

Step 4: Click Save → Loading
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗    │
│   ║  [💾 SAVE SCORE] [SKIP]  ║    │
│   ║                          ║    │
│   ║  ⏳ Saving...            ║    │ ← Loading
│   ╚═══════════════════════════╝    │
└─────────────────────────────────────┘

Step 5: Success → Modal tự động đóng sau 2s
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗    │
│   ║  [💾 SAVE SCORE] [SKIP]  ║    │
│   ║                          ║    │
│   ║  ✅ Score saved: 450     ║    │ ← Success
│   ╚═══════════════════════════╝    │
└─────────────────────────────────────┘
     ⬇ (2 seconds later)
  Modal đóng, quay lại màn hình game
```

---

### Scenario 2: Chơi lại cùng ngày
```
Step 1: Click [RESTART]
┌──────────────────────┐
│   GAME OVER!         │
│   Score: 450         │
│   [RESTART]          │ ← Click
└──────────────────────┘

Step 2: Chơi game lần 2
┌──────────────────────┐
│  ▓▓▓                 │
│  ▓▓                  │
│  SCORE: 890          │ ← Điểm cao hơn!
└──────────────────────┘

Step 3: Game Over → Modal hiện, tên BỊ KHÓA
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗    │
│   ║  🎮 GAME OVER!           ║    │
│   ║                          ║    │
│   ║  Your Score: 890         ║    │
│   ║  ═══════════════════     ║    │
│   ║                          ║    │
│   ║  Playing as:             ║    │
│   ║  ┏━━━━━━━━━━━━━━━━━━━┓  ║    │
│   ║  ┃   KHOI             ┃  ║    │ ← Locked!
│   ║  ┗━━━━━━━━━━━━━━━━━━━┛  ║    │
│   ║  🔒 Bạn đã đặt tên hôm  ║    │
│   ║     nay. Quay lại vào   ║    │
│   ║     ngày mai để đổi tên.║    │
│   ║                          ║    │
│   ║  [💾 SAVE SCORE] [SKIP] ║    │
│   ╚═══════════════════════════╝    │
└─────────────────────────────────────┘

Step 4: Click Save → Score update với tên cũ
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗    │
│   ║  🎉 New High Score!       ║    │
│   ║  890 (Previous: 450)      ║    │ ← Điểm cao hơn → Update!
│   ╚═══════════════════════════╝    │
└─────────────────────────────────────┘
```

---

### Scenario 3: Ngày mới - Đổi tên lại
```
Step 1: Sang ngày mới (00:00)
📅 2025-10-10 → 2025-10-11

Step 2: Chơi game
┌──────────────────────┐
│  SCORE: 1200         │
└──────────────────────┘

Step 3: Game Over → Input field LẠI XUẤT HIỆN!
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗    │
│   ║  🎮 GAME OVER!           ║    │
│   ║                          ║    │
│   ║  Your Score: 1200        ║    │
│   ║  ═══════════════════     ║    │
│   ║                          ║    │
│   ║  Enter Your Name:        ║    │
│   ║  ┌────────────────────┐  ║    │
│   ║  │ KHOI              │  ║    │ ← Pre-filled
│   ║  └────────────────────┘  ║    │   nhưng có thể sửa!
│   ║  * Chỉ được đổi tên     ║    │
│   ║    1 lần/ngày           ║    │
│   ║                          ║    │
│   ║  [💾 SAVE SCORE] [SKIP] ║    │
│   ╚═══════════════════════════╝    │
└─────────────────────────────────────┘

Step 4: Sửa tên
┌─────────────────────────────────────┐
│   ║  ┌────────────────────┐  ║    │
│   ║  │ KEVIN             │  ║    │ ← Đổi thành KEVIN
│   ║  └────────────────────┘  ║    │
└─────────────────────────────────────┘

Step 5: Save → Tên mới được lưu
┌─────────────────────────────────────┐
│   ║  ✅ Score saved: 1200    ║    │
│   ║     Name: KEVIN          ║    │ ← Tên mới!
└─────────────────────────────────────┘
```

---

## 🎯 Interactive Elements

### Input Field (Unlocked)
```
┌─────────────────────────┐
│ [Your name here_____]   │ ← Cursor blink
└─────────────────────────┘
  ↑ Focus: Border vàng
  ↑ Typing: Text màu trắng
  ↑ Max 20 chars
```

### Input Field (Locked)
```
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃    KHOI                ┃ ← Bold, no cursor
┗━━━━━━━━━━━━━━━━━━━━━━━┛
  ↑ Locked icon: 🔒
  ↑ Gray text: explanation
```

### Save Button States
```
Normal:
[💾 SAVE SCORE]  ← Green, hover effect

Hover:
[💾 SAVE SCORE]  ← Lighter green, lift up

Clicked:
[💾 SAVE SCORE]  ← Press down effect

Loading:
[💾 SAVE SCORE]  ← Disabled, opacity 50%

Success:
[💾 SAVE SCORE]  ← Re-enabled, show message below
```

### Status Messages
```
Loading:
⏳ Saving...           ← Yellow

Success:
✅ Score saved: 1200   ← Green

Error:
❌ Error: Firebase...  ← Red

Warning:
⚠️ Your best score...  ← Yellow
```

---

## 📱 Mobile View

```
┌───────────────────────┐
│  🎮 GAME OVER!        │
│                       │
│  Your Score:          │
│      1200             │ ← Larger on mobile
│                       │
│  Enter Your Name:     │
│  ┌─────────────────┐  │
│  │ [______]        │  │ ← Bigger tap target
│  └─────────────────┘  │
│  * Chỉ được đổi tên  │ ← Smaller font
│    1 lần/ngày        │
│                       │
│  ┌─────────────────┐  │
│  │  💾 SAVE SCORE  │  │ ← Full width
│  └─────────────────┘  │
│  ┌─────────────────┐  │
│  │      SKIP       │  │
│  └─────────────────┘  │
└───────────────────────┘
```

---

## 🎨 Animations

### Modal Appear
```
Frame 1: Opacity 0, translateY(50px)
    [Modal ở dưới, invisible]

Frame 2: Opacity 0.5, translateY(25px)
    [Modal đang lên, half visible]

Frame 3: Opacity 1, translateY(0)
    [Modal ở vị trí, fully visible]

Duration: 0.3s
```

### Success Message
```
Frame 1: Text appears
    ✅ Score saved: 1200

Frame 2-4: Pulse effect
    ✅ Score saved: 1200  (scale 1.05)
    ✅ Score saved: 1200  (scale 1.0)

Frame 5: Hold 2s

Frame 6: Modal fade out
    [Opacity 1 → 0]
```

### Button Hover
```
Normal → Hover:
  translateY(0) → translateY(-2px)
  box-shadow: 0 0 → 0 4px 0 #000

Hover → Click:
  translateY(-2px) → translateY(0)
  box-shadow: 0 4px → 0 0

Duration: 0.1s
```

---

## 🎥 Video Script (nếu quay demo)

### 00:00 - 00:10: Intro
```
"Chào mọi người! Hôm nay mình demo tính năng 
nhập tên trong game Tetris"
```

### 00:10 - 00:30: First Play
```
[Screen: Chơi game]
"Lần đầu chơi, mình sẽ để game over nhanh..."
[Game over]
"Và đây! Modal tự động hiện ra cho phép mình nhập tên"
[Type: DEMO]
"Mình sẽ đặt tên là DEMO"
[Click Save]
"Score đã được lưu vào Firebase với tên DEMO"
```

### 00:30 - 00:50: Same Day Lock
```
[Click Restart]
"Giờ mình chơi lại..."
[Game over]
"Lần này, input bị khóa! Tại sao?"
"Vì mình đã đổi tên hôm nay rồi"
"Chỉ được đổi tên 1 lần mỗi ngày thôi nhé"
[Click Save]
"Nhưng vẫn save score được với tên DEMO"
```

### 00:50 - 01:10: Next Day
```
[Console: fake date]
"Giờ mình sẽ fake sang ngày mới..."
localStorage.setItem('lastNameChangeDate', '2025-01-01')
[Refresh, play, game over]
"Và voilà! Lại có thể đổi tên rồi"
[Change to: NEWNAME]
"Mình đổi thành NEWNAME"
[Save]
"Perfect! Tên mới đã được lưu"
```

### 01:10 - 01:30: Other Features
```
[Show Skip button]
"Nếu không muốn save, click SKIP"
[Show click outside]
"Hoặc click ra ngoài để đóng modal"
[Show mobile view]
"Và tất nhiên, responsive trên mobile"
```

### 01:30 - 01:40: Outro
```
"Vậy là xong! Tính năng đơn giản nhưng 
giúp game trở nên cá nhân hơn"
"Cảm ơn các bạn đã xem!"
```

---

## 📸 Screenshot Checklist

Khi chụp screenshots:
- [ ] Modal xuất hiện (first time, input visible)
- [ ] Modal locked (same day, name locked)
- [ ] Modal với tên dài (testing max length)
- [ ] Success message
- [ ] Error message
- [ ] Skip button hover
- [ ] Mobile view (portrait)
- [ ] Mobile view (landscape)
- [ ] Firebase Console showing data
- [ ] localStorage in DevTools

---

## 🎬 GIF Ideas

### GIF 1: Complete Flow (10s loop)
```
Play → Game Over → Type name → Save → Success → Close
→ Loop back
```

### GIF 2: Lock Feature (5s)
```
Game Over → Show locked name → Zoom on lock icon
→ Loop
```

### GIF 3: Validation (3s)
```
Type long name → Error message → Shake animation
→ Loop
```

### GIF 4: Mobile (5s)
```
Mobile view → Touch play → Game over → Modal fits screen
→ Loop
```

---

**Ready to record!** 🎥🎮
