# Form Components 组件文档

## 📁 目录结构

```
form/components/
├── FormItem/           # 表单项容器组件
│   ├── FormItem.tsx
│   └── index.ts
├── FormField/          # 表单字段渲染组件
│   ├── FormField.tsx
│   └── index.ts
├── ReadonlyField/      # 只读字段展示组件
│   ├── ReadonlyField.tsx
│   └── index.ts
├── DateField/          # 日期时间组件
│   ├── DateField.tsx
│   ├── TimeField.tsx
│   ├── DateTimeField.tsx
│   └── index.ts
├── InputField/         # 输入框组件
│   ├── InputField.tsx
│   ├── PasswordField.tsx
│   ├── NumberField.tsx
│   ├── TextAreaField.tsx
│   └── index.ts
├── SelectField/        # 选择器组件
│   ├── SelectField.tsx
│   ├── TreeSelectField.tsx
│   ├── CascaderField.tsx
│   ├── RadioGroupField.tsx
│   ├── CheckboxGroupField.tsx
│   └── index.ts
├── SpecialField/       # 特殊字段组件
│   ├── SwitchField.tsx
│   ├── UploadField.tsx
│   └── index.ts
├── Markdown/           # Markdown 编辑器
│   ├── MarkdownField.tsx
│   ├── MarkdownPreview.tsx
│   ├── MarkdownTypes.ts
│   ├── index.module.less
│   └── index.ts
├── Image/              # 图片组件
│   ├── ImageCarousel.tsx
│   ├── ImageUploadField.tsx
│   └── index.ts
└── index.ts            # 统一导出
```

## 📦 组件导入

### 统一导入（推荐）

```typescript
import {
  FormItem,
  FormField,
  ReadonlyField,
  DateField,
  InputField,
  SelectField,
  // ... 其他组件
} from '@/form/components';
```

### 按需导入

```typescript
import { FormItem } from '@/form/components/FormItem';
import { DateField } from '@/form/components/DateField';
import { InputField } from '@/form/components/InputField';
```

## 🔧 核心组件

### FormItem

表单项容器组件，根据字段配置自动渲染对应的字段类型。

**Props:**
```typescript
interface FormItemProps<T extends Record<string, any>> {
  column: FormSchema<T>;  // 字段配置
  index: number;          // 字段索引
}
```

**使用示例:**
```tsx
import { FormItem } from '@/form/components';

<FormItem
  column={{
    name: 'username',
    title: '用户名',
    type: 'input',
    rules: [{ required: true }]
  }}
  index={0}
/>
```

### FormField

可编辑字段渲染组件，支持多种字段类型。

**支持的字段类型:**
- `input` - 普通输入框
- `password` - 密码输入框
- `textarea` - 多行文本框
- `number` - 数字输入框
- `select` - 下拉选择
- `date` - 日期选择
- `time` - 时间选择
- `datetime` - 日期时间选择
- `switch` - 开关
- `checkbox` - 多选框组
- `radio` - 单选框组
- `upload` - 文件上传
- `image` - 图片上传
- `cascader` - 级联选择
- `treeSelect` - 树形选择
- `markdown` - Markdown 编辑器

**使用示例:**
```tsx
import { FormField } from '@/form/components';

<FormField
  column={{
    name: 'email',
    title: '邮箱',
    type: 'input',
    fieldProps: {
      placeholder: '请输入邮箱'
    }
  }}
/>
```

### ReadonlyField

只读字段展示组件，用于详情页面或只读表单。

**特性:**
- 自动格式化显示值
- 支持自定义渲染函数 `render`
- 智能处理不同字段类型的展示

**使用示例:**
```tsx
import { ReadonlyField } from '@/form/components';

<ReadonlyField
  column={{
    name: 'status',
    title: '状态',
    type: 'select',
    fieldProps: {
      optionList: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  }}
  index={0}
  value={1}
  record={formData}
/>
```

## 📝 字段组件

### DateField 系列

**DateField** - 日期选择器
```tsx
import { DateField } from '@/form/components/DateField';

<DateField
  column={{
    name: 'birthday',
    title: '生日',
    type: 'date'
  }}
/>
```

**TimeField** - 时间选择器
```tsx
import { TimeField } from '@/form/components/DateField';

<TimeField
  column={{
    name: 'workTime',
    title: '工作时间',
    type: 'time'
  }}
/>
```

**DateTimeField** - 日期时间选择器
```tsx
import { DateTimeField } from '@/form/components/DateField';

<DateTimeField
  column={{
    name: 'createdAt',
    title: '创建时间',
    type: 'datetime'
  }}
/>
```

### InputField 系列

**InputField** - 普通输入框
```tsx
import { InputField } from '@/form/components/InputField';

<InputField
  column={{
    name: 'name',
    title: '姓名',
    type: 'input',
    fieldProps: {
      maxLength: 50
    }
  }}
/>
```

**PasswordField** - 密码输入框
```tsx
import { PasswordField } from '@/form/components/InputField';

<PasswordField
  column={{
    name: 'password',
    title: '密码',
    type: 'password'
  }}
/>
```

