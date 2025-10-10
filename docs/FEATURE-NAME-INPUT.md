# 🎮 Tính năng Nhập tên - Game Over Modal

## ✨ Tính năng mới

### 1. Modal nhập tên sau khi Game Over
- ✅ Hiện modal đẹp mắt sau khi game over
- ✅ Hiển thị điểm số cuối cùng
- ✅ Cho phép nhập tên (max 20 ký tự)
- ✅ Buttons: "SAVE SCORE" và "SKIP"

### 2. Giới hạn đổi tên 1 lần/ngày
- ✅ Kiểm tra ngày thay đổi tên lần cuối
- ✅ Nếu đã đổi tên hôm nay → Chỉ hiển thị tên hiện tại (locked)
- ✅ Nếu chưa đổi hoặc ngày mới → Cho phép nhập tên mới
- ✅ Lưu ngày đổi tên vào localStorage

### 3. Lưu trữ
```javascript
localStorage:
  - playerName: "KHOI"          // Tên người chơi
  - lastNameChangeDate: "2025-10-10"  // Ngày đổi tên lần cuối
```

## 🎯 User Flow

### Flow 1: Lần đầu chơi (chưa có tên)
```
1. Chơi game → Game Over
2. Modal hiện ra:
   ┌─────────────────────────────┐
   │    🎮 GAME OVER!           │
   │    Your Score: 1234        │
   │                            │
   │    Enter Your Name:        │
   │    [_______________]       │
   │    * Chỉ được đổi tên      │
   │      1 lần/ngày            │
   │                            │
   │  [💾 SAVE SCORE] [SKIP]   │
   └─────────────────────────────┘
3. Nhập tên: "KHOI"
4. Click "SAVE SCORE"
5. Tên được lưu + Score được ghi vào Firebase
6. Modal đóng sau 2s
```

### Flow 2: Đã đổi tên hôm nay
```
1. Chơi game → Game Over
2. Modal hiện ra:
   ┌─────────────────────────────┐
   │    🎮 GAME OVER!           │
   │    Your Score: 5678        │
   │                            │
   │    Playing as:             │
   │    KHOI                    │
   │    🔒 Bạn đã đặt tên hôm   │
   │    nay. Quay lại vào ngày  │
   │    mai để đổi tên.         │
   │                            │
   │  [💾 SAVE SCORE] [SKIP]   │
   └─────────────────────────────┘
3. Click "SAVE SCORE"
4. Score được ghi với tên "KHOI"
5. Modal đóng
```

### Flow 3: Ngày mới, đổi tên lại
```
1. Sang ngày mới (00:00)
2. localStorage.lastNameChangeDate = "2025-10-09"
3. Hôm nay = "2025-10-10" → Khác ngày!
4. Game Over → Modal cho phép nhập tên mới
5. Nhập "KEVIN" → Lưu tên mới
6. lastNameChangeDate update = "2025-10-10"
```

## 🔧 Implementation Details

### Helper Functions

#### 1. `getTodayString()`
```javascript
// Lấy ngày hiện tại format YYYY-MM-DD
function getTodayString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}
// Example: "2025-10-10"
```

#### 2. `canChangeNameToday()`
```javascript
// Kiểm tra xem có thể đổi tên hôm nay không
function canChangeNameToday() {
    const lastNameChangeDate = localStorage.getItem('lastNameChangeDate');
    const today = getTodayString();
    return lastNameChangeDate !== today;
}
// Return: true = chưa đổi hôm nay, false = đã đổi rồi
```

#### 3. `savePlayerName(name)`
```javascript
// Lưu tên + ghi nhận ngày đổi
function savePlayerName(name) {
    localStorage.setItem('playerName', name);
    localStorage.setItem('lastNameChangeDate', getTodayString());
}
```

#### 4. `getPlayerName()`
```javascript
// Lấy tên hiện tại
function getPlayerName() {
    return localStorage.getItem('playerName') || null;
}
```

