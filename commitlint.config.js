module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 宽松的类型检查 - 可选
    'type-enum': [
      2, // 改为警告级别
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式化（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'build', // 构建系统或外部依赖的变动
        'ci', // CI配置文件和脚本的变动
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'types', // 类型定义文件修改
        'wip', // 开发中
        'release', // 发布
        'workflow', // 工作流相关文件修改
        'merge', // 合并分支
        'improvement', // 改进
        'bump', // 版本升级
      ],
    ],
    // 类型大小写 - 警告级别
    'type-case': [1, 'always', 'lower-case'],
    // 允许空的 type
    'type-empty': [1, 'never'], // 改为警告级别
    // 作用域大小写 - 警告级别
    'scope-case': [1, 'always', 'lower-case'],
    // 允许中文 subject，禁用大小写检查
    'subject-case': [0], // 禁用
    // 允许空的 subject
    'subject-empty': [1, 'never'], // 改为警告级别
    // 允许 subject 以句号结尾
    'subject-full-stop': [0], // 禁用
    // 增加 header 长度限制
    'header-max-length': [1, 'always', 200], // 警告级别，增加长度
    // body 格式检查 - 警告级别
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [1, 'always', 100],
    // footer 格式检查 - 警告级别
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [1, 'always', 100],
    // 去除首尾空白字符 - 警告级别
    'header-trim': [1, 'always'],
  },
};
