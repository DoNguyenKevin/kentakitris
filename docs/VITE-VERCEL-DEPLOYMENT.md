# 🚀 Vite + Vercel Deployment Guide

## Tổng quan

Dự án Keltris đã được chuyển đổi sang sử dụng **Vite** làm build tool và được tối ưu hóa cho deployment lên **Vercel**.

---

## 📋 Yêu cầu

- **Node.js** >= 18.x
- **npm** hoặc **yarn** hoặc **pnpm**
- Tài khoản **Vercel** (miễn phí)
- Firebase project đã setup (xem [SETUP-NHANH.md](SETUP-NHANH.md))

---

## 🛠️ Setup Local Development

### 1. Clone Repository

```bash
git clone https://github.com/DoNguyenKevin/kentakitris.git
cd kentakitris
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5173`

**Vite features:**
- ⚡ Hot Module Replacement (HMR) - Thay đổi code tự động refresh
- 🚀 Fast refresh - < 100ms
- 📦 ES modules native support
- 🔥 Instant server start

### 4. Build for Production

```bash
npm run build
```

Output sẽ nằm trong thư mục `dist/`:
```
dist/
├── index.html
├── index-modular.html
└── assets/
    ├── index-*.css
    ├── index-*.js
    ├── main-*.js
    └── modular-*.js
```

### 5. Preview Production Build

```bash
npm run preview
```

Server preview chạy tại: `http://localhost:5173`

---

## 🌐 Deploy to Vercel

### Phương án 1: Vercel CLI (Khuyến nghị)

**Bước 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Bước 2: Login**
```bash
vercel login
```

**Bước 3: Deploy**

Deploy development:
```bash
vercel
```

Deploy production:
```bash
vercel --prod
```

**Lần đầu tiên:**
- Vercel sẽ hỏi một số câu hỏi
- Nhấn Enter để chấp nhận mặc định
- Vercel tự động detect Vite configuration

**Output:**
```
✅ Deployed to production: https://kentakitris.vercel.app
```

---

### Phương án 2: GitHub Integration (Dễ nhất)

**Bước 1: Push code lên GitHub**
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

