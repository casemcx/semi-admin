// biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
'use strict';

module.exports = {
  types: [
    { value: 'feat', name: '✨ feat:     新功能' },
    { value: 'fix', name: '🐛 fix:      修复bug' },
    { value: 'docs', name: '📝 docs:     文档更新' },
    { value: 'style', name: '💄 style:    代码格式化（不影响代码运行的变动）' },
    {
      value: 'refactor',
      name: '♻️ refactor: 重构（既不是新增功能，也不是修改bug的代码变动）',
    },
    { value: 'perf', name: '⚡ perf:     性能优化' },
    { value: 'test', name: '✅ test:     增加测试' },
    { value: 'build', name: '📦 build:    构建系统或外部依赖的变动' },
    { value: 'ci', name: '👷 ci:       CI配置文件和脚本的变动' },
    { value: 'chore', name: '🔧 chore:    构建过程或辅助工具的变动' },
    { value: 'revert', name: '⏪ revert:   回滚' },
    { value: 'types', name: '🏷️ types:    类型定义文件修改' },
    { value: 'wip', name: '🚧 wip:      开发中' },
    { value: 'release', name: '🎉 release:  发布' },
    { value: 'workflow', name: '🔄 workflow: 工作流相关文件修改' },
    { value: 'merge', name: '🔀 merge:    合并分支' },
    { value: 'improvement', name: '🚀 improvement: 改进' },
    { value: 'bump', name: '⬆️ bump:     版本升级' },
  ],

  scopes: [
    { name: 'admin-web', value: 'admin-web' },
    { name: 'admin-server', value: 'admin-server' },
    { name: 'components', value: 'components' },
    { name: 'utils', value: 'utils' },
    { name: 'types', value: 'types' },
    { name: 'config', value: 'config' },
    { name: 'docs', value: 'docs' },
    { name: 'style', value: 'style' },
    { name: 'test', value: 'test' },
    { name: 'build', value: 'build' },
    { name: 'ci', value: 'ci' },
    { name: '*', value: '*' },
  ],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // override the messages, defaults are as follows
  messages: {
    type: '选择你要提交的类型 🎯:',
    scope: '选择一个范围 (可选):',
    // used if allowCustomScopes is true
    customScope: '输入你的范围:',
    subject: '写一个简短的描述 📝:\n',
    body: '写一个详细的描述 (可选). 使用 "|" 来换行:\n',
    breaking: '列出任何 BREAKING CHANGES (可选):\n',
    footer: '列出这个提交关闭的ISSUE (可选). E.g.: #31, #34:\n',
    confirmCommit: '确认提交? 🚀',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'perf'],
  // skip any questions you want
  skipQuestions: [],

  // limit subject length
  subjectLimit: 72,
};
