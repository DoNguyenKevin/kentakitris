import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Nếu bạn muốn serve/build từ thư mục khác với root repo, đổi giá trị này.
  // (Mặc định là root dự án)
  root: '.',

  // Nếu bạn deploy site dưới một subpath (ví dụ https://example.com/kentakitris/),
  // set base: '/kentakitris/' để các đường dẫn tới assets đúng.
  // Trên Vercel thường để '/' (mặc định).
  base: '/',

  // Cấu hình dev server cho local development
  server: {
    port: 5173,       // cổng dev server
    strictPort: false,// nếu true mà cổng bận thì fail thay vì dùng cổng khác
    open: true        // tự mở trình duyệt khi chạy `vite`
  },

  // Cấu hình build cho production
  build: {
    outDir: 'dist',    // THVery important: Vercel expects build output dir (set to 'dist')
    assetsDir: 'assets', // thư mục con cho assets
    sourcemap: false,  // bật nếu muốn debug production
    rollupOptions: {
      // Nếu bạn chỉ có 1 trang (index.html) không cần đổi gì.
      // Nếu bạn muốn build nhiều HTML (index.html và index-modular.html),
      // thêm `input` để Rollup biết các entry points:
      input: {
        main: path.resolve(__dirname, 'index.html'),
        modular: path.resolve(__dirname, 'index-modular.html') // nếu cần
      },
      // Bạn có thể tuỳ chỉnh external/output nếu cần
    }
  },

  // Nếu bạn cần alias (ví dụ '@/js' -> ./js)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // 'js': path.resolve(__dirname, 'js') // tuỳ ý
    }
  },

  // Vite sẽ expose vào client chỉ những env bắt đầu bằng VITE_
  // Ví dụ thiết lập VITE_FIREBASE_CONFIG trong Vercel và đọc bằng import.meta.env.VITE_FIREBASE_CONFIG
  // Bạn không cần cấu hình gì ở đây để dùng import.meta.env, nhưng nếu muốn thay đổi prefix:
  // envPrefix: 'VITE_',

  // Nếu cần plugin (ví dụ dùng Tailwind via PostCSS, hoặc legacy hỗ trợ IE):
  // plugins: [ ... ],
});