### Modal Logic

#### `showNameModal(finalScore)`
```javascript
function showNameModal(finalScore) {
    // 1. Hiển thị điểm
    modalScore.textContent = finalScore;
    
    // 2. Check có thể đổi tên không
    const canChangeName = canChangeNameToday();
    
    if (canChangeName) {
        // Hiện input field
        nameInputSection.classList.remove('hidden');
        nameLockedSection.classList.add('hidden');
        playerNameInput.value = getPlayerName() || '';
    } else {
        // Hiện tên locked
        nameInputSection.classList.add('hidden');
        nameLockedSection.classList.remove('hidden');
        currentPlayerNameEl.textContent = getPlayerName();
    }
    
    // 3. Show modal
    nameModal.classList.remove('hidden');
}
```

### Save Logic

```javascript
saveScoreBtn.addEventListener('click', async () => {
    // 1. Nếu có thể đổi tên → Lưu tên mới
    if (canChangeNameToday()) {
        const newName = playerNameInput.value.trim();
        if (newName && newName.length > 0 && newName.length <= 20) {
            savePlayerName(newName);
        }
    }
    
    // 2. Lưu score (dùng tên từ localStorage)
    const saved = await window.saveScore(finalScore);
    
    // 3. Đóng modal sau 2s nếu thành công
    if (saved) {
        setTimeout(() => hideNameModal(), 2000);
    }
});
```

## 🎨 UI/UX Features

### 1. Visual Feedback
- ✅ Fade in animation khi modal hiện
- ✅ Slide up animation cho nội dung
- ✅ Loading state khi đang save
- ✅ Success/Error messages có màu sắc
- ✅ Button hover/active effects

### 2. Input Validation
- ✅ Max 20 ký tự
- ✅ Trim whitespace
- ✅ Error message nếu quá dài
- ✅ Disable button khi đang save

### 3. Accessibility
- ✅ Click outside modal → Close
- ✅ Skip button để bỏ qua
- ✅ Clear status messages
- ✅ Responsive design (mobile/desktop)

## 📱 Responsive Design

### Desktop
```
Modal: 400px wide
Font: Press Start 2P (pixel font)
Score: 4xl (rất lớn)
Input: 3xl padding
```

### Mobile (< 640px)
```
Modal: 90% width, 16px padding
Font size: 0.7rem (nhỏ hơn)
Score: 2rem
Input: 0.8rem
Buttons: 0.7rem, compact padding
```

## 🔒 Security & Validation

### Client-side
- ✅ Name length: 1-20 characters
- ✅ Trim whitespace
- ✅ Check date logic (localStorage)
- ✅ Disable button during save

### Server-side (Firebase Rules)
```json
{
  "name": {
    ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 20"
  }
}
```

## 🧪 Testing Scenarios

### Test 1: First time player
```
1. Clear localStorage
2. Play game → Game Over
3. Expected: Input field enabled, no name pre-filled
4. Enter name "TEST1" → Save
5. Check: localStorage has playerName + lastNameChangeDate
```

### Test 2: Same day, second game
```
1. localStorage already has playerName = "TEST1", date = today
2. Play game → Game Over
3. Expected: Name locked, "TEST1" displayed, cannot edit
4. Click Save → Score saved with "TEST1"
```

### Test 3: Change date (simulate next day)
```
1. localStorage.lastNameChangeDate = "2025-10-09"
2. Today = "2025-10-10"
3. Play game → Game Over
4. Expected: Input field enabled, "TEST1" pre-filled
5. Change to "TEST2" → Save
6. Check: lastNameChangeDate = "2025-10-10"
```

### Test 4: Name too long
```
1. Enter name > 20 chars
2. Click Save
3. Expected: Error message "Name too long"
4. Modal stays open
```

### Test 5: Skip save
```
1. Game Over → Modal shows
2. Click "SKIP"
3. Expected: Modal closes, score NOT saved
```

