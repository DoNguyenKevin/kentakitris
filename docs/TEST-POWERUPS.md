# Quick Test Guide - Power-ups System

## 🧪 How to Test the Power-ups

### Quick Start
1. Open `index.html` in your browser
2. Click "START" to begin the game
3. Clear 10 lines to level up
4. Power-up modal should appear automatically!

### Test Scenarios

#### ✅ Test 1: Basic Modal Display
1. Start game and clear 10 lines
2. **Expected**: Modal appears with 3 power-up cards
3. **Check**: Each card shows name, type, rarity, description

#### ✅ Test 2: Power-up Activation
1. Click any power-up card
2. **Expected**: Modal closes, game resumes
3. **Check**: Selected power-up is activated

#### ✅ Test 3: Instant Power-ups
Test each instant powerup:

**Clear Bottom**:
1. Fill bottom 3 rows with blocks
2. Select "Clear Bottom" from modal
3. **Expected**: Bottom 3 rows cleared instantly

**Laser**:
1. Fill bottom row completely
2. Select "Laser" 
3. **Expected**: Bottom row cleared

**Random Clear**:
1. Have some filled blocks on board
2. Select "Random Clear"
3. **Expected**: 5-8 random blocks disappear

#### ✅ Test 4: Duration Power-ups

**Slow Time**:
1. Select "Slow Time"
2. **Expected**: 
   - Pieces drop at half speed
   - Timer shows in top-right corner
   - Auto-removes after 15 seconds

**Score Boost**:
1. Note current score
2. Select "Score Boost"
3. Clear a line
4. **Expected**: Score increases by 2x normal amount

**Time Freeze**:
1. Select "Time Freeze"
2. **Expected**: Pieces stop falling automatically
3. Can still move/rotate manually
4. Normal drop resumes after 10s

#### ✅ Test 5: Permanent Power-ups

**Ghost Mode**:
1. Select "Ghost Mode"
2. **Expected**: See outline of where piece will land
3. Persists for entire game

**Swap Hold**:
1. Select "Swap Hold"
2. Press 'H' key
3. **Expected**: Current piece swaps with held piece
4. First time creates held piece, subsequent times swap

**Preview+**:
1. Select "Preview+"
2. **Expected**: Can see next 3 pieces instead of just 1

#### ✅ Test 6: Passive Power-ups

**Shield**:
1. Select "Shield"
2. Fill top of board to trigger game over
3. **Expected**: 
   - Game doesn't end
   - Message: "🛡️ SHIELD SAVED YOU!"
   - Top 4 rows cleared
   - Game continues
4. Only works once per shield

#### ✅ Test 7: Multiple Active Power-ups
1. Level up and select a duration powerup
2. Level up again (while first is still active)
3. Select another powerup
4. **Expected**: Both show in active powerups display

#### ✅ Test 8: Rarity System
1. Level up 10-20 times
2. **Check**: 
   - Common (gray) appears most often (~50%)
   - Legendary (gold with glow) appears rarely (~5%)

#### ✅ Test 9: Mobile Responsive
1. Resize browser to mobile width (< 640px)
2. Trigger powerup modal
3. **Check**: Cards stack vertically, text is readable

#### ✅ Test 10: Game State
1. Activate a duration powerup (e.g., Slow Time)
2. Pause game (P key)
3. Resume game
4. **Expected**: Powerup timer continues
5. Game over
6. **Expected**: All active powerups cleared

## 🐛 Known Issues / TODO

### ✅ All Skills Now Implemented!
All 15 power-ups are now fully functional:
- ✅ **Teleport** - Click-to-place mechanic WORKING
- ✅ **Reverse Gravity** - Upward movement WORKING
- ✅ **Wide Mode** - Board expansion WORKING
- ✅ **Bomb** - 3x3 explosion effect WORKING
- ✅ **Magic Block** - Smart fill WORKING

### Test These Behaviors
- [ ] Multiple Score Boosts stack (score × 4)?
- [ ] Multiple Slow Times stack (even slower)?
- [ ] Swap Hold with empty next piece queue?
- [ ] Preview+ with less than 3 pieces in queue?
- [ ] Shield with no blocks on board?
- [ ] Teleport to invalid position (should not work)
- [ ] Wide Mode ending while piece is in extended area
- [ ] Reverse Gravity with hard drop (should go to ceiling)
- [ ] Bomb at board edges (should not crash)
- [ ] Magic Block with no gaps (should still work)

## 🎮 Keyboard Controls Reminder
- **Arrow Keys**: Move/rotate piece
- **Space**: Hard drop (instant fall)
- **H**: Swap held piece (requires SWAP_PIECE powerup)
- **P**: Pause game

## 📝 What to Look For

### Visual Checks
- ✅ Modal appears centered on screen
- ✅ Cards have correct rarity colors
- ✅ Legendary cards have glowing animation
- ✅ Hover effects work on cards
- ✅ Active powerups display in top-right
- ✅ Timers count down smoothly

### Functional Checks
- ✅ Game pauses when modal shows
- ✅ Game resumes after selection
- ✅ Powerups actually affect gameplay
- ✅ Timers expire and remove effects
- ✅ Shield prevents death once
- ✅ Score boost multiplies correctly

### Performance Checks
- ✅ No lag when modal appears
- ✅ No lag with multiple active powerups
- ✅ Timer updates don't cause stuttering

## 🔧 Debug Tips

### View Active Powerups in Console
```javascript
// Open browser console (F12) and type:
activePowerups
// Shows array of currently active powerups

permanentPowerups
// Shows array of permanent powerups

hasPowerup('SHIELD')
// Check if specific powerup is active
```

### Force Trigger Powerup Modal
```javascript
// In console:
showPowerupModal()
// Manually open the modal without leveling up
```

### Activate Powerup Directly
```javascript
// In console:
activatePowerup(POWERUPS.LASER)
// Activate any powerup instantly
```

### Check Current Drop Speed
```javascript
// In console:
getCurrentDropDelay()
// See current drop delay in ms (accounts for SLOW_TIME)
```

## 📊 Success Metrics

The system is working correctly if:
1. ✅ Modal appears on level-up (every 10 lines)
2. ✅ 3 random cards display with proper styling
3. ✅ Clicking card activates powerup
4. ✅ Instant effects execute immediately
5. ✅ Duration effects show timer and auto-expire
6. ✅ Permanent effects persist until game over
7. ✅ Shield saves from death once
8. ✅ No JavaScript errors in console
9. ✅ Game remains playable throughout
10. ✅ Responsive on mobile devices

## 🎯 Quick Manual Test Sequence

**5-Minute Test**:
1. Start game → Clear 10 lines → Modal appears ✓
2. Select "Clear Bottom" → Bottom rows clear ✓
3. Level up again → Select "Slow Time" → Pieces slow ✓
4. Check top-right → Timer visible ✓
5. Level up again → Select "Shield" → Fill board ✓
6. Trigger death → Shield activates ✓
7. Resize window → Check responsive ✓

If all 7 steps pass, core system is working! 🎉

---

**Last Updated**: December 2024  
**Test Status**: Core features ready for testing  
**Next**: Implement advanced powerups (Teleport, Bomb, etc.)
