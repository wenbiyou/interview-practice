# 🎯 前端面试刷题

一个专为前端开发者打造的面试刷题应用，收录了 100+ 道经典前端面试题，支持 PC 和移动端访问。

## ✨ 功能特点

- 📱 **多端适配** - 完美支持 PC、平板和手机访问
- 💾 **本地存储** - 自动保存学习进度，刷新不丢失
- ⭐ **收藏笔记** - 收藏重点题目，添加个人笔记
- 🎯 **分类练习** - 按知识点分类，针对性突破
- 🌙 **暗黑模式** - 支持亮色/暗色主题切换
- 🆓 **开源免费** - 开源项目，永久免费使用

## 🚀 在线访问

👉 [https://wenbiyou.github.io/interview-practice/](https://wenbiyou.github.io/interview-practice/)

## 📋 题目分类

| 分类           | 题目数量 | 说明                              |
| -------------- | -------- | --------------------------------- |
| HTML/CSS基础   | 10+      | DOCTYPE、盒模型、Flex/Grid布局等  |
| JavaScript基础 | 15+      | 数据类型、闭包、Promise、原型链等 |
| React框架      | 10+      | Hooks、虚拟DOM、性能优化等        |
| Vue框架        | 10+      | 响应式原理、Composition API等     |
| 前端工程化     | 15+      | Webpack、Vite、CI/CD等            |
| 前端性能优化   | 15+      | 缓存策略、虚拟列表、懒加载等      |
| 前端安全       | 10+      | XSS、CSRF、HTTPS等                |

## 🛠️ 技术栈

- **框架**: React 18 + Vite 5
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router
- **图标**: Lucide React

## 🏃 本地开发

```bash
# 克隆项目
git clone https://github.com/你的用户名/interview-practice.git
cd interview-practice

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📦 部署到 GitHub Pages

### 自动部署（推荐）

1. Fork 本仓库
2. 修改 `vite.config.js` 中的 `base` 为你的仓库名
3. 在仓库 Settings → Pages → Build and deployment 中选择 "GitHub Actions"
4. 推送代码到 main 分支，自动触发部署

### 手动部署

```bash
npm run build
npm run deploy
```

## 📝 添加新题目

编辑 `src/data/questions.json` 文件，按以下格式添加题目：

```json
{
  "id": 题目ID,
  "title": "题目标题",
  "answer": "题目答案"
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 PR！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

[MIT](LICENSE) © 2024

---

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！
