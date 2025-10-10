# Checklist Kiểm tra Tính giáo dục (Educational)

## 🎯 Mục tiêu
Đảm bảo codebase dễ học, dễ hiểu cho học sinh lớp 7.

---

## ✅ 1. Comment và Documentation

### File headers
- [ ] Mọi file `.js` có comment đầu file giải thích mục đích
- [ ] Comment đầu file dùng ngôn ngữ đơn giản
- [ ] Có giải thích tại sao file này quan trọng

### Function comments
- [ ] Mọi hàm exported có comment
- [ ] Comment bao gồm: Mục tiêu, Cách hoạt động, Ví dụ
- [ ] Có phần "Try it" để thử nghiệm
- [ ] Dùng emoji phù hợp (✅❌❓💡)

### Inline comments
- [ ] Code phức tạp có comment giải thích từng bước
- [ ] Comment ngắn gọn, dễ hiểu
- [ ] Không comment những điều hiển nhiên

---

## ✅ 2. Code Quality

### Naming (Đặt tên)
- [ ] Tên biến rõ ràng (`score` thay vì `s`)
- [ ] Tên hàm mô tả hành động (`movePiece` thay vì `mp`)
- [ ] Tên constants viết HOA (`BOARD_WIDTH`)
- [ ] Tránh viết tắt quá nhiều

### Simplicity (Đơn giản)
- [ ] Hàm không quá dài (< 50 dòng)
- [ ] Logic không quá phức tạp
- [ ] Mỗi hàm làm 1 việc duy nhất
- [ ] Tránh nested loops sâu (> 3 cấp)

### Consistency (Nhất quán)
- [ ] Phong cách code nhất quán
- [ ] Format code đồng nhất (indent, space)
- [ ] Pattern giống nhau trong toàn bộ codebase

---

## ✅ 3. Helper Files

### js/helpers/
- [ ] `name-utils.js` - Hoàn chỉnh
- [ ] `date-utils.js` - Hoàn chỉnh
- [ ] `storage-utils.js` - Hoàn chỉnh
- [ ] `dom-utils.js` - Hoàn chỉnh
- [ ] Mỗi file có comment giáo dục
- [ ] Mỗi hàm có ví dụ "Try it"

---

## ✅ 4. Lesson Files

### docs/lesson/
- [ ] `01-intro-to-code.md` - Hoàn chỉnh
- [ ] `02-game-loop.md` - Hoàn chỉnh
- [ ] `03-pieces-and-shapes.md` - Hoàn chỉnh
- [ ] `04-board-and-arrays.md` - Hoàn chỉnh
- [ ] `05-leaderboard-firebase.md` - Hoàn chỉnh
- [ ] `exercises.md` - Hoàn chỉnh

### Nội dung bài học
- [ ] Mục tiêu rõ ràng
- [ ] Giải thích từ dễ đến khó
- [ ] Có ví dụ minh họa
- [ ] Có phần thử nghiệm
- [ ] Có câu hỏi kiểm tra
- [ ] Có bài tập về nhà

---

## ✅ 5. Documentation Files

- [ ] `CONTRIBUTING-EDU.md` - Hướng dẫn viết code learnable
- [ ] `docs/teacher-guide.md` - Hướng dẫn cho giáo viên
- [ ] `docs/CHECKLIST-EDU.md` - File này
- [ ] `README.md` có note về tính giáo dục

---

## ✅ 6. Main Game Modules

### game-constants.js
- [ ] Comment giải thích từng constant
- [ ] Có ví dụ "Try it" để thay đổi
- [ ] Giải thích tại sao tách riêng constants

### game-state.js
- [ ] Comment giải thích state variables
- [ ] Giải thích tại sao cần setters
- [ ] Ví dụ cách dùng các hàm

### game-pieces.js
- [ ] Giải thích 7 loại mảnh
- [ ] Comment chi tiết cho `getRandomPiece()`
- [ ] Giải thích công thức xoay
- [ ] Comment cho va chạm và lock

### game-logic.js
- [ ] Comment chi tiết cho `movePiece()`
- [ ] Giải thích hard drop
- [ ] Giải thích kick-testing
- [ ] Comment cho clear lines

### game-controls.js
- [ ] Giải thích game loop
- [ ] Comment cho keyboard/touch controls
- [ ] Giải thích `setInterval()`

### game-board.js
- [ ] Giải thích cách vẽ board
- [ ] Comment cho drawing functions
- [ ] Giải thích canvas/DOM rendering

---

## ✅ 7. Interactive Features

### Console accessibility
- [ ] Các biến quan trọng accessible trong Console
- [ ] Có thể test functions trong Console
- [ ] Logger output hữu ích cho debug

### Try-it examples
- [ ] Mỗi hàm quan trọng có ví dụ thử nghiệm
- [ ] Ví dụ chạy được ngay trong Console
- [ ] Kết quả dễ quan sát

---

## ✅ 8. Educational Enhancements

### Questions in code
- [ ] Có câu hỏi "❓ Câu hỏi:" trong code
- [ ] Có đáp án "💡 Trả lời:" ngay sau
- [ ] Câu hỏi khuyến khích tư duy

### Visual aids
- [ ] Có sơ đồ ASCII art nếu cần
- [ ] Dùng emoji để làm nổi bật
- [ ] Ví dụ trực quan (hình vẽ, bảng)

### Exercises
- [ ] Bài tập đa dạng (dễ → khó)
- [ ] Mini-projects thực tế
- [ ] Challenges cho học sinh giỏi

---

## ✅ 9. Testing & Verification

### Manual testing
- [ ] Game vẫn chạy bình thường
- [ ] Tất cả tính năng hoạt động
- [ ] Không có lỗi console
- [ ] Responsive trên mobile

### Educational testing
- [ ] Mở Console, test các ví dụ "Try it"
- [ ] Thử thay đổi constants
- [ ] Kiểm tra có dễ hiểu không (test với học sinh thật nếu có)

---

## ✅ 10. GitHub & Contributing

### .github/ or docs/
- [ ] Có note về "learnable for kids 7-12"
- [ ] CONTRIBUTING.md hoặc CONTRIBUTING-EDU.md
- [ ] Issue template khuyến khích educational PRs

### README.md
- [ ] Có section "Dành cho Giáo viên/Học sinh"
- [ ] Link đến lesson files
- [ ] Link đến teacher guide

---

## 🎯 Scoring

**Tổng số items**: ~80+

- **100% (80+/80)**: ⭐⭐⭐ Xuất sắc! Code hoàn toàn learnable
- **80-99% (64-79/80)**: ⭐⭐ Tốt! Còn vài điểm cần cải thiện
- **60-79% (48-63/80)**: ⭐ Khá! Cần thêm nhiều comment và doc
- **< 60% (< 48/80)**: ❌ Cần làm thêm nhiều việc

---

## 📝 Notes

- Checklist này để hướng dẫn, không bắt buộc 100%
- Ưu tiên: Comments > Docs > Exercises
- Quan trọng nhất: Code **dễ hiểu** hơn là **hoàn hảo**

---

## 🔄 Review Schedule

- **Hàng tuần**: Kiểm tra code mới
- **Hàng tháng**: Review toàn bộ codebase
- **Trước release**: Full checklist

---

**Cập nhật lần cuối**: 2025-10-10
