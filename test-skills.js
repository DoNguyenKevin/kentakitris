// Test script để kiểm tra các skill modules
// Chạy: node test-skills.js

import * as BombSkill from './js/powerups/bomb-skill.js';
import * as MagicBlockSkill from './js/powerups/magic-block-skill.js';
import * as TeleportSkill from './js/powerups/teleport-skill.js';
import * as ReverseGravitySkill from './js/powerups/reverse-gravity-skill.js';
import * as WideModeSkill from './js/powerups/wide-mode-skill.js';

console.log('🧪 Testing Skills Modules...\n');

// Test 1: Bomb Skill
console.log('💣 Test Bomb Skill:');
const testBoard = Array.from({ length: 20 }, () => Array(10).fill(0));
// Thêm một số ô để test
testBoard[19][5] = 1;
testBoard[18][5] = 1;

const testPiece = {
    x: 5,
    y: 18,
    shape: [[1]],
    color: 1
};

BombSkill.activateBombEffect(testBoard, testPiece, 10, 20);
console.log('   ✅ Bomb skill loaded and executed');

// Test 2: Magic Block Skill
console.log('✨ Test Magic Block Skill:');
const activePowerups = [{ id: 'MAGIC_BLOCK', uses: 1 }];
console.log('   Has pending:', MagicBlockSkill.hasMagicBlockPending(activePowerups));
console.log('   ✅ Magic Block skill loaded');

// Test 3: Teleport Skill
console.log('🌀 Test Teleport Skill:');
console.log('   Is active:', TeleportSkill.isTeleportActive());
console.log('   ✅ Teleport skill loaded');

// Test 4: Reverse Gravity Skill
console.log('🔺 Test Reverse Gravity Skill:');
ReverseGravitySkill.activateReverseGravity();
console.log('   Direction:', ReverseGravitySkill.getGravityDirection());
console.log('   Is active:', ReverseGravitySkill.isReverseGravityActive());
ReverseGravitySkill.deactivateReverseGravity();
console.log('   ✅ Reverse Gravity skill loaded');

// Test 5: Wide Mode Skill
console.log('📏 Test Wide Mode Skill:');
const wideBoard = WideModeSkill.activateWideMode(testBoard, 20, 12);
console.log('   Original width: 10, New width:', wideBoard[0].length);
console.log('   Is active:', WideModeSkill.isWideModeActive());
console.log('   ✅ Wide Mode skill loaded');

console.log('\n✅ All skills modules loaded successfully!');
console.log('🎮 Ready to play with all 15 skills!\n');
