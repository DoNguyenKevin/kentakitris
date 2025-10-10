# 🎮 Power-ups System - Keltris

## ⚡ Overview

Hệ thống 15+ kỹ năng đa dạng, xuất hiện khi **level up**. Mỗi lần lên level, người chơi được chọn 1 trong 3 kỹ năng ngẫu nhiên.

---

## 🎯 Power-ups List

### 🔥 Offensive Skills

#### 1. **🔥 Clear Bottom** (Common)
- **Effect**: Xóa ngay 2 hàng dưới cùng
- **Type**: Instant (kích hoạt ngay)
- **Use case**: Khi board gần đầy

#### 2. **💣 Bomb** (Uncommon)
- **Effect**: Xóa vùng 3x3 xung quanh piece tiếp theo
- **Type**: Next Piece (áp dụng cho piece tiếp theo)
- **Duration**: 1 lần
- **Use case**: Dọn khu vực khó

#### 3. **⚡ Laser Beam** (Rare)
- **Effect**: Xóa cả 1 cột (chọn cột nào)
- **Type**: Instant
- **Use case**: Dọn cột cao nhất

#### 4. **🎲 Random Clear** (Common)
- **Effect**: Xóa 5-10 blocks ngẫu nhiên
- **Type**: Instant
- **Use case**: May mắn, tạo gaps

---

### 🛡️ Defensive Skills

#### 5. **⏰ Slow Time** (Uncommon)
- **Effect**: Giảm 50% tốc độ rơi
- **Duration**: 30 giây
- **Type**: Duration (có thời hạn)
- **Use case**: Cần thời gian suy nghĩ

#### 6. **👻 Ghost Mode** (Rare)
- **Effect**: Hiển thị nơi piece sẽ rơi (permanent)
- **Type**: Permanent (vĩnh viễn)
- **Use case**: Chơi chính xác hơn

#### 7. **🛡️ Shield** (Legendary)
- **Effect**: Ngăn game over 1 lần
- **Type**: Passive (tự kích hoạt khi cần)
- **Use case**: Bảo hiểm an toàn

#### 8. **❄️ Time Freeze** (Rare)
- **Effect**: Piece không rơi tự động
- **Duration**: 10 giây
- **Type**: Duration
- **Use case**: Setup moves phức tạp

---

### 💎 Utility Skills

#### 9. **💰 Score Boost** (Common)
- **Effect**: +50% điểm số
- **Duration**: 20 giây
- **Type**: Duration
- **Use case**: Farm điểm cao

#### 10. **🔄 Swap Hold** (Rare)
- **Effect**: Giữ piece hiện tại, swap với piece đã hold
- **Type**: Permanent (như Tetris Effect)
- **Key**: Press 'H' to swap
- **Use case**: Save piece cho sau

#### 11. **🔮 Preview+** (Uncommon)
- **Effect**: Xem 3 pieces tiếp theo thay vì 1
- **Type**: Permanent
- **Use case**: Plan ahead

#### 12. **✨ Magic Block** (Uncommon)
- **Effect**: Piece tiếp theo tự động fill gaps
- **Type**: Next Piece
- **Duration**: 1 lần
- **Use case**: Smooth surface

---

### 🌀 Special Skills

#### 13. **🌀 Teleport** (Rare)
- **Effect**: Di chuyển piece đến bất kỳ đâu
- **Type**: Instant
- **Controls**: Click vào ô trên board
- **Use case**: Đặt piece ở vị trí khó

#### 14. **🔺 Reverse Gravity** (Legendary)
- **Effect**: Pieces bay lên thay vì rơi xuống
- **Duration**: 15 giây
- **Type**: Duration (crazy mode!)
- **Use case**: Unique gameplay

#### 15. **📏 Wide Mode** (Legendary)
- **Effect**: Board mở rộng thành 12 cột
- **Duration**: 25 giây
- **Type**: Duration
- **Use case**: Thoải mái hơn

---

## 🎲 Rarity System

### Rarity Tiers & Drop Rates

| Rarity | Color | Weight | Chance | Skills |
|--------|-------|--------|--------|--------|
| **Common** | 🟢 Green | 50% | ~50% | 4 skills |
| **Uncommon** | 🔵 Blue | 30% | ~30% | 5 skills |
| **Rare** | 🟣 Purple | 15% | ~15% | 5 skills |
| **Legendary** | 🟡 Gold | 5% | ~5% | 3 skills |

