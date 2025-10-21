/**
 * ✅ Mục tiêu: Component để chuyển đổi giữa phiên bản Phaser mới và phiên bản HTML cũ
 * 
 * Component này hiển thị nút để người chơi có thể:
 * - Từ phiên bản mới (Phaser) → chuyển sang phiên bản cũ (HTML)
 * - Từ phiên bản cũ (HTML) → chuyển sang phiên bản mới (Phaser)
 * 
 * Cách hoạt động:
 * 1. Hiển thị nút ở góc màn hình
 * 2. Khi click, chuyển sang trang tương ứng
 * 3. Sử dụng window.location để điều hướng
 */

import React from 'react';

interface VersionSwitcherProps {
  /** Current version: 'new' (Phaser) hoặc 'classic' (HTML) */
  currentVersion: 'new' | 'classic';
}

/**
 * 🎮 Version Switcher Component
 * 
 * Nút chuyển đổi giữa phiên bản game mới và cũ
 */
export const VersionSwitcher: React.FC<VersionSwitcherProps> = ({ currentVersion }) => {
  // Xác định URL đích và text của nút
  const targetUrl = currentVersion === 'new' ? '/classic/index.html' : '/';
  const buttonText = currentVersion === 'new' 
    ? '🕹️ Classic Version' 
    : '🎮 New Phaser Version';
  
  const handleClick = () => {
    window.location.href = targetUrl;
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        title={buttonText}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default VersionSwitcher;