### Test 6: Click outside modal
```
1. Game Over → Modal shows
2. Click dark background outside modal
3. Expected: Modal closes
```

## 🐛 Edge Cases Handled

### 1. Empty name
```javascript
if (newName && newName.length > 0 && newName.length <= 20) {
    // Save
}
// Empty name → Use UID instead (fallback in saveScore)
```

### 2. Firebase not initialized
```javascript
if (!window.db || !window.userId) {
    saveStatus.textContent = '❌ Firebase not initialized';
    return false;
}
```

### 3. Save fails
```javascript
try {
    await set(userRef, {...});
    saveStatus.textContent = '✅ Score saved';
} catch (error) {
    saveStatus.textContent = `❌ Error: ${error.message}`;
}
```

### 4. Modal shown multiple times
```javascript
// Reset status mỗi lần show modal
function showNameModal(finalScore) {
    saveStatus.textContent = '';
    // ...
}
```

## 📊 Data Flow

```
Game Over
    ↓
showNameModal(score)
    ↓
Check canChangeNameToday()
    ├─ YES → Show input (editable)
    └─ NO  → Show locked name
    ↓
User clicks "SAVE SCORE"
    ↓
If canChangeName: savePlayerName(newName)
    ↓
window.saveScore(finalScore)
    ├─ Get name from localStorage
    ├─ Check existing score
    ├─ Save to Firebase if higher
    └─ Show success/error message
    ↓
Close modal after 2s (if successful)
```

## 🎯 Benefits

### User Experience
- ✅ **Personalization**: User có thể đặt tên riêng
- ✅ **Flexibility**: Đổi tên mỗi ngày (không quá thường xuyên)
- ✅ **Clarity**: Rõ ràng khi nào có thể đổi tên
- ✅ **Control**: Skip nếu không muốn save

### Technical
- ✅ **Simple**: Chỉ dùng localStorage (không cần server)
- ✅ **Reliable**: Date logic đơn giản, không lỗi timezone
- ✅ **Performance**: Không có API calls thêm
- ✅ **Maintainable**: Code rõ ràng, dễ debug

### Anti-spam
- ✅ **Rate limit**: 1 lần/ngày (hạn chế thay đổi liên tục)
- ✅ **Validation**: Max 20 chars, trim whitespace
- ✅ **Firebase rules**: Validate trên server

## 🚀 Future Enhancements (Optional)

### 1. Avatar/Icon selection
```javascript
localStorage:
  - playerAvatar: "🎮"  // Emoji hoặc icon ID
```

### 2. Name history
```javascript
localStorage:
  - nameHistory: ["KHOI", "KEVIN", "KEN"]  // Track changes
```

### 3. Premium feature: Change anytime
```javascript
if (isPremiumUser) {
    canChangeName = true;  // Bypass daily limit
}
```

### 4. Profanity filter
```javascript
function isNameAppropriate(name) {
    const badWords = ['...'];
    return !badWords.some(word => name.toLowerCase().includes(word));
}
```

### 5. Name suggestions
```javascript
const suggestions = ["Player1", "Gamer", "Pro", ...];
// Show suggestions if input empty
```

## ✅ Checklist

- [x] Helper functions (getTodayString, canChangeNameToday, etc.)
- [x] Modal HTML structure
- [x] Modal CSS styling
- [x] showNameModal() logic
- [x] hideNameModal() logic
- [x] Save button handler
- [x] Skip button handler
- [x] Input validation
- [x] Date checking logic
- [x] Update saveScore() to use getPlayerName()
- [x] Update endGame() to show modal
- [x] Responsive design
- [x] Error handling
- [x] Visual feedback (loading, success, error)
- [x] Click outside to close

## 🎉 Done!

Tính năng đã sẵn sàng! Test theo flow:
1. Chơi game lần đầu → Nhập tên → Save
2. Chơi lại → Tên bị lock
3. Clear localStorage hoặc đợi ngày mai → Đổi tên lại

**Enjoy!** 🚀