**Bước 2: Import vào Vercel**
1. Đi tới [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import repository từ GitHub
4. Vercel tự động detect:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**Bước 3: Deploy**
1. Click "Deploy"
2. Đợi 1-2 phút
3. ✅ Done! Site sẽ được deploy tại `https://your-project.vercel.app`

**Auto-deployment:**
- Mỗi lần push lên `main` branch → Vercel tự động deploy production
- Mỗi lần push lên branch khác → Vercel tạo preview deployment

---

### Phương án 3: Firebase Hosting (Alternative)

Nếu bạn muốn dùng Firebase Hosting thay vì Vercel:

**Bước 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
```

**Bước 2: Login**
```bash
firebase login
```

**Bước 3: Init Hosting**
```bash
firebase init hosting
```

Chọn:
- Public directory: `dist`
- Single-page app: `No`
- Automatic builds with GitHub: `No` (hoặc Yes nếu muốn)

**Bước 4: Build & Deploy**
```bash
npm run build
firebase deploy --only hosting
```

---

## 🔐 Environment Variables (Vercel)

### Cấu hình Firebase trong Vercel

**Option 1: Via Vercel Dashboard**
1. Vào project settings trên Vercel
2. Tab "Environment Variables"
3. Thêm các biến:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Option 2: Via CLI**
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... các biến khác
```

**Sử dụng trong code:**
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

**Note:** 
- Tất cả env variables phải bắt đầu bằng `VITE_` để Vite expose cho client
- Redeploy sau khi thêm/sửa env variables

---

## 📝 vercel.json Configuration

File `vercel.json` đã được tạo sẵn với cấu hình tối ưu:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Security headers:**
- `X-Content-Type-Options: nosniff` - Chống MIME sniffing
- `X-Frame-Options: DENY` - Chống clickjacking
- `X-XSS-Protection: 1; mode=block` - Chống XSS attacks

---

## 🔍 Kiểm tra sau khi Deploy

### 1. Functional Testing

✅ Checklist:
- [ ] Game loads correctly
- [ ] Game controls work (keyboard + touch)
- [ ] Firebase authentication successful
- [ ] Leaderboard displays data
- [ ] Save score works
- [ ] Name input modal works
- [ ] Mobile responsive

### 2. Performance Testing

```bash
# Lighthouse audit
npm install -g @lhci/cli
lhci autorun --collect.url=https://your-site.vercel.app
```

**Expected scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### 3. Firebase Testing

1. **Console Logs**: Mở F12 → Console → Kiểm tra không có errors
2. **Network Tab**: Firebase requests có status 200
3. **Firebase Console**: Data được cập nhật realtime
4. **Authentication**: Anonymous sign-in successful

---

## 🐛 Troubleshooting

### Vercel build fails

**Error: "Cannot find module 'vite'"**
```bash
# Solution: Commit package.json and package-lock.json
git add package.json package-lock.json
git commit -m "Add dependencies"
git push
```

**Error: "Build exceeded maximum duration"**
```bash
# Solution: Check vite.config.js
# Đảm bảo không có infinite loops hoặc large assets
```

### Firebase không connect sau deploy

**Check:**
1. Environment variables đã set đúng chưa?
2. Firebase config có đúng không?
3. Domain của Vercel đã add vào Firebase authorized domains?

**Solution:**
1. Vào Firebase Console → Authentication → Settings
2. Tab "Authorized domains"
3. Add domain Vercel: `your-project.vercel.app`

### Assets không load (404)

**Check:**
1. File paths trong HTML có đúng không?
2. `base` trong vite.config.js có đúng không?

**Solution:**
- Sử dụng relative paths: `./assets/...`
- Hoặc absolute paths: `/assets/...`
- Trong vite.config.js: `base: '/'`

---

## 📊 Performance Optimization

### 1. Vite Build Optimization

File `vite.config.js` đã được tối ưu:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization

### 2. Vercel Edge Network

- ✅ CDN automatic
- ✅ Brotli compression
- ✅ HTTP/2 support
- ✅ Global edge locations

### 3. Firebase Optimization

- ✅ Realtime Database indexes
- ✅ Security rules optimized
- ✅ Anonymous auth (fast)
- ✅ Minimal data reads

**Expected performance:**
- Initial load: < 1s
- Time to Interactive: < 2s
- First Contentful Paint: < 0.8s

---

## 🚀 CI/CD Workflow (Optional)

### GitHub Actions + Vercel

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📚 Resources

### Documentation
- [Vite Documentation](https://vite.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Tools
- [Vercel CLI](https://vercel.com/cli)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Support
- [Vercel Support](https://vercel.com/support)
- [Firebase Support](https://firebase.google.com/support)
- [GitHub Issues](https://github.com/DoNguyenKevin/kentakitris/issues)

---

## ✅ Deployment Checklist

### Pre-deployment
- [ ] `npm install` successful
- [ ] `npm run build` successful
- [ ] `npm run preview` works locally
- [ ] Firebase config correct
- [ ] All features work locally

### Vercel Setup
- [ ] Vercel account created
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Domain configured (optional)

### Post-deployment
- [ ] Site accessible at Vercel URL
- [ ] Firebase authentication works
- [ ] Leaderboard loads data
- [ ] Save score works
- [ ] Mobile responsive
- [ ] All features functional

### Production
- [ ] Custom domain setup (optional)
- [ ] SSL certificate active (automatic)
- [ ] Analytics setup (optional)
- [ ] Performance monitoring
- [ ] Error tracking

---

**🎉 Happy Deploying!**

**Need help?** Open an issue on GitHub or check the [troubleshooting section](#-troubleshooting).
