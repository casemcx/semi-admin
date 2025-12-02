import { Form } from '@douyinfe/semi-ui';
import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';

import {
  InputField,
  NumberField,
  PasswordField,
  TextAreaField,
} from '../index';

const FormWrapper = ({ children }: { children: React.ReactNode }) => (
  <Form>{children}</Form>
);

describe('InputField', () => {
  it('should render with correct label from title prop', () => {
    const column = {
      name: 'username',
      title: '用户名',
    };

    render(
      <FormWrapper>
        <InputField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('用户名')).toBeInTheDocument();
  });

  it('should render input with correct placeholder', () => {
    const column = {
      name: 'email',
      title: '邮箱',
    };

    render(
      <FormWrapper>
        <InputField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByPlaceholderText('请输入邮箱');
    expect(input).toBeInTheDocument();
  });

  it('should apply fieldProps to the input element', () => {
    const column = {
      name: 'phone',
      title: '手机号',
      fieldProps: {
        maxLength: 11,
        disabled: true,
      },
    };

    render(
      <FormWrapper>
        <InputField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    expect(input).toHaveAttribute('maxlength', '11');
    expect(input).toBeDisabled();
  });

  it('should render input element', () => {
    const column = {
      name: 'test',
      title: '测试',
    };

    render(
      <FormWrapper>
        <InputField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should handle empty title gracefully', () => {
    const column = {
      name: 'field',
      title: '',
    };

    render(
      <FormWrapper>
        <InputField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByPlaceholderText('请输入');
    expect(input).toBeInTheDocument();
  });
});

describe('PasswordField', () => {
  it('should render password input type', () => {
    const column = {
      name: 'password',
      title: '密码',
    };

    render(
      <FormWrapper>
        <PasswordField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByPlaceholderText('请输入密码');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should render with correct label', () => {
    const column = {
      name: 'confirmPassword',
      title: '确认密码',
    };

    render(
      <FormWrapper>
        <PasswordField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('确认密码')).toBeInTheDocument();
  });

  it('should apply fieldProps to password input', () => {
    const column = {
      name: 'secret',
      title: '密钥',
      fieldProps: {
        autoComplete: 'off',
      },
    };

    render(
      <FormWrapper>
        <PasswordField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByPlaceholderText('请输入密钥');
    expect(input).toHaveAttribute('autocomplete', 'off');
  });
});

describe('NumberField', () => {
  it('should render with correct label', () => {
    const column = {
      name: 'age',
      title: '年龄',
    };

    render(
      <FormWrapper>
        <NumberField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('年龄')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    const column = {
      name: 'count',
      title: '数量',
    };

    render(
      <FormWrapper>
        <NumberField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByPlaceholderText('请输入数量');
    expect(input).toBeInTheDocument();
  });

  it('should apply min and max from fieldProps', () => {
    const column = {
      name: 'price',
      title: '价格',
      fieldProps: {
        min: 0,
        max: 99999,
      },
    };

    render(
      <FormWrapper>
        <NumberField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '99999');
  });

  it('should render number input component', () => {
    const column = {
      name: 'amount',
      title: '金额',
    };

    render(
      <FormWrapper>
        <NumberField column={column} />
      </FormWrapper>,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
  });
});

describe('TextAreaField', () => {
  it('should render textarea element', () => {
    const column = {
      name: 'description',
      title: '描述',
    };

    render(
      <FormWrapper>
        <TextAreaField column={column} />
      </FormWrapper>,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });

  it('should render with correct label', () => {
    const column = {
      name: 'remark',
      title: '备注信息',
    };

    render(
      <FormWrapper>
        <TextAreaField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('备注信息')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    const column = {
      name: 'content',
      title: '内容',
    };

    render(
      <FormWrapper>
        <TextAreaField column={column} />
      </FormWrapper>,
    );

    const textarea = screen.getByPlaceholderText('请输入内容');
    expect(textarea).toBeInTheDocument();
  });

  it('should apply rows from fieldProps', () => {
    const column = {
      name: 'bio',
      title: '简介',
      fieldProps: {
        rows: 6,
      },
    };

    render(
      <FormWrapper>
        <TextAreaField column={column} />
      </FormWrapper>,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '6');
  });

  it('should apply maxLength from fieldProps', () => {
    const column = {
      name: 'summary',
      title: '摘要',
      fieldProps: {
        maxLength: 500,
      },
    };

    render(
      <FormWrapper>
        <TextAreaField column={column} />
      </FormWrapper>,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxlength', '500');
  });
});
