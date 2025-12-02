import { Form } from '@douyinfe/semi-ui';
import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';

import {
  CascaderField,
  CheckboxGroupField,
  RadioGroupField,
  SelectField,
  TreeSelectField,
} from '../index';

const FormWrapper = ({ children }: { children: React.ReactNode }) => (
  <Form>{children}</Form>
);

describe('SelectField', () => {
  it('should render with correct label from title prop', () => {
    const column = {
      name: 'status',
      title: '状态',
    };

    render(
      <FormWrapper>
        <SelectField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('状态')).toBeInTheDocument();
  });

  it('should render select component', () => {
    const column = {
      name: 'type',
      title: '类型',
    };

    render(
      <FormWrapper>
        <SelectField column={column} />
      </FormWrapper>,
    );

    const selectWrapper = document.querySelector('.semi-select');
    expect(selectWrapper).not.toBeNull();
  });

  it('should support multiple selection when multiple prop is true', () => {
    const column = {
      name: 'tags',
      title: '标签',
      fieldProps: {
        multiple: true,
        optionList: [
          { label: '标签1', value: '1' },
          { label: '标签2', value: '2' },
        ],
      },
    };

    render(
      <FormWrapper>
        <SelectField column={column} />
      </FormWrapper>,
    );

    const selectWrapper = document.querySelector('.semi-select-multiple');
    expect(selectWrapper).not.toBeNull();
  });

  it('should be disabled when fieldProps.disabled is true', () => {
    const column = {
      name: 'disabled',
      title: '禁用选择',
      fieldProps: {
        disabled: true,
      },
    };

    render(
      <FormWrapper>
        <SelectField column={column} />
      </FormWrapper>,
    );

    const selectWrapper = document.querySelector('.semi-select-disabled');
    expect(selectWrapper).not.toBeNull();
  });

  it('should apply filter when filterable is true', () => {
    const column = {
      name: 'search',
      title: '可搜索',
      fieldProps: {
        filter: true,
      },
    };

    render(
      <FormWrapper>
        <SelectField column={column} />
      </FormWrapper>,
    );

    const selectWrapper = document.querySelector('.semi-select-filterable');
    expect(selectWrapper).not.toBeNull();
  });
});