**NumberField** - 数字输入框
```tsx
import { NumberField } from '@/form/components/InputField';

<NumberField
  column={{
    name: 'age',
    title: '年龄',
    type: 'number',
    fieldProps: {
      min: 0,
      max: 150
    }
  }}
/>
```

**TextAreaField** - 多行文本框
```tsx
import { TextAreaField } from '@/form/components/InputField';

<TextAreaField
  column={{
    name: 'description',
    title: '描述',
    type: 'textarea',
    fieldProps: {
      rows: 4,
      maxLength: 500
    }
  }}
/>
```

### SelectField 系列

**SelectField** - 下拉选择
```tsx
import { SelectField } from '@/form/components/SelectField';

<SelectField
  column={{
    name: 'city',
    title: '城市',
    type: 'select',
    fieldProps: {
      optionList: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' }
      ]
    }
  }}
/>
```

**TreeSelectField** - 树形选择
```tsx
import { TreeSelectField } from '@/form/components/SelectField';

<TreeSelectField
  column={{
    name: 'department',
    title: '部门',
    type: 'treeSelect',
    fieldProps: {
      treeData: departmentTree
    }
  }}
/>
```

**CascaderField** - 级联选择
```tsx
import { CascaderField } from '@/form/components/SelectField';

<CascaderField
  column={{
    name: 'region',
    title: '地区',
    type: 'cascader',
    fieldProps: {
      treeData: regionTree
    }
  }}
/>
```

**RadioGroupField** - 单选框组
```tsx
import { RadioGroupField } from '@/form/components/SelectField';

<RadioGroupField
  column={{
    name: 'gender',
    title: '性别',
    type: 'radio',
    fieldProps: {
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ]
    }
  }}
/>
```

**CheckboxGroupField** - 多选框组
```tsx
import { CheckboxGroupField } from '@/form/components/SelectField';

<CheckboxGroupField
  column={{
    name: 'hobbies',
    title: '爱好',
    type: 'checkbox',
    fieldProps: {
      options: [
        { label: '运动', value: 'sports' },
        { label: '阅读', value: 'reading' }
      ]
    }
  }}
/>
```

### SpecialField 系列

**SwitchField** - 开关
```tsx
import { SwitchField } from '@/form/components/SpecialField';

<SwitchField
  column={{
    name: 'enabled',
    title: '是否启用',
    type: 'switch'
  }}
/>
```

**UploadField** - 文件上传
```tsx
import { UploadField } from '@/form/components/SpecialField';

<UploadField
  column={{
    name: 'files',
    title: '文件',
    type: 'upload',
    fieldProps: {
      action: '/api/upload',
      maxCount: 5
    }
  }}
/>
```

### Markdown 组件

**MarkdownField** - Markdown 编辑器
```tsx
import MarkdownFormField from '@/form/components/Markdown';

<MarkdownFormField
  id="content"
  field="content"
  placeholder="请输入内容"
/>
```

**MarkdownPreview** - Markdown 预览
```tsx
import { MarkdownPreview } from '@/form/components/Markdown';

<MarkdownPreview
  id="preview"
  value={markdownContent}
/>
```

### Image 组件

**ImageUploadField** - 图片上传
```tsx
import { ImageUploadField } from '@/form/components/Image';

<ImageUploadField
  name="avatar"
  title="头像"
  type="image"
  fieldProps={{
    maxCount: 1,
    accept: 'image/*'
  }}
/>
```

**ImageCarousel** - 图片轮播
```tsx
import { ImageCarousel } from '@/form/components/Image';

<ImageCarousel
  images={[
    { fileUrl: 'image1.jpg', fileName: 'Image 1' },
    { fileUrl: 'image2.jpg', fileName: 'Image 2' }
  ]}
  width={300}
  height={200}
  preview
/>
```

## 🔄 自定义渲染

### renderFormItem

自定义表单项渲染：

```tsx
<FormItem
  column={{
    name: 'custom',
    title: '自定义字段',
    renderFormItem: () => (
      <Form.Input
        field="custom"
        placeholder="自定义组件"
      />
    )
  }}
  index={0}
/>
```

### render (只读模式)

自定义只读展示：

```tsx
<ReadonlyField
  column={{
    name: 'status',
    title: '状态',
    render: (value, record, index) => {
      return value === 1
        ? <Tag color="green">启用</Tag>
        : <Tag color="red">禁用</Tag>;
    }
  }}
  index={0}
  value={1}
/>
```

## 📋 完整示例

### 基础表单

