import { Form } from '@douyinfe/semi-ui';
import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';

import { FormField } from '../index';

const FormWrapper = ({ children }: { children: React.ReactNode }) => (
  <Form>{children}</Form>
);

describe('FormField', () => {
  describe('renderFormItem', () => {
    it('should render custom form item when renderFormItem is provided', () => {
      const column = {
        name: 'custom',
        title: '自定义',
        renderFormItem: () => (
          <div data-testid="custom-field">Custom Field</div>
        ),
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(screen.getByTestId('custom-field')).toBeInTheDocument();
      expect(screen.getByText('Custom Field')).toBeInTheDocument();
    });

    it('should prioritize renderFormItem over type', () => {
      const column = {
        name: 'priority',
        title: '优先级测试',
        type: 'select' as const,
        renderFormItem: () => (
          <div data-testid="custom-render">Custom Render</div>
        ),
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(screen.getByTestId('custom-render')).toBeInTheDocument();
      expect(document.querySelector('.semi-select')).toBeNull();
    });
  });

  describe('type="input" (default)', () => {
    it('should render input field by default when type is not specified', () => {
      const column = {
        name: 'username',
        title: '用户名',
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(screen.getByText('用户名')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render input field when type is "input"', () => {
      const column = {
        name: 'email',
        title: '邮箱',
        type: 'input' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(screen.getByPlaceholderText('请输入邮箱')).toBeInTheDocument();
    });
  });

  describe('type="password"', () => {
    it('should render password input', () => {
      const column = {
        name: 'password',
        title: '密码',
        type: 'password' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      const input = screen.getByPlaceholderText('请输入密码');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('type="textarea"', () => {
    it('should render textarea element', () => {
      const column = {
        name: 'description',
        title: '描述',
        type: 'textarea' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });
  });

  describe('type="number"', () => {
    it('should render number input', () => {
      const column = {
        name: 'age',
        title: '年龄',
        type: 'number' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });

  describe('type="select"', () => {
    it('should render select component', () => {
      const column = {
        name: 'status',
        title: '状态',
        type: 'select' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(document.querySelector('.semi-select')).not.toBeNull();
    });
  });

  describe('type="date"', () => {
    it('should render date picker', () => {
      const column = {
        name: 'birthday',
        title: '生日',
        type: 'date' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(document.querySelector('.semi-datepicker')).not.toBeNull();
    });
  });

  describe('type="switch"', () => {
    it('should render switch component', () => {
      const column = {
        name: 'isActive',
        title: '是否激活',
        type: 'switch' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(document.querySelector('.semi-switch')).not.toBeNull();
    });
  });

  describe('type="checkbox"', () => {
    it('should render checkbox group with options', () => {
      const column = {
        name: 'hobbies',
        title: '爱好',
        type: 'checkbox' as const,
        fieldProps: {
          options: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
          ],
        },
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(screen.getByText('阅读')).toBeInTheDocument();
      expect(screen.getByText('运动')).toBeInTheDocument();
    });
  });

  describe('type="radio"', () => {
    it('should render radio group with options', () => {
      const column = {
        name: 'gender',
        title: '性别',
        type: 'radio' as const,
        fieldProps: {
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ],
        },
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(screen.getByText('男')).toBeInTheDocument();
      expect(screen.getByText('女')).toBeInTheDocument();
    });
  });

  describe('type="cascader"', () => {
    it('should render cascader component', () => {
      const column = {
        name: 'region',
        title: '地区',
        type: 'cascader' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(document.querySelector('.semi-cascader')).not.toBeNull();
    });
  });

  describe('type="treeSelect"', () => {
    it('should render tree select component', () => {
      const column = {
        name: 'department',
        title: '部门',
        type: 'treeSelect' as const,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(document.querySelector('.semi-tree-select')).not.toBeNull();
    });
  });

  describe('unknown type', () => {
    it('should fallback to input for unknown type', () => {
      const column = {
        name: 'unknown',
        title: '未知类型',
        type: 'unknownType' as any,
      };

      render(
        <FormWrapper>
          <FormField column={column} />
        </FormWrapper>,
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });
});
