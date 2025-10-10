# Hướng dẫn cho Giáo viên - Keltris

## 🎯 Giới thiệu

Keltris là một dự án Tetris được thiết kế đặc biệt để **dạy lập trình** cho học sinh lớp 7 (12 tuổi).

### Mục tiêu học tập
- Hiểu cơ bản về lập trình JavaScript
- Làm quen với mảng 2 chiều
- Hiểu logic game và vòng lặp
- Biết cách lưu trữ dữ liệu (localStorage, Firebase)
- Phát triển tư duy logic và giải quyết vấn đề

---

## 📚 Kế hoạch bài giảng (5 tuần)

### Tuần 1: Giới thiệu Code
**Bài học**: [01-intro-to-code.md](lesson/01-intro-to-code.md)

**Thời lượng**: 2 tiết (90 phút)

**Nội dung**:
- Code là gì?
- Cấu trúc dự án
- Console và thử nghiệm đơn giản

**Hoạt động**:
1. Mở Console, thử `console.log()`
2. Xem file `game-constants.js`
3. Thay đổi `BOARD_WIDTH` và quan sát

**Bài tập về nhà**:
- Vẽ sơ đồ cấu trúc file
- Tìm 3 constants khác nhau
- Thay đổi màu sắc trong COLORS

---

### Tuần 2: Game Loop
**Bài học**: [02-game-loop.md](lesson/02-game-loop.md)

**Thời lượng**: 2 tiết (90 phút)

**Nội dung**:
- Vòng lặp là gì?
- Game loop trong Tetris
- `setInterval()` và `gameTick()`

**Hoạt động**:
1. Viết vòng lặp for đơn giản
2. Thay đổi `INITIAL_DROP_DELAY`
3. Quan sát game ở các level khác nhau

**Bài tập về nhà**:
- Tính tốc độ game ở level 1-10
- Vẽ sơ đồ game loop
- Thử nghiệm với `setInterval()`

---

### Tuần 3: Pieces và Shapes
**Bài học**: [03-pieces-and-shapes.md](lesson/03-pieces-and-shapes.md)

**Thời lượng**: 2 tiết (90 phút)

**Nội dung**:
- 7 loại mảnh Tetris
- Biểu diễn bằng mảng 2 chiều
- Xoay mảnh 90 độ

**Hoạt động**:
1. Vẽ 7 hình trên giấy ô li
2. Viết mảng 2D cho hình T
3. Thử nghiệm `getRandomPiece()`
4. Xoay hình T 4 lần

**Bài tập về nhà**:
- Tạo hình mới (hình U, hình X)
- Đếm số ô trong mỗi hình
- Thay đổi màu sắc

---

### Tuần 4: Board và Mảng 2D
**Bài học**: [04-board-and-arrays.md](lesson/04-board-and-arrays.md)

**Thời lượng**: 2 tiết (90 phút)

**Nội dung**:
- Board (bàn chơi) là gì
- Truy cập ô: `board[y][x]`
- Va chạm (collision)
- Khóa mảnh vào board

**Hoạt động**:
1. In board ra Console
2. Tô màu 1 ô thủ công
3. Tạo pattern (cờ đen trắng)
4. Viết hàm kiểm tra hàng đầy

**Bài tập về nhà**:
- Đếm ô trống/có màu
- Tô đầy 1 hàng
- Viết hàm `isRowFull()`

---

### Tuần 5: Firebase và Leaderboard
**Bài học**: [05-leaderboard-firebase.md](lesson/05-leaderboard-firebase.md)

**Thời lượng**: 2 tiết (90 phút)

**Nội dung**:
- Leaderboard là gì
- Firebase và cloud storage
- Lưu/lấy dữ liệu
- Real-time updates

**Hoạt động**:
1. Xem Firebase Console
2. Lưu điểm thử nghiệm
3. Quan sát real-time update
4. Tính điểm trung bình top 10

**Bài tập về nhà**:
- Vẽ sơ đồ luồng dữ liệu
- Tính vị trí của mình trong leaderboard
- Thử nghiệm `ref.on('value')`

---

## 🎓 Phương pháp giảng dạy

### 1. Học qua làm (Learning by Doing)
- Mỗi khái niệm đều có thử nghiệm thực tế
- Khuyến khích học sinh chỉnh sửa code
- Không sợ làm hỏng (có thể undo/reset)

### 2. Từ dễ đến khó
- Bắt đầu với khái niệm đơn giản
- Xây dựng dần lên khái niệm phức tạp
- Luôn liên kết với kiến thức cũ