```tsx
import { Form, Button } from '@douyinfe/semi-ui';
import { FormItem } from '@/form/components';
import type { FormSchema } from '@/types';

const UserForm = () => {
  const columns: FormSchema[] = [
    {
      name: 'username',
      title: '用户名',
      type: 'input',
      rules: [{ required: true, message: '请输入用户名' }]
    },
    {
      name: 'email',
      title: '邮箱',
      type: 'input',
      rules: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '请输入正确的邮箱格式' }
      ]
    },
    {
      name: 'age',
      title: '年龄',
      type: 'number',
      fieldProps: { min: 0, max: 150 }
    },
    {
      name: 'gender',
      title: '性别',
      type: 'radio',
      fieldProps: {
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 }
        ]
      }
    }
  ];

  return (
    <Form onSubmit={(values) => console.log(values)}>
      {columns.map((column, index) => (
        <FormItem
          key={String(column.name)}
          column={column}
          index={index}
        />
      ))}
      <Button type="primary" htmlType="submit">提交</Button>
    </Form>
  );
};
```

### 只读详情

```tsx
import { ReadonlyField } from '@/form/components';

const UserDetail = ({ user }) => {
  const columns: FormSchema[] = [
    { name: 'username', title: '用户名', type: 'input' },
    { name: 'email', title: '邮箱', type: 'input' },
    {
      name: 'status',
      title: '状态',
      type: 'select',
      fieldProps: {
        optionList: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      }
    }
  ];

  return (
    <div>
      {columns.map((column, index) => (
        <ReadonlyField
          key={String(column.name)}
          column={column}
          index={index}
          record={user}
        />
      ))}
    </div>
  );
};
```

## 🔧 类型定义

```typescript
import type { FormSchema } from '@/types';

// 基础字段配置
interface FormSchema<T extends Record<string, any>> {
  /** 字段名 */
  name: keyof T;
  /** 字段标题 */
  title: string;
  /** 字段类型 */
  type?: 'input' | 'password' | 'textarea' | 'number' |
         'select' | 'date' | 'time' | 'datetime' |
         'switch' | 'checkbox' | 'radio' | 'upload' |
         'image' | 'cascader' | 'treeSelect' | 'markdown';
  /** 字段属性 */
  fieldProps?: any;
  /** 验证规则 */
  rules?: any[];
  /** 是否只读 */
  readonly?: boolean;
  /** 栅格配置 */
  colProps?: any;
  /** 自定义渲染表单项 */
  renderFormItem?: () => JSX.Element;
  /** 自定义渲染只读内容 */
  render?: (value: any, record: T, index: number) => React.ReactNode;
}
```

## 📚 高级用法

### 配合 ProForm 使用

```tsx
import { ProForm } from '@/form/BaseForm';
import type { FormSchema } from '@/types';

interface UserFormData {
  username: string;
  email: string;
  age: number;
}

const columns: FormSchema<UserFormData>[] = [
  { name: 'username', title: '用户名', type: 'input' },
  { name: 'email', title: '邮箱', type: 'input' },
  { name: 'age', title: '年龄', type: 'number' }
];

<ProForm<UserFormData>
  columns={columns}
  onSubmit={(values) => console.log(values)}
  submitText="保存"
  showReset
/>
```

### 配合 SchemaForm 使用

```tsx
import { SchemaForm } from '@/form/layouts/EmbedForm';

<SchemaForm
  columns={columns}
  colProps={{ span: 12 }}
  gutter={16}
  renderFieldsOnly={false}
/>
```

### 配合 ModalForm 使用

```tsx
import { ModalForm } from '@/form/layouts/ModalForm';

<ModalForm
  visible={visible}
  title="编辑用户"
  columns={columns}
  initialValues={user}
  onSubmit={handleSubmit}
  onCancel={() => setVisible(false)}
/>
```

## 🎯 最佳实践

1. **使用类型约束**：为 FormSchema 提供泛型参数，获得完整的类型提示
2. **统一配置管理**：将表单配置提取为常量，便于维护和复用
3. **合理拆分组件**：复杂表单可拆分为多个子组件
4. **善用自定义渲染**：对于特殊需求，使用 `renderFormItem` 和 `render`
5. **性能优化**：使用 `useMemo` 缓存配置对象

## 🔄 迁移指南

### 从旧版本迁移

**之前的导入方式：**
```typescript
import { FormItem } from '@/form/form-item';
```

**新的导入方式：**
```typescript
import { FormItem } from '@/form/components';
// 或
import { FormItem } from '@/form/components/FormItem';
```

### 文件路径变更

| 旧路径 | 新路径 |
|--------|--------|
| `@/form/form-item` | `@/form/components` |
| `@/form/form-item/fields/date-field` | `@/form/components/DateField` |
| `@/form/form-item/fields/input-field` | `@/form/components/InputField` |
| `@/form/form-item/fields/select-field` | `@/form/components/SelectField` |
| `@/form/form-item/fields/special-field` | `@/form/components/SpecialField` |
| `@/form/form-item/fields/markdown` | `@/form/components/Markdown` |
| `@/form/form-item/fields/image` | `@/form/components/Image` |

所有文件名已从 `kebab-case` 改为 `PascalCase`。

## 🤝 贡献

如需添加新的字段类型或改进现有组件，请遵循以下规范：

1. 组件目录使用 PascalCase
2. 组件文件名使用 PascalCase
3. 每个组件目录必须包含 index.ts 导出文件
4. 为组件添加完整的 TypeScript 类型定义
5. 在主 index.ts 中添加导出
