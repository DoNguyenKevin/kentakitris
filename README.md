# 🎮 Keltris - Pixel Tetris Game

**Tetris game với Firebase Realtime Database Leaderboard + Name Input Feature**

![Version](https://img.shields.io/badge/version-2.0-blue)
![Firebase](https://img.shields.io/badge/firebase-realtime_database-orange)
![Status](https://img.shields.io/badge/status-ready-green)
![Educational](https://img.shields.io/badge/educational-kids_7--12-brightgreen)

---

## 🎓 Educational Project / Dự án Giáo dục

**Keltris được thiết kế đặc biệt để dạy lập trình cho trẻ em 7-12 tuổi (học sinh lớp 7).**

### Dành cho Giáo viên
- 📚 [Teacher Guide](docs/teacher-guide.md) - Hướng dẫn giảng dạy
- 📖 [Lesson Plans](docs/lesson/) - 5 bài học chi tiết
- ✅ [Educational Checklist](docs/CHECKLIST-EDU.md) - Kiểm tra chất lượng giáo dục

### Dành cho Học sinh
- 📝 [Bài 1: Giới thiệu Code](docs/lesson/01-intro-to-code.md)
- 🔄 [Bài 2: Game Loop](docs/lesson/02-game-loop.md)
- 🧩 [Bài 3: Các mảnh Tetris](docs/lesson/03-pieces-and-shapes.md)
- 📊 [Bài 4: Board và Mảng 2D](docs/lesson/04-board-and-arrays.md)
- 🏆 [Bài 5: Leaderboard và Firebase](docs/lesson/05-leaderboard-firebase.md)
- 💪 [Bài tập](docs/lesson/exercises.md)

### Đặc điểm Code
- ✅ Comment bằng tiếng Việt dễ hiểu
- ✅ Giải thích từng bước chi tiết
- ✅ Có ví dụ "Try it" để thử nghiệm
- ✅ Sử dụng emoji để làm nổi bật (✅❌❓💡)
- ✅ Code đơn giản, dễ đọc

> **Note for Contributors**: When contributing code, please follow our [Educational Code Guidelines](CONTRIBUTING-EDU.md) to keep the codebase learnable for kids!

---

## ✨ Features

### 🎯 Core Game
- ✅ Classic Tetris gameplay
- ✅ 7 tetromino shapes với màu sắc đẹp mắt
- ✅ Leveling system (tăng tốc độ theo level)
- ✅ Line clearing với score multiplier
- ✅ Next piece preview
- ✅ Pause/Resume functionality
- ✅ Keyboard + Touch controls
- ✅ Responsive design (desktop + mobile)
- ✅ Pixel art aesthetic

### 🏆 Leaderboard (Realtime Database)
- ✅ **Real-time updates** - Tự động cập nhật không cần refresh
- ✅ **Top 10 high scores** - Sắp xếp theo điểm giảm dần
- ✅ **Personal best only** - Chỉ lưu điểm cao nhất
- ✅ **Highlight current user** - Tô vàng người chơi hiện tại
- ✅ **Anonymous authentication** - Không cần đăng ký
- ✅ **Secure Firebase rules** - Chống gian lận cơ bản

### 🎨 Name Input Feature (NEW!)
- ✅ **Game Over Modal** - Modal đẹp mắt sau khi thua
- ✅ **Player names** - Đặt tên riêng (max 20 ký tự)
- ✅ **Daily limit** - Chỉ đổi tên 1 lần/ngày
- ✅ **Smart validation** - Client + server-side validation
- ✅ **Visual feedback** - Loading, success, error states
- ✅ **Skip option** - Linh hoạt, không bắt buộc
- ✅ **Mobile friendly** - Responsive trên mọi thiết bị

### ⚙️ Settings Feature (NEW!)
- ✅ **Settings Modal** - Modal cài đặt game
- ✅ **Show Speed Toggle** - Hiển thị tốc độ rơi (ms) bên cạnh level
- ✅ **Real-time Updates** - Thay đổi áp dụng ngay lập tức
- ✅ **LocalStorage Persistence** - Lưu cài đặt vĩnh viễn
- ✅ **Dynamic Speed Display** - Tốc độ tự động tính theo level (1000ms/level)
- ✅ **Both Versions** - Hoạt động trên cả index.html và index-modular.html

### 💪 Power-ups/Skills System (NEW!)
- ✅ **15 Unique Skills** - Đa dạng kỹ năng từ tấn công đến phòng thủ
- ✅ **4 Rarity Tiers** - Common, Uncommon, Rare, Legendary
- ✅ **5 Skill Types** - Instant, Duration, Permanent, Passive, NextPiece
- ✅ **Level-up Rewards** - Chọn skill mỗi khi lên level
- ✅ **Advanced Mechanics**:
  - 💣 **Bomb** - Vụ nổ 3x3 khi đặt mảnh
  - ✨ **Magic Block** - Tự động lấp đầy khoảng trống
  - 🌀 **Teleport** - Click để dịch chuyển mảnh
  - 🔺 **Reverse Gravity** - Mảnh bay lên thay vì rơi xuống
  - 📏 **Wide Mode** - Mở rộng bảng từ 10 → 12 cột
- ✅ **Visual Effects** - CSS animations cho từng skill
- ✅ **Modular Design** - Code được tách module dễ bảo trì

---

## 🚀 Quick Start

### 1. Setup Firebase (5 phút)

**Bước 1: Tạo Realtime Database**
1. Vào [Firebase Console](https://console.firebase.google.com/project/kentakitris)
2. **Realtime Database** → **Create Database**
3. Location: **asia-southeast1** (Singapore)
4. Mode: **Test mode** (tạm thời)
5. Click **Enable**

**Bước 2: Enable Authentication**
1. **Authentication** → **Sign-in method**
2. Enable **Anonymous**
3. Click **Save**

**Bước 3: Setup Security Rules**
1. **Realtime Database** → Tab **Rules**
2. Copy nội dung từ file `database.rules.clean.json`
3. Paste vào editor
4. Click **Publish**

✅ **Done!** Đọc chi tiết: [`SETUP-NHANH.md`](docs/SETUP-NHANH.md)

### 2. Test & Play

**Play Game**:
```bash
Mở file: index.html
```
- Chơi game bình thường
- Game over → Nhập tên → Save score
- Xem tên và điểm xuất hiện trên leaderboard
- Kiểm tra Firebase Console để xem dữ liệu trong database

---

## 📁 Project Structure

```
keltris/
├── index.html                      # Game chính ⭐
├── index.css                       # Styles (pixel theme)
│
├── database.rules.json             # Firebase Rules (có comments)
├── database.rules.clean.json       # Firebase Rules (copy vào Console)
│
├── js/                             # JavaScript modules
│   ├── main.js                     # Entry point (modular)
│   ├── firebase-config.js          # Firebase initialization
│   ├── game-*.js                   # Game logic modules
│   └── leaderboard.js              # Leaderboard functionality
│
└── docs/                           # Documentation files ⭐
    ├── SETUP-NHANH.md              # Quick setup (3 bước)
    ├── CHECKLIST.md                # Step-by-step checklist
    ├── REALTIME-DATABASE-SETUP.md  # Setup chi tiết
    ├── README-LEADERBOARD.md       # Leaderboard overview
    ├── IMPLEMENTATION-SUMMARY.md   # Technical summary
    ├── FEATURE-NAME-INPUT.md       # Name input technical docs
    ├── TEST-NAME-INPUT.md          # Testing guide
    ├── SUMMARY-NAME-INPUT.md       # Feature summary
    ├── DEMO-NAME-INPUT.md          # Demo scenarios
    └── QUICK-REF-NAME-INPUT.md     # Quick reference card
```

**⭐ = Đọc trước**

---

## 🎮 How to Play

### Desktop Controls
- **Arrow Left/Right**: Move piece
- **Arrow Down**: Soft drop
- **Arrow Up / X**: Rotate
- **Spacebar**: Hard drop (instant)
- **P**: Pause/Resume

### Mobile Controls
- **Touch buttons**: On-screen controls
- **←/→**: Move left/right
- **↓**: Soft drop
- **↻**: Rotate
- **HARD DROP**: Instant drop

### Scoring
- 1 line: 10 × Level
- 2 lines: 30 × Level
- 3 lines: 50 × Level
- 4 lines (Tetris): 80 × Level

### Leveling
- Every 10 lines → Level up
- Higher level → Faster falling speed

---

## 🎨 Name Input Feature

### Cách hoạt động:

```
1. Chơi game → Game Over
2. Modal hiện ra tự động
3. Nhập tên (max 20 ký tự)
4. Click "💾 SAVE SCORE"
5. Score lưu vào Firebase với tên của bạn
6. Modal tự động đóng sau 2s
```

### Giới hạn 1 lần/ngày:

```
✅ Lần đầu hôm nay → Cho phép nhập/đổi tên
🔒 Lần 2+ trong ngày → Tên bị khóa (không đổi được)
✅ Sang ngày mới → Lại cho phép đổi tên
```

### Lưu trữ:
```javascript
localStorage:
  - playerName: "KHOI"
  - lastNameChangeDate: "2025-10-10"
```

**Đọc thêm**: [`FEATURE-NAME-INPUT.md`](docs/FEATURE-NAME-INPUT.md)

---

## 💪 Power-ups/Skills System

### 🎯 Cách Sử Dụng Skills

Mỗi khi lên level (xóa 10 hàng), bạn sẽ được chọn 1 trong 3 skill ngẫu nhiên:

```
1. Chơi và xóa 10 hàng → Level Up!
2. Game tạm dừng, modal hiện 3 skill
3. Click vào skill muốn chọn
4. Skill được kích hoạt ngay lập tức
5. Game tiếp tục
```

### 📚 Danh Sách Đầy Đủ

#### 🔥 Tấn Công (Offensive)
- 💣 **Bomb** - Vụ nổ 3x3 xóa các ô xung quanh
- 🔥 **Clear Bottom** - Xóa 2 hàng dưới cùng
- ⚡ **Laser** - Xóa toàn bộ cột cao nhất
- 🎲 **Random Clear** - Xóa 5-10 ô ngẫu nhiên

#### 🛡️ Phòng Thủ (Defensive)
- ⏰ **Slow Time** - Giảm 50% tốc độ rơi (30s)
- 👻 **Ghost Mode** - Xem bóng ma của mảnh (vĩnh viễn)
- 🛡️ **Shield** - Cứu 1 lần khi thua
- ❄️ **Time Freeze** - Dừng tự động rơi (10s)

#### ✨ Đặc Biệt (Special)
- 🌀 **Teleport** - Click để dịch chuyển mảnh
- 🔺 **Reverse Gravity** - Mảnh bay lên (15s)
- 📏 **Wide Mode** - Bảng rộng 12 cột (25s)
- ✨ **Magic Block** - Tự động lấp khoảng trống

#### 💰 Tiện Ích (Utility)
- 💰 **Score Boost** - +50% điểm (20s)
- 🔄 **Swap Hold** - Đổi mảnh (nhấn H)
- 🔮 **Preview+** - Xem 3 mảnh tiếp theo

### 📖 Hướng Dẫn Chi Tiết

**Cho người chơi**: [`SKILLS-GUIDE.md`](docs/SKILLS-GUIDE.md) - Hướng dẫn đầy đủ từng skill  
**Cho developers**: [`SKILLS-TECHNICAL.md`](docs/SKILLS-TECHNICAL.md) - Tài liệu kỹ thuật

### 🎮 Ví Dụ Skill Mạnh

#### Teleport 🌀
```
1. Chọn skill Teleport
2. Bảng sáng tím, con trỏ thành dấu +
3. Click vào vị trí muốn đặt mảnh
4. Mảnh dịch chuyển tức thì!
```

#### Wide Mode 📏
```
Bình thường:          Wide Mode:
████████████          ░████████████░
████████████    →     ░████████████░
████████████          ░████████████░
(10 cột)              (12 cột)
```

#### Bomb 💣
```
Đặt mảnh:            Sau vụ nổ:
████████             ████████
██░█░███      →      ██░░░███
████████             ████████
```

---

## 🔒 Security & Validation

### Client-side
- ✅ Name: 1-20 characters, trimmed
- ✅ Score: >= 0
- ✅ Date check: String comparison (YYYY-MM-DD)
- ✅ Fallback: Use UID if name empty

### Server-side (Firebase Rules)
```json
{
  "leaderboards": {
    "global": {
      "$uid": {
        ".read": true,
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "... score >= old_score ..."
      }
    }
  }
}
```

**Features:**
- ✅ Per-user write permission (chỉ ghi vào của mình)
- ✅ Score increase only (không cho giảm điểm)
- ✅ Data validation (name, score, updatedAt)
- ✅ Reject invalid fields

---

## 🏗️ Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Pixel art styling, animations
- **JavaScript (ES6+)** - Game logic, ES6 modules
- **Tailwind CSS** - Utility classes (via CDN)
- **Vite** - Build tool and dev server

### Backend
- **Firebase Realtime Database** - Leaderboard data
- **Firebase Authentication** - Anonymous auth
- **Firebase Security Rules** - Access control

### Build & Deployment
- **Vite 5.x** - Fast build tool with HMR
- **Vercel** - Recommended deployment platform
- **Firebase Hosting** - Alternative deployment option

### Libraries
- Minimal dependencies (Vite dev dependency only)
- Firebase SDK via CDN (runtime)

---

## 🧪 Testing

### Quick Test (2 phút)
```javascript
// 1. Clear localStorage
localStorage.clear();

// 2. Chơi game → Game Over → Nhập tên "TEST" → Save

// 3. Chơi lại → Tên bị lock

// 4. Fake ngày mới
localStorage.setItem('lastNameChangeDate', '2025-01-01');

// 5. Refresh → Chơi → Lại cho đổi tên
```

### Full Test Suite
Đọc: [`TEST-NAME-INPUT.md`](docs/TEST-NAME-INPUT.md)

**Test scenarios:**
- ✅ First time player
- ✅ Same day (locked)
- ✅ Next day (can change)
- ✅ Validation (too long, empty)
- ✅ Skip save
- ✅ Click outside
- ✅ Responsive mobile
- ✅ Firebase rules

---

## 📊 Performance

### Realtime Database Usage
- **Reads**: ~1 per load + realtime subscriptions (free)
- **Writes**: ~1-5 per user per session
- **Storage**: < 1KB per user
- **Cost**: **FREE tier** (< 1GB, < 100k simultaneous)

### Game Performance
- **Load time**: < 2s
- **FPS**: 60fps (smooth gameplay)
- **Bundle size**: ~15KB (HTML+CSS+JS)

---

## 🎯 Roadmap

### ✅ Done (v2.0)
- [x] Realtime Database leaderboard
- [x] Name input with daily limit
- [x] Modal UI/UX
- [x] Validation & security rules
- [x] Mobile responsive
- [x] Comprehensive documentation

### 🔜 Coming Soon (v2.1)
- [ ] App Check (chống bot)
- [ ] Cloud Functions validation
- [ ] Rate limiting in rules
- [ ] Sound effects
- [ ] Themes (dark/light mode)

### 💡 Future Ideas
- [ ] Multiplayer mode
- [ ] Power-ups
- [ ] Achievements system
- [ ] Player profiles & avatars
- [ ] Multiple leaderboards (daily/weekly/monthly)
- [ ] Social sharing

---

## 🐛 Troubleshooting

### "Permission denied"
```
✅ Check: Anonymous auth enabled?
✅ Check: Rules published?
✅ Console: console.log(window.userId)
```

### Leaderboard không hiện
```
✅ F12 → Console có errors?
✅ Firebase Console → Data có entries?
✅ Try refresh page
```

### Score không lưu
```
✅ Console.log trong saveScore()?
✅ Điểm mới có > điểm cũ?
✅ Firebase Console → Data updated?
```

### Modal không hiện
```
✅ Check: #name-modal exists?
✅ Console có errors?
✅ Force show: document.getElementById('name-modal').classList.remove('hidden')
```

**Đọc thêm**: [`CHECKLIST.md`](docs/CHECKLIST.md) - Troubleshooting section

---

## 📚 Documentation

### Setup & Deployment
- [`SETUP-NHANH.md`](docs/SETUP-NHANH.md) - Quick start (3 bước)
- [`VITE-VERCEL-DEPLOYMENT.md`](docs/VITE-VERCEL-DEPLOYMENT.md) - Vite + Vercel deployment guide
- [`REALTIME-DATABASE-SETUP.md`](docs/REALTIME-DATABASE-SETUP.md) - Chi tiết setup
- [`CHECKLIST.md`](docs/CHECKLIST.md) - Step-by-step checklist

### Features
- [`README-LEADERBOARD.md`](docs/README-LEADERBOARD.md) - Leaderboard overview
- [`FEATURE-NAME-INPUT.md`](docs/FEATURE-NAME-INPUT.md) - Name input technical
- [`SUMMARY-NAME-INPUT.md`](docs/SUMMARY-NAME-INPUT.md) - Feature summary
- [`SKILLS-GUIDE.md`](docs/SKILLS-GUIDE.md) - 🎮 Hướng dẫn sử dụng Skills (cho người chơi)
- [`SKILLS-TECHNICAL.md`](docs/SKILLS-TECHNICAL.md) - 🔧 Tài liệu kỹ thuật Skills (cho developers)
- [`POWERUPS-IMPLEMENTATION.md`](docs/POWERUPS-IMPLEMENTATION.md) - Power-ups system overview
- [`TEST-POWERUPS.md`](docs/TEST-POWERUPS.md) - Testing guide for power-ups

### Testing & Demo
- [`TEST-NAME-INPUT.md`](docs/TEST-NAME-INPUT.md) - Testing guide
- [`DEMO-NAME-INPUT.md`](docs/DEMO-NAME-INPUT.md) - Demo scenarios
- [`QUICK-REF-NAME-INPUT.md`](docs/QUICK-REF-NAME-INPUT.md) - Quick reference

### Technical
- [`IMPLEMENTATION-SUMMARY.md`](docs/IMPLEMENTATION-SUMMARY.md) - Technical summary
- [`database.rules.json`](database.rules.json) - Firebase rules (with comments)

---

## 🤝 Contributing

### Report Issues
- Found a bug? Open an issue!
- Have an idea? Share it!

### Code Style
- ES6+ syntax
- Comments for complex logic
- Pixel art aesthetic
- Mobile-first approach

---

## 📜 License

**MIT License** - Feel free to use, modify, and distribute!

---

## 🙏 Credits

- **Game concept**: Classic Tetris
- **Firebase**: Google Firebase Platform
- **Font**: Press Start 2P (Google Fonts)
- **Styling**: Tailwind CSS

---

## 🎉 Changelog

### v2.1.0 (2025-10-10)
- 🚀 Added: Vite build system for development and production
- 📦 Added: Vercel deployment configuration
- 📚 Added: Comprehensive Vite + Vercel deployment guide
- ⚡ Improved: Fast HMR (Hot Module Replacement) in development
- 🔧 Improved: Build process with code splitting and optimization
- 🌐 Added: Multiple deployment options (Vercel, Firebase Hosting)

### v2.0.0 (2025-10-10)
- ✨ Added: Name input modal with daily limit
- ✨ Added: Game over modal UI
- ✅ Updated: saveScore() with player names
- 📚 Added: Comprehensive documentation
- 🎨 Improved: Modal animations
- 📱 Improved: Mobile responsiveness

### v1.0.0 (2025-10-09)
- 🎮 Initial release
- 🏆 Realtime Database leaderboard
- 🔒 Firebase security rules
- 📱 Touch controls for mobile
- 🎨 Pixel art theme

---

## 📞 Support

**Issues?** Check documentation:
1. [`SETUP-NHANH.md`](docs/SETUP-NHANH.md) - Setup problems
2. [`TEST-NAME-INPUT.md`](docs/TEST-NAME-INPUT.md) - Testing issues
3. [`CHECKLIST.md`](docs/CHECKLIST.md) - Troubleshooting

**Still stuck?** Open an issue on GitHub!

---

## 🎮 Development & Deployment

### Local Development

```bash
# Install dependencies
npm install

# Start development server with Vite
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Vercel

**Option 1: Using Vercel CLI**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option 2: Via GitHub Integration**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Vite configuration
5. Click "Deploy"

**Option 3: Firebase Hosting (Alternative)**
```bash
firebase init hosting
firebase deploy --only hosting
```

### Environment Variables (Vercel)

Set these in your Vercel project settings:
- `VITE_FIREBASE_CONFIG` - Your Firebase configuration JSON
- Other Firebase-related variables as needed

---

**Made with ❤️ and ☕**

**Happy Gaming!** 🎮🚀

---

## Quick Links

- [🚀 Quick Setup (3 bước)](docs/SETUP-NHANH.md)
- [📦 Vite + Vercel Deployment Guide](docs/VITE-VERCEL-DEPLOYMENT.md)
- [✅ Checklist đầy đủ](docs/CHECKLIST.md)
- [🧪 Test Guide](docs/TEST-NAME-INPUT.md)
- [📖 Name Feature Docs](docs/FEATURE-NAME-INPUT.md)
- [🎬 Demo Scenarios](docs/DEMO-NAME-INPUT.md)

---

**Current Version**: 2.1.0  
**Last Updated**: 2025-10-10  
**Status**: ✅ Production Ready (Vite + Vercel)
