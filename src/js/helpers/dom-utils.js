// js/helpers/dom-utils.js
// ======================================================
// Hàm giúp làm việc với DOM (Document Object Model)
// DOM = cách JavaScript điều khiển trang web
// ======================================================

// ✅ Mục tiêu: Hiển thị một phần tử (element)
// Ví dụ: showElement('game-over-modal')
// Try it: showElement('score-display');
export function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Xóa class 'hidden' để hiện ra
        element.classList.remove('hidden');
        return true;
    } else {
        console.error(`Không tìm thấy element với id: ${elementId}`);
        return false;
    }
}

// ✅ Mục tiêu: Ẩn một phần tử
// Ví dụ: hideElement('loading-spinner')
// Try it: hideElement('pause-screen');
export function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Thêm class 'hidden' để ẩn đi
        element.classList.add('hidden');
        return true;
    } else {
        console.error(`Không tìm thấy element với id: ${elementId}`);
        return false;
    }
}

// ✅ Mục tiêu: Bật/tắt hiển thị của element
// Nếu đang hiện → ẩn đi, nếu đang ẩn → hiện ra
// Ví dụ: toggleElement('settings-menu')
export function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('hidden');
        return true;
    } else {
        console.error(`Không tìm thấy element với id: ${elementId}`);
        return false;
    }
}

// ✅ Mục tiêu: Cập nhật nội dung text của element
// Ví dụ: updateText('score-value', '1000')
// Try it: updateText('level-display', 'Level 5');
export function updateText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        return true;
    } else {
        console.error(`Không tìm thấy element với id: ${elementId}`);
        return false;
    }
}

// ✅ Mục tiêu: Tạo một element HTML mới
// Ví dụ: createElement('div', 'my-class', 'Hello!')
// Try it:
// const box = createElement('div', 'red-box', 'Xin chào');
// document.body.appendChild(box);
export function createElement(tagName, className = '', textContent = '') {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

// ✅ Mục tiêu: Thêm class vào element
// Class trong HTML/CSS giúp trang trí element
// Ví dụ: addClass('player-name', 'highlight')
export function addClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add(className);
        return true;
    }
    return false;
}

// ✅ Mục tiêu: Xóa class khỏi element
// Ví dụ: removeClass('game-board', 'paused')
export function removeClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove(className);
        return true;
    }
    return false;
}

// ❓ Câu hỏi: Element là gì?
// 💡 Trả lời: Element = thành phần trên trang web
//            Ví dụ: nút bấm, hộp chữ, hình ảnh...

// ❓ Câu hỏi: Class là gì?
// 💡 Trả lời: Class = nhãn để trang trí element
//            CSS dùng class để đổi màu, kích thước, vị trí...
//            Một element có thể có nhiều class!

// ❓ Thử nghiệm: Hãy thử thay đổi text của điểm số
// Try it:
// updateText('score', '999999');
// addClass('score', 'blink'); // Nếu có CSS cho class 'blink'
