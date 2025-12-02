import { afterEach, beforeEach, describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';

import ConfigProvider from '../ConfigProvider';
import { initLocale, useConfigStore } from '../store';

describe('ConfigProvider', () => {
  beforeEach(() => {
    // Reset to default locale before each test
    initLocale('zh-CN');
  });

  afterEach(() => {
    // Reset to default locale after each test
    initLocale('zh-CN');
  });

  it('should render children correctly', () => {
    render(
      <ConfigProvider>
        <div data-testid="child">Hello</div>
      </ConfigProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should use default locale (zh-CN)', () => {
    render(
      <ConfigProvider>
        <div>Test</div>
      </ConfigProvider>,
    );

    const state = useConfigStore.getState();
    expect(state.locale).toBe('zh-CN');
  });

  it('should set locale to en-US when provided', () => {
    render(
      <ConfigProvider locale="en-US">
        <div>Test</div>
      </ConfigProvider>,
    );

    const state = useConfigStore.getState();
    expect(state.locale).toBe('en-US');
  });
});

describe('ConfigStore', () => {
  beforeEach(() => {
    initLocale('zh-CN');
  });

  it('should have default locale as zh-CN', () => {
    const state = useConfigStore.getState();
    expect(state.locale).toBe('zh-CN');
  });

  it('should translate key correctly in zh-CN', () => {
    const state = useConfigStore.getState();
    expect(state.t('submit')).toBe('提交');
    expect(state.t('reset')).toBe('重置');
    expect(state.t('search')).toBe('搜索');
    expect(state.t('save')).toBe('保存');
    expect(state.t('cancel')).toBe('取消');
    expect(state.t('close')).toBe('关闭');
    expect(state.t('yes')).toBe('是');
    expect(state.t('no')).toBe('否');
  });

  it('should translate key with params correctly', () => {
    const state = useConfigStore.getState();
    expect(state.t('pleaseSelect', { field: '状态' })).toBe('请选择状态');
    expect(state.t('pleaseEnter', { field: '用户名' })).toBe('请输入用户名');
    expect(state.t('pleaseUpload', { field: '文件' })).toBe('请上传文件');
    expect(state.t('viewImage', { index: 1 })).toBe('查看第 1 张图片');
  });

  it('should change locale to en-US', () => {
    initLocale('en-US');
    const state = useConfigStore.getState();
    expect(state.locale).toBe('en-US');
    expect(state.t('submit')).toBe('Submit');
    expect(state.t('reset')).toBe('Reset');
    expect(state.t('search')).toBe('Search');
  });

  it('should translate key with params in en-US', () => {
    initLocale('en-US');
    const state = useConfigStore.getState();
    expect(state.t('pleaseSelect', { field: 'status' })).toBe(
      'Please select status',
    );
    expect(state.t('pleaseEnter', { field: 'username' })).toBe(
      'Please enter username',
    );
  });
});