describe('CheckboxGroupField', () => {
  it('should render with correct label', () => {
    const column = {
      name: 'hobbies',
      title: '兴趣爱好',
    };

    render(
      <FormWrapper>
        <CheckboxGroupField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('兴趣爱好')).toBeInTheDocument();
  });

  it('should render checkbox options from fieldProps.options', () => {
    const column = {
      name: 'skills',
      title: '技能',
      fieldProps: {
        options: [
          { label: 'JavaScript', value: 'js' },
          { label: 'TypeScript', value: 'ts' },
          { label: 'React', value: 'react' },
        ],
      },
    };

    render(
      <FormWrapper>
        <CheckboxGroupField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should render checkbox group container', () => {
    const column = {
      name: 'features',
      title: '特性',
      fieldProps: {
        options: [
          { label: '特性A', value: 'a' },
          { label: '特性B', value: 'b' },
        ],
      },
    };

    render(
      <FormWrapper>
        <CheckboxGroupField column={column} />
      </FormWrapper>,
    );

    const checkboxGroup = document.querySelector('.semi-checkbox-group');
    expect(checkboxGroup).not.toBeNull();
  });
});

describe('RadioGroupField', () => {
  it('should render with correct label', () => {
    const column = {
      name: 'gender',
      title: '性别',
    };

    render(
      <FormWrapper>
        <RadioGroupField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('性别')).toBeInTheDocument();
  });

  it('should render radio options from fieldProps.options', () => {
    const column = {
      name: 'level',
      title: '级别',
      fieldProps: {
        options: [
          { label: '初级', value: 'junior' },
          { label: '中级', value: 'middle' },
          { label: '高级', value: 'senior' },
        ],
      },
    };

    render(
      <FormWrapper>
        <RadioGroupField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('初级')).toBeInTheDocument();
    expect(screen.getByText('中级')).toBeInTheDocument();
    expect(screen.getByText('高级')).toBeInTheDocument();
  });

  it('should render radio group container', () => {
    const column = {
      name: 'choice',
      title: '选择',
      fieldProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
    };

    render(
      <FormWrapper>
        <RadioGroupField column={column} />
      </FormWrapper>,
    );

    const radioGroup = document.querySelector('.semi-radio-group');
    expect(radioGroup).not.toBeNull();
  });

  it('should support type="button" from fieldProps', () => {
    const column = {
      name: 'mode',
      title: '模式',
      fieldProps: {
        type: 'button',
        options: [
          { label: '模式A', value: 'a' },
          { label: '模式B', value: 'b' },
        ],
      },
    };

    render(
      <FormWrapper>
        <RadioGroupField column={column} />
      </FormWrapper>,
    );

    const buttonGroup = document.querySelector('.semi-radio-buttonRadioGroup');
    expect(buttonGroup).not.toBeNull();
  });
});

describe('CascaderField', () => {
  it('should render with correct label', () => {
    const column = {
      name: 'region',
      title: '地区选择',
    };

    render(
      <FormWrapper>
        <CascaderField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('地区选择')).toBeInTheDocument();
  });

  it('should render cascader component', () => {
    const column = {
      name: 'address',
      title: '地址',
      fieldProps: {
        treeData: [
          {
            label: '北京',
            value: 'beijing',
            children: [
              { label: '朝阳区', value: 'chaoyang' },
              { label: '海淀区', value: 'haidian' },
            ],
          },
        ],
      },
    };

    render(
      <FormWrapper>
        <CascaderField column={column} />
      </FormWrapper>,
    );

    const cascader = document.querySelector('.semi-cascader');
    expect(cascader).not.toBeNull();
  });

  it('should be disabled when fieldProps.disabled is true', () => {
    const column = {
      name: 'disabledCascader',
      title: '禁用级联',
      fieldProps: {
        disabled: true,
      },
    };

    render(
      <FormWrapper>
        <CascaderField column={column} />
      </FormWrapper>,
    );

    const disabledCascader = document.querySelector('.semi-cascader-disabled');
    expect(disabledCascader).not.toBeNull();
  });
});

describe('TreeSelectField', () => {
  it('should render with correct label', () => {
    const column = {
      name: 'department',
      title: '部门选择',
    };

    render(
      <FormWrapper>
        <TreeSelectField column={column} />
      </FormWrapper>,
    );

    expect(screen.getByText('部门选择')).toBeInTheDocument();
  });

  it('should render tree select component', () => {
    const column = {
      name: 'org',
      title: '组织',
      fieldProps: {
        treeData: [
          {
            label: '研发部',
            value: 'dev',
            children: [
              { label: '前端组', value: 'frontend' },
              { label: '后端组', value: 'backend' },
            ],
          },
        ],
      },
    };

    render(
      <FormWrapper>
        <TreeSelectField column={column} />
      </FormWrapper>,
    );

    const treeSelect = document.querySelector('.semi-tree-select');
    expect(treeSelect).not.toBeNull();
  });

  it('should support multiple selection', () => {
    const column = {
      name: 'teams',
      title: '团队',
      fieldProps: {
        multiple: true,
        treeData: [
          { label: '团队A', value: 'a' },
          { label: '团队B', value: 'b' },
        ],
      },
    };

    render(
      <FormWrapper>
        <TreeSelectField column={column} />
      </FormWrapper>,
    );

    const treeSelect = document.querySelector('.semi-tree-select-multiple');
    expect(treeSelect).not.toBeNull();
  });

  it('should be disabled when fieldProps.disabled is true', () => {
    const column = {
      name: 'disabledTree',
      title: '禁用树选择',
      fieldProps: {
        disabled: true,
      },
    };

    render(
      <FormWrapper>
        <TreeSelectField column={column} />
      </FormWrapper>,
    );

    const disabledTree = document.querySelector('.semi-tree-select-disabled');
    expect(disabledTree).not.toBeNull();
  });
});
