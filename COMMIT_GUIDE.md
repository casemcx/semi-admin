# Commitizen + Commitlint 配置完成

## 功能特性 ✨

- ✅ Commitizen 交互式提交
- 🎯 Commitlint 规范检查
- 🌟 彩色 emoji 图标支持
- 📝 中文提示信息
- 🔧 Git hooks 自动检查
- 📦 预定义提交类型和范围

## 使用方法

### 方法 1: 使用 npm scripts
```bash
pnpm commit
```

### 方法 2: 直接使用 git-cz
```bash
npx git-cz
```

### 方法 3: 传统 git commit（会触发 commitlint 检查）
```bash
git commit -m "feat(scope): 添加新功能"
```

## 提交类型

- ✨ `feat`: 新功能
- 🐛 `fix`: 修复 bug
- 📝 `docs`: 文档更新
- 💄 `style`: 代码格式化
- ♻️ `refactor`: 重构
- ⚡ `perf`: 性能优化
- ✅ `test`: 测试
- 📦 `build`: 构建系统
- 👷 `ci`: CI 配置
- 🔧 `chore`: 其他改动
- ⏪ `revert`: 回滚
- 🏷️ `types`: 类型定义
- 🚧 `wip`: 开发中
- 🎉 `release`: 发布
- 🔄 `workflow`: 工作流

## 配置文件

- `.cz-config.js`: Commitizen 交互式配置
- `commitlint.config.js`: Commitlint 规则配置
- `.czrc`: Commitizen 基础配置
- `package.json`: scripts 和依赖管理