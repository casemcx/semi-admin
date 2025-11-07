module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
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
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [0], // 禁用 subject case 检查以支持中文
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100], // 增加长度限制以支持 emoji
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-trim': [2, 'always'], // 去除首尾空白字符
  },
};
