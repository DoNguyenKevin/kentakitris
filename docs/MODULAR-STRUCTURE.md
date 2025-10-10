# Keltris - Modular Structure

## Cấu trúc dự án

```
keltris/
├── index.html              # File HTML gốc (monolithic)
├── index-modular.html      # File HTML mới (sử dụng modules)
├── index.css               # CSS styles
├── js/                     # Thư mục chứa các module
│   ├── index.js            # File JS gốc (monolithic)
│   ├── main.js             # Entry point chính
│   ├── firebase-config.js  # Khởi tạo Firebase
│   ├── game-constants.js   # Hằng số game
│   ├── game-state.js       # Quản lý state
│   ├── game-pieces.js      # Logic các mảnh tetromino
│   ├── game-board.js       # Render board và UI
│   ├── game-logic.js       # Logic game chính
│   ├── game-controls.js    # Xử lý input
│   └── leaderboard.js      # Chức năng leaderboard
└── docs/                   # Tài liệu dự án
```

## Mô tả các module

### 1. **main.js** (Entry point)
- Khởi tạo Firebase và game
- Thiết lập event listeners
- Điều phối các module khác

### 2. **firebase-config.js**
- Khởi tạo Firebase App
- Xử lý authentication
- Export các instance Firebase

### 3. **game-constants.js**
- Định nghĩa các hằng số game
- BOARD_WIDTH, BOARD_HEIGHT
- SHAPES, COLORS
- Scoring và level constants

### 4. **game-state.js**
- Quản lý state của game
- Board array, current piece, next piece
- Score, lines, level
- Playing/paused flags
- Các hàm setter/getter

### 5. **game-pieces.js**
- Tạo random pieces
- Kiểm tra collision
- Lock piece vào board
- Rotate piece logic

### 6. **game-board.js**
- Render game board lên DOM
- Vẽ pieces
- Vẽ next piece preview
- Tạo score particles
- Flash cleared lines
- Update stats display

### 7. **game-logic.js**
- Move piece logic
- Hard drop
- Rotate piece
- Clear lines
- Spawn next piece
- Game tick

### 8. **game-controls.js**
- Handle keyboard input
- Handle touch controls
- Pause/unpause
- Drop interval management

### 9. **leaderboard.js**
- Save scores to Firestore
- Load and display leaderboard
- Real-time updates

## Cách sử dụng

### Sử dụng phiên bản modular:
```bash
# Mở file index-modular.html trong browser
# Hoặc dùng live server
```

### Lưu ý:
- Phiên bản modular cần chạy qua HTTP server (không thể chạy trực tiếp file://)
- Có thể dùng VS Code Live Server extension
- Hoặc Python: `python -m http.server 8000`
- Hoặc Node: `npx http-server`

## Ưu điểm của cấu trúc modular

1. **Dễ bảo trì**: Mỗi file có trách nhiệm riêng biệt
2. **Dễ debug**: Tìm lỗi nhanh hơn trong từng module
3. **Dễ mở rộng**: Thêm tính năng mới không ảnh hưởng code cũ
4. **Tái sử dụng**: Các module có thể dùng lại cho dự án khác
5. **Làm việc nhóm**: Nhiều người có thể làm việc trên các file khác nhau
6. **Testing**: Dễ dàng test từng module riêng lẻ

## Migration từ monolithic sang modular

File gốc `index.html` và `js/index.js` vẫn được giữ nguyên. Để chuyển sang phiên bản modular:

1. Sử dụng `index-modular.html` thay vì `index.html`
2. Đảm bảo chạy qua HTTP server
3. Kiểm tra console để đảm bảo không có lỗi import

## Troubleshooting

**Lỗi CORS / Module loading:**
- Đảm bảo chạy qua HTTP server, không phải file://
- Kiểm tra tất cả import paths đúng
- Kiểm tra browser console để xem lỗi cụ thể
