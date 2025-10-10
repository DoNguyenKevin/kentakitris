# 🎴 Quick Reference - Name Input Feature

## 📋 One-Page Cheat Sheet

### ⚡ TL;DR
Game Over → Modal hiện → Nhập tên (max 20 chars) → Save → Chỉ được đổi 1 lần/ngày

---

## 🔑 Key Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `getTodayString()` | Get today's date (YYYY-MM-DD) | `"2025-10-10"` |
| `canChangeNameToday()` | Check if can change name | `true`/`false` |
| `savePlayerName(name)` | Save name + date | `void` |
| `getPlayerName()` | Get current name | `"KHOI"` or `null` |
| `showNameModal(score)` | Show modal after game over | `void` |
| `hideNameModal()` | Close modal | `void` |

---

## 💾 LocalStorage Keys

| Key | Value Example | Description |
|-----|---------------|-------------|
| `playerName` | `"KHOI"` | Current player name |
| `lastNameChangeDate` | `"2025-10-10"` | Last date name was changed |

---

## 🎯 Modal States

### State 1: Input Unlocked (Can Change)
```
✅ nameInputSection: visible
❌ nameLockedSection: hidden
Input field: enabled
Condition: canChangeNameToday() === true
```

### State 2: Input Locked (Cannot Change)
```
❌ nameInputSection: hidden
✅ nameLockedSection: visible
Display: current name only
Condition: canChangeNameToday() === false
```

---

## 🎨 CSS Classes

### Modal
- `#name-modal` - Full screen overlay (z-index: 9999)
- `.pixel-border` - Retro border style

### Sections
- `#name-input-section` - Input form (unlocked)
- `#name-locked-section` - Name display (locked)

### Buttons
- `#save-score-btn` - Green, saves score
- `#skip-save-btn` - Gray, closes modal

### Status
- `text-red-400` - Error messages
- `text-yellow-400` - Warning/Loading
- `text-green-400` - Success messages

---

## 🔄 Event Flow

```
User plays game
    ↓
Game over
    ↓
endGame()
    ↓
showNameModal(score)
    ├─ Check canChangeNameToday()
    ├─ Show appropriate UI
    └─ Display modal
    ↓
User clicks Save
    ↓
saveScoreBtn handler
    ├─ Validate name (if unlocked)
    ├─ savePlayerName() (if new name)
    ├─ window.saveScore()
    └─ Show status message
    ↓
Close modal after 2s (or Skip/Click outside)
```

---

## ✅ Validation Rules

### Client-side
- Name length: **1-20 characters**
- Whitespace: **Trimmed**
- Empty: **Falls back to UID**
- Date: **YYYY-MM-DD string compare**

### Server-side (Firebase Rules)
```json
".validate": "newData.isString() && 
              newData.val().length > 0 && 
              newData.val().length <= 20"
```

---

## 🐛 Debug Commands

```javascript
// Check current state
localStorage.getItem('playerName')
localStorage.getItem('lastNameChangeDate')
getTodayString()
canChangeNameToday()

// Reset for testing
localStorage.clear()
localStorage.setItem('lastNameChangeDate', '2025-01-01')

// Manual show modal
showNameModal(12345)

// Check Firebase
console.log(window.userId)
console.log(window.db)
```

---

## 📊 Status Messages

| Icon | Message | Class | Meaning |
|------|---------|-------|---------|
| ⏳ | "Saving..." | `text-yellow-400` | Loading |
| ✅ | "Score saved: X" | `text-green-400` | Success |
| 🎉 | "New High Score! X" | `text-green-400` | Updated |
| ⚠️ | "Your best score is..." | `text-yellow-400` | Not saved |
| ❌ | "Error: ..." | `text-red-400` | Failed |
| ❌ | "Name too long..." | `text-red-400` | Validation |

---

## 🎮 Button Actions

| Button | Action | Closes Modal? |
|--------|--------|---------------|
| 💾 SAVE SCORE | Save name (if allowed) + Save score | ✅ After 2s |
| SKIP | Do nothing | ✅ Immediately |
| Click outside | Do nothing | ✅ Immediately |
| ESC key | *(not implemented)* | ❌ |

---

## 📱 Responsive Breakpoints

### Desktop (> 640px)
- Modal width: 400px
- Font: 1rem
- Score: 4xl
- Input: 3xl padding

### Mobile (≤ 640px)
- Modal width: 90%
- Font: 0.7rem
- Score: 2rem
- Input: 0.8rem
- Buttons: 0.7rem, compact

---

## 🎯 Common Scenarios

### Scenario A: New User
```
1. No localStorage → Input unlocked
2. Enter name → Save
3. Name + date saved to localStorage
4. Score saved to Firebase with name
```

### Scenario B: Return User (Same Day)
```
1. localStorage has name + today's date
2. Input locked, name displayed
3. Click Save → Score saved with existing name
4. No localStorage changes
```

### Scenario C: Return User (Next Day)
```
1. localStorage has name + old date
2. Input unlocked, name pre-filled
3. Can edit name → Save
4. Name + new date saved to localStorage
5. Score saved to Firebase with new name
```

---

## 🔧 Quick Fixes

### Modal không hiện
```javascript
// Check element exists
document.getElementById('name-modal')

// Force show
document.getElementById('name-modal').classList.remove('hidden')
```

### Input bị lock khi không nên
```javascript
// Check date
localStorage.getItem('lastNameChangeDate')
// Should be different from today if unlocked

// Force unlock
localStorage.setItem('lastNameChangeDate', '2000-01-01')
// Refresh page
```

### Tên không lưu
```javascript
// Check savePlayerName was called
console.log(localStorage.getItem('playerName'))

// Check Firebase
// Console → Realtime Database → Data → leaderboards/global/{uid}
```

---

## 📦 File Structure

```
index.html
├─ Modal HTML (line ~140-180)
├─ Helper Functions (line ~190-220)
├─ saveScore() (line ~300-350)
├─ showNameModal() (line ~790-820)
├─ hideNameModal() (line ~825-827)
└─ Button Handlers (line ~905-955)

index.css
├─ Modal Styles (line ~370-450)
└─ Responsive (line ~455-480)
```

---

## 🎓 Learning Points

### Why localStorage?
- ✅ Simple (no server needed)
- ✅ Fast (instant access)
- ✅ Persistent (survives refresh)
- ⚠️ Can be cleared by user (acceptable trade-off)

### Why daily limit?
- ✅ Prevents spam/abuse
- ✅ Encourages commitment (pick a good name!)
- ✅ Reduces server writes
- ⚠️ Can be bypassed (clear localStorage) - OK for game

### Why YYYY-MM-DD format?
- ✅ String comparison works correctly
- ✅ No timezone issues (compare dates, not times)
- ✅ Consistent format across locales

---

## ✨ Easter Eggs

```javascript
// Fun names to try
"TETRIS" "PLAYER1" "☆STAR☆" "🎮GAMER🎮" "123"

// Edge cases
"a" (1 char - min)
"ABCDEFGHIJ1234567890" (20 chars - max)
"ABCDEFGHIJ12345678901" (21 chars - error)
"   KHOI   " (trimmed to "KHOI")
"" (empty - uses UID fallback)
```

---

## 📚 Related Docs

- **Full docs**: `FEATURE-NAME-INPUT.md`
- **Testing**: `TEST-NAME-INPUT.md`
- **Demo**: `DEMO-NAME-INPUT.md`
- **Summary**: `SUMMARY-NAME-INPUT.md`

---

**Print this page for quick reference!** 📄
