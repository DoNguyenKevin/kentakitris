# 🎨 Skills Visual Guide - Minh Họa Kỹ Năng

## 💣 Bomb - Bom (3x3 Explosion)

### Before (Trước):
```
████████████
██████░█████
██████████░█
██████░█████
████████████
```

### Bomb Lands Here (Đặt Bom):
```
████████████
██████⚠█████  ← Bomb piece lands
██████████░█
██████░█████
████████████
```

### After Explosion (Sau khi nổ):
```
████████████
████░░░░████  ← 3x3 area cleared!
████░░░░████
████░░░░████
████████████
```

---

## ✨ Magic Block - Khối Ma Thuật (Fill Gaps)

### Before (Trước - có gaps):
```
████████████
████░░██████  ← Gap (ô trống có block bên dưới)
████████████
████░░░█████  ← 3 gaps
████████████
```

### Magic Block Lands (Đặt Magic Block):
```
████████████
████⭐⭐█████  ← Gaps filled automatically!
████████████
████⭐⭐⭐████  ← All gaps filled!
████████████
```

---

## 🌀 Teleport - Dịch Chuyển (Click to Place)

### Normal Play (Chơi bình thường):
```
    ↓
   [T]        ← Piece falling from top
   
████████████
████░░██████
████████████
```

### Teleport Mode (Chế độ Teleport):
```
🟣🟣🟣🟣🟣🟣  ← Board glows purple
🟣[T]🟣🟣🟣🟣  ← Click anywhere!
🟣🟣🟣🟣🟣🟣     Cursor: ✚ (crosshair)
🟣🟣🟣🟣🟣🟣
████████████
████░░██████  ← Click here to teleport
████████████     piece into gap!
```

### After Click (Sau khi click):
```
████████████
████[T]█████  ← Piece teleported instantly!
████████████
```

---

## 🔺 Reverse Gravity - Đảo Trọng Lực (Pieces Float Up)

### Normal Gravity (Bình thường - rơi xuống):
```
    ↓
   [I]        ← Piece falls DOWN
   
████████████
████████████
████████████  ← Lands at BOTTOM
```

### Reverse Gravity (Đảo ngược - bay lên):
```
████████████  ← Lands at TOP!
████████████
████████████
   
   [I]        ← Piece floats UP
    ↑
```

### Spawn Position Changed (Vị trí xuất hiện thay đổi):
```
Normal:           Reverse Gravity:
   [New]          ████████████
    ↓              ████████████
████████████       ████████████
████████████       ████████████
████████████  ↔    ████████████
████████████       ████████████
████████████        ↑
████████████       [New]
```

---

## 📏 Wide Mode - Mở Rộng Bảng (10 → 12 Columns)

### Normal Board (Bảng bình thường - 10 cột):
```
┌──────────┐
│██████████│  10 columns
│██████████│
│██████████│
│██████████│
└──────────┘
```

### Wide Mode Active (Wide Mode hoạt động - 12 cột):
```
  ┌────────────┐
🔵│░██████████░│🔵  12 columns
🔵│░██████████░│🔵  (+ 1 column each side)
🔵│░██████████░│🔵  Blue border glow
🔵│░██████████░│🔵
  └────────────┘
  ░ = New empty columns
```

### When Deactivated (Khi tắt - trở về 10 cột):
```
  ┌────────────┐
  │░██████████░│  
  │░██████████░│  ⚠️ Warning!
  │░██████████░│  Blocks in gray area
  │░██████████░│  will be DELETED
  └────────────┘
      ↓
┌──────────┐
│██████████│  Back to 10 columns
│██████████│  (lost 1 column each side)
│██████████│
│██████████│
└──────────┘
```

---

## 🎮 Skill Activation Flow

### Level Up Screen:
```
╔══════════════════════════════════════╗
║     🎉 LEVEL UP! 🎉                  ║
║     Choose Your Power-up:            ║
╠══════════════════════════════════════╣
║  ┌────────┐ ┌────────┐ ┌────────┐  ║
║  │  💣    │ │  🌀    │ │  📏    │  ║
║  │  BOMB  │ │TELEPORT│ │  WIDE  │  ║
║  │        │ │        │ │  MODE  │  ║
║  │3x3 boom│ │ Click  │ │ 12 col │  ║
║  │Uncommon│ │  Rare  │ │Legendary│ ║
║  │        │ │        │ │        │  ║
║  │[SELECT]│ │[SELECT]│ │[SELECT]│  ║
║  └────────┘ └────────┘ └────────┘  ║
╚══════════════════════════════════════╝
```

