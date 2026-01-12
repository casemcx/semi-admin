# 如何编写优秀的 CRUD 页面文档

基于项目中的权限管理页面示例，本文档将详细介绍如何编写一个结构清晰、功能完整的 CRUD（Create, Read, Update, Delete）页面。

## 📋 目录

1. [整体架构](#整体架构)
2. [核心 Hooks 使用](#核心-hooks-使用)
3. [表格列定义](#表格列定义)
4. [CRUD 操作实现](#crud-操作实现)
5. [最佳实践](#最佳实践)
6. [常见问题与解决方案](#常见问题与解决方案)

## 🏗️ 整体架构

一个标准的 CRUD 页面应该包含以下几个核心部分：

```typescript
// 1. 导入必要的依赖
import { createPermission, deletePermissionById, getPermissionPage, updatePermissionById } from '@/api';
import { useLocal } from '@/locales';
import { Button, Card, Toast } from '@douyinfe/semi-ui';
import { ModalForm, ProTable, useTableColumns } from '@packages/components';
import { useModalFormState, useTableQuery } from '@packages/hooks';

// 2. 定义页面组件
export default function UserPermissionPage() {
  // 3. 状态管理
  // 4. 事件处理函数
  // 5. 渲染 UI
}
```

## 🔧 核心 Hooks 使用

### 1. useTableQuery - 表格查询管理

```typescript
const {
  loading,        // 加载状态
  dataSource,     // 数据源
  query,          // 查询参数
  fetchData,      // 获取数据函数
  handleSearch,   // 搜索处理
  handleReset,    // 重置处理
  handlePageChange,  // 分页处理
  startTableTransition,  // 带过渡效果的操作
} = useTableQuery<Permission>(getPermissionPage);

// 初始化加载数据
useEffect(() => {
  fetchData();
}, [fetchData]);
```

**职责**：
- 管理分页参数（pageNum, pageSize, total）
- 处理加载状态
- 提供搜索、重置功能
- 缓存数据源

### 2. useModalFormState - 表单模态框状态管理

```typescript
const {
  isEdit,             // 是否为编辑模式
  modalVisible,       // 弹窗显示状态
  handleAdd,          // 新增处理
  handleEdit,         // 编辑处理
  handleModalOk,      // 弹窗确认
  handleModalCancel,  // 弹窗取消
} = useModalFormState<Permission>(
  {},  // 初始值
  {
    onSubmit: async (values: Permission, isEdit: boolean) => {
      // 统一的提交处理逻辑
      if (isEdit) {
        const result = await updatePermissionById(values);
        if (result.code !== ResultCode.SUCCESS) {
          Toast.error(result.msg);
          return Promise.reject(result.msg);
        }
        Toast.success(intl.get('common.updateSuccess'));
      } else {
        const result = await createPermission(values);
        if (result.code !== ResultCode.SUCCESS) {
          Toast.error(result.msg);
          return Promise.reject(result.msg);
        }
        Toast.success(intl.get('common.createSuccess'));
      }
      fetchData();  // 刷新列表
      return Promise.resolve();
    },
  },
);
```

**职责**：
- 管理新增/编辑弹窗状态
- 统一处理表单提交逻辑
- 区分新增和编辑操作

### 3. useTableColumns - 列配置管理

```typescript
const { createColumns, editColumns } = useTableColumns(columns);
```

**职责**：
- 自动过滤不需要在表单中显示的列
- 区分新增表单和编辑表单的列配置
- 处理表单验证规则

## 📊 表格列定义

### 基本列配置

```typescript
const columns: ProTableProps<Permission>['columns'] = [
  {
    name: 'name',              // 字段名
    title: '权限名称',          // 显示标题
    type: 'input',             // 表单类型
    width: 200,               // 列宽
    ellipsis: true,           // 超长省略
    colProps: {               // 表单布局
      span: 12,               // 栅格占用
    },
  },
];
```

### 特殊列配置示例

#### 1. 选择器列

```typescript
{
  name: 'type',
  title: '权限类型',
  type: 'select',
  fieldProps: {
    optionList: [
      { label: '菜单', value: PermissionType.MENU },
      { label: '按钮', value: PermissionType.BUTTON },
      { label: 'API', value: PermissionType.API },
    ],
  },
  render: (value: any) => {
    // 自定义渲染逻辑
    const typeMap = {
      [PermissionType.MENU]: { text: '菜单', color: 'blue' },
      [PermissionType.BUTTON]: { text: '按钮', color: 'green' },
      [PermissionType.API]: { text: 'API', color: 'orange' },
    };
    const config = typeMap[value as PermissionType];
    return <span style={{ color: config?.color }}>{config?.text}</span>;
  },
}
```

#### 2. 开关列

```typescript
{
  name: 'status',
  title: '状态',
  type: 'switch',
  render: value => {
    return (value as Status) === Status.ENABLED ? (
      <span style={{ color: '#52c41a' }}>启用</span>
    ) : (
      <span style={{ color: '#ff4d4f' }}>禁用</span>
    );
  },
}
```

#### 3. 操作列

```typescript
{
  name: 'action',
  title: '操作',
  width: 150,
  fixed: 'right',
  hiddenInEdit: true,        // 编辑时不显示
  hiddenInSearch: true,      // 搜索时不显示
  hiddenInCreate: true,      // 新增时不显示
  hiddenInTable: true,       // 表格中不显示（用于表单）
  render: (_: any, record: Permission) => (
    <Space>
      <Button
        size="small"
        icon={<IconEdit />}
        onClick={() => handleEdit(record)}
      >
        编辑
      </Button>
      <Popconfirm
        title="确定删除吗？"
        onConfirm={() => handleDelete(record.id)}
        okText="确定"
        cancelText="取消"
      >
        <Button
          size="small"
          type="danger"
          icon={<IconDelete />}
          disabled={record.isSystem === Status.ENABLED}
        >
          删除
        </Button>
      </Popconfirm>
    </Space>
  ),
}
```

### 列配置属性说明

| 属性 | 说明 | 类型 |
|------|------|------|
| `name` | 字段名 | string |
| `title` | 显示标题 | string |
| `type` | 表单类型 | 'input' \| 'select' \| 'switch' \| 'date' ... |
| `width` | 列宽 | number |
| `fixed` | 固定列 | 'left' \| 'right' \| false |
| `ellipsis` | 超长省略 | boolean |
| `hiddenInCreate` | 新增时隐藏 | boolean |
| `hiddenInEdit` | 编辑时隐藏 | boolean |
| `hiddenInSearch` | 搜索时隐藏 | boolean |
| `colProps` | 表单布局 | ColProps |
| `fieldProps` | 表单项属性 | any |
| `render` | 自定义渲染 | (value, record) => ReactNode |

## 🚀 CRUD 操作实现

### Create（创建）

```typescript
// 1. 触发新增
<Button type="primary" onClick={handleAdd}>
  新增
</Button>

// 2. 表单提交
const onSubmit = async (values: Permission, isEdit: boolean) => {
  if (!isEdit) {
    const result = await createPermission(values);
    if (result.code !== ResultCode.SUCCESS) {
      Toast.error(result.msg);
      return Promise.reject(result.msg);
    }
    Toast.success('创建成功');
    fetchData();  // 刷新列表
  }
};
```

### Read（读取）

```typescript
// 1. 列表查询
const { dataSource, loading, handleSearch } = useTableQuery<Permission>(getPermissionPage);

// 2. 搜索功能
<ProTable
  onSearch={handleSearch}
  // ...
/>

// 3. 分页功能
pagination={{
  total: query.total,
  currentPage: query.pageNum,
  pageSize: query.pageSize,
  onPageChange: handlePageChange,
}}
```

### Update（更新）

```typescript
// 1. 触发编辑
<Button onClick={() => handleEdit(record)}>编辑</Button>

// 2. 表单提交
const onSubmit = async (values: Permission, isEdit: boolean) => {
  if (isEdit) {
    const result = await updatePermissionById(values);
    if (result.code !== ResultCode.SUCCESS) {
      Toast.error(result.msg);
      return Promise.reject(result.msg);
    }
    Toast.success('更新成功');
    fetchData();  // 刷新列表
  }
};
```

### Delete（删除）

```typescript
const handleDelete = useCallback(
  (id: string) => {
    startTableTransition(async () => {
      const result = await deletePermissionById(id);
      if (result.code !== ResultCode.SUCCESS) {
        Toast.error(result.msg);
      } else {
        Toast.success('删除成功');
        fetchData();  // 刷新列表
      }
    });
  },
  [startTableTransition, fetchData],
);

// 使用确认弹窗
<Popconfirm
  title="确定删除吗？"
  onConfirm={() => handleDelete(record.id)}
>
  <Button type="danger" icon={<IconDelete />}>
    删除
  </Button>
</Popconfirm>
```

## ✨ 最佳实践

### 1. 统一的错误处理

```typescript
// 封装统一的错误处理函数
const handleError = (result: any, successMsg: string) => {
  if (result.code !== ResultCode.SUCCESS) {
    Toast.error(result.msg);
    return Promise.reject(result.msg);
  }
  Toast.success(successMsg);
  fetchData();
};

// 使用
const result = await updatePermissionById(values);
handleError(result, intl.get('common.updateSuccess'));
```

### 2. 国际化支持

```typescript
const intl = useLocal();

// 所有文案都使用国际化
{
  title: intl.get('user.permission.name'),
  placeholder: intl.get('user.permission.name.placeholder'),
}
```

### 3. 权限控制

```typescript
// 根据权限禁用操作
<Button
  disabled={!hasPermission('user:create')}
  onClick={handleAdd}
>
  新增
</Button>

// 系统数据保护
<Button
  disabled={record.isSystem === Status.ENABLED}
  onClick={() => handleDelete(record.id)}
>
  删除
</Button>
```

### 4. 优化用户体验

```typescript
// 1. 添加加载状态
<ProTable loading={loading} />

// 2. 操作过渡效果
startTableTransition(async () => {
  // 执行操作
});

// 3. 确认操作
<Popconfirm
  title="确定删除吗？"
  description="删除后无法恢复"
  onConfirm={handleDelete}
>
  <Button danger>删除</Button>
</Popconfirm>
```

### 5. 表格性能优化

```typescript
// 1. 使用 rowKey
<ProTable rowKey={record => record.id.toString()} />

// 2. 虚拟滚动（大数据量）
<ProTable scroll={{ x: 1200, y: 500 }} />

// 3. 列宽固定
{
  width: 200,
  ellipsis: true,
  fixed: 'right',
}
```

## ❓ 常见问题与解决方案

### 1. 表单数据不更新

**问题**：编辑时表单没有填充初始数据

**解决方案**：
```typescript
// 确保 ModalForm 组件传入正确的 columns
<ModalForm
  columns={isEdit ? editColumns : createColumns}
  // initialValues 会自动处理
/>
```

### 2. 搜索条件不生效

**问题**：搜索后没有过滤数据

**解决方案**：
```typescript
// 确保 handleSearch 正确调用
const handleSearch = useCallback((values: any) => {
  query.setPageNum(1);  // 重置到第一页
  Object.assign(query, values);
  fetchData();
}, [query, fetchData]);
```

### 3. 分页信息不更新

**问题**：删除/新增后分页信息不准确

**解决方案**：
```typescript
// 每次数据变更后刷新
useEffect(() => {
  fetchData();
}, [fetchData]);

// 或者
const handleSuccess = () => {
  fetchData();
};
```

### 4. 表单验证不生效

**问题**：表单提交时没有验证

**解决方案**：
```typescript
// 在列配置中添加验证规则
{
  name: 'name',
  title: '名称',
  rules: [
    { required: true, message: '请输入名称' },
    { max: 50, message: '名称不能超过50个字符' },
  ],
}
```

### 5. 国际化切换不及时

**问题**：切换语言后页面文案没有更新

**解决方案**：
```typescript
// 使用 useLocal hook
const intl = useLocal();

// 在 useEffect 中监听
useEffect(() => {
  // 语言切换后的处理
}, [intl.locale]);
```

## 📝 检查清单

完成 CRUD 页面后，请确认以下功能：

- [ ] 列表数据加载正常
- [ ] 分页功能正常
- [ ] 搜索功能正常
- [ ] 新增功能正常
- [ ] 编辑功能正常
- [ ] 删除功能正常（包含确认弹窗）
- [ ] 表单验证正常
- [ ] 错误处理完善
- [ ] 成功提示明确
- [ ] 加载状态显示
- [ ] 国际化支持
- [ ] 权限控制合理
- [ ] 响应式布局良好

## 🎯 总结

编写优秀的 CRUD 页面需要关注以下几点：

1. **代码结构清晰**：合理使用 hooks，保持组件职责单一
2. **用户体验良好**：提供加载状态、确认弹窗、错误提示等
3. **功能完善**：包含完整的增删改查和搜索分页功能
4. **代码可维护**：使用 TypeScript、国际化、统一错误处理
5. **性能优化**：合理使用 rowKey、虚拟滚动、防抖等

遵循本文档的指导，可以快速开发出高质量、易维护的 CRUD 页面。