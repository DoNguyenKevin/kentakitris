import { defineConfig } from 'vite';

// Nếu bạn deploy ở root, thông thường không cần cấu hình base.
// Nếu deploy dưới subpath (ví dụ /mygame/), đặt base: '/mygame/'
export default defineConfig({
  root: '.', // mặc định
  build: {
    outDir: 'dist',
    // Nếu bạn dùng index-modular.html làm trang chính, đổi input/rollupOptions nếu cần
  }
});