### Random Selection Algorithm
```javascript
// 3 random powerups mỗi level up
// Weighted random based on rarity
// No duplicates in same selection
```

---

## 🎮 Game Flow

### Level Up Trigger
```
Lines cleared = 10, 20, 30, 40...
    ↓
Level up! (Level 2, 3, 4...)
    ↓
Pause game
    ↓
Show Powerup Modal (3 choices)
    ↓
User clicks 1 powerup
    ↓
Activate powerup
    ↓
Resume game
```

### Modal UI
```
┌─────────────────────────────────────────┐
│       ⚡ LEVEL UP! ⚡                    │
│     Choose Your Power-up!               │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ 🔥       │  │ 💰       │  │ 🛡️     ││
│  │ Clear    │  │ Score    │  │ Shield ││
│  │ Bottom   │  │ Boost    │  │        ││
│  │          │  │          │  │        ││
│  │ [SELECT] │  │ [SELECT] │  │ [SELECT]││
│  └──────────┘  └──────────┘  └────────┘│
│                                         │
│  Active: 👻 Ghost, 💰 Score Boost      │
└─────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### Powerup Object Structure
```javascript
{
    id: 'CLEAR_BOTTOM',
    name: '🔥 Clear Bottom',
    description: 'Instantly clear the bottom 2 rows',
    icon: '🔥',
    rarity: 'common', // common | uncommon | rare | legendary
    color: 'orange',
    type: 'instant', // instant | nextPiece | duration | permanent | passive
    duration: null, // for duration type (ms)
    effect: function() { ... } // actual implementation
}
```

### State Management
```javascript
// Active powerups (duration-based)
activePowerups = [
    { id: 'SLOW_TIME', endTime: timestamp },
    { id: 'SCORE_BOOST', endTime: timestamp }
]

// Permanent powerups (permanent)
permanentPowerups = ['GHOST_PIECE', 'SWAP_PIECE']

// Passive powerups (trigger-based)
shieldActive = true