### 3. Trực quan hóa
- Dùng giấy ô li để vẽ mảng 2D
- Vẽ sơ đồ luồng (flowchart)
- Dùng emoji để làm nổi bật

### 4. Khuyến khích thắc mắc
- Có câu hỏi trong mỗi bài học
- Tạo môi trường an toàn để hỏi
- "Không có câu hỏi ngớ ngẩn"

---

## 💡 Gợi ý cho từng hoạt động

### Console Debugging
Dạy học sinh dùng Console để:
- In giá trị biến: `console.log(score)`
- Kiểm tra điều kiện: `console.log(score > 100)`
- Debug lỗi: `console.error("Lỗi!")`

### Pair Programming
Cho học sinh làm theo cặp:
- 1 người viết code
- 1 người đọc và kiểm tra
- Đổi vai sau mỗi 10 phút

### Code Review
Hướng dẫn học sinh review code của nhau:
- Code có dễ đọc không?
- Comment có rõ ràng không?
- Có cách nào tốt hơn không?

---

## 📊 Đánh giá

### Đánh giá thường xuyên (30%)
- Tham gia lớp học
- Hoàn thành bài tập nhỏ
- Thử nghiệm trong Console

### Bài tập về nhà (30%)
- Hoàn thành exercises
- Mini-projects
- Vẽ sơ đồ

### Dự án cuối kỳ (40%)
Chọn 1 trong 3:
1. **Thêm tính năng mới** (ví dụ: ghost piece, hold piece)
2. **Tạo theme mới** (đổi màu sắc, hình dạng)
3. **Viết hướng dẫn** cho tính năng hiện có

---

## 🎯 Rubric đánh giá dự án

| Tiêu chí | 1-2 điểm | 3-4 điểm | 5 điểm |
|----------|----------|----------|--------|
| **Chức năng** | Không chạy được | Chạy nhưng có lỗi | Chạy tốt, không lỗi |
| **Code quality** | Khó đọc, không comment | Có comment cơ bản | Comment rõ ràng, dễ đọc |
| **Sáng tạo** | Sao chép mẫu | Có thay đổi nhỏ | Ý tưởng độc đáo |
| **Trình bày** | Không rõ ràng | Có giải thích | Trình bày chuyên nghiệp |

---

## 🛠️ Xử lý tình huống

### "Em không hiểu code này làm gì"
**Giải pháp**:
1. Đọc comment cùng em
2. Chạy từng dòng trong Console
3. Vẽ sơ đồ trực quan
4. Cho ví dụ trong đời thực

### "Code em bị lỗi!"
**Giải pháp**:
1. Đọc thông báo lỗi
2. Kiểm tra dòng bị lỗi
3. So sánh với code mẫu
4. Dùng `console.log()` để debug

### "Em muốn làm khác nhưng không biết cách"
**Giải pháp**:
1. Khuyến khích thử nghiệm
2. Tìm code tương tự
3. Chia nhỏ thành các bước
4. Làm từng bước một

---

## 📝 Checklist cho giáo viên

### Trước mỗi bài
- [ ] Đọc trước bài học
- [ ] Chuẩn bị file code mẫu
- [ ] Test tất cả ví dụ
- [ ] Chuẩn bị câu hỏi thảo luận

### Trong bài
- [ ] Giới thiệu mục tiêu học tập
- [ ] Demo trực tiếp trên máy
- [ ] Cho học sinh thử nghiệm
- [ ] Trả lời câu hỏi
- [ ] Tóm tắt cuối bài

### Sau bài
- [ ] Giao bài tập về nhà
- [ ] Cung cấp tài liệu tham khảo
- [ ] Thu thập feedback
- [ ] Chuẩn bị cho bài tiếp theo

---

## 🌟 Tips thành công

1. **Kiên nhẫn**: Học sinh cần thời gian để hiểu
2. **Khuyến khích**: Khen ngợi mỗi tiến bộ nhỏ
3. **Linh hoạt**: Điều chỉnh tốc độ theo lớp
4. **Thực hành nhiều**: Code học tốt nhất qua làm
5. **Vui vẻ**: Giữ không khí học tập thoải mái

---

## 📞 Liên hệ và hỗ trợ

Nếu cần hỗ trợ:
- Tham khảo [CONTRIBUTING-EDU.md](../CONTRIBUTING-EDU.md)
- Xem [exercises.md](lesson/exercises.md)
- Mở issue trên GitHub

---

**Chúc giáo viên giảng dạy vui vẻ và thành công!** 🎉👨‍🏫👩‍🏫