### Active Skills Display (Top-right corner):
```
┌─────────────────────┐
│ Active Skills:      │
│ 🔺 (12s) ← Reverse  │
│ 📏 (∞) ← Wide Mode  │
│ 👻 (∞) ← Ghost      │
└─────────────────────┘
```

---

## 🎨 CSS Visual Effects

### Teleport Mode:
```
┌─────────────────────┐
│ 🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣 │  ← Purple glow
│ 🟣 Board      🟣 │     Pulsing animation
│ 🟣 glowing    🟣 │     Cursor: ✚
│ 🟣 purple     🟣 │
│ 🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣 │
└─────────────────────┘
```

### Wide Mode:
```
  ┌─────────────────┐
🔵│    Board        │🔵  ← Blue glow
🔵│    wider        │🔵     Royal blue border
🔵│    now!         │🔵
  └─────────────────┘
```

### Bomb Explosion (Animation):
```
Frame 1:           Frame 2:           Frame 3:
██████             ██☀███             ██░███
██⚠███    →        ☀⚠☀██    →        ░░░███
██████             ██☀███             ██░███

☀ = Exploding      ░ = Cleared
⚠ = Bomb center
```

---

## 🎯 Skill Combos - Tổ Hợp Skill

### Combo 1: Wide Mode + Magic Block
```
Before:
┌────────────┐
│░███░░█████░│  ← Many gaps
│░██████████░│
└────────────┘

After:
┌────────────┐
│░██████████░│  ← All gaps filled!
│░██████████░│     More space + auto-fill
└────────────┘
```

### Combo 2: Teleport + Ghost Mode
```
👻 Ghost shows where piece will land
🌀 Teleport lets you place piece anywhere

Result: Perfect placement every time!
```

### Combo 3: Reverse Gravity + Wide Mode
```
  ┌────────────┐
  │░          ░│  ← Pieces spawn at bottom
  │░    ↑↑↑   ░│  ← Float up in wide board
  │░ ████████ ░│
  │░ ████████ ░│
  └────────────┘
  
Very challenging but fun! 🎢
```

---

## 📱 Mobile UI

### Skill Selection on Mobile:
```
┌────────────────┐
│  Choose Skill  │
├────────────────┤
│   ┌──────┐     │
│   │ 💣   │     │
│   │BOMB  │     │
│   └──────┘     │
│   ┌──────┐     │
│   │ 🌀   │     │
│   │TELPT │     │
│   └──────┘     │
│   ┌──────┐     │
│   │ 📏   │     │
│   │WIDE  │     │
│   └──────┘     │
└────────────────┘
```

---

## 🎓 Learning Diagram

### How Skills Work (Flow):
```
Player Levels Up
       ↓
Show 3 Random Skills
       ↓
Player Clicks One
       ↓
   ┌───┴────┐
   ↓        ↓
Instant   Duration
   ↓        ↓
Execute   Set Timer
   ↓        ↓
 Done   Execute & Remove
```

### Module Structure:
```
js/
├── index-game.js  ← Main game
│   └── imports
│       ├── bomb-skill.js
│       ├── magic-block-skill.js
│       ├── teleport-skill.js
│       ├── reverse-gravity-skill.js
│       └── wide-mode-skill.js
```

---

## 🎬 Animation Timeline

### Bomb Explosion (0.5 seconds):
```
0.0s: 💣 Land
0.1s: ⚠️ Warning flash
0.2s: 💥 Explosion starts
0.3s: ☀️ Explosion grows
0.4s: 🌟 Peak brightness
0.5s: ░ Blocks cleared
```

### Wide Mode Transition (0.3 seconds):
```
0.0s: ┌──────┐  Normal
      └──────┘

0.1s: ┌──────┐  Start expanding
      └──────┘

0.2s: ┌───────┐ Expanding...
      └───────┘

0.3s: ┌────────┐ Done!
      └────────┘
```

---

**Note**: These are text representations. The actual game has colorful graphics and smooth animations! 🎮✨
