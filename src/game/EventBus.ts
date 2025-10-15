// src/game/EventBus.ts
// ======================================================
// ✅ Event Bus - Hệ thống gửi tin nhắn giữa các phần của game
// 
// Mục tiêu: Cho phép React và Phaser "nói chuyện" với nhau
// 
// Event Bus = Xe buýt sự kiện
// - Các phần khác nhau của game gửi "tin nhắn" (events)
// - Các phần khác "lắng nghe" (listen) tin nhắn đó
// - Giống như hệ thống thông báo trong trường học!
// 
// Ví dụ:
// 1. Game.ts gửi: EventBus.emit('game-over', { score: 100 })
// 2. React nhận: EventBus.on('game-over', (data) => alert(data.score))
// 
// ❓ Câu hỏi: Tại sao cần Event Bus?
// 💡 Trả lời: Để React (UI) và Phaser (Game) giao tiếp không phụ thuộc!
//            Giống như điện thoại, không cần biết người khác ở đâu.
// ======================================================

import { Events } from 'phaser';

/**
 * 📡 EventBus - Đối tượng toàn cục để gửi/nhận events
 * 
 * Cách dùng:
 * - Gửi event: EventBus.emit('event-name', data)
 * - Nhận event: EventBus.on('event-name', callback)
 * 
 * Try it trong Console:
 * EventBus.emit('test', { message: 'Hello!' })
 * EventBus.on('test', (data) => console.log(data))
 */
export const EventBus = new Events.EventEmitter();