// Timers
powerupTimers = {
    'SLOW_TIME': intervalId,
    'SCORE_BOOST': intervalId
}
```

---

## 💡 Skill Effects Implementation

### Instant Skills
```javascript
// Execute immediately, one-time effect
function activateClearBottom() {
    // Remove bottom 2 rows
    board.splice(BOARD_HEIGHT - 2, 2);
    // Add 2 empty rows at top
    board.unshift(
        Array(BOARD_WIDTH).fill(0),
        Array(BOARD_WIDTH).fill(0)
    );
    drawBoard();
}
```

### Duration Skills
```javascript
// Effect for specific time
function activateSlowTime() {
    const originalDelay = dropDelay;
    dropDelay = dropDelay * 2; // 50% slower
    
    setTimeout(() => {
        dropDelay = originalDelay;
    }, 30000); // 30s
    
    restartDropInterval();
}
```

### Permanent Skills
```javascript
// Stays forever (until game over)
function activateGhostPiece() {
    permanentPowerups.push('GHOST_PIECE');
    // Update drawBoard() to show ghost
}
```

### Passive Skills
```javascript
// Auto-trigger when condition met
function checkShield() {
    if (shieldActive && gameWouldEnd()) {
        // Clear top rows instead of game over
        board.splice(0, 5);
        for (let i = 0; i < 5; i++) {
            board.push(Array(BOARD_WIDTH).fill(0));
        }
        shieldActive = false;
        return true; // prevented game over
    }
    return false;
}
```

---

## 🎨 UI/UX Features

### Powerup Card (選択時)
```
┌──────────────────┐
│     🔥           │ ← Icon (big)
│  Clear Bottom    │ ← Name
│  ──────────────  │
│  Instantly clear │ ← Description
│  the bottom 2    │
│  rows            │
│  ──────────────  │
│  [Common]        │ ← Rarity badge
│                  │
│  [  SELECT  ]    │ ← Button
└──────────────────┘
```

### Active Powerups Display
```
Screen corner:
┌─────────────────┐
│ Active:         │
│ 👻 Ghost (∞)   │ ← Permanent
│ ⏰ Slow (15s)  │ ← Duration left
│ 🛡️ Shield (1)  │ ← Uses left
└─────────────────┘
```

### Powerup Activation Animation
```
1. Flash effect khi activate
2. Status text: "🔥 Clear Bottom activated!"
3. Visual effect (particles, shake, glow...)
4. Sound effect (optional)
```

---

## 📊 Balance & Strategy

### Tier List (Meta)

**S-Tier** (Always pick):
- 🛡️ Shield - Prevents death
- 👻 Ghost Mode - Permanent advantage
- 🔄 Swap Hold - Flexibility

**A-Tier** (Very strong):
- ⏰ Slow Time - Consistent value
- 🔮 Preview+ - Planning
- ⚡ Laser Beam - Clutch saves

**B-Tier** (Situational):
- 💣 Bomb - Good mid-game
- 💰 Score Boost - High score runs
- ❄️ Time Freeze - Combo setup

**C-Tier** (Fun but risky):
- 🔺 Reverse Gravity - Hard to use
- 📏 Wide Mode - Requires adaptation
- 🎲 Random Clear - RNG

### Synergies
```
👻 Ghost + 🔄 Swap = Perfect planning
⏰ Slow Time + 💰 Score Boost = Safe high score
🛡️ Shield + 🔺 Reverse Gravity = Safe experimentation
```

---

## 🔮 Future Ideas

### Additional Powerups
- 🎯 **Precision Drop**: Piece teleports to cursor position
- 🌈 **Rainbow Piece**: Piece matches any color when clearing
- 🔥 **Combo Master**: Each line clear increases multiplier
- 🎪 **Random Shape**: Next 3 pieces are random custom shapes
- 🔨 **Hammer**: Click to destroy any single block
- 🎁 **Mystery Box**: Random powerup instantly

### Powerup Upgrades
- Collect same powerup → Upgrade
  - Clear Bottom → Clear Bottom 3 (3 rows)
  - Slow Time 30s → Slow Time 60s
  - Shield 1x → Shield 2x

### Powerup Combinations
- Select 2 powerups at once (cost: skip next level up)
- Fuse powerups for unique effects

---

## ✅ Implementation Checklist

### Phase 1: Core System
- [x] Define powerup constants
- [x] Create modal HTML
- [ ] Random selection algorithm
- [ ] Modal show/hide logic
- [ ] Powerup activation dispatcher

### Phase 2: Skills (Instant)
- [ ] Clear Bottom
- [ ] Laser Beam
- [ ] Random Clear

### Phase 3: Skills (Duration)
- [ ] Slow Time
- [ ] Score Boost
- [ ] Time Freeze
- [ ] Reverse Gravity
- [ ] Wide Mode

### Phase 4: Skills (Permanent)
- [ ] Ghost Mode
- [ ] Swap Hold
- [ ] Preview+

### Phase 5: Skills (Advanced)
- [ ] Bomb (Next Piece)
- [ ] Magic Block
- [ ] Teleport
- [ ] Shield (Passive)

### Phase 6: UI/UX
- [ ] Powerup cards styling
- [ ] Active powerups display
- [ ] Activation animations
- [ ] Duration countdown
- [ ] Rarity colors

### Phase 7: Polish
- [ ] Sound effects
- [ ] Particle effects
- [ ] Tooltips
- [ ] Tutorial
- [ ] Balance testing

---

## 🧪 Testing

### Test Scenarios

**Test 1: Level Up Flow**
```
1. Play to 10 lines
2. Level up → Modal shows
3. Check: 3 unique powerups displayed
4. Select one → Modal closes
5. Powerup activated
```

**Test 2: Duration Skills**
```
1. Activate Slow Time
2. Check: Drop delay doubled
3. Wait 30s
4. Check: Drop delay restored
```

**Test 3: Permanent Skills**
```
1. Activate Ghost Mode
2. Move piece
3. Check: Ghost piece visible
4. Game over → Restart
5. Check: Ghost mode gone
```

**Test 4: Multiple Powerups**
```
1. Activate Slow Time
2. Level up again
3. Activate Score Boost
4. Check: Both active
5. Check: UI shows both
```

**Test 5: Shield**
```
1. Activate Shield
2. Play until game would end
3. Check: Shield triggers, clears top
4. Check: shieldActive = false
5. Next game over → Real game over
```

---

**Status**: 📝 Design Complete, Ready for Implementation!
