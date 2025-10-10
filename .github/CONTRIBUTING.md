# Contributing to Keltris

## 🎓 Special Note: Educational Project for Kids (Ages 7-12)

**Keltris is designed to be a learning resource for children aged 7-12 years old.**

When contributing code to this project, please follow these educational principles:

### 📚 Write "Learnable" Code

1. **Simple Language**: Use easy-to-understand comments in Vietnamese
2. **Educational Comments**: Every function should explain WHAT it does and WHY
3. **Examples**: Include "Try it" examples that kids can test in the browser console
4. **Visual Aids**: Use emojis (✅❌❓💡) to highlight important points

### 📖 Required Documentation

All contributions should include:
- Clear comments explaining the purpose
- Examples of usage
- Vietnamese explanations for complex concepts
- Links to related lesson materials (if applicable)

### 🎯 Style Guide

Please read our detailed educational style guide:
- [CONTRIBUTING-EDU.md](../CONTRIBUTING-EDU.md) - Full guidelines for writing educational code
- [docs/teacher-guide.md](../docs/teacher-guide.md) - Teaching methodology
- [docs/CHECKLIST-EDU.md](../docs/CHECKLIST-EDU.md) - Quality checklist

### ✨ Example of Good Educational Code

```javascript
/**
 * ✅ Mục tiêu: Kiểm tra số có chẵn không
 * 
 * Cách hoạt động:
 * - Dùng phép chia lấy dư (%)
 * - Số chia 2 dư 0 = số chẵn
 * - Số chia 2 dư 1 = số lẻ
 * 
 * Ví dụ:
 * - isEven(4) → true (4 là số chẵn)
 * - isEven(7) → false (7 là số lẻ)
 * 
 * Try it: console.log(isEven(10));
 * 
 * @param {number} num - Số cần kiểm tra
 * @returns {boolean} true nếu chẵn, false nếu lẻ
 */
function isEven(num) {
    return num % 2 === 0;
}
```

---

## 🚀 How to Contribute

### 1. Fork the Repository
Click the "Fork" button at the top right of this page.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/kentakitris.git
cd kentakitris
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes
- Follow the educational code style
- Add comments in Vietnamese
- Include examples and "Try it" suggestions
- Test thoroughly

### 5. Commit Your Changes
```bash
git add .
git commit -m "Add educational feature: description"
```

### 6. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request
- Go to the original repository
- Click "New Pull Request"
- Describe your changes
- Mention how it helps kids learn

---

## 🎯 What We're Looking For

### High Priority
- Educational comments in existing code
- Lesson materials (docs/lesson/)
- Interactive examples
- Bug fixes that maintain educational value

### Medium Priority
- New helper functions with clear examples
- Mini-projects for students
- Improved documentation
- Visual aids and diagrams

### Low Priority (but still welcome!)
- Performance optimizations
- New game features
- UI improvements
- Advanced features (mark as "optional/advanced")

---

## ❌ What to Avoid

- Complex code without explanation
- Technical jargon without Vietnamese translation
- Removing existing educational comments
- Breaking changes without clear migration path
- Features that make the code harder to understand

---

## 📋 Checklist Before Submitting

- [ ] Code follows educational style guide
- [ ] All functions have clear comments in Vietnamese
- [ ] Includes "Try it" examples where applicable
- [ ] Uses emojis appropriately (✅❌❓💡)
- [ ] Tested in browser console
- [ ] No breaking changes to existing lessons
- [ ] Updated relevant documentation
- [ ] Ran through [CHECKLIST-EDU.md](../docs/CHECKLIST-EDU.md)

---

## 🌟 Code of Conduct

### Be Kind and Patient
This is a learning environment. All questions are valid questions.

### Be Encouraging
Celebrate every contribution, no matter how small.

### Be Educational
Every PR should make the codebase easier to learn from.

### Be Respectful
Respect that this project is designed for children. Keep it appropriate and positive.

---

## 🙋 Questions?

- Check [docs/lesson/](../docs/lesson/) for teaching materials
- Read [CONTRIBUTING-EDU.md](../CONTRIBUTING-EDU.md) for detailed style guide
- Open an issue for clarification
- Contact the maintainers

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🎉 Thank You!

Thank you for helping make programming education accessible and fun for kids!

Every line of code you contribute helps a child understand programming better. 💪

---

**Remember**: The goal is not just to make the game better, but to make learning programming easier and more enjoyable for 7-12 year olds! 🎓✨
